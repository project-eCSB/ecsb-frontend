import * as Phaser from 'phaser'
import type { GridEngine, Position } from 'grid-engine'
import { Direction } from 'grid-engine'
import type { Websocket } from 'websocket-ts'
import { WebsocketBuilder } from 'websocket-ts'
import type { Coordinates } from '../MessageHandler'
import { MessageType, parseMessage, sendMessage } from '../MessageHandler'
import type { GameSettings, GameStatus } from '../../services/game/Types'
import { decodeGameToken } from '../../apis/apis'
import { type GameClassResourceDto } from '../../apis/game/Types'
import Key = Phaser.Input.Keyboard.Key

type PlayerId = string

interface PlayerState {
  coords: Coordinates
  direction: Direction
  sprite: Phaser.GameObjects.Sprite
}

const VITE_ECSB_WS_API_URL: string = import.meta.env.VITE_ECSB_WS_API_URL as string
const LAYER_SCALE = 3
const RANGE = 3

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
  private actionTrade: string | null
  private movingEnabled: boolean
  private ws!: Websocket

  constructor(gameToken: string, userStatus: GameStatus, settings: GameSettings) {
    super(sceneConfig)
    this.gameToken = gameToken
    this.playerId = decodeGameToken(gameToken).playerId
    this.status = userStatus
    this.settings = settings
    this.players = {}
    this.actionTrade = null
    this.movingEnabled = true
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

    playerSprite.setInteractive()
    playerSprite.on('pointerdown', () => {
      console.log(this.playerId)
    })
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

    this.players[this.playerId] = { coords: this.status.coords, direction: this.status.direction as Direction , sprite: playerSprite}
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

        this.players[this.playerId].coords = {x: enterTile.x, y: enterTile.y}
        this.players[this.playerId].direction = direction
      }
    })

    this.gridEngine.positionChangeFinished().subscribe(({ charId, exitTile, enterTile }) => {
      if (charId !== this.playerId) {
        this.gridEngine.turnTowards(charId, this.players[charId].direction)
      }
    })

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
      if(gameObjects.length === 0) {
        window.document.getElementById('btn')?.remove()
        this.actionTrade = null
      }
    })

    this.scale.resize(window.innerWidth, window.innerHeight)
  }
    
  createTradeWindow = (id: string, name: string): void => {
    const neighbor = this.players[id]
    const currPlayer = this.players[this.playerId]
    if (!(
      Math.abs(neighbor.coords.x - currPlayer.coords.x) <= RANGE &&
      Math.abs(neighbor.coords.y - currPlayer.coords.y) <= RANGE
    )) return

    const tradeBox = document.createElement('div')
    tradeBox.id = 'tradeBox'
    const tradeBoxName = document.createElement('div')
    tradeBoxName.appendChild(document.createTextNode(name))
    const tradeBoxId = document.createElement('div')
    tradeBoxId.appendChild(document.createTextNode(id.toString()))
    const tradeBoxClose = document.createElement('button')
    tradeBoxClose.innerText = 'Close'
    tradeBoxClose.addEventListener('click', () => {
      document.getElementById('tradeBox')?.remove()
      this.movingEnabled = true
    })
  
    tradeBox.appendChild(tradeBoxName)
    tradeBox.appendChild(tradeBoxId)
    tradeBox.appendChild(tradeBoxClose)
  
    tradeBox.style.width = '500px'
    tradeBox.style.height = '800px'
    tradeBox.style.padding = '5px 20px 20px 10px'
    tradeBox.style.position = 'fixed'
    tradeBox.style.top = 'calc(50% - 100px)'
    tradeBox.style.left = 'calc(50% - 150px)'
    tradeBox.style.background = 'white'
  
    this.movingEnabled = false

    window.document.body.appendChild(tradeBox) 
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

    const div = document.createElement('div')
    div.id = 'btn'
    div.style.backgroundColor = 'white'

    const buttonPartnership = document.createElement('button')
    buttonPartnership.textContent = 'Partnership'
    buttonPartnership.onclick = (e: Event) => {
      window.document.getElementById('btn')?.remove()
      this.actionTrade = null
    }
    const buttonTrade = document.createElement('button')
    buttonTrade.textContent = 'Trade'
    buttonTrade.onclick = (e: Event) => {
      window.document.getElementById('btn')?.remove()

      this.createTradeWindow(id, "TEST")

      this.actionTrade = null
    }
    
    div.appendChild(buttonPartnership)
    div.appendChild(buttonTrade)

    sprite.setInteractive()
    sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if ((!this.actionTrade || this.actionTrade !== id) && (this.movingEnabled)) {
        const neighbor = this.players[id]
        const currPlayer = this.players[this.playerId]
        if (
          Math.abs(neighbor.coords.x - currPlayer.coords.x) <= RANGE &&
          Math.abs(neighbor.coords.y - currPlayer.coords.y) <= RANGE
        ) {
          window.document.getElementById('btn')?.remove()
          this.add.dom(this.cameras.main.scrollX + pointer.x, this.cameras.main.scrollY + pointer.y, div)
          this.actionTrade = id
        }
      }
    })
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
      sprite
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

    this.players[id].coords = coords
    this.players[id].direction = direction
  }

  private areAllKeysDown(keys: Phaser.Input.Keyboard.Key[]): boolean {
    return keys.every((value) => value.isDown)
  }

  update(): void {
    if (!this.movingEnabled) return

    const cursors = this.input.keyboard.createCursorKeys()

    const moveMapping: Array<{ keys: Key[]; direction: Direction }> = [
      { keys: [cursors.left, cursors.up], direction: Direction.UP_LEFT },
      { keys: [cursors.left, cursors.down], direction: Direction.DOWN_LEFT },
      { keys: [cursors.right, cursors.up], direction: Direction.UP_RIGHT },
      { keys: [cursors.right, cursors.down], direction: Direction.DOWN_RIGHT },
      { keys: [cursors.left], direction: Direction.LEFT },
      { keys: [cursors.down], direction: Direction.DOWN },
      { keys: [cursors.right], direction: Direction.RIGHT },
      { keys: [cursors.up], direction: Direction.UP },
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
