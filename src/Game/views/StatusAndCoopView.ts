import { type ClassResourceRepresentation } from '../../apis/game/Types'
import { type Equipment } from '../../services/game/Types'
import { RESOURCE_ICON_SCALE, RESOURCE_ICON_WIDTH, getResourceMapping } from '../GameUtils'
import { type Scene } from '../scenes/Scene'
import { ImageCropper } from '../tools/ImageCropper'
import {
  OutcomingTradeMessageType,
  sendTradeMessage,
} from '../webSocketMessage/chat/TradeMessageHandler'

export class StatusAndCoopView {
  public static readonly statusButtonID = 'statusButton'
  public static readonly statusButtonWrapperID = 'statusButtonWrapper'
  public static readonly coopButtonID = 'coopButton'
  public static readonly coopButtonWrapperID = 'coopButtonWrapper'
  public static readonly statusAndCoopConatinerID = 'statusAndCoopContainer'
  public static readonly advertisementContainerID = 'advertisementContainer'

  private readonly statusButton: HTMLDivElement
  private readonly statusButtonWrapper: HTMLDivElement
  private readonly coopButton: HTMLDivElement
  private readonly coopButtonWrapper: HTMLDivElement
  private readonly container: HTMLDivElement
  private readonly advertisementContainer: HTMLDivElement

  constructor(
    equipment: Equipment,
    url: string,
    resRepresentation: ClassResourceRepresentation[],
    scene: Scene,
  ) {
    const cropper = new ImageCropper()

    this.advertisementContainer = document.createElement('div')
    this.advertisementContainer.id = StatusAndCoopView.advertisementContainerID
    equipment.resources.forEach((element) => {
      const row = document.createElement('div')
      row.className = 'advertisementContainerRow'
      const buttonGiveWrapper = document.createElement('div')
      buttonGiveWrapper.id = 'adButtonWrapper'
      const buttonGive = document.createElement('div')
      buttonGive.className = 'adGive'
      buttonGive.id = 'adButton'
      const giveImage = document.createElement('img')
      giveImage.src = '/assets/giveCustomIcon.png'
      buttonGive.appendChild(giveImage)
      const resourceGiveImg = cropper.crop(
        RESOURCE_ICON_WIDTH,
        RESOURCE_ICON_WIDTH,
        RESOURCE_ICON_SCALE,
        url,
        resRepresentation.length,
        getResourceMapping(resRepresentation)(element.key),
        false,
      )
      buttonGive.appendChild(resourceGiveImg)
      buttonGive.addEventListener('click', () => {
        document.querySelectorAll('.adGive').forEach((el) => {
          if (el !== buttonGive) el.id = 'adButton'
          if (el.parentElement !== buttonGiveWrapper) el.parentElement!.id = 'adButtonWrapper'
        })
        buttonGive.id = buttonGive.id === 'adButtonActive' ? 'adButton' : 'adButtonActive'
        buttonGiveWrapper.id =
          buttonGiveWrapper.id === 'adButtonWrapperActive'
            ? 'adButtonWrapper'
            : 'adButtonWrapperActive'

        scene.advertisementInfoBuilder.cleanBubblesForPlayer(scene.playerId, false)
        if (buttonGive.id === 'adButtonActive') {
          const bubble = document.createElement('div')
          bubble.appendChild(giveImage.cloneNode(true))
          bubble.appendChild(resourceGiveImg.cloneNode(true))
          bubble.classList.add('bubbleGive')
          scene.advertisementInfoBuilder.addBubble(bubble, scene.playerId)

          sendTradeMessage(scene.chatWs, {
            type: OutcomingTradeMessageType.TradeSell,
            gameResourceName: element.key,
          })
        } else {
          sendTradeMessage(scene.chatWs, {
            type: OutcomingTradeMessageType.TradeSell,
            gameResourceName: '',
          })
        }
        scene.advertisementInfoBuilder.setMarginAndVisibility(scene.playerId)
      })
      buttonGiveWrapper.appendChild(buttonGive)
      const buttonReceiveWrapper = document.createElement('div')
      buttonReceiveWrapper.id = 'adButtonWrapper'
      const buttonReceive = document.createElement('div')
      buttonReceive.className = 'adReceive'
      buttonReceive.id = 'adButton'
      const receiveImage = document.createElement('img')
      receiveImage.src = '/assets/receiveCustomIcon.png'
      buttonReceive.appendChild(receiveImage)
      const resourceReceiveImg = cropper.crop(
        RESOURCE_ICON_WIDTH,
        RESOURCE_ICON_WIDTH,
        RESOURCE_ICON_SCALE,
        url,
        resRepresentation.length,
        getResourceMapping(resRepresentation)(element.key),
        false,
      )
      buttonReceive.appendChild(resourceReceiveImg)
      buttonReceive.addEventListener('click', () => {
        document.querySelectorAll('.adReceive').forEach((el) => {
          if (el !== buttonReceive) el.id = 'adButton'
          if (el.parentElement !== buttonReceiveWrapper) el.parentElement!.id = 'adButtonWrapper'
        })
        buttonReceive.id = buttonReceive.id === 'adButtonActive' ? 'adButton' : 'adButtonActive'
        buttonReceiveWrapper.id =
          buttonReceiveWrapper.id === 'adButtonWrapperActive'
            ? 'adButtonWrapper'
            : 'adButtonWrapperActive'

        scene.advertisementInfoBuilder.cleanBubblesForPlayer(scene.playerId, true)
        if (buttonReceive.id === 'adButtonActive') {
          const bubble = document.createElement('div')
          bubble.appendChild(receiveImage.cloneNode(true))
          bubble.appendChild(resourceReceiveImg.cloneNode(true))
          bubble.classList.add('bubbleReceive')
          scene.advertisementInfoBuilder.addBubble(bubble, scene.playerId)

          sendTradeMessage(scene.chatWs, {
            type: OutcomingTradeMessageType.TradeBuy,
            gameResourceName: element.key,
          })
        } else {
          sendTradeMessage(scene.chatWs, {
            type: OutcomingTradeMessageType.TradeBuy,
            gameResourceName: '',
          })
        }
        scene.advertisementInfoBuilder.setMarginAndVisibility(scene.playerId)
      })
      buttonReceiveWrapper.appendChild(buttonReceive)
      row.appendChild(buttonGiveWrapper)
      row.appendChild(buttonReceiveWrapper)
      this.advertisementContainer.appendChild(row)
    })
    this.advertisementContainer.style.display = 'none'

    this.statusButton = document.createElement('div')
    this.statusButton.addEventListener('click', () => {
      this.statusButton.id =
        this.statusButton.id === 'statusButtonActive' ? 'statusButton' : 'statusButtonActive'
      this.statusButtonWrapper.id =
        this.statusButtonWrapper.id === 'statusButtonWrapperActive'
          ? 'statusButtonWrapper'
          : 'statusButtonWrapperActive'

      if (this.statusButton.id === 'statusButtonActive') {
        this.coopButton.id = 'coopButton'
        this.coopButtonWrapper.id = 'coopButtonWrapper'
      }
    })
    this.statusButton.id = StatusAndCoopView.statusButtonID
    const spanStatus = document.createElement('span')
    spanStatus.textContent = 'Status'
    const iconStatus = document.createElement('i')
    iconStatus.className = 'fa fa-caret-down'
    iconStatus.ariaHidden = 'true'
    this.statusButton.addEventListener('click', () => {
      iconStatus.className =
        iconStatus.className === 'fa fa-caret-up' ? 'fa fa-caret-down' : 'fa fa-caret-up'
      this.advertisementContainer.style.display =
        this.advertisementContainer.style.display === 'none' ? 'block' : 'none'

      if (iconStatus.className === 'fa fa-caret-up') {
        iconCoop.className = 'fa fa-caret-down'
      }
    })
    this.statusButton.appendChild(spanStatus)
    this.statusButton.appendChild(iconStatus)

    this.statusButtonWrapper = document.createElement('div')
    this.statusButtonWrapper.id = StatusAndCoopView.statusButtonWrapperID

    this.coopButton = document.createElement('div')
    this.coopButton.addEventListener('click', () => {
      this.coopButton.id =
        this.coopButton.id === 'coopButtonActive' ? 'coopButton' : 'coopButtonActive'
      this.coopButtonWrapper.id =
        this.coopButtonWrapper.id === 'coopButtonWrapperActive'
          ? 'coopButtonWrapper'
          : 'coopButtonWrapperActive'

      if (this.coopButton.id === 'coopButtonActive') {
        this.statusButton.id = 'statusButton'
        this.statusButtonWrapper.id = 'statusButtonWrapper'
      }
    })
    this.coopButton.id = StatusAndCoopView.coopButtonID
    const spanCoop = document.createElement('span')
    spanCoop.textContent = 'Wyprawa'
    const iconCoop = document.createElement('i')
    iconCoop.className = 'fa fa-caret-down'
    iconCoop.ariaHidden = 'true'
    this.coopButton.addEventListener('click', () => {
      iconCoop.className =
        iconCoop.className === 'fa fa-caret-up' ? 'fa fa-caret-down' : 'fa fa-caret-up'

      if (iconCoop.className === 'fa fa-caret-up') {
        iconStatus.className = 'fa fa-caret-down'
        this.advertisementContainer.style.display = 'none'
      }
    })
    this.coopButton.appendChild(spanCoop)
    this.coopButton.appendChild(iconCoop)

    this.coopButtonWrapper = document.createElement('div')
    this.coopButtonWrapper.id = StatusAndCoopView.coopButtonWrapperID

    this.container = document.createElement('div')
    this.container.id = StatusAndCoopView.statusAndCoopConatinerID

    this.statusButtonWrapper.appendChild(this.statusButton)
    this.coopButtonWrapper.appendChild(this.coopButton)
    this.container.appendChild(this.statusButtonWrapper)
    this.container.appendChild(this.advertisementContainer)
    this.container.appendChild(this.coopButtonWrapper)
  }

  public show(): void {
    window.document.body.appendChild(this.container)
  }

  public close(): void {
    window.document.body.removeChild(this.container)
  }
}
