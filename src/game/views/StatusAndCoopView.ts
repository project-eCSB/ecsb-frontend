import { type ClassResourceRepresentation, type Equipment, type GameResourceDto } from '../../apis/game/Types'
import { type Scene } from '../scenes/Scene'
import { ImageCropper } from '../tools/ImageCropper'
import { OutcomingCoopMessageType, sendCoopMessage } from '../webSocketMessage/chat/CoopMessageHandler'
import { OutcomingTradeMessageType, sendTradeMessage } from '../webSocketMessage/chat/TradeMessageHandler'
import {
  addResourcesTimes,
  createButtonWithInnerText,
  createCrop,
  createDivWithAll,
  createDivWithClassName,
  createDivWithId,
  createHeading,
  createIcon,
  createIconWithWidth,
  createIElement,
  createSpan,
  getClassName,
  getClassNameCondition,
  getId,
  getTimeIcon,
  getTimeIconWithValue,
  getValue,
} from './ViewUtils'

export class StatusAndCoopView {
  private static readonly statusButtonID = 'statusButton'
  private static readonly statusButtonWrapperID = 'statusButtonWrapper'
  private static readonly coopButtonID = 'coopButton'
  private static readonly coopButtonWrapperID = 'coopButtonWrapper'
  private static readonly statusAndCoopContainerID = 'statusAndCoopContainer'
  private static readonly advertisementContainerID = 'advertisementContainer'
  private static readonly coopContainerID = 'coopContainer'
  private static readonly coopDialogButtonsResignExtraWrapperID = 'coopDialogButtonsResignExtraWrapper'
  private static readonly coopDialogButtonsResignWrapperID = 'coopDialogButtonsResignWrapper'
  private static readonly coopDialogButtonsResignID = 'coopDialogButtonsResign'
  private static readonly coopDialogButtonsCooperateExtraWrapperID = 'coopDialogButtonsCooperateExtraWrapper'
  private static readonly coopDialogButtonsCooperateWrapperID = 'coopDialogButtonsCooperateWrapper'
  private static readonly coopDialogButtonsCooperateID = 'coopDialogButtonsCooperate'
  private static readonly coopDialogButtonsBreakExtraWrapperID = 'coopDialogButtonsBreakExtraWrapper'
  private static readonly coopDialogButtonsBreakWrapperID = 'coopDialogButtonsBreakWrapper'
  private static readonly coopDialogButtonsBreakID = 'coopDialogButtonsBreak'
  private static readonly coopDialogSuccessIconID = 'coopDialogSuccessIcon'


  private readonly scene: Scene
  private readonly cropper: ImageCropper
  private readonly url: string
  private readonly resRepresentation: ClassResourceRepresentation[]

  private readonly statusButton: HTMLDivElement
  private readonly statusButtonWrapper: HTMLDivElement
  private readonly coopButton: HTMLDivElement
  private readonly coopButtonWrapper: HTMLDivElement
  private readonly container: HTMLDivElement
  private readonly advertisementContainer: HTMLDivElement
  private readonly coopContainer: HTMLDivElement

  constructor(
    equipment: Equipment,
    url: string,
    resRepresentation: ClassResourceRepresentation[],
    scene: Scene,
  ) {
    this.cropper = new ImageCropper()
    this.url = url
    this.resRepresentation = resRepresentation

    this.scene = scene
    this.advertisementContainer = createDivWithId(StatusAndCoopView.advertisementContainerID)
    equipment.resources.forEach((element) => {
      const row = createDivWithClassName('advertisementContainerRow')
      const buttonGiveWrapper = createDivWithId('adButtonWrapper')
      const buttonGive = createDivWithAll('adButton', 'adGive')
      const giveImage = createIconWithWidth('/assets/giveCustomIcon.png', '30px')
      const resourceGiveImg = createCrop(this.cropper, this.url, this.resRepresentation, element.key)
      buttonGive.append(giveImage, resourceGiveImg)

      const giveImageAdvertisement = createIcon('/assets/giveCustomIcon.png')
      const resourceGiveImgAdvertisement = createCrop(this.cropper, this.url, this.resRepresentation, element.key)
      buttonGive.addEventListener('click', () => {
        document.querySelectorAll('.adGive').forEach((el) => {
          if (el !== buttonGive) el.id = 'adButton'
          if (el.parentElement !== buttonGiveWrapper) el.parentElement!.id = 'adButtonWrapper'
        })
        buttonGive.id = getId(buttonGive, 'adButton')
        buttonGiveWrapper.id = getId(buttonGiveWrapper, 'adButtonWrapper')

        scene.advertisementInfoBuilder.cleanBubblesForPlayer(scene.playerId, false)
        if (buttonGive.id === 'adButtonActive') {
          const bubble = document.createElement('div')
          bubble.append(giveImageAdvertisement, resourceGiveImgAdvertisement)
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
      const buttonReceiveWrapper = createDivWithId('adButtonWrapper')
      const buttonReceive = createDivWithAll('adButton', 'adReceive')
      const receiveImage = createIconWithWidth('/assets/receiveCustomIcon.png', '30px')
      const resourceReceiveImg = createCrop(this.cropper, this.url, this.resRepresentation, element.key)
      buttonReceive.append(receiveImage, resourceReceiveImg)

      const receiveImageAdvertisement = createIcon('/assets/receiveCustomIcon.png')
      const resourceReceiveImgAdvertisement = createCrop(this.cropper, this.url, this.resRepresentation, element.key)
      buttonReceive.addEventListener('click', () => {
        document.querySelectorAll('.adReceive').forEach((el) => {
          if (el !== buttonReceive) el.id = 'adButton'
          if (el.parentElement !== buttonReceiveWrapper) el.parentElement!.id = 'adButtonWrapper'
        })
        buttonReceive.id = getId(buttonReceive, 'adButton')
        buttonReceiveWrapper.id = getId(buttonReceiveWrapper, 'adButtonWrapper')

        scene.advertisementInfoBuilder.cleanBubblesForPlayer(scene.playerId, true)
        if (buttonReceive.id === 'adButtonActive') {
          const bubble = document.createElement('div')
          bubble.append(receiveImageAdvertisement, resourceReceiveImgAdvertisement)
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
      row.append(buttonGiveWrapper, buttonReceiveWrapper)
      this.advertisementContainer.appendChild(row)
    })
    this.advertisementContainer.style.display = 'none'

    this.statusButton = document.createElement('div')
    this.statusButton.addEventListener('click', () => {
      this.statusButton.id = getId(this.statusButton, 'statusButton')
      this.statusButtonWrapper.id = getId(this.statusButtonWrapper, 'statusButtonWrapper')
      if (this.statusButton.id === 'statusButtonActive') {
        this.coopButton.id = 'coopButton'
        this.coopButtonWrapper.id = 'coopButtonWrapper'
      }
    })
    this.statusButton.id = StatusAndCoopView.statusButtonID
    const spanStatus = createSpan('Status')
    const iconStatus = createIElement('caret-down')
    this.statusButton.addEventListener('click', () => {
      iconStatus.className = getValue(iconStatus.className, 'fa fa-caret-up', 'fa fa-caret-down')
      this.advertisementContainer.style.display = getValue(this.advertisementContainer.style.display, 'none', 'block')
      if (iconStatus.className === 'fa fa-caret-up') {
        iconCoop.className = 'fa fa-caret-down'
        this.coopContainer.style.display = 'none'
      }
    })
    this.statusButton.append(spanStatus, iconStatus)

    this.statusButtonWrapper = createDivWithId(StatusAndCoopView.statusButtonWrapperID)
    this.coopContainer = createDivWithId(StatusAndCoopView.coopContainerID)
    this.coopContainer.style.display = 'none'

    this.coopButton = createDivWithId(StatusAndCoopView.coopButtonID)
    this.coopButton.addEventListener('click', () => {
      this.coopButton.id = getId(this.coopButton, 'coopButton')
      this.coopButtonWrapper.id = getId(this.coopButtonWrapper, 'coopButtonWrapper')
      if (this.coopButton.id === 'coopButtonActive') {
        this.statusButton.id = 'statusButton'
        this.statusButtonWrapper.id = 'statusButtonWrapper'
      }
    })
    const spanCoop = createSpan('Wyprawa')
    const iconCoop = createIElement('caret-down')
    this.coopButton.addEventListener('click', () => {
      iconCoop.className = getValue(iconCoop.className, 'fa fa-caret-up', 'fa fa-caret-down')
      this.coopContainer.style.display = getValue(this.coopContainer.style.display, 'none', 'block')
      if (iconCoop.className === 'fa fa-caret-up') {
        iconStatus.className = 'fa fa-caret-down'
        this.advertisementContainer.style.display = 'none'
      }
    })
    this.coopButton.append(spanCoop, iconCoop)

    this.coopButtonWrapper = createDivWithId(StatusAndCoopView.coopButtonWrapperID)
    this.container = createDivWithId(StatusAndCoopView.statusAndCoopContainerID)

    this.statusButtonWrapper.appendChild(this.statusButton)
    this.coopButtonWrapper.appendChild(this.coopButton)
    this.container.append(this.statusButtonWrapper, this.advertisementContainer, this.coopButtonWrapper, this.coopContainer)
  }

  public showCoopView(): void {
    if (this.coopButton.id !== 'coopButtonActive') {
      this.coopButton.click()
    }
  }

  public hideCoopView(): void {
    if (this.coopButton.id === 'coopButtonActive') {
      this.coopButton.click()
    }
  }

  public updateCoopView(): void {
    while (this.coopContainer.firstChild) {
      this.coopContainer.removeChild(this.coopContainer.firstChild)
    }

    if (!this.scene.plannedTravel) return

    if (this.scene.plannedTravel.isSingle) {
      this.fillCoopViewSingleTravel()
    } else {
      this.fillCoopViewMultiTravel()
    }
  }

  private fillCoopViewSingleTravel(): void {
    if (!this.scene.plannedTravel) return

    const coopDialogExtraWrapper = createDivWithClassName('coopDialogExtraWrapper')
    const coopDialogWrapper = createDivWithClassName('coopDialogWrapper')
    const coopDialog = createDivWithClassName('coopDialog singleCoopDialog')
    // Header
    const coopDialogHeader = createDivWithId('singleCoopDialogHeader')

    const coopDialogTownName = createSpan(this.scene.plannedTravel.travel.value.name)
    const successIcon = createIconWithWidth('/assets/successCustomIcon.png', '15px')
    successIcon.id = StatusAndCoopView.coopDialogSuccessIconID

    coopDialogHeader.append(coopDialogTownName, successIcon)
    coopDialog.append(coopDialogHeader, document.createElement('hr'))

    // Resources
    const coopDialogResources = createDivWithId('singleCoopDialogResources')
    let hasAllResources = true
    this.scene.plannedTravel.playerRequiredResources.resources.forEach((resource) => {
      hasAllResources = this.processResources(resource, coopDialogResources, this.scene.plannedTravel!.playerResources, hasAllResources)
    })
    if (hasAllResources) {
      successIcon.style.visibility = 'visible'
    } else {
      successIcon.style.visibility = 'hidden'
      this.scene.shownGatheredResourcesMessage = false
    }
    coopDialogResources.appendChild(addResourcesTimes(this.scene.plannedTravel.playerRequiredResources.time))
    coopDialog.append(coopDialogResources, document.createElement('hr'))

    // Buttons
    const coopDialogButtons = createDivWithId('singleCoopDialogButtons')
    // Buttons - Resign
    const coopDialogButtonsResignExtraWrapper = createDivWithAll(StatusAndCoopView.coopDialogButtonsResignExtraWrapperID, StatusAndCoopView.coopDialogButtonsResignExtraWrapperID + 'Enabled')
    const coopDialogButtonsResignWrapper = createDivWithAll(StatusAndCoopView.coopDialogButtonsResignWrapperID, StatusAndCoopView.coopDialogButtonsResignWrapperID + 'Enabled')
    const coopDialogButtonsResign = createButtonWithInnerText(StatusAndCoopView.coopDialogButtonsResignID, 'Zrezygnuj')
    coopDialogButtonsResign.className = StatusAndCoopView.coopDialogButtonsResignID + 'Enabled'
    coopDialogButtonsResign.addEventListener('click', () => {
      coopDialogButtonsResign.disabled = true
      sendCoopMessage(this.scene.chatWs, {
        type: OutcomingCoopMessageType.CancelPlanning,
      })
      this.scene.advertisementInfoBuilder.addBubbleForCoop('', this.scene.playerId)
      coopDialogButtonsResignExtraWrapper.className = getClassName(coopDialogButtonsResignExtraWrapper, StatusAndCoopView.coopDialogButtonsResignExtraWrapperID)
      coopDialogButtonsResignWrapper.className = getClassName(coopDialogButtonsResignWrapper, StatusAndCoopView.coopDialogButtonsResignWrapperID)
      coopDialogButtonsResign.className = getClassName(coopDialogButtonsResign, StatusAndCoopView.coopDialogButtonsResignID)
    })

    coopDialogButtonsResignWrapper.appendChild(coopDialogButtonsResign)
    coopDialogButtonsResignExtraWrapper.appendChild(coopDialogButtonsResignWrapper)
    coopDialogButtons.appendChild(coopDialogButtonsResignExtraWrapper)

    // Buttons - Cooperate
    const coopDialogButtonsCooperateExtraWrapper = createDivWithId(StatusAndCoopView.coopDialogButtonsCooperateExtraWrapperID)
    coopDialogButtonsCooperateExtraWrapper.className = getClassNameCondition(!this.scene.plannedTravel.wantToCooperate, StatusAndCoopView.coopDialogButtonsCooperateExtraWrapperID)

    const coopDialogButtonsCooperateWrapper = createDivWithId(StatusAndCoopView.coopDialogButtonsCooperateWrapperID)
    coopDialogButtonsCooperateWrapper.className = getClassNameCondition(!this.scene.plannedTravel.wantToCooperate, StatusAndCoopView.coopDialogButtonsCooperateWrapperID)

    const coopDialogButtonsCooperate = createDivWithId(StatusAndCoopView.coopDialogButtonsCooperateID)
    coopDialogButtonsCooperate.className = getClassNameCondition(!this.scene.plannedTravel.wantToCooperate, StatusAndCoopView.coopDialogButtonsCooperateID)

    const cooperateIcon = createIconWithWidth('/assets/coopCustomIcon.png', '25px')
    coopDialogButtonsCooperate.appendChild(cooperateIcon)
    coopDialogButtonsCooperate.addEventListener('click', () => {
      this.scene.plannedTravel!.wantToCooperate = !this.scene.plannedTravel!.wantToCooperate

      if (this.scene.plannedTravel!.wantToCooperate) {
        sendCoopMessage(this.scene.chatWs, {
          type: OutcomingCoopMessageType.AdvertisePlanningStart,
          travelName: this.scene.plannedTravel!.travel.value.name,
        })
        this.scene.advertisementInfoBuilder.addBubbleForCoop(
          this.scene.plannedTravel!.travel.value.name,
          this.scene.playerId,
        )
        this.scene.advertisementInfoBuilder.setMarginAndVisibility(this.scene.playerId)
        this.scene.playerAdvertisedTravel[this.scene.playerId] =
          this.scene.plannedTravel!.travel.value.name
      } else {
        sendCoopMessage(this.scene.chatWs, {
          type: OutcomingCoopMessageType.AdvertisePlanningStop,
        })
        this.scene.advertisementInfoBuilder.addBubbleForCoop('', this.scene.playerId)
        this.scene.advertisementInfoBuilder.setMarginAndVisibility(this.scene.playerId)
        delete this.scene.playerAdvertisedTravel[this.scene.playerId]
      }
      coopDialogButtonsCooperateExtraWrapper.className = getClassName(coopDialogButtonsCooperateExtraWrapper, StatusAndCoopView.coopDialogButtonsCooperateExtraWrapperID)
      coopDialogButtonsCooperateWrapper.className = getClassName(coopDialogButtonsCooperateWrapper, StatusAndCoopView.coopDialogButtonsCooperateWrapperID)
      coopDialogButtonsCooperate.className = getClassName(coopDialogButtonsCooperate, StatusAndCoopView.coopDialogButtonsCooperateID)
    })

    coopDialogButtonsCooperateWrapper.appendChild(coopDialogButtonsCooperate)
    coopDialogButtonsCooperateExtraWrapper.appendChild(coopDialogButtonsCooperateWrapper)
    coopDialogButtons.appendChild(coopDialogButtonsCooperateExtraWrapper)
    coopDialog.appendChild(coopDialogButtons)
    coopDialogWrapper.appendChild(coopDialog)
    coopDialogExtraWrapper.appendChild(coopDialogWrapper)

    this.coopContainer.appendChild(coopDialogExtraWrapper)
  }

  private fillCoopViewMultiTravel(): void {
    if (!this.scene.plannedTravel) return

    const coopDialogExtraWrapper = createDivWithClassName('coopDialogExtraWrapper')
    const coopDialogWrapper = createDivWithClassName('coopDialogWrapper')
    const coopDialog = createDivWithClassName('coopDialog multiCoopDialog')
    // Header
    const coopDialogHeader = createDivWithId('multiCoopDialogHeader')

    const coopDialogHeaderLeft = document.createElement('div')
    const coopDialogTownName = createSpan(this.scene.plannedTravel.travel.value.name)
    const successIcon = createIconWithWidth('/assets/successCustomIcon.png', '15px')
    successIcon.id = StatusAndCoopView.coopDialogSuccessIconID
    coopDialogHeaderLeft.append(coopDialogTownName, successIcon)

    const coopDialogHeaderRight = document.createElement('div')
    const cooperateHeaderIcon = createIconWithWidth('/assets/coopCustomIcon.png', '20px')
    const partnerName = createSpan(this.scene.plannedTravel.partner!)
    coopDialogHeaderRight.append(cooperateHeaderIcon, partnerName)
    coopDialogHeader.append(coopDialogHeaderLeft, coopDialogHeaderRight)
    // PlayerResources

    const coopDialogPlayerName = createSpan(this.scene.playerId)
    coopDialogPlayerName.className = 'multiCoopDialogPlayerName'
    coopDialog.append(coopDialogHeader, document.createElement('hr'), coopDialogPlayerName)

    const coopDialogPlayerResources = createDivWithClassName('multiCoopDialogResources')

    let playerHasAllResources = true
    this.scene.plannedTravel.playerRequiredResources.resources.forEach((resource) => {
      playerHasAllResources = this.processResources(resource, coopDialogPlayerResources, this.scene.plannedTravel!.playerResources, playerHasAllResources)
    })

    if (this.scene.plannedTravel.playerIsRunning) {
      coopDialogPlayerResources.appendChild(addResourcesTimes(this.scene.plannedTravel.playerRequiredResources.time))
    }

    // PartnerResources
    const coopDialogPartnerName = createSpan(this.scene.plannedTravel.partner!)
    coopDialogPartnerName.className = 'multiCoopDialogPlayerName'
    coopDialog.append(coopDialogPlayerResources, document.createElement('hr'), coopDialogPartnerName)
    const coopDialogPartnerResources = createDivWithClassName('multiCoopDialogResources')

    let partnerHasAllResources = true
    this.scene.plannedTravel.partnerRequiredResources!.resources.forEach((resource) => {
      partnerHasAllResources = this.processResources(resource, coopDialogPartnerResources, this.scene.plannedTravel!.partnerResources!, partnerHasAllResources)
    })

    if (!this.scene.plannedTravel.playerIsRunning) {
      const coopDialogResourcesTimes = document.createElement('div')
      if (this.scene.plannedTravel.partnerRequiredResources!.time <= 2) {
        for (let i = 0; i < this.scene.plannedTravel.partnerRequiredResources!.time; i++) {
          const timeIconExtraWrapper = getTimeIcon()
          coopDialogResourcesTimes.appendChild(timeIconExtraWrapper)
        }
      } else {
        const timeIconExtraWrapper = getTimeIconWithValue(`${this.scene.plannedTravel.partnerRequiredResources!.time}`, false)
        coopDialogResourcesTimes.appendChild(timeIconExtraWrapper)
      }
      coopDialogPartnerResources.appendChild(coopDialogResourcesTimes)
    }

    coopDialog.append(coopDialogPartnerResources, document.createElement('hr'))

    if (playerHasAllResources && partnerHasAllResources) {
      successIcon.style.visibility = 'visible'
    } else {
      successIcon.style.visibility = 'hidden'
      this.scene.shownGatheredResourcesMessage = false
    }

    // Buttons
    const coopDialogButtons = createDivWithId('multiCoopDialogButtons')

    // Buttons - Break
    const coopDialogButtonsBreakExtraWrapper = createDivWithAll(StatusAndCoopView.coopDialogButtonsBreakExtraWrapperID, StatusAndCoopView.coopDialogButtonsBreakExtraWrapperID + 'Enabled')
    const coopDialogButtonsBreakWrapper = createDivWithAll(StatusAndCoopView.coopDialogButtonsBreakWrapperID, StatusAndCoopView.coopDialogButtonsBreakWrapperID + 'Enabled')
    const coopDialogButtonsBreak = createButtonWithInnerText(StatusAndCoopView.coopDialogButtonsBreakID, 'Zerwij')
    coopDialogButtonsBreak.className = StatusAndCoopView.coopDialogButtonsBreakID + 'Enabled'
    coopDialogButtonsBreak.addEventListener('click', () => {
      coopDialogButtonsBreak.disabled = true
      sendCoopMessage(this.scene.chatWs, {
        type: OutcomingCoopMessageType.CancelCoop,
      })
      coopDialogButtonsBreakExtraWrapper.className = getClassName(coopDialogButtonsBreakExtraWrapper, StatusAndCoopView.coopDialogButtonsBreakExtraWrapperID)
      coopDialogButtonsBreakWrapper.className = getClassName(coopDialogButtonsBreakWrapper, StatusAndCoopView.coopDialogButtonsBreakWrapperID)
      coopDialogButtonsBreak.className = getClassName(coopDialogButtonsBreak, StatusAndCoopView.coopDialogButtonsBreakID)
    })

    coopDialogButtonsBreakWrapper.appendChild(coopDialogButtonsBreak)
    coopDialogButtonsBreakExtraWrapper.appendChild(coopDialogButtonsBreakWrapper)
    coopDialogButtons.appendChild(coopDialogButtonsBreakExtraWrapper)
    coopDialog.appendChild(coopDialogButtons)
    coopDialogWrapper.appendChild(coopDialog)
    coopDialogExtraWrapper.appendChild(coopDialogWrapper)
    this.coopContainer.appendChild(coopDialogExtraWrapper)
  }

  private processResources(resource: GameResourceDto, coopDialogResources: HTMLDivElement, equipment: Equipment, hasAllResources: boolean): boolean {
    if (resource.value === 0) return hasAllResources

    const coopDialogResourcesItem = document.createElement('div')

    const itemImage = createCrop(this.cropper, this.url, this.resRepresentation, resource.key)

    const playerResourceValue = equipment.resources.find(
      (r) => r.key === resource.key,
    )!.value
    const playerRequiredValue = resource.value

    if (playerResourceValue < playerRequiredValue) hasAllResources = false

    const itemValueWrapper = document.createElement('div')
    const itemValue = createHeading('h4', `${Math.min(playerResourceValue, playerRequiredValue)}/${resource.value}`)

    itemValueWrapper.appendChild(itemValue)
    coopDialogResourcesItem.append(itemImage, itemValueWrapper)
    coopDialogResources.appendChild(coopDialogResourcesItem)
    return hasAllResources
  }

  public updateCoopSuccessIcon(success: boolean): void {
    const icon = document.getElementById(StatusAndCoopView.coopDialogSuccessIconID)
    if (!icon) return

    if (success) {
      icon.style.visibility = 'visible'
    } else {
      icon.style.visibility = 'hidden'
    }
  }

  public show(): void {
    window.document.body.appendChild(this.container)
  }

  public close(): void {
    document.getElementById(StatusAndCoopView.statusAndCoopContainerID)?.remove()
  }
}
