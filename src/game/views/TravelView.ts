import { type ClassResourceRepresentation, type Travel } from '../../apis/game/Types'
import { SPACE_PRESS_ACTION_PREFIX } from '../GameUtils'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { OutcomingCoopMessageType, sendCoopMessage } from '../webSocketMessage/chat/CoopMessageHandler'
import { sendTravelChoosingMessage, TravelChoosingMessageType } from '../webSocketMessage/chat/TravelChoosingMessage'
import {
  createButtonWithId,
  createButtonWithInnerText,
  createDivWithClassName,
  createDivWithId,
  createElWithText,
  createIconWithSize, createIconWithWidth,
  createIElementWithColor,
  createTradeCrop,
  getClassName,
} from './ViewUtils'

export enum TravelType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class TravelView {
  private readonly scene: Scene
  private readonly travelType: TravelType
  private selectedTravel: Travel | null
  private readonly plannedTravel: Travel | null
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper

  private static readonly travelBoxWrapperID = 'travelBoxWrapper'
  private static readonly travelBoxHeaderWrapperID = 'travelBoxHeaderWrapper'
  private static readonly travelBoxHeaderID = 'travelBoxHeader'
  private static readonly travelBoxCloseButtonID = 'travelBoxCloseButton'
  private static readonly travelBoxContentExtraWrapperID = 'travelBoxContentExtraWrapper'
  private static readonly travelBoxContentWrapperID = 'travelBoxContentWrapper'
  private static readonly travelBoxContentID = 'travelBoxContent'
  private static readonly travelBoxButtonsContainerID = 'travelBoxButtonsContainer'
  private static readonly travelBoxButtonsContainerButtonExtraWrapperID = 'travelBoxButtonsContainerButtonExtraWrapper'
  private static readonly travelBoxButtonsContainerButtonWrapperID = 'travelBoxButtonsContainerButtonWrapper'
  private static readonly travelBoxButtonsContainerButtonID = 'travelBoxButtonsContainerButton'
  private static readonly travelBoxPlanButtonID = 'travelBoxPlanButton'
  private static readonly travelBoxTravelButtonID = 'travelBoxTravelButton'
  private static readonly travelWarningBoxID = 'travelWarningBox'
  private readonly travelBoxWrapper: HTMLDivElement
  private readonly travelBoxContentWrapper: HTMLDivElement
  private readonly travelBoxContent: HTMLDivElement
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
    this.plannedTravel = scene.plannedTravel ? scene.plannedTravel.travel : null
    this.resourceURL = resourceURL
    this.resourceRepresentation = resourceRepresentation
    this.cropper = new ImageCropper()

    // Wrapper
    this.travelBoxWrapper = createDivWithId(TravelView.travelBoxWrapperID)

    // Header
    const travelBoxHeaderWrapper = createDivWithId(TravelView.travelBoxHeaderWrapperID)
    const travelBoxHeader = createDivWithId(TravelView.travelBoxHeaderID)

    const travelBoxHeaderMainTitle = createElWithText('h1', 'WYPRAWY')

    const timeIcon = document.createElement('img')
    timeIcon.style.transform = 'translateX(-15px)'

    let sideTitle: string
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
    const travelBoxHeaderSideTitle = createElWithText('h2', sideTitle)

    const trainIcon = createIconWithWidth('/assets/trainCustomIcon.png', '56px')
    const titlesWrapper = document.createElement('div')
    titlesWrapper.append(travelBoxHeaderMainTitle, travelBoxHeaderSideTitle)

    const closeButton = createButtonWithId(TravelView.travelBoxCloseButtonID)
    closeButton.addEventListener('click', () => {
      this.close()
      this.scene.movingEnabled = true
    })
    const XIcon = createIElementWithColor('times', 'black')
    closeButton.appendChild(XIcon)

    travelBoxHeader.append(trainIcon, titlesWrapper, timeIcon)
    travelBoxHeaderWrapper.append(travelBoxHeader, closeButton)

    // Content
    const travelBoxContentExtraWrapper = createDivWithId(TravelView.travelBoxContentExtraWrapperID)

    this.travelBoxContentWrapper = createDivWithId(TravelView.travelBoxContentWrapperID)
    this.travelBoxContent = createDivWithId(TravelView.travelBoxContentID)

    let correctGate = false
    this.scene.settings.travels.forEach((travel) => {
      if (travel.key === this.travelType) {
        travel.value.forEach((travelItem) => {
          if (travelItem.value.name === this.plannedTravel?.value.name) {
            correctGate = true
          }

          // Item
          const travelItemContainerWrapper = createDivWithClassName('travelBoxContentItemWrapper')
          const travelItemContainer = createDivWithClassName('travelBoxContentItem')

          // Item - Header
          const travelItemHeader = createDivWithClassName('travelBoxContentItemHeader')
          const travelItemTitle = createElWithText('h2', travelItem.value.name)

          const travelItemCheckbox = document.createElement('input')
          travelItemCheckbox.type = 'radio'
          travelItemCheckbox.name = 'travel-option'
          travelItemCheckbox.value = travelItem.value.name
          travelItemCheckbox.addEventListener('change', () => {
            this.selectedTravel = travelItem
            sendTravelChoosingMessage(this.scene.chatWs, {
              type: TravelChoosingMessageType.TravelChange,
              travelName: this.selectedTravel.value.name,
            })
            if (
              !(
                travelItem.value.resources.some((resource) => {
                  return (
                    resource.value >
                    this.scene.equipment!.resources.find((res) => res.key === resource.key)!.value
                  )
                }) || travelItem.value.time > this.scene.timeView!.getAvailableTokens()
              )
            ) {
              this.enableTravelButton()
            }
            this.enablePlanButton()
          })
          travelItemHeader.append(travelItemCheckbox, travelItemTitle)
          travelItemContainer.append(travelItemHeader, document.createElement('hr'))

          // Item - Content
          const travelItemContent = createDivWithId('travelBoxContentItemContent')

          // Item - Content Left
          const travelItemContentLeft = createDivWithId('travelBoxContentItemContentLeft')
          const travelItemContentLeftHeader = createElWithText('h3', 'Koszt:')
          travelItemContentLeft.appendChild(travelItemContentLeftHeader)

          const travelItemContentTimes = createDivWithClassName('travelBoxContentItemContentLeftTimes')
          for (let i = 0; i < travelItem.value.time; i++) {
            const timeIconExtraWrapper = document.createElement('div')
            const timeIconWrapper = document.createElement('div')
            const timeIcon = createIconWithSize('/assets/timeCustomIcon.png', '25px')
            timeIconWrapper.appendChild(timeIcon)
            timeIconExtraWrapper.appendChild(timeIconWrapper)
            travelItemContentTimes.appendChild(timeIconExtraWrapper)

            if (this.plannedTravel && (this.plannedTravel?.value.name !== travelItem.value.name || !this.isPlannedTravelReady())) {
              timeIconWrapper.style.backgroundColor = 'rgba(246, 220, 184, 0.4)'
              timeIcon.style.opacity = '0.4'
            }
          }
          travelItemContentLeft.appendChild(travelItemContentTimes)

          const travelItemContentResources = createDivWithClassName('travelBoxContentItemContentLeftResources')
          travelItem.value.resources.forEach((resource) => {
            if (resource.value !== 0) {
              const itemContainer = document.createElement('div')
              const itemIconWrapper = document.createElement('div')
              const itemIcon = createTradeCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
              itemIconWrapper.appendChild(itemIcon)
              const itemValueWrapper = document.createElement('div')
              const itemValue = createElWithText('h4', `${resource.value}`)
              itemValueWrapper.appendChild(itemValue)

              itemContainer.append(itemIconWrapper, itemValueWrapper)

              travelItemContentResources.appendChild(itemContainer)

              if (this.plannedTravel && (this.plannedTravel?.value.name !== travelItem.value.name || !this.isPlannedTravelReady())) {
                itemValue.style.backgroundColor = 'rgba(246, 220, 184, 0.4)'
                itemValue.style.color = 'rgba(0, 0, 0, 0.7)'
                itemIcon.style.opacity = '0.4'
              }
            }
          })
          travelItemContentLeft.appendChild(travelItemContentResources)

          // Item - Content Right
          const travelItemContentRight = createDivWithClassName('travelBoxContentItemContentRight')

          const travelItemContentRightHeader = createElWithText('h3', 'Zysk:')
          const travelItemContentRightResult = document.createElement('div')

          const moneyIconWrapper = document.createElement('div')

          const moneyIcon = createIconWithSize('/assets/coinCustomIcon.png', '25px')
          moneyIconWrapper.appendChild(moneyIcon)
          const resultWrapper = document.createElement('div')

          const result = createElWithText('h4', `${travelItem.value.moneyRange.from} - ${travelItem.value.moneyRange.to}`)
          resultWrapper.appendChild(result)

          travelItemContentRightResult.append(moneyIconWrapper, resultWrapper)
          travelItemContentRight.append(travelItemContentRightHeader, travelItemContentRightResult)

          travelItemContent.append(travelItemContentLeft, travelItemContentRight)
          travelItemContainer.appendChild(travelItemContent)
          travelItemContainerWrapper.appendChild(travelItemContainer)

          this.travelBoxContent.appendChild(travelItemContainerWrapper)

          if (this.plannedTravel && (this.plannedTravel?.value.name !== travelItem.value.name || !this.isPlannedTravelReady())) {
            travelItemCheckbox.disabled = true
            travelItemCheckbox.style.cursor = 'auto'
            travelItemCheckbox.style.backgroundColor = 'rgba(246, 220, 184, 0.4)'
            travelItemCheckbox.style.borderColor = 'rgba(246, 220, 184, 0.4)'
            travelItemContainer.style.backgroundColor = 'rgba(176, 156, 95, 0.40)'

            travelItemTitle.style.color = 'rgba(0, 0, 0, 0.7)'

            travelItemContentLeftHeader.style.color = 'rgba(0, 0, 0, 0.7)'

            result.style.backgroundColor = 'rgba(246, 220, 184, 0.4)'
            result.style.color = 'rgba(0, 0, 0, 0.7)'
            moneyIcon.style.opacity = '0.4'
            travelItemContentRightHeader.style.color = 'rgba(0, 0, 0, 0.7)'
          }

          if (this.plannedTravel && this.plannedTravel?.value.name === travelItem.value.name) {
            travelItemCheckbox.style.display = 'none'
            this.selectedTravel = travelItem
          }
        })
      }
    })

    this.travelBoxContentWrapper.appendChild(this.travelBoxContent)
    travelBoxContentExtraWrapper.appendChild(this.travelBoxContentWrapper)

    // Buttons
    const travelBoxButtonsContainer = createDivWithId(TravelView.travelBoxButtonsContainerID)

    this.travelBoxPlanButtonExtraWrapper = document.createElement('div')
    this.travelBoxPlanButtonWrapper = document.createElement('div')
    this.travelBoxPlanButton = createButtonWithInnerText(TravelView.travelBoxPlanButtonID, 'ZAPLANUJ')
    this.travelBoxPlanButton.addEventListener('click', () => {
      this.travelBoxPlanButtonExtraWrapper.className = getClassName(this.travelBoxPlanButtonExtraWrapper, TravelView.travelBoxButtonsContainerButtonExtraWrapperID)
      this.travelBoxPlanButtonWrapper.className = getClassName(this.travelBoxPlanButtonWrapper, TravelView.travelBoxButtonsContainerButtonWrapperID)
      this.travelBoxPlanButton.className = getClassName(this.travelBoxPlanButton, TravelView.travelBoxButtonsContainerButtonID)

      sendCoopMessage(this.scene.chatWs, {
        type: OutcomingCoopMessageType.StartPlanning,
        travelName: this.selectedTravel!.value.name,
      })
      this.close()
      this.scene.movingEnabled = true
    })
    this.travelBoxPlanButtonWrapper.appendChild(this.travelBoxPlanButton)
    this.travelBoxPlanButtonExtraWrapper.appendChild(this.travelBoxPlanButtonWrapper)

    this.travelBoxTravelButtonExtraWrapper = document.createElement('div')
    this.travelBoxTravelButtonWrapper = document.createElement('div')
    this.travelBoxTravelButton = createButtonWithInnerText(TravelView.travelBoxTravelButtonID, 'JEDŹ')
    this.travelBoxTravelButton.addEventListener('click', () => {
      this.disableTravelButton()

      this.scene.loadingView.show()

      this.travelBoxTravelButtonExtraWrapper.className = getClassName(this.travelBoxTravelButtonExtraWrapper, TravelView.travelBoxButtonsContainerButtonExtraWrapperID)
      this.travelBoxTravelButtonWrapper.className = getClassName(this.travelBoxTravelButtonWrapper, TravelView.travelBoxButtonsContainerButtonWrapperID)
      this.travelBoxTravelButton.className = getClassName(this.travelBoxTravelButton, TravelView.travelBoxButtonsContainerButtonID)


      if (this.plannedTravel && correctGate && this.isPlannedTravelReady()) {
        sendCoopMessage(scene.chatWs, {
          type: OutcomingCoopMessageType.StartPlannedTravel,
          travelName: this.selectedTravel!.value.name,
        })
        scene.plannedTravel = null
        scene.statusAndCoopView?.updateCoopView()
      } else {
        sendCoopMessage(scene.chatWs, {
          type: OutcomingCoopMessageType.StartSimpleTravel,
          travelName: this.selectedTravel!.value.name,
        })
      }
    })
    this.travelBoxTravelButtonWrapper.appendChild(this.travelBoxTravelButton)
    this.travelBoxTravelButtonExtraWrapper.appendChild(this.travelBoxTravelButtonWrapper)

    travelBoxButtonsContainer.append(this.travelBoxPlanButtonExtraWrapper, this.travelBoxTravelButtonExtraWrapper)

    this.travelBoxWrapper.append(travelBoxHeaderWrapper, travelBoxContentExtraWrapper, travelBoxButtonsContainer)

    this.disablePlanButton()
    this.disableTravelButton()

    if (
      this.plannedTravel &&
      this.scene.plannedTravel &&
      this.scene.plannedTravel.playerIsRunning === false
    ) {
      this.setWarning(
        `Zgodnie z wynikiem negocjacji to twój partner powinien odbyć podróż do miasta ${this.plannedTravel.value.name}`,
      )
    } else if (this.plannedTravel && correctGate && this.isPlannedTravelReady()) {
      this.setWarning(
        'Możesz wybrać tylko wyprawę którą zaplanowałeś. Jeżeli chcesz zmienić kierunek, anuluj kartę aktualnej wyprawy i wejdź ponownie.',
      )
      this.enableTravelButton()
    } else if (this.plannedTravel && correctGate) {
      this.setWarning(
        `Jesteś w trakcie planowania podróży do miasta ${this.plannedTravel.value.name}, na którą nie uzbierałeś jeszcze wszystkich zasobów. Jeżeli chcesz pojechać w inną podróż, zrezygnuj z aktualnej.`,
      )
    } else if (this.plannedTravel) {
      this.setWarning(
        `Jesteś w trakcie planowania podróży do miasta ${this.plannedTravel.value.name}. Jeżeli chcesz pojechać w inną podróż, zrezygnuj z aktualnej.`,
      )
    }
  }

  public disableTravelButton(): void {
    this.travelBoxTravelButton.disabled = true
    this.travelBoxTravelButton.className = TravelView.travelBoxButtonsContainerButtonID + 'Disabled'
    this.travelBoxTravelButtonExtraWrapper.className = TravelView.travelBoxButtonsContainerButtonExtraWrapperID + 'Disabled'
    this.travelBoxTravelButtonWrapper.className = TravelView.travelBoxButtonsContainerButtonWrapperID + 'Disabled'
  }

  public enableTravelButton(): void {
    this.travelBoxTravelButton.disabled = false
    this.travelBoxTravelButton.className = TravelView.travelBoxButtonsContainerButtonID + 'Enabled'
    this.travelBoxTravelButtonExtraWrapper.className = TravelView.travelBoxButtonsContainerButtonExtraWrapperID + 'Enabled'
    this.travelBoxTravelButtonWrapper.className = TravelView.travelBoxButtonsContainerButtonWrapperID + 'Enabled'
  }

  public disablePlanButton(): void {
    this.travelBoxPlanButton.disabled = true
    this.travelBoxPlanButton.className = TravelView.travelBoxButtonsContainerButtonID + 'Disabled'
    this.travelBoxPlanButtonExtraWrapper.className = TravelView.travelBoxButtonsContainerButtonExtraWrapperID + 'Disabled'
    this.travelBoxPlanButtonWrapper.className = TravelView.travelBoxButtonsContainerButtonWrapperID + 'Disabled'
  }

  public enablePlanButton(): void {
    this.travelBoxPlanButton.disabled = false
    this.travelBoxPlanButton.className = TravelView.travelBoxButtonsContainerButtonID + 'Enabled'
    this.travelBoxPlanButtonExtraWrapper.className = TravelView.travelBoxButtonsContainerButtonExtraWrapperID + 'Enabled'
    this.travelBoxPlanButtonWrapper.className = TravelView.travelBoxButtonsContainerButtonWrapperID + 'Enabled'
  }

  public show(): void {
    sendTravelChoosingMessage(this.scene.chatWs, {
      type: TravelChoosingMessageType.TravelStart,
    })
    this.scene.interactionCloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    window.document.body.appendChild(this.travelBoxWrapper)
    this.scene.travelView = this
    this.scene.movingEnabled = false
  }

  public close(): void {
    sendTravelChoosingMessage(this.scene.chatWs, {
      type: TravelChoosingMessageType.TravelStop,
    })
    this.scene.interactionCloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    document.getElementById(TravelView.travelBoxWrapperID)?.remove()
    this.scene.travelView = null

    switch (this.travelType) {
      case TravelType.LOW:
        this.scene.informationActionPopup.setText(
          `${SPACE_PRESS_ACTION_PREFIX} odbyć krótką podróż...`,
        )
        break
      case TravelType.MEDIUM:
        this.scene.informationActionPopup.setText(
          `${SPACE_PRESS_ACTION_PREFIX} odbyć średnią podróż...`,
        )
        break
      case TravelType.HIGH:
        this.scene.informationActionPopup.setText(
          `${SPACE_PRESS_ACTION_PREFIX} odbyć długą podróż...`,
        )
        break
    }

    this.scene.informationActionPopup.show()
  }

  private isPlannedTravelReady(): boolean {
    if (this.scene.plannedTravel) {
      for (const resource of this.scene.plannedTravel.playerRequiredResources.resources) {
        const currResource = this.scene.plannedTravel.playerResources.resources.find(
          (currentResource) => currentResource.key === resource.key,
        )!
        if (resource.value > currResource.value) {
          return false
        }
      }
      if (!this.scene.plannedTravel.isSingle) {
        for (const resource of this.scene.plannedTravel.partnerRequiredResources!.resources) {
          const currResource = this.scene.plannedTravel.partnerResources!.resources.find(
            (currentResource) => currentResource.key === resource.key,
          )!
          if (resource.value > currResource.value) {
            return false
          }
        }
      }
      if (
        this.scene.plannedTravel.playerRequiredResources.time >
        this.scene.plannedTravel.playerResources.time
      ) {
        return false
      }
      if (!this.scene.plannedTravel.isSingle) {
        if (
          this.scene.plannedTravel.partnerRequiredResources!.time >
          this.scene.plannedTravel.partnerResources!.time
        ) {
          return false
        }
      }
      return true
    }
    return false
  }

  private setWarning(text: string): void {
    const warningBox = createDivWithId(TravelView.travelWarningBoxID)
    const warningText = createElWithText('h5', text)
    const icon = createIElementWithColor('question-circle', '#835211')
    warningBox.append(icon, warningText)
    const travels = this.travelBoxContent.childNodes.length
    if (travels === 1) {
      warningBox.style.maxWidth = '410px'
    } else if (travels === 2) {
      warningBox.style.maxWidth = '820px'
    }
    this.travelBoxContentWrapper.append(document.createElement('hr'), warningBox)
  }
}
