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

export class TradeFailureView {
  private readonly onClose: () => void
  private static readonly tradeFailureBoxID = 'tradeFailureBox'
  private readonly tradeFailureBox: HTMLDivElement
  private static readonly tradeFailureBoxOkButtonExtraWrapperID = 'tradeFailureBoxOkButtonExtraWrapper'
  private static readonly tradeFailureBoxOkButtonWrapperID = 'tradeFailureBoxOkButtonWrapper'
  private static readonly tradeFailureBoxOkButtonID = 'tradeFailureBoxOkButton'

  constructor(currPlayerId: string, otherPlayerId: string, message: string, onClose: () => void) {
    this.onClose = onClose

    // Container
    this.tradeFailureBox = createDivWithId(TradeFailureView.tradeFailureBoxID)
    // Header
    const tradeFailureBoxHeaderWrapper = createDivWithId('tradeFailureBoxHeaderWrapper')
    const tradeFailureBoxHeader = createDivWithId('tradeFailureBoxHeader')
    const tradeSuccessBoxHeaderTitle = createElWithText('h1', 'HANDEL')
    tradeFailureBoxHeader.append(createArrowIcon(), tradeSuccessBoxHeaderTitle, createArrowIcon())
    tradeFailureBoxHeaderWrapper.appendChild(tradeFailureBoxHeader)

    // Failure information
    const tradeFailureBoxInformationBoxWrapper = createDivWithId('tradeFailureBoxInformationBoxWrapper')
    const tradeFailureBoxInformationBox = createDivWithId('tradeFailureBoxInformationBox')
    const tradeFailureBoxInformationBoxText = createElWithText('h1', 'Wymiana została przerwana!')
    tradeFailureBoxInformationBox.append(
      createIconWithWidth('/assets/failureCustomIcon.png', '20px'),
      tradeFailureBoxInformationBoxText,
      createIconWithWidth('/assets/failureCustomIcon.png', '20px'),
    )

    tradeFailureBoxInformationBoxWrapper.appendChild(tradeFailureBoxInformationBox)

    // Content
    const tradeFailureBoxContentBoxExtraWrapper = createDivWithId('tradeFailureBoxContentBoxExtraWrapper')
    const tradeFailureBoxContentBoxWrapper = createDivWithId('tradeFailureBoxContentBoxWrapper')
    const tradeFailureBoxContentBox = createDivWithId('tradeFailureBoxContentBox')

    // Content left
    const currentUserIdContainer = document.createElement('div')
    const currentUserId = createElWithClassText('h2', currPlayerId, 'tradeFailureBoxContentBoxUsername')
    currentUserIdContainer.appendChild(currentUserId)

    // Content middle
    const messageContainer = document.createElement('div')

    const messageCloudExtraWrapper = createDivWithClassName('tradeMessageExtraWrapper')
    const messageCloudWrapper = createDivWithClassName('tradeMessageWrapper')
    const messageCloud = createDivWithClassName('tradeMessage')
    const messageTag = createParagraph(message)
    messageCloudExtraWrapper.appendChild(messageCloudWrapper)
    messageCloudWrapper.appendChild(messageCloud)
    messageCloud.appendChild(messageTag)
    messageContainer.appendChild(messageCloudExtraWrapper)

    // Content right
    const otherUserIdContainer = document.createElement('div')
    const otherUserId = createElWithClassText('h2', otherPlayerId, 'tradeFailureBoxContentBoxUsername')
    otherUserIdContainer.appendChild(otherUserId)

    tradeFailureBoxContentBox.append(currentUserIdContainer, messageContainer, otherUserIdContainer)
    tradeFailureBoxContentBoxWrapper.appendChild(tradeFailureBoxContentBox)
    tradeFailureBoxContentBoxExtraWrapper.appendChild(tradeFailureBoxContentBoxWrapper)

    // Ok button
    const tradeFailureBoxOkButtonExtraWrapper = createDivWithId(TradeFailureView.tradeFailureBoxOkButtonExtraWrapperID)
    const tradeFailureBoxOkButtonWrapper = createDivWithId(TradeFailureView.tradeFailureBoxOkButtonWrapperID)
    const tradeFailureBoxOkButton = createButtonWithInnerText(TradeFailureView.tradeFailureBoxOkButtonID, 'OK')
    tradeFailureBoxOkButton.addEventListener('click', () => {
      tradeFailureBoxOkButtonExtraWrapper.id = getId(tradeFailureBoxOkButtonExtraWrapper, TradeFailureView.tradeFailureBoxOkButtonExtraWrapperID)
      tradeFailureBoxOkButtonWrapper.id = getId(tradeFailureBoxOkButtonWrapper, TradeFailureView.tradeFailureBoxOkButtonWrapperID)
      tradeFailureBoxOkButton.id = getId(tradeFailureBoxOkButton, TradeFailureView.tradeFailureBoxOkButtonID)
      this.close()
    })
    tradeFailureBoxOkButtonWrapper.appendChild(tradeFailureBoxOkButton)
    tradeFailureBoxOkButtonExtraWrapper.appendChild(tradeFailureBoxOkButtonWrapper)

    // Append all
    this.tradeFailureBox.append(
      tradeFailureBoxHeaderWrapper, tradeFailureBoxInformationBoxWrapper,
      tradeFailureBoxContentBoxExtraWrapper, tradeFailureBoxOkButtonExtraWrapper)
  }

  public show(): void {
    if (!document.getElementById(TradeFailureView.tradeFailureBoxID)) {
      window.document.body.appendChild(this.tradeFailureBox)
    }
  }

  public close(): void {
    document.getElementById(TradeFailureView.tradeFailureBoxID)?.remove()
    this.onClose()
  }
}
