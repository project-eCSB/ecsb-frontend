import { type ClassResourceRepresentation, type TradeEquipment } from '../../apis/game/Types'
import { ImageCropper } from '../tools/ImageCropper'
import {
  createArrowIcon,
  createButtonWithInnerText,
  createDivWithId,
  createHeading,
  createIconWithWidth,
  createItemContainer,
  createMoneyContainer,
  createTradeCrop,
  getId,
} from './ViewUtils'

export class TradeSuccessView {
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper
  private readonly onClose: () => void
  private static readonly tradeSuccessBoxID = 'tradeSuccessBox'
  private readonly tradeSuccessBox: HTMLDivElement
  private static readonly tradeSuccessBoxOkButtonExtraWrapperID = 'tradeSuccessBoxOkButtonExtraWrapper'
  private static readonly tradeSuccessBoxOkButtonWrapperID = 'tradeSuccessBoxOkButtonWrapper'
  private static readonly tradeSuccessBoxOkButtonID = 'tradeSuccessBoxOkButton'

  constructor(
    resourceURL: string,
    resourceRepresentation: ClassResourceRepresentation[],
    currPlayerId: string,
    currPlayerOffers: TradeEquipment,
    otherPlayerId: string,
    otherPlayerOffers: TradeEquipment,
    onClose: () => void,
  ) {
    this.resourceURL = resourceURL
    this.resourceRepresentation = resourceRepresentation
    this.cropper = new ImageCropper()
    this.onClose = onClose

    // Container
    this.tradeSuccessBox = createDivWithId(TradeSuccessView.tradeSuccessBoxID)

    // Header
    const tradeSuccessBoxHeaderWrapper = createDivWithId('tradeSuccessBoxHeaderWrapper')
    const tradeSuccessBoxHeader = createDivWithId('tradeSuccessBoxHeader')
    const tradeSuccessBoxHeaderTitle = createHeading('h1', 'HANDEL')
    tradeSuccessBoxHeader.append(createArrowIcon(), tradeSuccessBoxHeaderTitle, createArrowIcon())
    tradeSuccessBoxHeaderWrapper.appendChild(tradeSuccessBoxHeader)

    // Success information
    const tradeSuccessBoxInformationBoxWrapper = createDivWithId('tradeSuccessBoxInformationBoxWrapper')
    const tradeSuccessBoxInformationBox = createDivWithId('tradeSuccessBoxInformationBox')
    const tradeSuccessBoxInformationBoxText = createHeading('h1', 'Wymiana zakończona sukcesem!')
    tradeSuccessBoxInformationBox.append(
      createIconWithWidth('/assets/successCustomIcon.png', '20px'),
      tradeSuccessBoxInformationBoxText,
      createIconWithWidth('/assets/successCustomIcon.png', '20px'),
    )

    tradeSuccessBoxInformationBoxWrapper.appendChild(tradeSuccessBoxInformationBox)

    // Content
    const tradeSuccessBoxContentBoxExtraWrapper = createDivWithId('tradeSuccessBoxContentBoxExtraWrapper')
    const tradeSuccessBoxContentBoxWrapper = createDivWithId('tradeSuccessBoxContentBoxWrapper')
    const tradeSuccessBoxContentBox = createDivWithId('tradeSuccessBoxContentBox')
    const currentUserId = createHeading('h2', currPlayerId)
    const otherUserId = createHeading('h2', otherPlayerId)

    const resourcesBox = createDivWithId('tradeSuccessBoxContentBoxResourcesBox')

    const currPlayerResourcesBox = document.createElement('div')
    const currPlayerResourcesBoxResources = createDivWithId('tradeSuccessBoxContentBoxResourcesCurrPlayer')
    if (otherPlayerOffers.money > 0) {
      const moneyContainer = createMoneyContainer(`${otherPlayerOffers.money}`)
      currPlayerResourcesBoxResources.appendChild(moneyContainer)
    }
    for (const resource of otherPlayerOffers.resources) {
      if (resource.value > 0) {
        const itemContainer = createItemContainer(`${resource.value}`,
          createTradeCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key))
        currPlayerResourcesBoxResources.appendChild(itemContainer)
      }
    }
    const leftTransferIcon = createIconWithWidth('/assets/tradeLeftArrowCustomIcon.png', '400px')
    currPlayerResourcesBox.append(currPlayerResourcesBoxResources, leftTransferIcon)

    const otherPlayerResourcesBox = document.createElement('div')
    const otherPlayerResourcesBoxResources = createDivWithId('tradeSuccessBoxContentBoxResourcesOtherPlayer')
    if (currPlayerOffers.money > 0) {
      const moneyContainer = createMoneyContainer(`${currPlayerOffers.money}`)
      otherPlayerResourcesBoxResources.appendChild(moneyContainer)
    }
    for (const resource of currPlayerOffers.resources) {
      if (resource.value > 0) {
        const itemContainer = createItemContainer(`${resource.value}`,
          createTradeCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key))
        otherPlayerResourcesBoxResources.appendChild(itemContainer)
      }
    }
    const rightTransferIcon = createIconWithWidth('/assets/tradeRightArrowCustomIcon.png', '400px')
    otherPlayerResourcesBox.append(otherPlayerResourcesBoxResources, rightTransferIcon)
    resourcesBox.append(currPlayerResourcesBox, otherPlayerResourcesBox)
    tradeSuccessBoxContentBox.append(currentUserId, resourcesBox, otherUserId)
    tradeSuccessBoxContentBoxWrapper.appendChild(tradeSuccessBoxContentBox)
    tradeSuccessBoxContentBoxExtraWrapper.appendChild(tradeSuccessBoxContentBoxWrapper)

    // Ok button
    const tradeSuccessBoxOkButtonExtraWrapper = createDivWithId(TradeSuccessView.tradeSuccessBoxOkButtonExtraWrapperID)
    const tradeSuccessBoxOkButtonWrapper = createDivWithId(TradeSuccessView.tradeSuccessBoxOkButtonWrapperID)
    const tradeSuccessBoxOkButton = createButtonWithInnerText(TradeSuccessView.tradeSuccessBoxOkButtonID, 'OK')
    tradeSuccessBoxOkButton.addEventListener('click', () => {
      tradeSuccessBoxOkButtonExtraWrapper.id = getId(tradeSuccessBoxOkButtonExtraWrapper, TradeSuccessView.tradeSuccessBoxOkButtonExtraWrapperID)
      tradeSuccessBoxOkButtonWrapper.id = getId(tradeSuccessBoxOkButtonWrapper, TradeSuccessView.tradeSuccessBoxOkButtonWrapperID)
      tradeSuccessBoxOkButton.id = getId(tradeSuccessBoxOkButton, TradeSuccessView.tradeSuccessBoxOkButtonID)
      this.close()
    })
    tradeSuccessBoxOkButtonWrapper.appendChild(tradeSuccessBoxOkButton)
    tradeSuccessBoxOkButtonExtraWrapper.appendChild(tradeSuccessBoxOkButtonWrapper)

    // Append all
    this.tradeSuccessBox.append(
      tradeSuccessBoxHeaderWrapper, tradeSuccessBoxInformationBoxWrapper,
      tradeSuccessBoxContentBoxExtraWrapper, tradeSuccessBoxOkButtonExtraWrapper,
    )
  }

  public show(): void {
    if (!document.getElementById(TradeSuccessView.tradeSuccessBoxID)) {
      window.document.body.appendChild(this.tradeSuccessBox)
    }
  }

  public close(): void {
    document.getElementById(TradeSuccessView.tradeSuccessBoxID)?.remove()
    this.onClose()
  }
}
