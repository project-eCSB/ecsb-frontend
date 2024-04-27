export class TradeFailureView {
  private readonly onClose: () => void
  private static readonly tradeFailureBoxID = 'tradeFailureBox'
  private readonly tradeFailureBox: HTMLDivElement

  constructor(currPlayerId: string, otherPlayerId: string, message: string, onClose: () => void) {
    this.onClose = onClose

    // Container
    this.tradeFailureBox = document.createElement('div')
    this.tradeFailureBox.id = TradeFailureView.tradeFailureBoxID

    // Header
    const tradeFailureBoxHeaderWrapper = document.createElement('div')
    tradeFailureBoxHeaderWrapper.id = 'tradeFailureBoxHeaderWrapper'

    const tradeFailureBoxHeader = document.createElement('div')
    tradeFailureBoxHeader.id = 'tradeFailureBoxHeader'

    const tradeSucceessBoxHeaderTitle = document.createElement('h1')
    tradeSucceessBoxHeaderTitle.innerText = 'HANDEL'

    const leftArrows = document.createElement('div')
    const leftArrowsLeftArrowIcon = document.createElement('img')
    leftArrowsLeftArrowIcon.src = '/assets/leftArrowCustomIcon.png'
    leftArrowsLeftArrowIcon.style.width = '54px'
    const leftArrowsRightArrowIcon = document.createElement('img')
    leftArrowsRightArrowIcon.src = '/assets/rightArrowCustomIcon.png'
    leftArrowsRightArrowIcon.style.width = '54px'
    leftArrows.appendChild(leftArrowsLeftArrowIcon)
    leftArrows.appendChild(leftArrowsRightArrowIcon)

    const rightArrows = document.createElement('div')
    const rightArrowsLeftArrowIcon = document.createElement('img')
    rightArrowsLeftArrowIcon.src = '/assets/leftArrowCustomIcon.png'
    rightArrowsLeftArrowIcon.style.width = '54px'
    const rightArrowsRightArrowIcon = document.createElement('img')
    rightArrowsRightArrowIcon.src = '/assets/rightArrowCustomIcon.png'
    rightArrowsRightArrowIcon.style.width = '54px'
    rightArrows.appendChild(rightArrowsLeftArrowIcon)
    rightArrows.appendChild(rightArrowsRightArrowIcon)

    tradeFailureBoxHeader.appendChild(leftArrows)
    tradeFailureBoxHeader.appendChild(tradeSucceessBoxHeaderTitle)
    tradeFailureBoxHeader.appendChild(rightArrows)
    tradeFailureBoxHeaderWrapper.appendChild(tradeFailureBoxHeader)

    // Failure information
    const tradeFailureBoxInformationBoxWrapper = document.createElement('div')
    tradeFailureBoxInformationBoxWrapper.id = 'tradeFailureBoxInformationBoxWrapper'
    const tradeFailureBoxInformationBox = document.createElement('div')
    tradeFailureBoxInformationBox.id = 'tradeFailureBoxInformationBox'
    const tradeFailureBoxInformationBoxText = document.createElement('h1')
    tradeFailureBoxInformationBoxText.innerText = 'Wymiana została przerwana!'
    const leftFailureIcon = document.createElement('img')
    leftFailureIcon.src = '/assets/failureCustomIcon.png'
    leftFailureIcon.style.width = '20px'
    const rightFailureIcon = document.createElement('img')
    rightFailureIcon.src = '/assets/failureCustomIcon.png'
    rightFailureIcon.style.width = '20px'

    tradeFailureBoxInformationBox.appendChild(leftFailureIcon)
    tradeFailureBoxInformationBox.appendChild(tradeFailureBoxInformationBoxText)
    tradeFailureBoxInformationBox.appendChild(rightFailureIcon)

    tradeFailureBoxInformationBoxWrapper.appendChild(tradeFailureBoxInformationBox)

    // Content
    const tradeFailureBoxContentBoxExtraWrapper = document.createElement('div')
    tradeFailureBoxContentBoxExtraWrapper.id = 'tradeFailureBoxContentBoxExtraWrapper'
    const tradeFailureBoxContentBoxWrapper = document.createElement('div')
    tradeFailureBoxContentBoxWrapper.id = 'tradeFailureBoxContentBoxWrapper'
    const tradeFailureBoxContentBox = document.createElement('div')
    tradeFailureBoxContentBox.id = 'tradeFailureBoxContentBox'

    // Content left
    const currentUserIdContainer = document.createElement('div')
    const currentUserId = document.createElement('h2')
    currentUserId.className = 'tradeFailureBoxContentBoxUsername'
    currentUserId.innerText = currPlayerId
    currentUserIdContainer.appendChild(currentUserId)

    // Content middle
    const messageContainer = document.createElement('div')

    const messageCloudExtraWrapper = document.createElement('div')
    messageCloudExtraWrapper.className = 'tradeMessageExtraWrapper'
    const messageCloudWrapper = document.createElement('div')
    messageCloudWrapper.className = 'tradeMessageWrapper'
    const messageCloud = document.createElement('div')
    messageCloud.className = 'tradeMessage'
    const messageTag = document.createElement('p')
    messageTag.textContent = message
    messageCloudExtraWrapper.appendChild(messageCloudWrapper)
    messageCloudWrapper.appendChild(messageCloud)
    messageCloud.appendChild(messageTag)

    messageContainer.appendChild(messageCloudExtraWrapper)

    // Content right
    const otherUserIdContainer = document.createElement('div')
    const otherUserId = document.createElement('h2')
    otherUserId.className = 'tradeFailureBoxContentBoxUsername'
    otherUserId.innerText = otherPlayerId
    otherUserIdContainer.appendChild(otherUserId)

    tradeFailureBoxContentBox.appendChild(currentUserIdContainer)
    tradeFailureBoxContentBox.appendChild(messageContainer)
    tradeFailureBoxContentBox.appendChild(otherUserIdContainer)

    tradeFailureBoxContentBoxWrapper.appendChild(tradeFailureBoxContentBox)
    tradeFailureBoxContentBoxExtraWrapper.appendChild(tradeFailureBoxContentBoxWrapper)

    // Ok button
    const tradeFailureBoxOkButtonExtraWrapper = document.createElement('div')
    tradeFailureBoxOkButtonExtraWrapper.id = 'tradeFailureBoxOkButtonExtraWrapper'
    const tradeFailureBoxOkButtonWrapper = document.createElement('div')
    tradeFailureBoxOkButtonWrapper.id = 'tradeFailureBoxOkButtonWrapper'
    const tradeFailureBoxOkButton = document.createElement('button')
    tradeFailureBoxOkButton.id = 'tradeFailureBoxOkButton'
    tradeFailureBoxOkButton.innerText = 'OK'
    tradeFailureBoxOkButton.addEventListener('click', () => {
      tradeFailureBoxOkButtonExtraWrapper.id =
        tradeFailureBoxOkButtonExtraWrapper.id === 'tradeFailureBoxOkButtonExtraWrapperActive'
          ? 'tradeFailureBoxOkButtonExtraWrapper'
          : 'tradeFailureBoxOkButtonExtraWrapperActive'
      tradeFailureBoxOkButtonWrapper.id =
        tradeFailureBoxOkButtonWrapper.id === 'tradeFailureBoxOkButtonWrapperActive'
          ? 'tradeFailureBoxOkButtonWrapper'
          : 'tradeFailureBoxOkButtonWrapperActive'
      tradeFailureBoxOkButton.id =
        tradeFailureBoxOkButton.id === 'tradeFailureBoxOkButtonActive'
          ? 'tradeFailureBoxOkButton'
          : 'tradeFailureBoxOkButtonActive'

      this.close()
    })
    tradeFailureBoxOkButtonWrapper.appendChild(tradeFailureBoxOkButton)
    tradeFailureBoxOkButtonExtraWrapper.appendChild(tradeFailureBoxOkButtonWrapper)

    // Append all
    this.tradeFailureBox.appendChild(tradeFailureBoxHeaderWrapper)
    this.tradeFailureBox.appendChild(tradeFailureBoxInformationBoxWrapper)
    this.tradeFailureBox.appendChild(tradeFailureBoxContentBoxExtraWrapper)
    this.tradeFailureBox.appendChild(tradeFailureBoxOkButtonExtraWrapper)
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
