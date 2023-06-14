import * as Phaser from 'phaser'
import type { GridEngine, Position } from 'grid-engine'
import { Direction } from 'grid-engine'
import type { Websocket } from 'websocket-ts'
import { WebsocketBuilder } from 'websocket-ts'
import type { GameSettings, GameStatus, PlayerEquipment } from '../../services/game/Types'
import { type Controls } from './Types'
import { decodeGameToken } from '../../apis/apis'
import { TradeWindow } from '../views/TradeWindow'
import {
  type Coordinates,
  MovementMessageType,
  parseMovementMessage,
  sendMovementMessage,
} from '../messages/MoveMessageHandler'
import gameService from '../../services/game/GameService'
import {
  parseTradeMessage,
  sendTradeMessage,
  TradeMessageType,
} from '../messages/TradeMessagehandler'
import { EquipmentView } from '../views/EquipmentView'
import Key = Phaser.Input.Keyboard.Key
import { toast } from 'react-toastify'
import { TradeOfferPopup } from '../../components/messages/TradeOfferPopup'
import { type ClassResourceRepresentation } from '../../apis/game/Types'

export type PlayerId = string

export interface PlayerState {
  coords: Coordinates
  direction: Direction
  sprite: Phaser.GameObjects.Sprite
}

const VITE_ECSB_MOVEMENT_WS_API_URL: string = import.meta.env
  .VITE_ECSB_MOVEMENT_WS_API_URL as string
const VITE_ECSB_CHAT_WS_API_URL: string = import.meta.env.VITE_ECSB_CHAT_WS_API_URL as string
const LAYER_SCALE = 3
export const RANGE = 3

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

const getPlayerMapping =
  (initialCharacterMapping: ClassResourceRepresentation[]) =>
  (playerClass: string): number =>
    initialCharacterMapping.find((dto) => dto.key === playerClass)?.value.classAsset ?? 0

export class Scene extends Phaser.Scene {
  private readonly gridEngine!: GridEngine
  private readonly gameToken: string
  readonly playerId: PlayerId
  private readonly status: GameStatus
  public readonly settings: GameSettings
  public readonly players: Record<PlayerId, PlayerState>
  private actionTrade: string | null
  public tradeWindow: TradeWindow | null
  public equipmentView: EquipmentView | null
  public movingEnabled: boolean
  private movementWs!: Websocket
  private tradeWs!: Websocket
  equipment?: PlayerEquipment
  visibleEquipment?: PlayerEquipment
  private otherEquipment?: PlayerEquipment
  private otherPlayerId?: PlayerId

  constructor(gameToken: string, userStatus: GameStatus, settings: GameSettings) {
    super(sceneConfig)
    this.gameToken = gameToken
    this.playerId = decodeGameToken(gameToken).playerId
    this.status = userStatus
    this.settings = settings
    this.players = {}
    this.actionTrade = null
    this.movingEnabled = true
    this.tradeWindow = null
    this.equipmentView = null
  }

  preload(): void {
    this.load.image('tiles', '/assets/overworld.png')
    this.load.tilemapTiledJSON('glade', '/assets/forest_glade.json')
    this.load.spritesheet('player', '/assets/characters.png', {
      frameWidth: 52,
      frameHeight: 72,
    })
  }

  create(): void {
    const cloudCityTilemap = this.make.tilemap({ key: 'glade' })
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

    this.players[this.playerId] = {
      coords: this.status.coords,
      direction: this.status.direction as Direction,
      sprite: playerSprite,
    }
    this.gridEngine.create(cloudCityTilemap, gridEngineConfig)

    this.configureMovementWebSocket()
    this.configureChatWebSocket()

    this.gridEngine.positionChangeStarted().subscribe(({ charId, exitTile, enterTile }) => {
      if (charId === this.playerId) {
        const direction = this.getDirection(exitTile, enterTile)

        sendMovementMessage(this.movementWs, {
          type: MovementMessageType.Move,
          coords: {
            x: enterTile.x,
            y: enterTile.y,
          },
          direction: direction,
        })

        this.players[this.playerId].coords = { x: enterTile.x, y: enterTile.y }
        this.players[this.playerId].direction = direction
      }
    })

    this.gridEngine.positionChangeFinished().subscribe(({ charId, exitTile, enterTile }) => {
      if (charId !== this.playerId) {
        this.gridEngine.turnTowards(charId, this.players[charId].direction)
      }
    })

    this.input.on(
      'pointerdown',
      (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
        if (gameObjects.length === 0) {
          window.document.getElementById('btns')?.remove()
          this.actionTrade = null
        }
      },
    )

    gameService
      .getPlayerEquipment()
      .then((res: PlayerEquipment) => {
        this.equipment = res
        this.visibleEquipment = JSON.parse(JSON.stringify(res))
        this.equipmentView = new EquipmentView(this)
        this.equipmentView.show()
      })
      .catch((err) => {
        console.log('Error getting equipment:', err)
      })

    this.scale.resize(window.innerWidth, window.innerHeight)
  }

  createTradeWindow = (targetId: string, isUserTurn: boolean): void => {
    this.tradeWindow = new TradeWindow(
      this,
      this.equipment!,
      this.playerId,
      this.otherEquipment!,
      targetId,
      isUserTurn,
    )
    this.tradeWindow.show()
  }

  configureMovementWebSocket(): void {
    this.movementWs = new WebsocketBuilder(
      `${VITE_ECSB_MOVEMENT_WS_API_URL}/ws?gameToken=${this.gameToken}`,
    )
      .onOpen((i, ev) => {
        console.log('movementWs opened')

        sendMovementMessage(this.movementWs, {
          type: MovementMessageType.SyncRequest,
        })
      })
      .onClose((i, ev) => {
        console.log('movementWs closed')
      })
      .onError((i, ev) => {
        console.error('movementWs error')
      })
      .onMessage((i, ev) => {
        const msg = parseMovementMessage(ev.data)

        if (!msg) {
          return
        }

        switch (msg.type) {
          case MovementMessageType.PlayerAdded:
            this.addPlayer(msg.id, msg.coords, msg.direction, msg.className)
            break
          case MovementMessageType.PlayerMoved:
            this.movePlayer(msg.id, msg.coords, msg.direction)
            break
          case MovementMessageType.PlayerRemoved:
            this.removePlayer(msg.id)
            break
          case MovementMessageType.PlayerSyncing:
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

  configureChatWebSocket(): void {
    this.tradeWs = new WebsocketBuilder(
      `${VITE_ECSB_CHAT_WS_API_URL}/ws?gameToken=${this.gameToken}`,
    )
      .onOpen((i, ev) => {
        console.log('tradeWs opened')
      })
      .onClose((i, ev) => {
        console.log('tradeWs closed')
      })
      .onError((i, ev) => {
        console.error('tradeWs error')
      })
      .onMessage((i, ev) => {
        const msg = parseTradeMessage(ev.data)

        if (!msg) {
          return
        }

        switch (msg.message.type) {
          case TradeMessageType.TradeStart:
            this.showTradeInvite(msg.senderId)
            break
          case TradeMessageType.TradeServerAck:
            this.otherEquipment = msg.message.otherTrader
            this.otherPlayerId = msg.senderId
            this.createTradeWindow(msg.senderId, msg.message.myTurn)
            break
          case TradeMessageType.TradeCancel:
            this.tradeWindow?.close()
            this.otherEquipment = undefined
            this.otherPlayerId = undefined
            break
          case TradeMessageType.TradeBid:
            this.updateTradeDialog(
              msg.message.tradeBid.senderRequest,
              msg.message.tradeBid.senderOffer,
            )
            break
          case TradeMessageType.TradeServerFinish:
            this.tradeWindow?.close()
            this.otherEquipment = undefined
            this.otherPlayerId = undefined
            gameService
              .getPlayerEquipment()
              .then((res: PlayerEquipment) => {
                this.equipment = res
                for (const resource of res.resources) {
                  const val = this.visibleEquipment?.resources.find(
                    (it) => it.name === resource.name,
                  )
                  if (val) {
                    val.value = Math.min(resource.value, val.value)
                  }
                }
                if (this.visibleEquipment) {
                  this.visibleEquipment.money = Math.min(this.visibleEquipment.money, res.money)
                  this.visibleEquipment.time = Math.min(this.visibleEquipment.time, res.time)
                }
                this.equipmentView?.update()
              })
              .catch((err) => {
                console.log('Error getting equipment:', err)
              })
            break
          case TradeMessageType.UserBusy:
            this.showBusyPopup(msg.senderId, msg.message.reason)
            break
          case TradeMessageType.UserInterrupt:
            this.showInterruptMessage(msg.senderId, msg.message.reason)
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
    div.id = 'btns'
    div.style.backgroundColor = 'transparent'

    const buttonPartnership = document.createElement('button')
    const buttonPartnershipText = document.createElement('p')
    const iconPartnership = document.createElement('i')
    iconPartnership.className = 'fa fa-handshake-o'
    iconPartnership.ariaHidden = 'true'
    buttonPartnershipText.innerText = 'Company'
    buttonPartnership.appendChild(iconPartnership)
    buttonPartnership.appendChild(buttonPartnershipText)
    buttonPartnership.onclick = (e: Event) => {
      window.document.getElementById('btns')?.remove()
      this.actionTrade = null
    }
    const buttonTrade = document.createElement('button')
    const buttonTradeText = document.createElement('p')
    const iconTrade = document.createElement('i')
    iconTrade.className = 'fa fa-exchange'
    iconTrade.ariaHidden = 'true'
    buttonTradeText.innerText = 'Trade'
    buttonTrade.appendChild(iconTrade)
    buttonTrade.appendChild(buttonTradeText)
    buttonTrade.onclick = (e: Event) => {
      window.document.getElementById('btns')?.remove()
      sendTradeMessage(this.tradeWs, {
        senderId: this.playerId,
        message: {
          type: TradeMessageType.TradeStart,
          receiverId: id,
        },
      })
      toast.info('Trade invite sent', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
      this.actionTrade = null
    }

    div.appendChild(buttonPartnership)
    div.appendChild(buttonTrade)

    sprite.setInteractive()
    sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if ((!this.actionTrade || this.actionTrade !== id) && this.movingEnabled) {
        const neighbor = this.players[id]
        const currPlayer = this.players[this.playerId]
        if (
          Math.abs(neighbor.coords.x - currPlayer.coords.x) <= RANGE &&
          Math.abs(neighbor.coords.y - currPlayer.coords.y) <= RANGE
        ) {
          window.document.getElementById('btns')?.remove()
          this.add.dom(
            this.cameras.main.scrollX + pointer.x,
            this.cameras.main.scrollY + pointer.y,
            div,
          )
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
      sprite,
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

  showTradeInvite(from: string): void {
    toast.warn(TradeOfferPopup({ scene: this, from: from }), {
      position: 'bottom-right',
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    })
  }

  acceptTradeInvitation(senderId: string): void {
    sendTradeMessage(this.tradeWs, {
      senderId: this.playerId,
      message: {
        type: TradeMessageType.TradeStartAck,
        receiverId: senderId,
      },
    })
  }

  sendTradeBid(ourSide: PlayerEquipment, otherSide: PlayerEquipment): void {
    sendTradeMessage(this.tradeWs, {
      senderId: this.playerId,
      message: {
        type: TradeMessageType.TradeBid,
        tradeBid: {
          senderOffer: ourSide,
          senderRequest: otherSide,
        },
        receiverId: this.otherPlayerId!,
      },
    })
    this.tradeWindow?.disableSendOfferBtn()
    this.tradeWindow?.disableAcceptBtn()
  }

  updateTradeDialog(ourSide: PlayerEquipment, otherSide: PlayerEquipment): void {
    this.tradeWindow?.update(ourSide, otherSide)
    this.tradeWindow?.enableAcceptBtn()
    this.tradeWindow?.disableSendOfferBtn()
    this.tradeWindow?.setUserTurn(true)
  }

  finishTrade(ourSide: PlayerEquipment, otherSide: PlayerEquipment): void {
    sendTradeMessage(this.tradeWs, {
      senderId: this.playerId,
      message: {
        type: TradeMessageType.TradeFinish,
        finalBid: {
          senderOffer: ourSide,
          senderRequest: otherSide,
        },
        receiverId: this.otherPlayerId!,
      },
    })
  }

  cancelTrade(): void {
    sendTradeMessage(this.tradeWs, {
      senderId: this.playerId,
      message: {
        type: TradeMessageType.TradeCancel,
        receiverId: this.otherPlayerId!,
      },
    })
    this.otherEquipment = undefined
    this.otherPlayerId = undefined
  }

  showBusyPopup(senderId: string, message: string): void {
    toast.error(`${senderId} is already busy`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    })
  }

  showInterruptMessage(senderId: string, message: string): void {
    this.otherEquipment = undefined
    this.otherPlayerId = undefined
    console.log(senderId, message)
  }

  private areAllKeysDown(keys: Phaser.Input.Keyboard.Key[]): boolean {
    return keys.every((value) => value.isDown)
  }

  update(): void {
    if (!this.movingEnabled) return

    const controls: Controls = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    }

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
    this.movementWs.close()
    this.tradeWs.close()
    toast.dismiss()
  }
}
