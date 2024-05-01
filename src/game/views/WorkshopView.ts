import { type ClassResourceRepresentation } from '../../apis/game/Types'
import { getResourceMapping, SPACE_PRESS_ACTION_PREFIX } from '../GameUtils'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { OutcomingWorkshopMessageType, sendWorkshopMessage } from '../webSocketMessage/chat/WorkshopMessageHandler'
import {
  createButtonWithId,
  createButtonWithInnerText,
  createCrop,
  createDivWithId,
  createHeading,
  createIconWithAll,
  createIElement,
  createIElementWithColor,
  createSpan,
  getClassName,
} from './ViewUtils'

export class WorkshopView {
  public static readonly workshopBoxWrapperID = 'workshopBoxWrapper'
  public static readonly workshopBoxID = 'workshopBox'
  public static readonly workshopBoxHeaderBoxExtraWrapperID = 'workshopBoxHeaderBoxExtraWrapper'
  public static readonly workshopBoxHeaderBoxWrapperID = 'workshopBoxHeaderBoxWrapper'
  public static readonly workshopBoxHeaderBoxID = 'workshopBoxHeaderBox'
  public static readonly workshopBoxMathBoxWrapperID = 'workshopBoxMathBoxWrapper'
  public static readonly workshopBoxMathBoxID = 'workshopBoxMathBox'
  public static readonly workshopBoxContentBoxWrapperID = 'workshopBoxContentBoxWrapper'
  public static readonly workshopBoxContentBoxID = 'workshopBoxContentBox'
  public static readonly workshopBoxContentBoxLeftID = 'workshopBoxContentBoxLeft'
  public static readonly workshopBoxContentBoxRightID = 'workshopBoxContentBoxRight'
  public static readonly workshopBoxContentBoxCostBoxID = 'workshopBoxContentBoxCostBox'
  public static readonly workshopBoxContentBoxResultBoxID = 'workshopBoxContentBoxResultBox'
  public static readonly workshopBoxContentBoxButtonsBoxID = 'workshopBoxContentBoxButtonsBox'
  public static readonly workshopBoxSubmitButtonExtraWrapperID = 'workshopBoxSubmitButtonExtraWrapper'
  public static readonly workshopBoxSubmitButtonWrapperID = 'workshopBoxSubmitButtonWrapper'
  public static readonly workshopBoxSubmitButtonID = 'workshopBoxSubmitButton'
  public static readonly workshopBoxCloseButtonID = 'workshopBoxCloseButton'

  private readonly workshopBoxWrapper: HTMLDivElement
  private readonly workshopBoxSubmitButtonExtraWrapper: HTMLDivElement
  private readonly workshopBoxSubmitButtonWrapper: HTMLDivElement
  private readonly workshopBoxSubmitButton: HTMLButtonElement
  private readonly workshopBoxPlusButton: HTMLButtonElement
  private readonly workshopBoxMinusButton: HTMLButtonElement

  private readonly pTime: HTMLDivElement

  private readonly scene: Scene
  private readonly cropper: ImageCropper
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]

  constructor(scene: Scene, resourceURL: string, resRepresentation: ClassResourceRepresentation[]) {
    this.scene = scene
    this.resourceURL = resourceURL
    this.resourceRepresentation = resRepresentation
    this.cropper = new ImageCropper()

    let resourceName = ''
    for (const classResource of this.scene.settings.classResourceRepresentation) {
      if (classResource.key === this.scene.status.className) {
        resourceName = classResource.value.gameResourceName
      }
    }

    const itemIcon = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resourceName)
    const itemIconReversed = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resourceName)

    // Wrapper
    this.workshopBoxWrapper = createDivWithId(WorkshopView.workshopBoxWrapperID)

    // Container
    const workshopBox = createDivWithId(WorkshopView.workshopBoxID)

    // Header
    const workshopBoxHeaderBoxExtraWrapper = createDivWithId(WorkshopView.workshopBoxHeaderBoxExtraWrapperID)
    const workshopBoxHeaderBoxWrapper = createDivWithId(WorkshopView.workshopBoxHeaderBoxWrapperID)
    const workshopBoxHeaderBox = createDivWithId(WorkshopView.workshopBoxHeaderBoxID)
    const workshopTitleHeader = createHeading('h1', 'WARSZTAT')
    const workshopTitleClassWrapper = document.createElement('div')

    const workshopTitleClass = createHeading('h2', `${this.scene.status.className.toUpperCase()}A`)
    const leftIcon = itemIconReversed.cloneNode(true)
    const rightIcon = itemIcon.cloneNode(true)

    workshopTitleClassWrapper.append(leftIcon, workshopTitleClass, rightIcon)
    workshopBoxHeaderBox.append(workshopTitleHeader, workshopTitleClassWrapper)

    // Close button
    const workshopBoxCloseButton = createButtonWithId(WorkshopView.workshopBoxCloseButtonID)
    workshopBoxCloseButton.addEventListener('click', () => {
      this.close()
      this.scene.workshopView = null
      this.scene.movingEnabled = true

      this.scene.informationActionPopup.setText(
        `${SPACE_PRESS_ACTION_PREFIX} rozpocząć wytwarzanie...`,
      )
      this.scene.informationActionPopup.show()
      this.scene.interactionCloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.WORK)
    })
    const XIcon = createIElementWithColor('times', 'black')
    XIcon.style.color = 'black'
    workshopBoxCloseButton.appendChild(XIcon)

    workshopBoxHeaderBoxWrapper.append(workshopBoxCloseButton, workshopBoxHeaderBox)
    workshopBoxHeaderBoxExtraWrapper.appendChild(workshopBoxHeaderBoxWrapper)

    // Math
    const workshopBoxMathBoxWrapper = createDivWithId(WorkshopView.workshopBoxMathBoxWrapperID)
    const workshopBoxMathBox = createDivWithId(WorkshopView.workshopBoxMathBoxID)

    const resourceAmountElement = createSpan(`${this.scene.workshopMaxProduction}`)
    const resourceIconElement = this.cropper.crop(
      20,
      20,
      1,
      this.resourceURL,
      this.resourceRepresentation.length,
      getResourceMapping(this.resourceRepresentation)(resourceName),
      false,
    )
    const equalsElement = createSpan(' = ')
    const moneyIcon = createIconWithAll('/assets/coinCustomIcon.png', '20px')
    const timeIcon = createIconWithAll('/assets/timeCustomIcon.png', '20px')
    const moneySpan = createSpan(`${this.scene.workshopUnitPrice * this.scene.workshopMaxProduction}`)
    const timeSpan = createSpan(`+ ${1}`)

    workshopBoxMathBox.append(
      resourceAmountElement, resourceIconElement, equalsElement,
      moneySpan, moneyIcon, timeSpan, timeIcon,
    )

    workshopBoxMathBoxWrapper.appendChild(workshopBoxMathBox)

    // Content
    const workshopBoxContentBoxWrapper = createDivWithId(WorkshopView.workshopBoxContentBoxWrapperID)
    const workshopBoxContentBox = createDivWithId(WorkshopView.workshopBoxContentBoxID)
    // Left
    const workshopBoxContentBoxLeft = createDivWithId(WorkshopView.workshopBoxContentBoxLeftID)
    // Left - CostBox
    const workshopBoxContentBoxCostBox = createDivWithId(WorkshopView.workshopBoxContentBoxCostBoxID)

    const pMoneyIconWrapper = document.createElement('div')
    const pMoneyIcon = createIconWithAll('/assets/coinCustomIcon.png', '38px')
    pMoneyIconWrapper.appendChild(pMoneyIcon)

    const pMoneyInputWrapper = document.createElement('div')
    const pMoneyInput = createHeading('h4', '0')
    pMoneyInputWrapper.appendChild(pMoneyInput)
    const pMoney = document.createElement('div')
    pMoney.append(pMoneyInputWrapper, pMoneyIconWrapper)

    this.pTime = createDivWithId('pTime')

    const costHeader = createHeading('h2', 'Koszt')
    const costResources = document.createElement('div')
    costResources.append(pMoney, this.pTime)

    workshopBoxContentBoxCostBox.append(costHeader, costResources)

    // Left - ResultBox
    const workshopBoxContentBoxResultBox = createDivWithId(WorkshopView.workshopBoxContentBoxResultBoxID)

    const pWantLabel = createHeading('h1', 'Wyprodukujesz')
    const pWantInputWrapper = document.createElement('div')
    const pWantInput = createHeading('h2', '0')
    pWantInputWrapper.appendChild(pWantInput)

    const inputWrapper = document.createElement('div')

    inputWrapper.append(itemIcon, pWantInputWrapper)
    workshopBoxContentBoxResultBox.append(pWantLabel, inputWrapper)
    workshopBoxContentBoxLeft.append(workshopBoxContentBoxCostBox, workshopBoxContentBoxResultBox)

    // Right
    const workshopBoxContentBoxRight = createDivWithId(WorkshopView.workshopBoxContentBoxRightID)

    this.workshopBoxPlusButton = document.createElement('button')

    this.workshopBoxPlusButton.addEventListener('click', () => {
      this.enableMinusButton()
      this.enableSubmitBtn()

      const costTime = this.pTime.children.length + 1
      const costMoney =
        costTime * (this.scene.workshopUnitPrice * this.scene.workshopMaxProduction)
      const resource = costTime * this.scene.workshopMaxProduction

      pWantInput.innerText = `${resource}`
      pMoneyInput.innerText = `${costMoney}`

      const pTimeIconExtraWrapper = document.createElement('div')
      const pTimeIconWrapper = document.createElement('div')
      const pTimeIcon = createIconWithAll('/assets/timeCustomIcon.png', '25px')
      pTimeIconWrapper.appendChild(pTimeIcon)
      pTimeIconExtraWrapper.appendChild(pTimeIconWrapper)
      this.pTime.appendChild(pTimeIconExtraWrapper)

      sendWorkshopMessage(this.scene.chatWs, {
        type: OutcomingWorkshopMessageType.WorkshopChoosingChange,
        amount: resource,
      })

      const costTimeMore = costTime + 1
      const costMoneyMore =
        costTimeMore * (this.scene.workshopUnitPrice * this.scene.workshopMaxProduction)
      if (
        costMoneyMore > this.scene.equipment!.money ||
        costTimeMore > this.scene.timeView!.getAvailableTokens() ||
        costTimeMore === 11
      ) {
        this.disablePlusButton()
        return
      }
      this.enablePlusButton()
    })

    this.workshopBoxPlusButton.appendChild(createIElement('plus'))

    this.workshopBoxMinusButton = document.createElement('button')
    this.workshopBoxMinusButton.addEventListener('click', () => {
      this.enablePlusButton()

      const costTime = this.pTime.children.length - 1
      const costMoney =
        costTime * (this.scene.workshopUnitPrice * this.scene.workshopMaxProduction)
      const resource = costTime * this.scene.workshopMaxProduction

      pWantInput.innerText = `${resource}`
      pMoneyInput.innerText = `${costMoney}`
      if (this.pTime.lastChild) {
        this.pTime.removeChild(this.pTime.lastChild)
      }

      sendWorkshopMessage(this.scene.chatWs, {
        type: OutcomingWorkshopMessageType.WorkshopChoosingChange,
        amount: resource,
      })

      if (costTime === 0) {
        this.disableSubmitBtn()
      }

      if (costTime - 1 < 0) {
        this.disableMinusButton()
      }
    })

    this.workshopBoxMinusButton.appendChild(createIElement('minus'))

    const buttons = createDivWithId(WorkshopView.workshopBoxContentBoxButtonsBoxID)
    buttons.append(this.workshopBoxPlusButton, this.workshopBoxMinusButton)
    workshopBoxContentBoxRight.appendChild(buttons)
    workshopBoxContentBox.append(workshopBoxContentBoxLeft, document.createElement('hr'), workshopBoxContentBoxRight)
    workshopBoxContentBoxWrapper.appendChild(workshopBoxContentBox)

    // Submit button
    this.workshopBoxSubmitButtonExtraWrapper = createDivWithId(WorkshopView.workshopBoxSubmitButtonExtraWrapperID)
    this.workshopBoxSubmitButtonWrapper = createDivWithId(WorkshopView.workshopBoxSubmitButtonWrapperID)

    this.workshopBoxSubmitButton = createButtonWithInnerText(WorkshopView.workshopBoxSubmitButtonID, 'Produkuj')
    this.workshopBoxSubmitButton.addEventListener('click', () => {
      this.disableSubmitBtn()
      this.workshopBoxSubmitButtonExtraWrapper.className = getClassName(this.workshopBoxSubmitButtonExtraWrapper, WorkshopView.workshopBoxSubmitButtonExtraWrapperID)
      this.workshopBoxSubmitButtonWrapper.className = getClassName(this.workshopBoxSubmitButtonWrapper, WorkshopView.workshopBoxSubmitButtonWrapperID)
      this.workshopBoxSubmitButton.className = getClassName(this.workshopBoxSubmitButton, WorkshopView.workshopBoxSubmitButtonID)

      sendWorkshopMessage(scene.chatWs, {
        type: OutcomingWorkshopMessageType.WorkshopStart,
        amount: parseInt(pWantInput.innerText),
      })
    })

    this.workshopBoxSubmitButtonWrapper.appendChild(this.workshopBoxSubmitButton)
    this.workshopBoxSubmitButtonExtraWrapper.appendChild(this.workshopBoxSubmitButtonWrapper)

    workshopBox.append(workshopBoxHeaderBoxExtraWrapper, workshopBoxMathBoxWrapper,
      workshopBoxContentBoxWrapper, this.workshopBoxSubmitButtonExtraWrapper)

    this.workshopBoxWrapper.appendChild(workshopBox)

    const costTime = 1
    const costMoney = costTime * (this.scene.workshopUnitPrice * this.scene.workshopMaxProduction)
    if (costMoney > this.scene.equipment!.money || costTime > this.scene.timeView!.getAvailableTokens()) {
      this.disablePlusButton()
    } else {
      this.enablePlusButton()
    }
    this.disableMinusButton()
    this.disableSubmitBtn()
  }

  public onTimeTokensChange(): void {
    const currentCostTime = this.pTime.children.length

    const nextCostTime = currentCostTime + 1
    const nextCostMoney = nextCostTime * (this.scene.workshopUnitPrice * this.scene.workshopMaxProduction)
    if (nextCostMoney > this.scene.equipment!.money ||
      nextCostTime > this.scene.timeView!.getAvailableTokens() || nextCostTime === 11) {
      this.disablePlusButton()
      return
    }
    this.enablePlusButton()

    const prevCostTime = currentCostTime - 1
    if (prevCostTime < 0) {
      this.disableMinusButton()
    }
  }

  private enablePlusButton(): void {
    this.workshopBoxPlusButton.disabled = false
    this.workshopBoxPlusButton.className = WorkshopView.workshopBoxContentBoxButtonsBoxID + 'Enabled'
  }

  private disablePlusButton(): void {
    this.workshopBoxPlusButton.disabled = true
    this.workshopBoxPlusButton.className = WorkshopView.workshopBoxContentBoxButtonsBoxID + 'Disabled'
  }

  private enableMinusButton(): void {
    this.workshopBoxMinusButton.disabled = false
    this.workshopBoxMinusButton.className = WorkshopView.workshopBoxContentBoxButtonsBoxID + 'Enabled'
  }

  private disableMinusButton(): void {
    this.workshopBoxMinusButton.disabled = true
    this.workshopBoxMinusButton.className = WorkshopView.workshopBoxContentBoxButtonsBoxID + 'Disabled'
  }

  private disableSubmitBtn(): void {
    this.workshopBoxSubmitButton.disabled = true
    this.workshopBoxSubmitButton.className = WorkshopView.workshopBoxSubmitButtonID + 'Disabled'
    this.workshopBoxSubmitButtonExtraWrapper.className = WorkshopView.workshopBoxSubmitButtonExtraWrapperID +'Disabled'
    this.workshopBoxSubmitButtonWrapper.className = WorkshopView.workshopBoxSubmitButtonWrapperID +'Disabled'
  }

  private enableSubmitBtn(): void {
    this.workshopBoxSubmitButton.disabled = false
    this.workshopBoxSubmitButton.className = WorkshopView.workshopBoxSubmitButtonID + 'Enabled'
    this.workshopBoxSubmitButtonExtraWrapper.className = WorkshopView.workshopBoxSubmitButtonExtraWrapperID +'Enabled'
    this.workshopBoxSubmitButtonWrapper.className = WorkshopView.workshopBoxSubmitButtonWrapperID +'Enabled'
  }

  public show(): void {
    sendWorkshopMessage(this.scene.chatWs, {
      type: OutcomingWorkshopMessageType.WorkshopChoosingStart,
    })
    this.scene.interactionCloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.WORK)
    window.document.body.appendChild(this.workshopBoxWrapper)
    this.scene.workshopView = this
    this.scene.movingEnabled = false
  }

  public close(): void {
    sendWorkshopMessage(this.scene.chatWs, {
      type: OutcomingWorkshopMessageType.WorkshopChoosingStop,
    })
    document.getElementById(WorkshopView.workshopBoxWrapperID)?.remove()
    this.scene.interactionCloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.WORK)
    this.scene.workshopView = null
  }
}
