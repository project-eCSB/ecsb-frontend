import { type ClassResourceRepresentation, type Travel } from '../../apis/game/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { type CoopBid } from '../webSocketMessage/chat/CoopMessageHandler'
import {
  createButtonWithInnerText,
  createCrop,
  createDivWithClassName,
  createDivWithId,
  createHeading,
  createIconWithWidth,
  getId,
  getTimeContainer,
} from './ViewUtils'

export class ResourceNegotiationSuccessView {
  private static readonly resourceNegotiationSuccessBoxID = 'resourceNegotiationSuccessBox'
  private static readonly resourceElementWidth = 105
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper
  private readonly onClose: () => void
  private readonly resourceNegotiationSuccessBox: HTMLDivElement
  private static readonly resourceNegotiationSuccessOkButtonExtraWrapperID = 'resourceNegotiationSuccessOkButtonExtraWrapper'
  private static readonly resourceNegotiationSuccessOkButtonWrapperID = 'resourceNegotiationSuccessOkButtonWrapper'
  private static readonly resourceNegotiationSuccessOkButtonID = 'resourceNegotiationSuccessOkButton'

  constructor(
    resourceURL: string,
    resourceRepresentation: ClassResourceRepresentation[],
    travel: Travel,
    player: string,
    playerBid: CoopBid,
    partner: string,
    partnerBid: CoopBid,
    onClose: () => void,
  ) {
    this.resourceURL = resourceURL
    this.resourceRepresentation = resourceRepresentation
    this.cropper = new ImageCropper()
    this.onClose = onClose

    const arrowIconWidth =
      (travel.value.resources.length + 1) * ResourceNegotiationSuccessView.resourceElementWidth

    // Container
    this.resourceNegotiationSuccessBox = createDivWithId(ResourceNegotiationSuccessView.resourceNegotiationSuccessBoxID)
    // Header
    const resourceNegotiationSuccessHeaderWrapper = createDivWithId('resourceNegotiationSuccessHeaderBoxWrapper')
    const resourceNegotiationSuccessHeader = createDivWithId('resourceNegotiationSuccessHeaderBox')
    const tradeSuccessBoxHeaderTitle = createHeading('h1', 'WYPRAWA')
    resourceNegotiationSuccessHeader.appendChild(tradeSuccessBoxHeaderTitle)
    resourceNegotiationSuccessHeaderWrapper.appendChild(resourceNegotiationSuccessHeader)
    this.resourceNegotiationSuccessBox.appendChild(resourceNegotiationSuccessHeaderWrapper)

    // Success Information
    const resourceNegotiationSuccessInformationBoxWrapper = createDivWithId('resourceNegotiationSuccessInformationBoxWrapper')
    const resourceNegotiationSuccessInformationBox = createDivWithId('resourceNegotiationSuccessInformationBox')
    const resourceNegotiationSuccessInformationBoxText = createHeading('h2', 'Podział zakończony sukcesem!')
    const leftSuccessIcon = createIconWithWidth('/assets/successCustomIcon.png', '20px')
    const rightSuccessIcon = createIconWithWidth('/assets/successCustomIcon.png', '20px')

    resourceNegotiationSuccessInformationBox.append(leftSuccessIcon, resourceNegotiationSuccessInformationBoxText, rightSuccessIcon)
    resourceNegotiationSuccessInformationBoxWrapper.appendChild(resourceNegotiationSuccessInformationBox)
    this.resourceNegotiationSuccessBox.appendChild(resourceNegotiationSuccessInformationBoxWrapper)

    // Content
    const resourceNegotiationSuccessContentBoxExtraWrapper = createDivWithId('resourceNegotiationSuccessContentBoxExtraWrapper')
    const resourceNegotiationSuccessContentBoxWrapper = createDivWithId('resourceNegotiationSuccessContentBoxWrapper')
    const resourceNegotiationSuccessContentBox = createDivWithId('resourceNegotiationSuccessContentBox')
    // Content - Players' names
    const resourceNegotiationSuccessContentBoxPlayersNames = createDivWithId('resourceNegotiationSuccessContentBoxPlayersNames')
    resourceNegotiationSuccessContentBoxPlayersNames.append(createHeading('h3', `${player}`), createHeading('h3', `${partner}`))
    resourceNegotiationSuccessContentBox.appendChild(resourceNegotiationSuccessContentBoxPlayersNames)
    // Content - Players' resources
    const resourceNegotiationSuccessContentBoxPlayersResources = createDivWithId('resourceNegotiationSuccessContentBoxPlayersResources')

    const playerResourcesContainer = document.createElement('div')
    const playerResources = createDivWithClassName('resourceNegotiationSuccessContentBoxResources')
    for (const resource of playerBid.resources) {
      if (resource.value === 0) continue

      const playerResourceItem = document.createElement('div')

      const playerResourceIconWrapper = document.createElement('div')
      const playerResourceIcon = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
      playerResourceIconWrapper.appendChild(playerResourceIcon)
      playerResourceItem.appendChild(playerResourceIconWrapper)
      const playerResourceValueWrapper = document.createElement('div')
      const playerResourceValue = createHeading('h5', `${resource.value}`)
      playerResourceValueWrapper.appendChild(playerResourceValue)
      playerResourceItem.appendChild(playerResourceValueWrapper)
      playerResources.appendChild(playerResourceItem)
    }
    if (playerBid.travelerId !== '') {
      const timeContainer = getTimeContainer(travel.value.time)
      playerResources.appendChild(timeContainer)
    }
    const playerArrow = createIconWithWidth('/assets/tradeRightArrowCustomIcon.png', `${arrowIconWidth}px`)
    playerResourcesContainer.append(playerResources, playerArrow)
    resourceNegotiationSuccessContentBoxPlayersResources.appendChild(playerResourcesContainer)

    const partnerResourcesContainer = document.createElement('div')
    const partnerResources = createDivWithClassName('resourceNegotiationSuccessContentBoxResources')
    for (const resource of partnerBid.resources) {
      if (resource.value === 0) continue

      const partnerResourceItem = document.createElement('div')
      const partnerResourceIconWrapper = document.createElement('div')
      const partnerResourceIcon = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
      partnerResourceIconWrapper.appendChild(partnerResourceIcon)
      partnerResourceItem.appendChild(partnerResourceIconWrapper)
      const partnerResourceValueWrapper = document.createElement('div')
      const partnerResourceValue = createHeading('h5', `${resource.value}`)
      partnerResourceValueWrapper.appendChild(partnerResourceValue)
      partnerResourceItem.appendChild(partnerResourceValueWrapper)
      partnerResources.appendChild(partnerResourceItem)
    }
    if (partnerBid.travelerId !== '') {
      const timeContainer = getTimeContainer(travel.value.time)
      partnerResources.appendChild(timeContainer)
    }
    const partnerArrow = createIconWithWidth('/assets/tradeRightArrowCustomIcon.png', `${arrowIconWidth}px`)
    partnerResourcesContainer.append(partnerResources, partnerArrow)
    resourceNegotiationSuccessContentBoxPlayersResources.append(partnerResourcesContainer, playerResourcesContainer, partnerResourcesContainer)
    resourceNegotiationSuccessContentBox.appendChild(resourceNegotiationSuccessContentBoxPlayersResources)

    // Content Right - Travel destination
    const resourceNegotiationSuccessContentBoxTravelDestination = createDivWithId('resourceNegotiationSuccessContentBoxTravelDestination')

    const trainIcon = createIconWithWidth('/assets/trainCustomIcon.png', '56px')
    const travelName = createHeading('h3', `${travel.value.name}`)
    resourceNegotiationSuccessContentBoxTravelDestination.append(trainIcon, travelName)
    resourceNegotiationSuccessContentBox.appendChild(resourceNegotiationSuccessContentBoxTravelDestination)
    resourceNegotiationSuccessContentBoxWrapper.appendChild(resourceNegotiationSuccessContentBox)
    resourceNegotiationSuccessContentBoxExtraWrapper.appendChild(resourceNegotiationSuccessContentBoxWrapper)
    this.resourceNegotiationSuccessBox.appendChild(resourceNegotiationSuccessContentBoxExtraWrapper)

    // OK Button
    const resourceNegotiationSuccessOkButtonExtraWrapper = createDivWithId(ResourceNegotiationSuccessView.resourceNegotiationSuccessOkButtonExtraWrapperID)
    const resourceNegotiationSuccessOkButtonWrapper = createDivWithId(ResourceNegotiationSuccessView.resourceNegotiationSuccessOkButtonWrapperID)
    const resourceNegotiationSuccessOkButton = createButtonWithInnerText(ResourceNegotiationSuccessView.resourceNegotiationSuccessOkButtonID, 'OK')
    resourceNegotiationSuccessOkButton.addEventListener('click', () => {
      resourceNegotiationSuccessOkButtonExtraWrapper.id = getId(resourceNegotiationSuccessOkButtonExtraWrapper, ResourceNegotiationSuccessView.resourceNegotiationSuccessOkButtonExtraWrapperID)
      resourceNegotiationSuccessOkButtonWrapper.id = getId(resourceNegotiationSuccessOkButtonWrapper, ResourceNegotiationSuccessView.resourceNegotiationSuccessOkButtonWrapperID)
      resourceNegotiationSuccessOkButton.id = getId(resourceNegotiationSuccessOkButton, ResourceNegotiationSuccessView.resourceNegotiationSuccessOkButtonID)
      this.close()
    })
    resourceNegotiationSuccessOkButtonWrapper.appendChild(resourceNegotiationSuccessOkButton)
    resourceNegotiationSuccessOkButtonExtraWrapper.appendChild(resourceNegotiationSuccessOkButtonWrapper)
    this.resourceNegotiationSuccessBox.appendChild(resourceNegotiationSuccessOkButtonExtraWrapper)
  }

  public show(): void {
    if (!document.getElementById(ResourceNegotiationSuccessView.resourceNegotiationSuccessBoxID)) {
      window.document.body.appendChild(this.resourceNegotiationSuccessBox)
    }
  }

  public close(): void {
    document
      .getElementById(ResourceNegotiationSuccessView.resourceNegotiationSuccessBoxID)
      ?.remove()
    this.onClose()
  }
}
