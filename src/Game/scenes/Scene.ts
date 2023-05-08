import * as Phaser from 'phaser'
import { Direction } from 'grid-engine'
import type { GridEngine, Position } from 'grid-engine'
import { WebsocketBuilder } from 'websocket-ts'
import type { Websocket } from 'websocket-ts'
import { MessageType, parseMessage, sendMessage } from '../MessageHandler'
import type { Coordinates } from '../MessageHandler'
import type { GameSettings, GameStatus } from '../../services/game/Types'
import { decodeGameToken } from '../../apis/apis'

type PlayerId = string
interface PlayerState {
  coords: Coordinates
  direction: Direction
}

const VITE_ECSB_WS_API_URL: string = import.meta.env.VITE_ECSB_WS_API_URL as string
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

export class Scene extends Phaser.Scene {
  private readonly gridEngine!: GridEngine
  private readonly gameToken: string
  private readonly playerId: PlayerId
  private readonly status: GameStatus
  private readonly settings: GameSettings
  private readonly players: Record<PlayerId, PlayerState>
  private ws!: Websocket

  constructor(gameToken: string, userStatus: GameStatus, settings: GameSettings) {
    super(sceneConfig)
    this.gameToken = gameToken
    this.playerId = decodeGameToken(gameToken).playerId
    this.status = userStatus
    this.settings = settings
    this.players = {}
  }

  preload(): void {
    this.load.image('tiles', '/assets/cloud_tileset.png')
    this.load.tilemapTiledJSON('cloud-city-map', '/assets/cloud_city.json')
    this.load.spritesheet('player', '/assets/characters.png', {
      frameWidth: 52,
      frameHeight: 72,
    })
  }

  create(): void {
    const cloudCityTilemap = this.make.tilemap({ key: 'cloud-city-map' })
    cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')

    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, 'Cloud City', 0, 0)
      layer.scale = 3
    }

    const playerSprite = this.add.sprite(0, 0, 'player')
    const text = this.add.text(0, -10, 'You')
    text.setColor('#000000')

    const container = this.add.container(0, 0, [playerSprite, text])
    this.cameras.main.startFollow(container, true)
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height)

    const gridEngineConfig = {
      characters: [
        {
          id: this.playerId,
          sprite: playerSprite,
          container,
          walkingAnimationMapping: 6,
          startPosition: { x: 3, y: 3 },
          collides: false,
        },
      ],
      numberOfDirections: 8,
    }

    this.gridEngine.create(cloudCityTilemap, gridEngineConfig)

    this.configureWebSocket()

    this.gridEngine.positionChangeStarted().subscribe(({ charId, exitTile, enterTile }) => {
      if (charId === this.playerId) {
        const direction = this.getDirection(exitTile, enterTile)

        sendMessage(this.ws, {
          type: MessageType.Move,
          coords: {
            x: enterTile.x,
            y: enterTile.y,
          },
          direction: direction,
        })
      }
    })

    this.gridEngine.positionChangeFinished().subscribe(({ charId, exitTile, enterTile }) => {
      if (charId !== this.playerId) {
        this.gridEngine.turnTowards(charId, this.players[charId].direction)
      }
    })
  }

  configureWebSocket(): void {
    this.ws = new WebsocketBuilder(`${VITE_ECSB_WS_API_URL}/ws?gameToken=${this.gameToken}`)
      .onOpen((i, ev) => {
        console.log('ws opened')

        sendMessage(this.ws, {
          type: MessageType.SyncRequest,
        })
      })
      .onClose((i, ev) => {
        console.log('ws closed')
      })
      .onError((i, ev) => {
        console.log('ws error')
      })
      .onMessage((i, ev) => {
        const msg = parseMessage(ev.data)

        if (!msg) {
          return
        }

        switch (msg.type) {
          case MessageType.PlayerAdded:
            this.addPlayer(msg.id, msg.coords, msg.direction)
            break
          case MessageType.PlayerMoved:
            this.movePlayer(msg.id, msg.coords, msg.direction)
            break
          case MessageType.PlayerRemoved:
            this.removePlayer(msg.id)
            break
          case MessageType.PlayerSyncing:
            msg.players.forEach((player) => {
              if (player.id !== this.playerId) {
                this.addPlayer(player.id, player.coords, player.direction)
              }
            })
            break
        }
      })
      .onRetry((i, ev) => {
        console.log('retry')
      })
      .build()
  }

  getDirection = (startPosition: Position, endPosition: Position): Direction => {
    const xDiff = startPosition.x - endPosition.x
    const yDiff = startPosition.y - endPosition.y

    if (xDiff === 0 && yDiff === 0) {
      return Direction.NONE
    }

    if (xDiff === 0) {
      return yDiff > 0 ? Direction.UP : Direction.DOWN
    }

    if (yDiff === 0) {
      return xDiff > 0 ? Direction.LEFT : Direction.RIGHT
    }

    if (xDiff > 0) {
      return yDiff > 0 ? Direction.UP_LEFT : Direction.DOWN_LEFT
    }

    return yDiff > 0 ? Direction.UP_RIGHT : Direction.DOWN_RIGHT
  }

  addPlayer(id: string, coords: Coordinates, direction: Direction): void {
    const sprite = this.add.sprite(0, 0, 'player')
    const text = this.add.text(0, -10, id)
    text.setColor('#000000')

    const container = this.add.container(0, 0, [sprite, text])

    this.gridEngine.addCharacter({
      id: id,
      sprite: sprite,
      container,
      facingDirection: direction,
      walkingAnimationMapping: 5,
      startPosition: coords,
      collides: false,
    })

    this.players[id] = {
      coords,
      direction,
    }
  }

  removePlayer(id: string): void {
    this.gridEngine.getSprite(id)?.destroy()
    this.gridEngine.getContainer(id)?.destroy()
    this.gridEngine.removeCharacter(id)

    delete this.players[id]
  }

  movePlayer(id: string, coords: Coordinates, direction: Direction): void {
    this.gridEngine.moveTo(id, coords)

    this.players[id] = {
      coords,
      direction,
    }
  }

  update(): void {
    const cursors = this.input.keyboard.createCursorKeys()

    if (cursors.left.isDown && cursors.up.isDown) {
      this.gridEngine.move(this.playerId, Direction.UP_LEFT)
    } else if (cursors.left.isDown && cursors.down.isDown) {
      this.gridEngine.move(this.playerId, Direction.DOWN_LEFT)
    } else if (cursors.right.isDown && cursors.up.isDown) {
      this.gridEngine.move(this.playerId, Direction.UP_RIGHT)
    } else if (cursors.right.isDown && cursors.down.isDown) {
      this.gridEngine.move(this.playerId, Direction.DOWN_RIGHT)
    } else if (cursors.left.isDown) {
      this.gridEngine.move(this.playerId, Direction.LEFT)
    } else if (cursors.right.isDown) {
      this.gridEngine.move(this.playerId, Direction.RIGHT)
    } else if (cursors.up.isDown) {
      this.gridEngine.move(this.playerId, Direction.UP)
    } else if (cursors.down.isDown) {
      this.gridEngine.move(this.playerId, Direction.DOWN)
    }
  }
}
