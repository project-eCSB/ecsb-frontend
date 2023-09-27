import * as Phaser from 'phaser'
import type {GridEngine, Position} from 'grid-engine'
import {Direction} from 'grid-engine'
import type {Websocket} from 'websocket-ts'
import {WebsocketBuilder} from 'websocket-ts'
import type {AssetConfig, Equipment, GameSettings, GameStatus, TradeEquipment,} from '../../services/game/Types'
import {CloudType, type Controls, type Coordinates, type PlayerId, type PlayerState,} from './Types'
import {decodeGameToken} from '../../apis/apis'
import {TradeView} from '../views/TradeView'
import gameService from '../../services/game/GameService'
import {EquipmentView} from '../views/EquipmentView'
import {toast} from 'react-toastify'
import {TradeOfferPopup} from '../components/TradeOfferPopup'
import {WorkshopView} from '../views/WorkshopView'
import {InteractionView} from '../views/InteractionView'
import {type LoadingView} from '../views/LoadingView'
import {parseChatMessage} from '../webSocketMessage/chat/MessageParser'
import {MovementMessageType, sendMovementMessage,} from '../webSocketMessage/movement/MovementMessage'
import {parseMovementMessage} from '../webSocketMessage/movement/MessageParser'
import {
  IncomingTradeMessageType,
  OutcomingTradeMessageType,
  sendTradeMessage,
} from '../webSocketMessage/chat/TradeMessageHandler'
import {UserStatusMessageType} from '../webSocketMessage/chat/UserStatusMessage'
import {NotificationMessageType} from '../webSocketMessage/chat/NotificationMessage'
import {InteractionCloudBuilder} from '../tools/InteractionCloudBuilder'
import {ContextMenuBuilder} from '../tools/ContextMenuBuilder'
import {TravelType, TravelView} from '../views/TravelView'
import {ImageCropper} from '../tools/ImageCropper'
import {
  ALL_PLAYERS_DESC_OFFSET_TOP,
  CHARACTER_ASSET_KEY,
  getPlayerMapping,
  LAYER_SCALE,
  MAP_ASSET_KEY,
  MOVEMENT_SPEED,
  PLAYER_DESC_OFFSET_LEFT,
  RANGE,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  TILES_ASSET_KEY
} from '../GameUtils'
import Key = Phaser.Input.Keyboard.Key;
import { EquipmentMessageType } from '../webSocketMessage/chat/EqupimentMessage'
import { UserMessageType, sendUserMessage } from '../webSocketMessage/chat/UserMessage'
import { UserDataView } from '../views/UserDataView'

const VITE_ECSB_MOVEMENT_WS_API_URL: string = import.meta.env
  .VITE_ECSB_MOVEMENT_WS_API_URL as string
const VITE_ECSB_CHAT_WS_API_URL: string = import.meta.env.VITE_ECSB_CHAT_WS_API_URL as string
const VITE_ECSB_HTTP_AUTH_AND_MENAGEMENT_API_URL: string = import.meta.env.VITE_ECSB_HTTP_AUTH_AND_MENAGEMENT_API_URL

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
}

export class Scene extends Phaser.Scene {
  private readonly gridEngine!: GridEngine
  private readonly gameToken: string
  readonly playerId: PlayerId
  public readonly status: GameStatus
  public readonly settings: GameSettings
  private readonly lowTravels: Coordinates[]
  private readonly mediumTravels: Coordinates[]
  private readonly highTravels: Coordinates[]
  private readonly playerWorkshopsCoordinates: Coordinates[]
  public playerCloudMovement!: Map<PlayerId, boolean>
  public playerWorkshopUnitPrice = 0
  public playerWorkshopResouseName = ''
  public playerWorkshopMaxProduction = 0
  public readonly players: Record<PlayerId, PlayerState>
  public playersClasses!: Map<PlayerId, string>
  public actionTrade: string | null
  public tradeWindow: TradeView | null
  public userDataView: UserDataView | null
  public equipmentView: EquipmentView | null
  public workshopView: WorkshopView | null
  public interactionView: InteractionView
  public loadingView: LoadingView | null
  public travelView: TravelView | null
  public interactionCloudBuiler!: InteractionCloudBuilder
  public contextMenuBuilder!: ContextMenuBuilder
  public imageCropper!: ImageCropper
  public movingEnabled: boolean
  private movementWs!: Websocket
  public chatWs!: Websocket
  public equipment?: Equipment
  public otherEquipment?: TradeEquipment
  public otherPlayerId?: PlayerId
  public characterUrl!: string
  public resourceUrl!: string
  public tileUrl!: string

  constructor(
    gameToken: string,
    userStatus: GameStatus,
    settings: GameSettings,
    mapConfig: AssetConfig,
    characterUrl: string,
    resourceUrl: string,
    tileUrl: string,
  ) {
    super(sceneConfig)
    this.gameToken = gameToken
    this.playerId = decodeGameToken(gameToken).playerId
    this.status = userStatus
    this.settings = settings
    this.players = {}
    this.actionTrade = null
    this.movingEnabled = true
    this.tradeWindow = null
    this.userDataView = null
    this.equipmentView = null
    this.workshopView = null
    this.interactionView = new InteractionView()
    this.loadingView = null
    this.travelView = null
    this.interactionCloudBuiler = new InteractionCloudBuilder()
    this.contextMenuBuilder = new ContextMenuBuilder()
    this.imageCropper = new ImageCropper()
    this.playerCloudMovement = new Map()
    this.playersClasses = new Map()
    this.lowTravels = mapConfig.lowLevelTravels
    this.mediumTravels = mapConfig.mediumLevelTravels
    this.highTravels = mapConfig.highLevelTravels
    this.characterUrl = characterUrl
    this.resourceUrl = resourceUrl
    this.tileUrl = tileUrl

    this.playerWorkshopsCoordinates = mapConfig.professionWorkshops[userStatus.className]

    settings.classResourceRepresentation.forEach((dto) => {
      if (dto.key === userStatus.className) {
        this.playerWorkshopUnitPrice = dto.value.unitPrice
        this.playerWorkshopResouseName = dto.value.gameResourceName
        this.playerWorkshopMaxProduction = dto.value.maxProduction
      }
    })
  }

  preload(): void {
    this.load.tilemapTiledJSON(MAP_ASSET_KEY, `${VITE_ECSB_HTTP_AUTH_AND_MENAGEMENT_API_URL}/assets/${this.settings.gameAssets.mapAssetId}`)
    this.load.image(TILES_ASSET_KEY, this.tileUrl)
    this.load.spritesheet(CHARACTER_ASSET_KEY, this.characterUrl, {
      frameWidth: SPRITE_WIDTH,
      frameHeight: SPRITE_HEIGHT,
    })
  }

  create(): void {
    const cloudCityTilemap = this.make.tilemap({ key: MAP_ASSET_KEY })
    cloudCityTilemap.addTilesetImage('Overworld', TILES_ASSET_KEY)

    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, 'Overworld', 0, 0)
      layer.scale = LAYER_SCALE
    }

    const playerSprite = this.add.sprite(0, 0, CHARACTER_ASSET_KEY)
    const text = this.add.text(PLAYER_DESC_OFFSET_LEFT, ALL_PLAYERS_DESC_OFFSET_TOP, 'You')
    text.setColor('#000000')
    text.setFontFamily('Georgia, serif')

    this.playerCloudMovement.set(this.playerId, false)
    this.playersClasses.set(this.playerId, this.status.className)

    const cloud = this.interactionCloudBuiler.build(this, this.playerId)

    this.cameras.main.setBounds(
      0,
      0,
      cloudCityTilemap.widthInPixels * LAYER_SCALE,
      cloudCityTilemap.heightInPixels * LAYER_SCALE,
    )

    const container = this.add.container(0, 0, [
      playerSprite,
      text,
      cloud,
    ])

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
          speed: MOVEMENT_SPEED,
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
        return
      }

      if (charId === this.playerId) {
        if (
          this.playerWorkshopsCoordinates.some(
            (coord) => coord.x === enterTile.x && coord.y === enterTile.y,
          )
        ) {
          this.interactionView.setText('enter the workshop...')
          this.interactionView.show()
        } else if (
          this.lowTravels.some((coord) => coord.x === enterTile.x && coord.y === enterTile.y)
        ) {
          this.interactionView.setText('start a short journey...')
          this.interactionView.show()
        } else if (
          this.mediumTravels.some((coord) => coord.x === enterTile.x && coord.y === enterTile.y)
        ) {
          this.interactionView.setText('start a medium-distance journey...')
          this.interactionView.show()
        } else if (
          this.highTravels.some((coord) => coord.x === enterTile.x && coord.y === enterTile.y)
        ) {
          this.interactionView.setText('start a long-distance journey...')
          this.interactionView.show()
        } else {
          this.interactionView.close()
        }
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
      .then((eq: Equipment) => {
        this.equipment = eq
        this.equipmentView = new EquipmentView(eq)
        this.equipmentView.show()
      })
      .catch((err) => {
        console.error(err)
      })

    this.userDataView = new UserDataView(this.playerId ,this.status.className)
    this.userDataView.show()

    this.scale.resize(window.innerWidth, window.innerHeight)

    if (
      this.playerWorkshopsCoordinates.some(
        (coord) => coord.x === this.status.coords.x && coord.y === this.status.coords.y,
      )
    ) {
      this.interactionView.setText('enter the workshop...')
      this.interactionView.show()
    } else if (
      this.lowTravels.some((coord) => coord.x === this.status.coords.x && coord.y === this.status.coords.y)
    ) {
      this.interactionView.setText('start a short journey...')
      this.interactionView.show()
    } else if (
      this.mediumTravels.some((coord) => coord.x === this.status.coords.x && coord.y === this.status.coords.y)
    ) {
      this.interactionView.setText('start a medium-distance journey...')
      this.interactionView.show()
    } else if (
      this.highTravels.some((coord) => coord.x === this.status.coords.x && coord.y === this.status.coords.y)
    ) {
      this.interactionView.setText('start a long-distance journey...')
      this.interactionView.show()
    } 
  }

  createTradeWindow = (targetId: string, isUserTurn: boolean): void => {
    this.tradeWindow = new TradeView(
      this,
      isUserTurn,
      this.playerId,
      this.equipment!,
      targetId,
      this.otherEquipment!,
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
    this.chatWs = new WebsocketBuilder(
      `${VITE_ECSB_CHAT_WS_API_URL}/ws?gameToken=${this.gameToken}`,
    )
      .onOpen((i, ev) => {
        console.log('chatWs opened')
      })
      .onClose((i, ev) => {
        console.log('chatWs closed')
      })
      .onError((i, ev) => {
        console.error('chatWs error')
      })
      .onMessage((i, ev) => {
        const msg = parseChatMessage(ev.data)
      
        if (!msg) return
        switch (msg.message.type) {
          case IncomingTradeMessageType.TradeServerPropose:
            this.showTradeInvite(msg.senderId)
            break
          case IncomingTradeMessageType.TradeServerStart:
            this.otherEquipment = msg.message.otherTrader
            this.otherPlayerId = msg.senderId
            this.createTradeWindow(msg.senderId, msg.message.myTurn)
            break
          case IncomingTradeMessageType.TradeServerCancel:
            this.tradeWindow?.close()
            break
          case IncomingTradeMessageType.TradeServerBid:
            this.updateTradeDialog(
              msg.message.tradeBid.senderRequest,
              msg.message.tradeBid.senderOffer,
            )
            break
          case IncomingTradeMessageType.TradeServerFinish:
            this.tradeWindow?.close()
            break
          case IncomingTradeMessageType.TradeSecondPlayerEqupimentChange:
            if (this.tradeWindow) {
              this.otherEquipment = msg.message.secondPlayerEqupiment
              this.tradeWindow.otherPlayerEq = msg.message.secondPlayerEqupiment
            }
            break
          case UserStatusMessageType.UserBusy:
            this.showBusyPopup(msg.message.reason)
            break
          case EquipmentMessageType.EquipmentChange:
            this.equipment = msg.message.playerEquipment
            this.equipmentView?.update(msg.message.playerEquipment)
            break
          case NotificationMessageType.NotificationTradeStart:
            this.interactionCloudBuiler.showInteractionCloud(msg.message.playerId, CloudType.TALK)
            break
          case NotificationMessageType.NotificationTradeEnd:
            this.interactionCloudBuiler.hideInteractionCloud(msg.message.playerId, CloudType.TALK)
            break
          case NotificationMessageType.NotificationTravelStart:
            this.interactionCloudBuiler.showInteractionCloud(msg.message.playerId, CloudType.TRAVEL)
            break
          case NotificationMessageType.NotificationTravelEnd:
            this.interactionCloudBuiler.hideInteractionCloud(msg.message.playerId, CloudType.TRAVEL)
            break            
          case NotificationMessageType.NotificationTravelChoosingStart:
            this.interactionCloudBuiler.showInteractionCloud(msg.message.playerId, CloudType.TRAVEL)
            break
          case NotificationMessageType.NotificationTravelChoosingStop:
            this.interactionCloudBuiler.hideInteractionCloud(msg.message.playerId, CloudType.TRAVEL)
            break
          case NotificationMessageType.NotificationWorkshopChoosingStart:
            this.interactionCloudBuiler.showInteractionCloud(msg.message.playerId, CloudType.WORK)
            break
          case NotificationMessageType.NotificationWorkshopChoosingStop:
            this.interactionCloudBuiler.hideInteractionCloud(msg.message.playerId, CloudType.WORK)
            break
          case NotificationMessageType.NotificationProductionStart:
            this.interactionCloudBuiler.showInteractionCloud(msg.message.playerId, CloudType.PRODUCTION)
            this.playerCloudMovement.set(msg.message.playerId, true)
            break
          case NotificationMessageType.NotificationProductionEnd:
            this.interactionCloudBuiler.hideInteractionCloud(msg.message.playerId, CloudType.PRODUCTION)
            this.playerCloudMovement.set(msg.message.playerId, false)
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
    const sprite = this.add.sprite(0, 0, CHARACTER_ASSET_KEY)
    const text = this.add.text(0, ALL_PLAYERS_DESC_OFFSET_TOP, id)
    text.setColor('#000000')
    text.setFontFamily('Georgia, serif')

    this.playerCloudMovement.set(id, false)
    this.playersClasses.set(id, characterClass)

    const cloud = this.interactionCloudBuiler.build(this, id)
    const div = this.contextMenuBuilder.build(this, id)

    sprite.setInteractive()
    sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if ((!this.actionTrade || this.actionTrade !== id) && this.movingEnabled) {
        sendUserMessage(this.chatWs, {
          type: UserMessageType.UserClicked,
          name: id
        })

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
    const container = this.add.container(0, 0, [
      sprite,
      text,
      cloud,
    ])

    this.gridEngine.addCharacter({
      id: id,
      sprite: sprite,
      container,
      facingDirection: direction,
      walkingAnimationMapping: getPlayerMapping(this.settings.classResourceRepresentation)(
        characterClass,
      ),
      speed: MOVEMENT_SPEED,
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

    this.interactionCloudBuiler.purgeUnnecessaryIcons(id)
    this.players[id].coords = coords
    this.players[id].direction = direction
  }

  showTradeInvite(from: string): void {
    toast.warn(TradeOfferPopup({ scene: this, from: from}), {
      position: 'bottom-right',
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      toastId: from,
    })
  }

  acceptTradeInvitation(senderId: string): void {
    sendTradeMessage(this.chatWs, {
      senderId: this.playerId,
      message: {
        type: OutcomingTradeMessageType.ProposeTradeAck,
        proposalSenderId: senderId,
      },
    })
  }

  sendTradeMinorChange(ourSide: TradeEquipment, otherSide: TradeEquipment): void {
    sendTradeMessage(this.chatWs, {
      senderId: this.playerId,
      message: {
        type: OutcomingTradeMessageType.TradeMinorChange,
        tradeBid: {
          senderOffer: ourSide,
          senderRequest: otherSide,
        },
        receiverId: this.otherPlayerId!,
      },
    })
  }

  sendTradeBid(ourSide: TradeEquipment, otherSide: TradeEquipment): void {
    sendTradeMessage(this.chatWs, {
      senderId: this.playerId,
      message: {
        type: OutcomingTradeMessageType.TradeBid,
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

  updateTradeDialog(ourSide: TradeEquipment, otherSide: TradeEquipment): void {
    this.tradeWindow?.update(ourSide, otherSide)
    this.tradeWindow?.enableAcceptBtn()
    this.tradeWindow?.disableSendOfferBtn()
    this.tradeWindow?.setUserTurn(true)
  }

  finishTrade(ourSide: TradeEquipment, otherSide: TradeEquipment): void {
    sendTradeMessage(this.chatWs, {
      senderId: this.playerId,
      message: {
        type: OutcomingTradeMessageType.TradeBidAck,
        finalBid: {
          senderOffer: ourSide,
          senderRequest: otherSide,
        },
        receiverId: this.otherPlayerId!,
      },
    })
  }

  cancelTrade(): void {
    sendTradeMessage(this.chatWs, {
      senderId: this.playerId,
      message: {
        type: OutcomingTradeMessageType.TradeCancel,
      },
    })
    this.otherEquipment = undefined
    this.otherPlayerId = undefined
  }

  showBusyPopup(message: string): void {
    toast.error(`${message}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    })
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

    if (controls.action.isDown && Phaser.Input.Keyboard.JustDown(controls.action)) {
      if (
        this.playerWorkshopsCoordinates.some(
          (coords) =>
            this.players[this.playerId].coords.x === coords.x &&
            this.players[this.playerId].coords.y === coords.y,
        )
      ) {
        this.workshopView = new WorkshopView(this)
        this.workshopView.show()

        this.interactionView.close()
      } else if (
        this.lowTravels.some(
          (coords) =>
            this.players[this.playerId].coords.x === coords.x &&
            this.players[this.playerId].coords.y === coords.y,
        )
      ) {
        this.travelView = new TravelView(this, TravelType.LOW)
        this.travelView.show()

        this.interactionView.close()
      } else if (
        this.mediumTravels.some(
          (coords) =>
            this.players[this.playerId].coords.x === coords.x &&
            this.players[this.playerId].coords.y === coords.y,
        )
      ) {
        this.travelView = new TravelView(this, TravelType.MEDIUM)
        this.travelView.show()

        this.interactionView.close()
      } else if (
        this.highTravels.some(
          (coords) =>
            this.players[this.playerId].coords.x === coords.x &&
            this.players[this.playerId].coords.y === coords.y,
        )
      ) {
        this.travelView = new TravelView(this, TravelType.HIGH)
        this.travelView.show()

        this.interactionView.close()
      }

      return
    }

    const foundMapping = moveMapping.find((mapping) => this.areAllKeysDown(mapping.keys))
    if (foundMapping) {
      this.gridEngine.move(this.playerId, foundMapping.direction)
      this.interactionCloudBuiler.purgeUnnecessaryIcons(this.playerId)
    }
  }

  destroy(): void {
    this.movementWs.close()
    this.chatWs.close()
    toast.dismiss()
  }
}
