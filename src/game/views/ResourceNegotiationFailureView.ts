import {
    createArrowIcon,
    createButtonWithInnerText,
    createDivWithClassName,
    createDivWithId,
    createElWithText,
    createElWithClassText,
    createIconWithWidth,
    createParagraph,
    getId,
  } from './ViewUtils'
  
  export class ResourceNegotiationFailureView {
    private readonly onClose: () => void
    private static readonly negotiationFailureBoxID = 'negotiationFailureBox'
    private readonly negotiationFailureBox: HTMLDivElement
    private static readonly negotiationFailureBoxOkButtonExtraWrapperID = 'negotiationFailureBoxOkButtonExtraWrapper'
    private static readonly negotiationFailureBoxOkButtonWrapperID = 'negotiationFailureBoxOkButtonWrapper'
    private static readonly negotiationFailureBoxOkButtonID = 'negotiationFailureBoxOkButton'
  
    constructor(currPlayerId: string, otherPlayerId: string, message: string, onClose: () => void) {
      this.onClose = onClose
  
      // Container
      this.negotiationFailureBox = createDivWithId(ResourceNegotiationFailureView.negotiationFailureBoxID)
      // Header
      const negotiationFailureBoxHeaderWrapper = createDivWithId('negotiationFailureBoxHeaderWrapper')
      const negotiationFailureBoxHeader = createDivWithId('negotiationFailureBoxHeader')
      const negotiationSuccessBoxHeaderTitle = createElWithText('h1', 'WYPRAWA')
      negotiationFailureBoxHeader.append(negotiationSuccessBoxHeaderTitle)
      negotiationFailureBoxHeaderWrapper.appendChild(negotiationFailureBoxHeader)
  
      // Failure information
      const negotiationFailureBoxInformationBoxWrapper = createDivWithId('negotiationFailureBoxInformationBoxWrapper')
      const negotiationFailureBoxInformationBox = createDivWithId('negotiationFailureBoxInformationBox')
      const negotiationFailureBoxInformationBoxText = createElWithText('h1', 'Negocjacja została przerwana!')
      negotiationFailureBoxInformationBox.append(
        createIconWithWidth('/assets/failureCustomIcon.png', '20px'),
        negotiationFailureBoxInformationBoxText,
        createIconWithWidth('/assets/failureCustomIcon.png', '20px'),
      )
  
      negotiationFailureBoxInformationBoxWrapper.appendChild(negotiationFailureBoxInformationBox)
  
      // Content
      const negotiationFailureBoxContentBoxExtraWrapper = createDivWithId('negotiationFailureBoxContentBoxExtraWrapper')
      const negotiationFailureBoxContentBoxWrapper = createDivWithId('negotiationFailureBoxContentBoxWrapper')
      const negotiationFailureBoxContentBox = createDivWithId('negotiationFailureBoxContentBox')
  
      // Content left
      const currentUserIdContainer = document.createElement('div')
      const currentUserId = createElWithClassText('h2', currPlayerId, 'negotiationFailureBoxContentBoxUsername')
      currentUserIdContainer.appendChild(currentUserId)
  
      // Content middle
      const messageContainer = document.createElement('div')
  
      const messageCloudExtraWrapper = createDivWithClassName('resourceNegotiationMessageExtraWrapper')
      const messageCloudWrapper = createDivWithClassName('resourceNegotiationMessageWrapper')
      const messageCloud = createDivWithClassName('resourceNegotiationMessage')
      const messageTag = createParagraph(message)
      messageCloudExtraWrapper.appendChild(messageCloudWrapper)
      messageCloudWrapper.appendChild(messageCloud)
      messageCloud.appendChild(messageTag)
      messageContainer.appendChild(messageCloudExtraWrapper)
  
      // Content right
      const otherUserIdContainer = document.createElement('div')
      const otherUserId = createElWithClassText('h2', otherPlayerId, 'negotiationFailureBoxContentBoxUsername')
      otherUserIdContainer.appendChild(otherUserId)
  
      negotiationFailureBoxContentBox.append(currentUserIdContainer, messageContainer, otherUserIdContainer)
      negotiationFailureBoxContentBoxWrapper.appendChild(negotiationFailureBoxContentBox)
      negotiationFailureBoxContentBoxExtraWrapper.appendChild(negotiationFailureBoxContentBoxWrapper)
  
      // Ok button
      const negotiationFailureBoxOkButtonExtraWrapper = createDivWithId(ResourceNegotiationFailureView.negotiationFailureBoxOkButtonExtraWrapperID)
      const negotiationFailureBoxOkButtonWrapper = createDivWithId(ResourceNegotiationFailureView.negotiationFailureBoxOkButtonWrapperID)
      const negotiationFailureBoxOkButton = createButtonWithInnerText(ResourceNegotiationFailureView.negotiationFailureBoxOkButtonID, 'OK')
      negotiationFailureBoxOkButton.addEventListener('click', () => {
        negotiationFailureBoxOkButtonExtraWrapper.id = getId(negotiationFailureBoxOkButtonExtraWrapper, ResourceNegotiationFailureView.negotiationFailureBoxOkButtonExtraWrapperID)
        negotiationFailureBoxOkButtonWrapper.id = getId(negotiationFailureBoxOkButtonWrapper, ResourceNegotiationFailureView.negotiationFailureBoxOkButtonWrapperID)
        negotiationFailureBoxOkButton.id = getId(negotiationFailureBoxOkButton, ResourceNegotiationFailureView.negotiationFailureBoxOkButtonID)
        this.close()
      })
      negotiationFailureBoxOkButtonWrapper.appendChild(negotiationFailureBoxOkButton)
      negotiationFailureBoxOkButtonExtraWrapper.appendChild(negotiationFailureBoxOkButtonWrapper)
  
      // Append all
      this.negotiationFailureBox.append(
        negotiationFailureBoxHeaderWrapper, negotiationFailureBoxInformationBoxWrapper,
        negotiationFailureBoxContentBoxExtraWrapper, negotiationFailureBoxOkButtonExtraWrapper)
    }
  
    public show(): void {
      if (!document.getElementById(ResourceNegotiationFailureView.negotiationFailureBoxID)) {
        window.document.body.appendChild(this.negotiationFailureBox)
      }
    }
  
    public close(): void {
      document.getElementById(ResourceNegotiationFailureView.negotiationFailureBoxID)?.remove()
      this.onClose()
    }
  }
  