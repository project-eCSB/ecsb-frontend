import { type ClassResourceRepresentation, type GameResourceDto, type Travel } from '../../apis/game/Types'
import { getResourceMapping } from '../GameUtils'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { type CoopBid, OutcomingCoopMessageType, sendCoopMessage } from '../webSocketMessage/chat/CoopMessageHandler'
import { ResourceNegotiationSuccessView } from './ResourceNegotiationSuccessView'
import {
  createButtonWithId,
  createButtonWithInnerText,
  createCrop,
  createDivWithClassName,
  createDivWithId,
  createHeading,
  createHeadingWithId,
  createIconWithAll, createIconWithWidth,
  createIElementWithColor,
  createSpan,
  getClassName,
  getTimeContainer,
} from './ViewUtils'

export class ResourceNegotiationView {
  public static readonly resourceNegotiationBoxWrapperID = 'resourceNegotiationBoxWrapper'
  public static readonly resourceNegotiationBoxID = 'resourceNegotiationBox'
  public static readonly resourceNegotiationHeaderBoxExtraWrapperID = 'resourceNegotiationHeaderBoxExtraWrapper'
  public static readonly resourceNegotiationHeaderBoxWrapperID = 'resourceNegotiationHeaderBoxWrapper'
  public static readonly resourceNegotiationHeaderBoxID = 'resourceNegotiationHeaderBox'
  public static readonly resourceNegotiationCloseButtonID = 'resourceNegotiationCloseButton'
  public static readonly resourceNegotiationResultBoxID = 'resourceNegotiationResultBox'
  public static readonly resourceNegotiationResultCostBoxWrapperID = 'resourceNegotiationResultCostBoxWrapper'
  public static readonly resourceNegotiationResultCostBoxID = 'resourceNegotiationResultCostBox'
  public static readonly resourceNegotiationResultProfitBoxWrapperID = 'resourceNegotiationResultProfitBoxWrapper'
  public static readonly resourceNegotiationResultProfitBoxID = 'resourceNegotiationResultProfitBox'
  public static readonly resourceNegotiationPlayerTurnBoxWrapperID = 'resourceNegotiationPlayerTurnBoxWrapper'
  public static readonly resourceNegotiationPlayerTurnBoxID = 'resourceNegotiationPlayerTurnBox'
  public static readonly resourceNegotiationContentBoxExtraWrapperID = 'resourceNegotiationContentBoxExtraWrapper'
  public static readonly resourceNegotiationContentBoxWrapperID = 'resourceNegotiationContentBoxWrapper'
  public static readonly resourceNegotiationContentBoxID = 'resourceNegotiationContentBox'
  public static readonly resourceNegotiationContentBoxResourcesID = 'resourceNegotiationContentBoxResources'
  public static readonly resourceNegotiationContentBoxPlayerTimeID = 'resourceNegotiationContentBoxPlayerTime'
  public static readonly resourceNegotiationContentBoxProfitID = 'resourceNegotiationContentBoxProfit'
  public static readonly resourceNegotiationPlayerNameWrapperID = 'resourceNegotiationPlayerNameWrapper'
  public static readonly resourceNegotiationPlayerNameID = 'resourceNegotiationPlayerName'
  public static readonly resourceNegotiationPartnerNameWrapperID = 'resourceNegotiationPartnerNameWrapper'
  public static readonly resourceNegotiationPartnerNameID = 'resourceNegotiationPartnerName'
  public static readonly resourceNegotiationButtonsID = 'resourceNegotiationButtons'
  public static readonly resourceNegotiationButtonsProposeButtonExtraWrapperID = 'resourceNegotiationButtonsProposeButtonExtraWrapper'
  public static readonly resourceNegotiationButtonsProposeButtonWrapperID = 'resourceNegotiationButtonsProposeButtonWrapper'
  public static readonly resourceNegotiationButtonsProposeButtonID = 'resourceNegotiationButtonsProposeButton'
  public static readonly resourceNegotiationButtonsAcceptButtonExtraWrapperID = 'resourceNegotiationButtonsAcceptButtonExtraWrapper'
  public static readonly resourceNegotiationButtonsAcceptButtonWrapperID = 'resourceNegotiationButtonsAcceptButtonWrapper'
  public static readonly resourceNegotiationButtonsAcceptButtonID = 'resourceNegotiationButtonsAcceptButton'

  // CONTAINER
  private readonly resourceNegotiationBoxWrapper: HTMLDivElement
  private readonly resourceNegotiationBox: HTMLDivElement
  // HEADER
  private readonly resourceNegotiationHeaderBoxExtraWrapper: HTMLDivElement
  private readonly resourceNegotiationHeaderBoxWrapper: HTMLDivElement
  private readonly resourceNegotiationHeaderBox: HTMLDivElement
  private readonly resourceNegotiationCloseButton: HTMLButtonElement
  // RESULT
  private readonly resourceNegotiationResultBox: HTMLDivElement
  private readonly resourceNegotiationResultCostBoxWrapper: HTMLDivElement
  private readonly resourceNegotiationResultCostBox: HTMLDivElement
  private readonly resourceNegotiationResultProfitBoxWrapper: HTMLDivElement
  private readonly resourceNegotiationResultProfitBox: HTMLDivElement
  private readonly resourceNegotiationPlayerTurnBoxWrapper: HTMLHeadingElement
  private readonly resourceNegotiationPlayerTurnBox: HTMLHeadingElement
  // CONTENT
  private readonly resourceNegotiationContentBoxExtraWrapper: HTMLDivElement
  private readonly resourceNegotiationContentBoxWrapper: HTMLDivElement
  private readonly resourceNegotiationContentBox: HTMLDivElement
  // BUTTONS
  private readonly resourceNegotiationButtons: HTMLDivElement
  private readonly resourceNegotiationButtonsProposeButtonExtraWrapper: HTMLDivElement
  private readonly resourceNegotiationButtonsProposeButtonWrapper: HTMLDivElement
  private readonly resourceNegotiationButtonsProposeButton: HTMLButtonElement
  private readonly resourceNegotiationButtonsAcceptButtonExtraWrapper: HTMLDivElement
  private readonly resourceNegotiationButtonsAcceptButtonWrapper: HTMLDivElement
  private readonly resourceNegotiationButtonsAcceptButton: HTMLButtonElement

  private isPlayerTurn: boolean
  private isFirstTurn: boolean

  private currPlayerBid: CoopBid
  private newPlayerBid: CoopBid
  private currPartnerBid: CoopBid
  private newPartnerBid: CoopBid

  private readonly scene: Scene
  public readonly travel: Travel
  public readonly partner: string
  private readonly cropper: ImageCropper
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]

  constructor(
    scene: Scene,
    travel: Travel,
    partner: string,
    resourceURL: string,
    resRepresentation: ClassResourceRepresentation[],
    isPlayerTurn: boolean,
  ) {
    this.scene = scene
    this.travel = travel
    this.partner = partner
    this.resourceURL = resourceURL
    this.resourceRepresentation = resRepresentation
    this.cropper = new ImageCropper()
    this.isPlayerTurn = isPlayerTurn
    this.isFirstTurn = true

    const currPlayerBidResources: GameResourceDto[] = []
    const newPlayerBidResources: GameResourceDto[] = []
    const currPartnerBidResources: GameResourceDto[] = []
    const newPartnerBidResources: GameResourceDto[] = []
    for (const resource of this.travel.value.resources) {
      currPlayerBidResources.push({
        key: resource.key,
        value: 0,
      })
      newPlayerBidResources.push({
        key: resource.key,
        value: 0,
      })

      currPartnerBidResources.push({
        key: resource.key,
        value: resource.value,
      })
      newPartnerBidResources.push({
        key: resource.key,
        value: resource.value,
      })
    }
    this.currPlayerBid = {
      travelerId: '',
      moneyRatio: 0,
      resources: currPlayerBidResources,
    }
    this.newPlayerBid = {
      travelerId: '',
      moneyRatio: 0,
      resources: newPlayerBidResources,
    }
    this.currPartnerBid = {
      travelerId: this.partner,
      moneyRatio: 100,
      resources: newPartnerBidResources,
    }
    this.newPartnerBid = {
      travelerId: this.partner,
      moneyRatio: 100,
      resources: currPartnerBidResources,
    }

    // Wrapper
    this.resourceNegotiationBoxWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationBoxWrapperID)
    // Container
    this.resourceNegotiationBox = createDivWithId(ResourceNegotiationView.resourceNegotiationBoxID)
    // Header
    this.resourceNegotiationHeaderBoxExtraWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationHeaderBoxExtraWrapperID)
    this.resourceNegotiationHeaderBoxWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationHeaderBoxWrapperID)
    this.resourceNegotiationHeaderBox = createDivWithId(ResourceNegotiationView.resourceNegotiationHeaderBoxID)

    const resourceNegotiationHeaderTitle = createHeading('h1', 'WYPRAWA')
    const resourceNegotiationHeaderSubtitle = createHeading('h2', 'PODZIAŁ WKŁADU i ZYSKU')
    this.resourceNegotiationCloseButton = createButtonWithId(ResourceNegotiationView.resourceNegotiationCloseButtonID)
    this.resourceNegotiationCloseButton.addEventListener('click', () => {
      sendCoopMessage(this.scene.chatWs, {
        type: OutcomingCoopMessageType.CancelNegotiation,
        message: 'empty for now',
      })
      this.close(false)
    })
    const XIcon = createIElementWithColor('times', 'black')
    this.resourceNegotiationCloseButton.appendChild(XIcon)
    this.resourceNegotiationHeaderBox.append(resourceNegotiationHeaderTitle, resourceNegotiationHeaderSubtitle)
    this.resourceNegotiationHeaderBoxWrapper.append(this.resourceNegotiationHeaderBox, this.resourceNegotiationCloseButton)
    this.resourceNegotiationHeaderBoxExtraWrapper.appendChild(this.resourceNegotiationHeaderBoxWrapper)
    this.resourceNegotiationBox.append(this.resourceNegotiationHeaderBoxExtraWrapper)
    // Result
    this.resourceNegotiationResultBox = createDivWithId(ResourceNegotiationView.resourceNegotiationResultBoxID)
    // Result - cost
    this.resourceNegotiationResultCostBoxWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationResultCostBoxWrapperID)
    this.resourceNegotiationResultCostBox = createDivWithId(ResourceNegotiationView.resourceNegotiationResultCostBoxID)
    this.resourceNegotiationResultCostBox.appendChild(createSpan('Koszt wyprawy'))

    for (const resource of this.travel.value.resources) {
      const resourceContainer = document.createElement('div')
      const resourceValue = createSpan(`${resource.value}`)
      const resourceIcon = this.cropper.crop(
        20,
        20,
        1,
        this.resourceURL,
        this.resourceRepresentation.length,
        getResourceMapping(this.resourceRepresentation)(resource.key),
        false,
      )
      resourceContainer.append(resourceValue, resourceIcon)
      this.resourceNegotiationResultCostBox.appendChild(resourceContainer)
      this.resourceNegotiationResultCostBox.appendChild(createSpan(' + '))
    }

    const timeContainer = document.createElement('div')
    if (this.travel.value.time > 3) {
      const timeValue = createSpan(`${this.travel.value.time}`)
      const timeIcon = createIconWithAll('/assets/timeCustomIcon.png', '20px')
      timeContainer.append(timeValue, timeIcon)
    } else {
      for (let i = 0; i < this.travel.value.time; i++) {
        const timeIcon = createIconWithAll('/assets/timeCustomIcon.png', '20px')
        timeContainer.appendChild(timeIcon)
      }
    }

    this.resourceNegotiationResultCostBox.appendChild(timeContainer)

    this.resourceNegotiationResultCostBoxWrapper.appendChild(this.resourceNegotiationResultCostBox)
    // Result - profit
    this.resourceNegotiationResultProfitBoxWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationResultProfitBoxWrapperID)
    this.resourceNegotiationResultProfitBox = createDivWithId(ResourceNegotiationView.resourceNegotiationResultProfitBoxID)
    this.resourceNegotiationResultProfitBox.appendChild(createSpan(`Zysk:`))

    const moneyContainer = document.createElement('div')
    const moneyValue = createSpan(`${this.travel.value.moneyRange.from}-${this.travel.value.moneyRange.to}`)
    const moneyIcon = createIconWithAll('/assets/coinCustomIcon.png', '20px')
    moneyContainer.append(moneyValue, moneyIcon)
    this.resourceNegotiationResultProfitBox.appendChild(moneyContainer)

    this.resourceNegotiationResultProfitBoxWrapper.appendChild(this.resourceNegotiationResultProfitBox)
    // Result - player turn
    this.resourceNegotiationPlayerTurnBoxWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationPlayerTurnBoxWrapperID)

    this.resourceNegotiationPlayerTurnBox = createHeadingWithId('h3', ResourceNegotiationView.resourceNegotiationPlayerTurnBoxID, '')
    this.resourceNegotiationPlayerTurnBoxWrapper.appendChild(this.resourceNegotiationPlayerTurnBox)

    this.resourceNegotiationResultBox.append(
      this.resourceNegotiationResultCostBoxWrapper,
      this.resourceNegotiationResultProfitBoxWrapper,
      this.resourceNegotiationPlayerTurnBoxWrapper,
    )

    this.resourceNegotiationBox.append(this.resourceNegotiationResultBox)
    // Content
    this.resourceNegotiationContentBoxExtraWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationContentBoxExtraWrapperID)
    this.resourceNegotiationContentBoxWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationContentBoxWrapperID)
    this.resourceNegotiationContentBox = createDivWithId(ResourceNegotiationView.resourceNegotiationContentBoxID)
    // Content - Player names
    const resourceNegotiationPlayerNameWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationPlayerNameWrapperID)
    const resourceNegotiationPlayerName = createHeadingWithId('h3', ResourceNegotiationView.resourceNegotiationPlayerNameID, `${this.scene.playerId}`)
    resourceNegotiationPlayerNameWrapper.appendChild(resourceNegotiationPlayerName)
    const resourceNegotiationPartnerNameWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationPartnerNameWrapperID)
    const resourceNegotiationPartnerName = createHeadingWithId('h3', ResourceNegotiationView.resourceNegotiationPartnerNameID, `${this.partner}`)
    resourceNegotiationPartnerNameWrapper.appendChild(resourceNegotiationPartnerName)

    this.resourceNegotiationContentBoxWrapper.appendChild(this.resourceNegotiationContentBox)
    this.resourceNegotiationContentBoxExtraWrapper.append(this.resourceNegotiationContentBoxWrapper, resourceNegotiationPlayerNameWrapper, resourceNegotiationPartnerNameWrapper)
    this.resourceNegotiationBox.append(this.resourceNegotiationContentBoxExtraWrapper)

    // Buttons
    this.resourceNegotiationButtons = createDivWithId(ResourceNegotiationView.resourceNegotiationButtonsID)

    // Buttons - propose
    this.resourceNegotiationButtonsProposeButtonExtraWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationButtonsProposeButtonExtraWrapperID)
    this.resourceNegotiationButtonsProposeButtonWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationButtonsProposeButtonWrapperID)
    this.resourceNegotiationButtonsProposeButton = createButtonWithInnerText(ResourceNegotiationView.resourceNegotiationButtonsProposeButtonID, 'ZAPROPONUJ')
    this.resourceNegotiationButtonsProposeButton.addEventListener('click', () => {
      this.disableAcceptBtn()
      this.disableProposeButton()
      sendCoopMessage(this.scene.chatWs, {
        type: OutcomingCoopMessageType.ResourceDecide,
        yourBid: {
          travelerId: this.newPlayerBid.travelerId !== '' ? this.newPlayerBid.travelerId : this.newPartnerBid.travelerId,
          moneyRatio: this.newPlayerBid.moneyRatio,
          resources: this.newPlayerBid.resources,
        },
        message: 'empty for now',
      })
      this.resourceNegotiationButtonsProposeButtonExtraWrapper.className = getClassName(
        this.resourceNegotiationButtonsProposeButtonExtraWrapper,
        ResourceNegotiationView.resourceNegotiationButtonsProposeButtonExtraWrapperID)
      this.resourceNegotiationButtonsProposeButtonWrapper.className = getClassName(
        this.resourceNegotiationButtonsProposeButtonWrapper,
        ResourceNegotiationView.resourceNegotiationButtonsProposeButtonWrapperID)
      this.resourceNegotiationButtonsProposeButton.className = getClassName(
        this.resourceNegotiationButtonsProposeButton,
        ResourceNegotiationView.resourceNegotiationButtonsProposeButtonID)
      this.update(false, this.newPlayerBid)
    })

    this.resourceNegotiationButtonsProposeButtonWrapper.appendChild(this.resourceNegotiationButtonsProposeButton)
    this.resourceNegotiationButtonsProposeButtonExtraWrapper.appendChild(this.resourceNegotiationButtonsProposeButtonWrapper)
    this.resourceNegotiationButtons.appendChild(this.resourceNegotiationButtonsProposeButtonExtraWrapper)
    // Buttons - accept
    this.resourceNegotiationButtonsAcceptButtonExtraWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationButtonsAcceptButtonExtraWrapperID)
    this.resourceNegotiationButtonsAcceptButtonWrapper = createDivWithId(ResourceNegotiationView.resourceNegotiationButtonsAcceptButtonWrapperID)
    this.resourceNegotiationButtonsAcceptButton = createButtonWithInnerText(ResourceNegotiationView.resourceNegotiationButtonsAcceptButtonID, 'POTWIERDŹ')
    this.resourceNegotiationButtonsAcceptButton.addEventListener('click', () => {
      this.disableAcceptBtn()
      this.disableProposeButton()

      sendCoopMessage(this.scene.chatWs, {
        type: OutcomingCoopMessageType.ResourceDecideAck,
        yourBid: {
          travelerId: this.newPlayerBid.travelerId !== '' ? this.newPlayerBid.travelerId : this.newPartnerBid.travelerId,
          moneyRatio: this.newPlayerBid.moneyRatio,
          resources: this.newPlayerBid.resources,
        },
      })

      this.scene.loadingView.show()
      this.resourceNegotiationButtonsAcceptButtonExtraWrapper.className = getClassName(
        this.resourceNegotiationButtonsAcceptButtonExtraWrapper,
        ResourceNegotiationView.resourceNegotiationButtonsAcceptButtonExtraWrapperID)
      this.resourceNegotiationButtonsAcceptButtonWrapper.className = getClassName(
        this.resourceNegotiationButtonsAcceptButtonWrapper,
        ResourceNegotiationView.resourceNegotiationButtonsAcceptButtonWrapperID)
      this.resourceNegotiationButtonsAcceptButton.className = getClassName(
        this.resourceNegotiationButtonsAcceptButton,
        ResourceNegotiationView.resourceNegotiationButtonsAcceptButtonID)
    })

    this.resourceNegotiationButtonsAcceptButtonWrapper.appendChild(this.resourceNegotiationButtonsAcceptButton)
    this.resourceNegotiationButtonsAcceptButtonExtraWrapper.appendChild(this.resourceNegotiationButtonsAcceptButtonWrapper)
    this.resourceNegotiationButtons.appendChild(this.resourceNegotiationButtonsAcceptButtonExtraWrapper)
    this.resourceNegotiationBox.append(this.resourceNegotiationButtons)
    this.resourceNegotiationBoxWrapper.appendChild(this.resourceNegotiationBox)

    // Content - Negotiation
    this.setPlayerTurn(isPlayerTurn)
    this.updateContent()
  }

  public update(isPlayerTurn: boolean, playerBid: CoopBid): void {
    this.isFirstTurn = false
    this.setPlayerTurn(isPlayerTurn)

    if (isPlayerTurn) {
      const currPlayerBidResources: GameResourceDto[] = []
      const newPlayerBidResources: GameResourceDto[] = []
      const currPartnerBidResources: GameResourceDto[] = []
      const newPartnerBidResources: GameResourceDto[] = []
      for (const resource of playerBid.resources) {
        const resourceValue = resource.value
        const travelRequiredResourceValue = this.travel.value.resources.find(
          (r) => r.key === resource.key,
        )!.value
        currPlayerBidResources.push({
          key: resource.key,
          value: resourceValue,
        })
        newPlayerBidResources.push({
          key: resource.key,
          value: resourceValue,
        })

        currPartnerBidResources.push({
          key: resource.key,
          value: travelRequiredResourceValue - resourceValue,
        })
        newPartnerBidResources.push({
          key: resource.key,
          value: travelRequiredResourceValue - resourceValue,
        })
      }
      this.currPlayerBid = {
        travelerId: playerBid.travelerId === this.scene.playerId ? this.scene.playerId : '',
        moneyRatio: playerBid.moneyRatio,
        resources: currPlayerBidResources,
      }
      this.newPlayerBid = {
        travelerId: playerBid.travelerId === this.scene.playerId ? this.scene.playerId : '',
        moneyRatio: playerBid.moneyRatio,
        resources: newPlayerBidResources,
      }
      this.currPartnerBid = {
        travelerId: playerBid.travelerId === this.partner ? this.partner : '',
        moneyRatio: 100 - playerBid.moneyRatio,
        resources: newPartnerBidResources,
      }
      this.newPartnerBid = {
        travelerId: playerBid.travelerId === this.partner ? this.partner : '',
        moneyRatio: 100 - playerBid.moneyRatio,
        resources: currPartnerBidResources,
      }
    }
    this.updateContent()
  }

  private updateContent(): void {
    this.clearContent()
    // Content - Negotiation - Resources
    const resourceNegotiationContentBoxResources = createDivWithId(ResourceNegotiationView.resourceNegotiationContentBoxResourcesID)
    resourceNegotiationContentBoxResources.appendChild(createHeading('h5', 'Podział kosztów'))
    const resourceNegotiationContentBoxResourcesContent = createDivWithId('resourceNegotiationContentBoxResourcesContent')
    for (const resource of this.travel.value.resources) {
      const resourceNegotiationContentBoxResourcesContentItem = document.createElement('div')
      // Player
      const playerResourceContainer = document.createElement('div')
      const playerResourceIconWrapper = document.createElement('div')
      const playerResourceIcon = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
      playerResourceIconWrapper.appendChild(playerResourceIcon)
      playerResourceContainer.appendChild(playerResourceIconWrapper)

      const playerResourceValueWrapper = document.createElement('div')
      const playerValue = this.newPlayerBid.resources.find((r) => r.key === resource.key)!.value
      const playerResourceValue = createHeadingWithId('h5', `coop-playerBid-${resource.key}`, `${playerValue}`)
      playerResourceValueWrapper.appendChild(playerResourceValue)
      playerResourceContainer.appendChild(playerResourceValueWrapper)
      // Partner
      const partnerResourceContainer = document.createElement('div')

      const partnerResourceIconWrapper = document.createElement('div')
      const partnerResourceIcon = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
      partnerResourceIconWrapper.appendChild(partnerResourceIcon)
      partnerResourceContainer.appendChild(partnerResourceIconWrapper)

      const partnerResourceValueWrapper = document.createElement('div')
      const partnerValue = this.newPartnerBid.resources.find((r) => r.key === resource.key)!.value
      const partnerResourceValue = createHeadingWithId('h5', `coop-partnerBid-${resource.key}`, `${partnerValue}`)
      partnerResourceValueWrapper.appendChild(partnerResourceValue)
      partnerResourceContainer.appendChild(partnerResourceValueWrapper)

      const resourceRangeSliderContainer = createDivWithClassName('negotiationRangeSliderContainer')
      const resourceInputRangeBack = document.createElement('input')
      resourceInputRangeBack.className = 'negotiationRangeSliderBack'
      resourceInputRangeBack.type = 'range'
      resourceInputRangeBack.min = '0'
      resourceInputRangeBack.max = `${resource.value}`
      resourceInputRangeBack.value = `${playerValue}`
      resourceInputRangeBack.disabled = true
      if (!this.isPlayerTurn) {
        resourceInputRangeBack.style.cursor = 'auto'
        resourceInputRangeBack.classList.add('negotiationRangeSliderBackCursor')
      }
      resourceRangeSliderContainer.appendChild(resourceInputRangeBack)

      if (this.isPlayerTurn) {
        const resourceInputRangeFront = document.createElement('input')
        resourceInputRangeFront.className = 'negotiationRangeSliderFront'
        resourceInputRangeFront.type = 'range'
        resourceInputRangeFront.min = '0'
        resourceInputRangeFront.max = `${resource.value}`
        resourceInputRangeFront.step = '1'
        resourceInputRangeFront.value = `${this.newPlayerBid.resources.find((r) => r.key === resource.key)!.value}`
        const eventListener = (event: Event): void => {
          const newValue = Number((event.target as HTMLInputElement).value)
          this.updateResourceValue(true, resource.key, newValue)
          this.updateResourceValue(false, resource.key, resource.value - newValue)
          this.newPlayerBid.resources.find((r) => r.key === resource.key)!.value = newValue
          this.newPartnerBid.resources.find((r) => r.key === resource.key)!.value = resource.value - newValue
          this.checkBidsChanged()
        }
        resourceInputRangeFront.addEventListener('change', eventListener)
        resourceInputRangeFront.addEventListener('input', eventListener)
        resourceRangeSliderContainer.appendChild(resourceInputRangeFront)
      }

      resourceNegotiationContentBoxResourcesContentItem.append(playerResourceContainer, resourceRangeSliderContainer, partnerResourceContainer)
      resourceNegotiationContentBoxResourcesContent.appendChild(resourceNegotiationContentBoxResourcesContentItem)
    }
    resourceNegotiationContentBoxResources.appendChild(resourceNegotiationContentBoxResourcesContent)

    this.resourceNegotiationContentBox.appendChild(resourceNegotiationContentBoxResources)
    // Content - Negotiation - Player & Time
    const resourceNegotiationContentBoxPlayerTime = createDivWithId(ResourceNegotiationView.resourceNegotiationContentBoxPlayerTimeID)
    resourceNegotiationContentBoxPlayerTime.appendChild(createHeading('h5', 'Wyjazd i wkład czasu'))

    const resourceNegotiationContentBoxPlayerTimeContent = createDivWithId('resourceNegotiationContentBoxPlayerTimeContent')
    const playerMovesCheckbox = document.createElement('input')
    playerMovesCheckbox.id = 'playerRunsCheckbox'
    playerMovesCheckbox.className = 'runsCheckbox'
    playerMovesCheckbox.type = 'radio'
    playerMovesCheckbox.name = 'player-moves-option'
    if (this.isPlayerTurn) {
      playerMovesCheckbox.addEventListener('change', () => {
        this.newPlayerBid.travelerId = this.scene.playerId
        this.newPartnerBid.travelerId = ''
        this.checkBidsChanged()
      })
      playerMovesCheckbox.classList.add('runsCheckboxEnabled')
    } else {
      playerMovesCheckbox.disabled = true
      playerMovesCheckbox.addEventListener('mouseover', () => {
        playerMovesCheckbox.style.cursor = 'auto'
      })
      playerMovesCheckbox.classList.add('runsCheckboxDisabled')
    }
    if (this.newPlayerBid.travelerId === this.scene.playerId) {
      if (this.isPlayerTurn || (!this.isPlayerTurn && !this.isFirstTurn)) {
        playerMovesCheckbox.checked = true
      }
    }

    resourceNegotiationContentBoxPlayerTimeContent.appendChild(playerMovesCheckbox)
    const timeContainer = getTimeContainer(this.travel.value.time, 'resourceNegotiationSuccessContentBoxResourcesTime')
    resourceNegotiationContentBoxPlayerTimeContent.appendChild(timeContainer)

    const partnerMovesCheckbox = document.createElement('input')
    partnerMovesCheckbox.id = 'partnerRunsCheckbox'
    partnerMovesCheckbox.className = 'runsCheckbox'
    partnerMovesCheckbox.type = 'radio'
    partnerMovesCheckbox.name = 'player-moves-option'
    if (this.isPlayerTurn) {
      partnerMovesCheckbox.addEventListener('change', () => {
        this.newPlayerBid.travelerId = ''
        this.newPartnerBid.travelerId = this.partner
        this.checkBidsChanged()
      })
      partnerMovesCheckbox.classList.add('runsCheckboxEnabled')
    } else {
      partnerMovesCheckbox.disabled = true
      partnerMovesCheckbox.addEventListener('mouseover', () => {
        partnerMovesCheckbox.style.cursor = 'auto'
      })
      partnerMovesCheckbox.classList.add('runsCheckboxDisabled')
    }
    if (this.newPartnerBid.travelerId === this.partner) {
      if (this.isPlayerTurn || (!this.isPlayerTurn && !this.isFirstTurn)) {
        partnerMovesCheckbox.checked = true
      }
    }

    resourceNegotiationContentBoxPlayerTimeContent.appendChild(partnerMovesCheckbox)
    resourceNegotiationContentBoxPlayerTime.appendChild(resourceNegotiationContentBoxPlayerTimeContent)

    this.resourceNegotiationContentBox.appendChild(resourceNegotiationContentBoxPlayerTime)
    // Content - Negotiation - Separator
    this.resourceNegotiationContentBox.appendChild(document.createElement('hr'))
    // Content - Negotiation - Profit
    const resourceNegotiationContentBoxProfit = createDivWithId(ResourceNegotiationView.resourceNegotiationContentBoxProfitID)
    resourceNegotiationContentBoxProfit.appendChild(createHeading('h5', 'Podział zysków'))
    const resourceNegotiationContentBoxProfitContent = createDivWithId('resourceNegotiationContentBoxProfitContent')

    const playerProfit = document.createElement('div')
    const playerMoneyIconWrapper = document.createElement('div')
    const playerMoneyIcon = createIconWithWidth('/assets/coinCustomIcon.png', '38px')
    playerMoneyIconWrapper.appendChild(playerMoneyIcon)
    playerProfit.appendChild(playerMoneyIconWrapper)

    const playerMoneyValueContainer = document.createElement('div')
    const playerMoneyValuePercentageWrapper = document.createElement('div')
    const playerMoneyValuePercentage = createHeadingWithId('h5', `coop-playerBid-money-percentage`, `${this.newPlayerBid.moneyRatio}%`)
    playerMoneyValuePercentageWrapper.appendChild(playerMoneyValuePercentage)
    const playerMoneyValueValueWrapper = document.createElement('div')
    const playerMoneyValueValue = createHeadingWithId('h5', `coop-playerBid-money-value`, `(${Math.floor(
      this.travel.value.moneyRange.from * (this.newPlayerBid.moneyRatio / 100),
    )}-${Math.ceil(this.travel.value.moneyRange.to * (this.newPlayerBid.moneyRatio / 100))})`)
    playerMoneyValueValueWrapper.appendChild(playerMoneyValueValue)
    playerMoneyValueContainer.append(playerMoneyValuePercentageWrapper, playerMoneyValueValueWrapper)
    playerProfit.appendChild(playerMoneyValueContainer)
    resourceNegotiationContentBoxProfitContent.appendChild(playerProfit)

    const profitRangeSliderContainer = createDivWithClassName('negotiationRangeSliderContainer')
    const profitInputRangeBack = document.createElement('input')
    profitInputRangeBack.className = 'negotiationRangeSliderBack'
    profitInputRangeBack.type = 'range'
    profitInputRangeBack.min = '0'
    profitInputRangeBack.max = '100'
    profitInputRangeBack.value = `${this.newPlayerBid.moneyRatio}`
    profitInputRangeBack.disabled = true
    if (!this.isPlayerTurn) {
      profitInputRangeBack.style.cursor = 'auto'
      profitInputRangeBack.classList.add('negotiationRangeSliderBackCursor')
    }
    profitRangeSliderContainer.appendChild(profitInputRangeBack)

    if (this.isPlayerTurn) {
      const profitInputRangeFront = document.createElement('input')
      profitInputRangeFront.className = 'negotiationRangeSliderFront'
      profitInputRangeFront.type = 'range'
      profitInputRangeFront.min = '0'
      profitInputRangeFront.max = '100'
      profitInputRangeFront.step = '1'
      profitInputRangeFront.value = `${this.newPlayerBid.moneyRatio}`
      const eventListener = (event: Event): void => {
        const newValue = Number((event.target as HTMLInputElement).value)
        this.updateMoneyValue(true, newValue)
        this.updateMoneyValue(false, 100 - newValue)
        this.newPlayerBid.moneyRatio = newValue
        this.newPartnerBid.moneyRatio = 100 - newValue

        this.checkBidsChanged()
      }
      profitInputRangeFront.addEventListener('change', eventListener)
      profitInputRangeFront.addEventListener('input', eventListener)
      profitRangeSliderContainer.appendChild(profitInputRangeFront)
    }

    resourceNegotiationContentBoxProfitContent.appendChild(profitRangeSliderContainer)

    const partnerProfit = document.createElement('div')
    const partnerMoneyIconWrapper = document.createElement('div')
    const partnerMoneyIcon = createIconWithWidth('/assets/coinCustomIcon.png', '38px')
    partnerMoneyIconWrapper.appendChild(partnerMoneyIcon)
    partnerProfit.appendChild(partnerMoneyIconWrapper)

    const partnerMoneyValueContainer = document.createElement('div')
    const partnerMoneyValuePercentageWrapper = document.createElement('div')
    const partnerMoneyValuePercentage = createHeadingWithId('h5', `coop-partnerBid-money-percentage`, `${this.newPartnerBid.moneyRatio}%`)
    partnerMoneyValuePercentageWrapper.appendChild(partnerMoneyValuePercentage)
    const partnerMoneyValueValueWrapper = document.createElement('div')
    const partnerMoneyValueValue = createHeadingWithId('h5', `coop-partnerBid-money-value`, `(${Math.floor(
      this.travel.value.moneyRange.from * (this.newPartnerBid.moneyRatio / 100),
    )}-${Math.ceil(this.travel.value.moneyRange.to * (this.newPartnerBid.moneyRatio / 100))})`)
    partnerMoneyValueValueWrapper.appendChild(partnerMoneyValueValue)

    partnerMoneyValueContainer.append(partnerMoneyValuePercentageWrapper, partnerMoneyValueValueWrapper)
    partnerProfit.appendChild(partnerMoneyValueContainer)
    resourceNegotiationContentBoxProfitContent.appendChild(partnerProfit)

    resourceNegotiationContentBoxProfit.appendChild(resourceNegotiationContentBoxProfitContent)

    this.resourceNegotiationContentBox.appendChild(resourceNegotiationContentBoxProfit)

    if (this.isPlayerTurn) {
      if (this.isFirstTurn) {
        this.enableProposeButton()
        this.disableAcceptBtn()
      } else {
        this.disableProposeButton()
        this.enableAcceptButton()
      }
    } else {
      this.disableProposeButton()
      this.disableAcceptBtn()
    }
  }

  private checkBidsChanged(): void {
    if (this.isPlayerTurn && !this.isFirstTurn) {
      let changed = false
      for (const newResource of this.newPlayerBid.resources) {
        if (
          this.currPlayerBid.resources.find((r) => r.key === newResource.key)!.value !==
          newResource.value
        ) {
          changed = true
        }
      }
      if (this.currPlayerBid.moneyRatio !== this.newPlayerBid.moneyRatio) {
        changed = true
      }

      if (
        this.currPlayerBid.travelerId !== this.newPlayerBid.travelerId ||
        this.currPartnerBid.travelerId !== this.newPartnerBid.travelerId
      ) {
        changed = true
      }

      if (changed) {
        this.enableProposeButton()
        this.disableAcceptBtn()
      } else {
        this.enableAcceptButton()
        this.disableProposeButton()
      }
    }
  }

  private updateResourceValue(player: boolean, resourceName: string, value: number): void {
    let resourceElement: HTMLElement | null
    if (player) {
      resourceElement = document.getElementById(`coop-playerBid-${resourceName}`)
    } else {
      resourceElement = document.getElementById(`coop-partnerBid-${resourceName}`)
    }
    if (!resourceElement) return

    resourceElement.innerText = `${value}`
  }

  private updateMoneyValue(player: boolean, percentage: number): void {
    let moneyPercentageElement: HTMLElement | null
    let moneyValueElement: HTMLElement | null
    if (player) {
      moneyPercentageElement = document.getElementById('coop-playerBid-money-percentage')
      moneyValueElement = document.getElementById('coop-playerBid-money-value')
    } else {
      moneyPercentageElement = document.getElementById('coop-partnerBid-money-percentage')
      moneyValueElement = document.getElementById('coop-partnerBid-money-value')
    }
    if (!moneyPercentageElement || !moneyValueElement) return

    moneyPercentageElement.innerText = `${percentage}%`
    moneyValueElement.innerText = `(${Math.floor(
      this.travel.value.moneyRange.from * (percentage / 100),
    )}-${Math.ceil(this.travel.value.moneyRange.to * (percentage / 100))})`
  }

  private clearContent(): void {
    while (this.resourceNegotiationContentBox.firstChild) {
      this.resourceNegotiationContentBox.removeChild(this.resourceNegotiationContentBox.firstChild)
    }
  }

  public setPlayerTurn(isPlayerTurn: boolean): void {
    this.isPlayerTurn = isPlayerTurn
    if (this.isPlayerTurn) {
      this.resourceNegotiationPlayerTurnBox.innerText = 'Twoja kolej!'
      this.resourceNegotiationPlayerTurnBox.className = 'resourceNegotiationPlayerTurn'
    } else {
      this.resourceNegotiationPlayerTurnBox.innerText = 'Poczekaj!'
      this.resourceNegotiationPlayerTurnBox.className = 'resourceNegotiationPartnerTurn'
    }
  }

  private enableProposeButton(): void {
    this.resourceNegotiationButtonsProposeButton.disabled = false
    this.resourceNegotiationButtonsProposeButtonExtraWrapper.style.display = 'block'
    this.resourceNegotiationButtonsProposeButtonExtraWrapper.className =
      'resourceNegotiationButtonsProposeButtonExtraWrapperEnabled'
    this.resourceNegotiationButtonsProposeButtonWrapper.className =
      'resourceNegotiationButtonsProposeButtonWrapperEnabled'
    this.resourceNegotiationButtonsProposeButton.className =
      'resourceNegotiationButtonsProposeButtonEnabled'
  }

  private disableProposeButton(): void {
    this.resourceNegotiationButtonsProposeButton.disabled = true
    this.resourceNegotiationButtonsProposeButtonExtraWrapper.style.display = 'none'
    this.resourceNegotiationButtonsProposeButtonExtraWrapper.className =
      'resourceNegotiationButtonsProposeButtonExtraWrapperDisabled'
    this.resourceNegotiationButtonsProposeButtonWrapper.className =
      'resourceNegotiationButtonsProposeButtonWrapperDisabled'
    this.resourceNegotiationButtonsProposeButton.className =
      'resourceNegotiationButtonsProposeButtonDisabled'
  }

  private enableAcceptButton(): void {
    this.resourceNegotiationButtonsAcceptButton.disabled = false
    this.resourceNegotiationButtonsAcceptButtonExtraWrapper.style.display = 'block'
    this.resourceNegotiationButtonsAcceptButtonExtraWrapper.className =
      'resourceNegotiationButtonsAcceptButtonExtraWrapperEnabled'
    this.resourceNegotiationButtonsAcceptButtonWrapper.className =
      'resourceNegotiationButtonsAcceptButtonWrapperEnabled'
    this.resourceNegotiationButtonsAcceptButton.className =
      'resourceNegotiationButtonsAcceptButtonEnabled'
  }

  private disableAcceptBtn(): void {
    this.resourceNegotiationButtonsAcceptButton.disabled = true
    this.resourceNegotiationButtonsAcceptButtonExtraWrapper.style.display = 'none'
    this.resourceNegotiationButtonsAcceptButtonExtraWrapper.className =
      'resourceNegotiationButtonsAcceptButtonExtraWrapperDisabled'
    this.resourceNegotiationButtonsAcceptButtonWrapper.className =
      'resourceNegotiationButtonsAcceptButtonWrapperDisabled'
    this.resourceNegotiationButtonsAcceptButton.className =
      'resourceNegotiationButtonsAcceptButtonDisabled'
  }

  public show(): void {
    this.scene.interactionCloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.TALK)
    window.document.body.appendChild(this.resourceNegotiationBoxWrapper)
    this.scene.movingEnabled = false
  }

  public close(success: boolean): void {
    document.getElementById(ResourceNegotiationView.resourceNegotiationBoxWrapperID)?.remove()
    this.scene.interactionCloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.TALK)
    this.scene.resourceNegotiationView = null

    if (success) {
      const successView = new ResourceNegotiationSuccessView(
        this.resourceURL,
        this.resourceRepresentation,
        this.travel,
        this.scene.playerId,
        this.newPlayerBid,
        this.partner,
        this.newPartnerBid,
        () => {
          this.scene.movingEnabled = true
        },
      )
      successView.show()
    } else {
      this.scene.movingEnabled = true
    }
  }
}
