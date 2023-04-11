import * as Phaser from 'phaser'
import { Direction } from 'grid-engine'
import type { GridEngine } from 'grid-engine'
import { WebsocketBuilder } from 'websocket-ts'
import type { Websocket } from 'websocket-ts'
import { MessageType, parseMessage, sendMessage } from '../MessageHandler'
import type { Coordinates } from '../MessageHandler'
import { v4 as uuidv4 } from 'uuid'

const sessionID = 10
const playerID = uuidv4()
const players: Record<string, Coordinates> = {}
const ECSB_MOVE_API_URL: string = import.meta.env.VITE_ECSB_MOVE_API_URL as string
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

export class Scene extends Phaser.Scene {
  private readonly gridEngine!: GridEngine
  private ws!: Websocket

  constructor() {
    super(sceneConfig)
  }

  preload(): void {
    this.load.image('tiles', 'src/assets/cloud_tileset.png')
    this.load.tilemapTiledJSON('cloud-city-map', 'src/assets/cloud_city.json')
    this.load.spritesheet('player', 'src/assets/characters.png', {
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
    this.cameras.main.startFollow(playerSprite, true)
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height)

    const gridEngineConfig = {
      characters: [
        {
          id: playerID,
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 3, y: 3 },
          collides: false,
        },
      ],
    }

    this.gridEngine.create(cloudCityTilemap, gridEngineConfig)

    this.configureWebSocket()

    this.gridEngine.positionChangeStarted().subscribe(({ charId, exitTile, enterTile }) => {
      if (charId === playerID) {
        sendMessage(this.ws, {
          type: MessageType.Move,
          coords: {
            x: enterTile.x,
            y: enterTile.y,
          },
        })
      }
    })
  }

  configureWebSocket(): void {
    this.ws = new WebsocketBuilder(
      `${ECSB_MOVE_API_URL}/ws?gameSessionId=${sessionID}&name=${playerID}`,
    )
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
            this.addPlayer(msg.id, msg.coords)
            break
          case MessageType.PlayerMoved:
            this.movePlayer(msg.id, msg.coords)
            break
          case MessageType.PlayerRemoved:
            this.removePlayer(msg.id)
            break
          case MessageType.PlayerSyncing:
            msg.players.forEach((player) => {
              if (player.id !== playerID) {
                this.addPlayer(player.id, player.coords)
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

  addPlayer(id: string, cords: Coordinates): void {
    const sprite = this.add.sprite(0, 0, 'player')
    this.gridEngine.addCharacter({
      id: id,
      sprite: sprite,
      walkingAnimationMapping: 5,
      startPosition: cords,
      collides: false,
    })

    players[id] = cords
  }

  removePlayer(id: string): void {
    const sprite = this.gridEngine.getSprite(id)

    this.gridEngine.removeCharacter(id)
    sprite?.destroy()

    delete players.id
  }

  movePlayer(id: string, cords: Coordinates): void {
    this.gridEngine.moveTo(id, cords)

    players[id] = cords
  }

  update(): void {
    const cursors = this.input.keyboard.createCursorKeys()

    if (cursors.left.isDown) {
      this.gridEngine.move(playerID, Direction.LEFT)
    } else if (cursors.right.isDown) {
      this.gridEngine.move(playerID, Direction.RIGHT)
    } else if (cursors.up.isDown) {
      this.gridEngine.move(playerID, Direction.UP)
    } else if (cursors.down.isDown) {
      this.gridEngine.move(playerID, Direction.DOWN)
    }
  }
}
