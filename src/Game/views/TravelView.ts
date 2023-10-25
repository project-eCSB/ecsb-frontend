import { type ClassResourceRepresentation } from '../../apis/game/Types'
import gameService from '../../services/game/GameService'
import { ERROR_TIMEOUT, getResourceMapping } from '../GameUtils'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { TravelMessageType, sendTravelMessage } from '../webSocketMessage/chat/TravelMessage'
import { ErrorView } from './ErrorView'

export enum TravelType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class TravelView {
  private readonly scene: Scene
  private readonly travelType: TravelType
  private selectedTravel: string | null
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper

  public static readonly travelBoxWrapperID = 'travelBoxWrapper'

  private static readonly travelBoxHeaderWrapperID = 'travelBoxHeaderWrapper'
  private static readonly travelBoxHeaderID = 'travelBoxHeader'
  private static readonly travelBoxCloseButtonID = 'travelBoxCloseButton'

  private static readonly travelBoxContentExtraWrapperID = 'travelBoxContentExtraWrapper'
  private static readonly travelBoxContentWrapperID = 'travelBoxContentWrapper'
  private static readonly travelBoxContentID = 'travelBoxContent'

  private static readonly travelBoxButtonsContainerID = 'travelBoxButtonsContainer'
  private static readonly travelBoxPlanButtonID = 'travelBoxPlanButton'
  private static readonly travelBoxTravelButtonID = 'travelBoxTravelButton'

  private readonly travelBoxWrapper: HTMLDivElement

  private readonly travelBoxHeaderWrapper: HTMLDivElement
  private readonly travelBoxHeader: HTMLDivElement

  private readonly travelBoxContentExtraWrapper: HTMLDivElement
  private readonly travelBoxContentWrapper: HTMLDivElement
  private readonly travelBoxContent: HTMLDivElement

  private readonly travelBoxButtonsContainer: HTMLDivElement
  private readonly travelBoxPlanButtonExtraWrapper: HTMLDivElement
  private readonly travelBoxPlanButtonWrapper: HTMLDivElement
  private readonly travelBoxPlanButton: HTMLButtonElement
  private readonly travelBoxTravelButtonExtraWrapper: HTMLDivElement
  private readonly travelBoxTravelButtonWrapper: HTMLDivElement
  private readonly travelBoxTravelButton: HTMLButtonElement

  constructor(
    scene: Scene,
    travelType: TravelType,
    resourceURL: string,
    resourceRepresentation: ClassResourceRepresentation[],
  ) {
    this.scene = scene
    this.travelType = travelType
    this.selectedTravel = null
    this.resourceURL = resourceURL
    this.resourceRepresentation = resourceRepresentation
    this.cropper = new ImageCropper()

    // Wrapper
    this.travelBoxWrapper = document.createElement('div')
    this.travelBoxWrapper.id = TravelView.travelBoxWrapperID

    // Header
    this.travelBoxHeaderWrapper = document.createElement('div')
    this.travelBoxHeaderWrapper.id = TravelView.travelBoxHeaderWrapperID

    this.travelBoxHeader = document.createElement('div')
    this.travelBoxHeader.id = TravelView.travelBoxHeaderID

    const travelBoxHeaderMainTitle = document.createElement('h1')
    travelBoxHeaderMainTitle.innerText = 'WYPRAWY'

    const timeIcon = document.createElement('img')
    timeIcon.style.transform = 'translateX(-15px)'

    const travelBoxHeaderSideTitle = document.createElement('h2')
    let sideTitle = ''
    switch (travelType) {
      case TravelType.LOW:
        sideTitle = 'BLISKIE'
        timeIcon.style.width = '61px'
        timeIcon.src = '/assets/shortRouteCustomIcon.png'
        break
      case TravelType.MEDIUM:
        sideTitle = 'ŚREDNIE'
        timeIcon.style.width = '61px'
        timeIcon.src = '/assets/mediumRouteCustomIcon.png'
        break
      case TravelType.HIGH:
        sideTitle = 'DALEKIE'
        timeIcon.style.width = '51px'
        timeIcon.src = '/assets/longRouteCustomIcon.png'
        break
      default:
        sideTitle = 'Travel'
        console.error('TravelType not found')
    }
    travelBoxHeaderSideTitle.innerText = sideTitle

    const trainIcon = document.createElement('img')
    trainIcon.src = '/assets/trainCustomIcon.png'
    trainIcon.style.width = '56px'

    const titlesWrapper = document.createElement('div')
    titlesWrapper.appendChild(travelBoxHeaderMainTitle)
    titlesWrapper.appendChild(travelBoxHeaderSideTitle)

    const closeButton = document.createElement('button')
    closeButton.id = TravelView.travelBoxCloseButtonID
    closeButton.addEventListener('click', () => {
      this.close()
    })
    const XIcon = document.createElement('i')
    XIcon.className = 'fa fa-times'
    XIcon.ariaHidden = 'true'
    XIcon.style.color = 'black'
    closeButton.appendChild(XIcon)

    this.travelBoxHeader.appendChild(trainIcon)
    this.travelBoxHeader.appendChild(titlesWrapper)
    this.travelBoxHeader.appendChild(timeIcon)

    this.travelBoxHeaderWrapper.appendChild(this.travelBoxHeader)
    this.travelBoxHeaderWrapper.appendChild(closeButton)

    // Content
    this.travelBoxContentExtraWrapper = document.createElement('div')
    this.travelBoxContentExtraWrapper.id = TravelView.travelBoxContentExtraWrapperID

    this.travelBoxContentWrapper = document.createElement('div')
    this.travelBoxContentWrapper.id = TravelView.travelBoxContentWrapperID

    this.travelBoxContent = document.createElement('div')
    this.travelBoxContent.id = TravelView.travelBoxContentID

    this.scene.settings.travels.forEach((travel) => {
      if (travel.key === this.travelType) {
        travel.value.forEach((travelItem) => {
          // Item
          const travelItemContainerWrapper = document.createElement('div')
          travelItemContainerWrapper.className = 'travelBoxContentItemWrapper'
          const travelItemContainer = document.createElement('div')
          travelItemContainer.className = 'travelBoxContentItem'

          // Item - Header
          const travelItemHeader = document.createElement('div')
          travelItemHeader.className = 'travelBoxContentItemHeader'

          const travelItemTitle = document.createElement('h2')
          travelItemTitle.innerText = travelItem.value.name

          const travelItemCheckbox = document.createElement('input')
          travelItemCheckbox.type = 'radio'
          travelItemCheckbox.name = 'travel-option'
          travelItemCheckbox.value = travelItem.value.name
          travelItemCheckbox.addEventListener('change', () => {
            this.selectedTravel = travelItemCheckbox.value
            sendTravelMessage(this.scene.chatWs, {
              type: TravelMessageType.TravelChange,
              travelName: this.selectedTravel,
            })
            this.enableTravelButton()
          })
          travelItemHeader.appendChild(travelItemCheckbox)
          travelItemHeader.appendChild(travelItemTitle)

          travelItemContainer.appendChild(travelItemHeader)

          // Item - Line
          travelItemContainer.appendChild(document.createElement('hr'))

          // Item - Content
          const travelItemContent = document.createElement('div')
          travelItemContent.className = 'travelBoxContentItemContent'

          // Item - Content Left
          const travelItemContentLeft = document.createElement('div')
          travelItemContentLeft.className = 'travelBoxContentItemContentLeft'

          const travelItemContentLeftHeader = document.createElement('h3')
          travelItemContentLeftHeader.innerText = 'Koszt:'
          travelItemContentLeft.appendChild(travelItemContentLeftHeader)

          const travelItemContentTimes = document.createElement('div')
          travelItemContentTimes.className = 'travelBoxContentItemContentLeftTimes'
          for (let i = 0; i < travelItem.value.time!; i++) {
            const timeIconExtraWrapper = document.createElement('div')
            const timeIconWrapper = document.createElement('div')
            const timeIcon = document.createElement('img')
            timeIcon.src = '/assets/timeCustomIcon.png'
            timeIcon.style.width = '25px'
            timeIcon.style.height = '25px'
            timeIconWrapper.appendChild(timeIcon)
            timeIconExtraWrapper.appendChild(timeIconWrapper)
            travelItemContentTimes.appendChild(timeIconExtraWrapper)
          }
          travelItemContentLeft.appendChild(travelItemContentTimes)

          const travelItemContentResources = document.createElement('div')
          travelItemContentResources.className = 'travelBoxContentItemContentLeftResources'
          travelItem.value.resources.forEach((resource) => {
            if (resource.value !== 0) {
              const itemContainer = document.createElement('div')

              const itemIconWrapper = document.createElement('div')
              const itemIcon = this.cropper.crop(
                25,
                25,
                1,
                this.resourceURL,
                3,
                getResourceMapping(this.resourceRepresentation)(resource.key),
                false,
              )
              itemIconWrapper.appendChild(itemIcon)
              itemContainer.appendChild(itemIconWrapper)

              const itemValueWrapper = document.createElement('div')
              const itemValue = document.createElement('h4')
              itemValue.innerText = `${resource.value}`
              itemValueWrapper.appendChild(itemValue)
              itemContainer.appendChild(itemValueWrapper)

              travelItemContentResources.appendChild(itemContainer)
            }
          })
          travelItemContentLeft.appendChild(travelItemContentResources)

          // Item - Content Right
          const travelItemContentRight = document.createElement('div')
          travelItemContentRight.className = 'travelBoxContentItemContentRight'

          const travelItemContentRightHeader = document.createElement('h3')
          travelItemContentRightHeader.innerText = 'Zysk:'
          travelItemContentRight.appendChild(travelItemContentRightHeader)

          const travelItemContentRightResult = document.createElement('div')

          const moneyIconWrapper = document.createElement('div')
          const moneyIcon = document.createElement('img')
          moneyIcon.src = '/assets/coinCustomIcon.png'
          moneyIcon.style.width = '25px'
          moneyIcon.style.height = '25px'
          moneyIconWrapper.appendChild(moneyIcon)

          const resultWrapper = document.createElement('div')
          const result = document.createElement('h4')
          result.innerText = `${travelItem.value.moneyRange.from} - ${travelItem.value.moneyRange.to}`
          resultWrapper.appendChild(result)

          travelItemContentRightResult.appendChild(moneyIconWrapper)
          travelItemContentRightResult.appendChild(resultWrapper)
          travelItemContentRight.appendChild(travelItemContentRightResult)

          travelItemContent.appendChild(travelItemContentLeft)
          travelItemContent.appendChild(travelItemContentRight)
          travelItemContainer.appendChild(travelItemContent)

          travelItemContainerWrapper.appendChild(travelItemContainer)

          this.travelBoxContent.appendChild(travelItemContainerWrapper)
        })
      }
    })

    this.travelBoxContentWrapper.appendChild(this.travelBoxContent)
    this.travelBoxContentExtraWrapper.appendChild(this.travelBoxContentWrapper)

    // Buttons
    this.travelBoxButtonsContainer = document.createElement('div')
    this.travelBoxButtonsContainer.id = TravelView.travelBoxButtonsContainerID

    this.travelBoxPlanButtonExtraWrapper = document.createElement('div')
    this.travelBoxPlanButtonWrapper = document.createElement('div')
    this.travelBoxPlanButton = document.createElement('button')
    this.travelBoxPlanButton.id = TravelView.travelBoxPlanButtonID
    this.travelBoxPlanButton.innerText = 'ZAPLANUJ'
    this.travelBoxPlanButton.addEventListener('click', () => {
      this.travelBoxPlanButtonExtraWrapper.className =
        this.travelBoxPlanButtonExtraWrapper.className ===
        'travelBoxButtonsContainerButtonExtraWrapperEnabledActive'
          ? 'travelBoxButtonsContainerButtonExtraWrapperEnabled'
          : 'travelBoxButtonsContainerButtonExtraWrapperEnabledActive'

      this.travelBoxPlanButtonWrapper.className =
        this.travelBoxPlanButtonWrapper.className ===
        'travelBoxButtonsContainerButtonWrapperEnabledActive'
          ? 'travelBoxButtonsContainerButtonWrapperEnabled'
          : 'travelBoxButtonsContainerButtonWrapperEnabledActive'

      this.travelBoxPlanButton.className =
        this.travelBoxPlanButton.className === 'travelBoxButtonsContainerButtonEnabledActive'
          ? 'travelBoxButtonsContainerButtonEnabled'
          : 'travelBoxButtonsContainerButtonEnabledActive'

      this.close()
    })
    this.travelBoxPlanButtonWrapper.appendChild(this.travelBoxPlanButton)
    this.travelBoxPlanButtonExtraWrapper.appendChild(this.travelBoxPlanButtonWrapper)

    this.travelBoxTravelButtonExtraWrapper = document.createElement('div')
    this.travelBoxTravelButtonWrapper = document.createElement('div')
    this.travelBoxTravelButton = document.createElement('button')
    this.travelBoxTravelButton.id = TravelView.travelBoxTravelButtonID
    this.travelBoxTravelButton.innerText = 'JEDŹ'
    this.travelBoxTravelButton.addEventListener('click', () => {
      this.disableTravelButton()

      this.scene.loadingView.show()

      this.travelBoxTravelButtonExtraWrapper.className =
        this.travelBoxTravelButtonExtraWrapper.className ===
        'travelBoxButtonsContainerButtonExtraWrapperEnabledActive'
          ? 'travelBoxButtonsContainerButtonExtraWrapperEnabled'
          : 'travelBoxButtonsContainerButtonExtraWrapperEnabledActive'

      this.travelBoxTravelButtonWrapper.className =
        this.travelBoxTravelButtonWrapper.className ===
        'travelBoxButtonsContainerButtonWrapperEnabledActive'
          ? 'travelBoxButtonsContainerButtonWrapperEnabled'
          : 'travelBoxButtonsContainerButtonWrapperEnabledActive'

      this.travelBoxTravelButton.className =
        this.travelBoxTravelButton.className === 'travelBoxButtonsContainerButtonEnabledActive'
          ? 'travelBoxButtonsContainerButtonEnabled'
          : 'travelBoxButtonsContainerButtonEnabledActive'

      gameService
        .travel(this.selectedTravel!)
        .then(() => {
          this.close()
        })
        .catch((err) => {
          const errorMessage = new ErrorView()
          errorMessage.setText('Insufficient materials')
          errorMessage.show()
          setTimeout(() => {
            errorMessage.close()
          }, ERROR_TIMEOUT)
          console.error(err)
          this.scene.loadingView?.close()
          this.enableTravelButton()
        })
        .finally(() => {
          this.scene.loadingView.close()
        })
    })
    this.travelBoxTravelButtonWrapper.appendChild(this.travelBoxTravelButton)
    this.travelBoxTravelButtonExtraWrapper.appendChild(this.travelBoxTravelButtonWrapper)

    this.travelBoxButtonsContainer.appendChild(this.travelBoxPlanButtonExtraWrapper)
    this.travelBoxButtonsContainer.appendChild(this.travelBoxTravelButtonExtraWrapper)

    this.travelBoxWrapper.appendChild(this.travelBoxHeaderWrapper)
    this.travelBoxWrapper.appendChild(this.travelBoxContentExtraWrapper)
    this.travelBoxWrapper.appendChild(this.travelBoxButtonsContainer)

    this.disablePlanButton()
    this.disableTravelButton()
  }

  public disableTravelButton(): void {
    this.travelBoxTravelButton.disabled = true
    this.travelBoxTravelButtonExtraWrapper.className =
      'travelBoxButtonsContainerButtonExtraWrapperDisabled'
    this.travelBoxTravelButtonWrapper.className = 'travelBoxButtonsContainerButtonWrapperDisabled'
    this.travelBoxTravelButton.className = 'travelBoxButtonsContainerButtonDisabled'
  }

  public enableTravelButton(): void {
    this.travelBoxTravelButton.disabled = false
    this.travelBoxTravelButtonExtraWrapper.className =
      'travelBoxButtonsContainerButtonExtraWrapperEnabled'
    this.travelBoxTravelButtonWrapper.className = 'travelBoxButtonsContainerButtonWrapperEnabled'
    this.travelBoxTravelButton.className = 'travelBoxButtonsContainerButtonEnabled'
  }

  public disablePlanButton(): void {
    this.travelBoxPlanButton.disabled = true
    this.travelBoxPlanButtonExtraWrapper.className =
      'travelBoxButtonsContainerButtonExtraWrapperDisabled'
    this.travelBoxPlanButtonWrapper.className = 'travelBoxButtonsContainerButtonWrapperDisabled'
    this.travelBoxPlanButton.className = 'travelBoxButtonsContainerButtonDisabled'
  }

  public enablePlanButton(): void {
    this.travelBoxPlanButton.disabled = false
    this.travelBoxPlanButtonExtraWrapper.className =
      'travelBoxButtonsContainerButtonExtraWrapperEnabled'
    this.travelBoxPlanButtonWrapper.className = 'travelBoxButtonsContainerButtonWrapperEnabled'
    this.travelBoxPlanButton.className = 'travelBoxButtonsContainerButtonEnabled'
  }

  public show(): void {
    sendTravelMessage(this.scene.chatWs, {
      type: TravelMessageType.TravelStart,
    })
    this.scene.interactionCloudBuiler.showInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    window.document.body.appendChild(this.travelBoxWrapper)
    this.scene.travelView = this
    this.scene.movingEnabled = false
  }

  public close(): void {
    sendTravelMessage(this.scene.chatWs, {
      type: TravelMessageType.TravelStop,
    })
    this.scene.interactionCloudBuiler.hideInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    document.getElementById(TravelView.travelBoxWrapperID)?.remove()
    this.scene.travelView = null
    this.scene.movingEnabled = true

    switch (this.travelType) {
      case TravelType.LOW:
        this.scene.interactionView.setText('odbyć krótką podróż...')
        break
      case TravelType.MEDIUM:
        this.scene.interactionView.setText('odbyć średnią podróż...')
        break
      case TravelType.HIGH:
        this.scene.interactionView.setText('odbyć długą podróż...')
        break
    }

    this.scene.interactionView.show()
  }
}
