import * as Phaser from 'phaser'
import type { GridEngine, Position } from 'grid-engine'
import { Direction } from 'grid-engine'
import type { Websocket } from 'websocket-ts'
import { WebsocketBuilder } from 'websocket-ts'
import type { Coordinates } from '../MessageHandler'
import { MessageType, parseMessage, sendMessage } from '../MessageHandler'
import type { Controls, GameSettings, GameStatus } from '../../services/game/Types'
import { decodeGameToken } from '../../apis/apis'
import { type GameClassResourceDto } from '../../apis/game/Types'
import Key = Phaser.Input.Keyboard.Key

type PlayerId = string

interface PlayerState {
  coords: Coordinates
  direction: Direction
}

const VITE_ECSB_WS_API_URL: string = import.meta.env.VITE_ECSB_WS_API_URL as string
const LAYER_SCALE = 3

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

const getPlayerMapping =
  (initialCharacterMapping: GameClassResourceDto[]) =>
  (playerClass: string): number =>
    initialCharacterMapping.find((dto) => dto.gameClassName === playerClass)?.classAsset ?? 0

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
    this.load.image('tiles', '/assets/overworld.png')
    this.load.tilemapTiledJSON('cloud-city-map', '/assets/forest_glade.json')
    this.load.spritesheet('player', this.settings.assetUrl, {
      frameWidth: 52,
      frameHeight: 72,
    })
  }

  create(): void {
    const cloudCityTilemap = this.make.tilemap({ key: 'cloud-city-map' })
    cloudCityTilemap.addTilesetImage('Overworld', 'tiles')

    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, 'Overworld', 0, 0)
      layer.scale = LAYER_SCALE
    }

    const playerSprite = this.add.sprite(0, 0, 'player')
    const text = this.add.text(0, -20, 'You')
    text.setColor('#000000')

    const className = this.add.text(0, -5, `[${this.status.className}]`)
    className.setColor('#000000')

    this.cameras.main.setBounds(
      0,
      0,
      cloudCityTilemap.widthInPixels * LAYER_SCALE,
      cloudCityTilemap.heightInPixels * LAYER_SCALE,
    )

    const container = this.add.container(0, 0, [playerSprite, text, className])

    this.cameras.main.startFollow(container, true)
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height)

    const gridEngineConfig = {
      characters: [
        {
          id: this.playerId,
          sprite: playerSprite,
          container,
          walkingAnimationMapping: getPlayerMapping(this.settings.classResourceRepresentation)(
            this.status.className,
          ),
          startPosition: this.status.coords,
          collides: true,
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
            this.addPlayer(msg.id, msg.coords, msg.direction, msg.className)
            break
          case MessageType.PlayerMoved:
            this.movePlayer(msg.id, msg.coords, msg.direction)
            break
          case MessageType.PlayerRemoved:
            this.removePlayer(msg.id)
            break
          case MessageType.PlayerSyncing:
            msg.players.forEach((playerWithClass) => {
              const player = playerWithClass.playerPosition
              if (player.id !== this.playerId) {
                this.addPlayer(
                  player.id,
                  player.coords,
                  player.direction,
                  playerWithClass.className,
                )
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

  addPlayer(id: string, coords: Coordinates, direction: Direction, characterClass: string): void {
    const sprite = this.add.sprite(0, 0, 'player')
    const text = this.add.text(0, -10, id)
    text.setColor('#000000')

    const className = this.add.text(0, 10, characterClass)
    className.setColor('#000000')

    const container = this.add.container(0, 0, [sprite, text, className])

    this.gridEngine.addCharacter({
      id: id,
      sprite: sprite,
      container,
      facingDirection: direction,
      walkingAnimationMapping: getPlayerMapping(this.settings.classResourceRepresentation)(
        characterClass,
      ),
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

  private areAllKeysDown(keys: Phaser.Input.Keyboard.Key[]): boolean {
    return keys.every((value) => value.isDown)
  }

  update(): void {

    const controls: Controls = {up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), 
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), 
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), 
      action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)}

    const moveMapping: Array<{ keys: Key[]; direction: Direction }> = [
      { keys: [controls.left, controls.up], direction: Direction.UP_LEFT },
      { keys: [controls.left, controls.down], direction: Direction.DOWN_LEFT },
      { keys: [controls.right, controls.up], direction: Direction.UP_RIGHT },
      { keys: [controls.right, controls.down], direction: Direction.DOWN_RIGHT },
      { keys: [controls.left], direction: Direction.LEFT },
      { keys: [controls.down], direction: Direction.DOWN },
      { keys: [controls.right], direction: Direction.RIGHT },
      { keys: [controls.up], direction: Direction.UP },
    ]

    const foundMapping = moveMapping.find((mapping) => this.areAllKeysDown(mapping.keys))
    if (foundMapping) {
      this.gridEngine.move(this.playerId, foundMapping.direction)
    }
  }

  destroy(): void {
    this.ws.close()
  }
}
