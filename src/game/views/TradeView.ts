import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { type ClassResourceRepresentation, type TradeEquipment } from '../../apis/game/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { getResourceMapping } from '../GameUtils'
import { TradeSuccessView } from './TradeSuccessView'
import { TradeFailureView } from './TradeFailureView'

export class TradeView {
  private static readonly maxPlayerIdLength = 24
  private readonly scene: Scene
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper
  /* Players data */
  private isCurrPlayerTurn: boolean
  private readonly currPlayerEq: TradeEquipment
  private readonly currPlayerId: string
  private readonly otherPlayerId: string
  private youOffer: TradeEquipment
  private youGet: TradeEquipment
  private youOfferPrevious: TradeEquipment
  private youGetPrevious: TradeEquipment
  private changesDone: number
  private isFirstOffer: boolean
  /* TradeBox */
  public static readonly tradeBoxWrapperID = 'tradeBoxWrapper'
  public static readonly tradeBoxHeaderWrapperID = 'tradeBoxHeaderWrapper'
  public static readonly tradeBoxHeaderID = 'tradeBoxHeader'
  public static readonly tradeBoxCloseButtonID = 'tradeBoxCloseButton'
  public static readonly tradeBoxCloseButtonActiveID = 'tradeBoxCloseButtonActive'
  /* TradeBox - Content */
  public static readonly tradeBoxContentID = 'tradeBoxContent'
  public static readonly tradeBoxContentLeftWrapperID = 'tradeBoxContentLeftWrapper'
  public static readonly tradeBoxContentLeftWrapperTitleWrapperID =
    'tradeBoxContentLeftWrapperTitleWrapper'
  public static readonly tradeBoxContentLeftWrapperTitleID = 'tradeBoxContentLeftWrapperTitle'
  public static readonly tradeBoxContentMiddleID = 'tradeBoxContentMiddle'
  public static readonly tradeBoxContentRightWrapperID = 'tradeBoxContentRightWrapper'
  public static readonly tradeBoxContentRightWrapperTitleWrapperID =
    'tradeBoxContentRightWrapperTitleWrapper'
  public static readonly tradeBoxContentRightWrapperTitleID = 'tradeBoxContentRightWrapperTitle'
  /* TradeBox - Propose Button */
  public static readonly tradeBoxProposeButtonExtraWrapperID = 'tradeBoxProposeButtonExtraWrapper'
  public static readonly tradeBoxProposeButtonWrapperID = 'tradeBoxProposeButtonWrapper'
  public static readonly tradeBoxProposeButtonID = 'tradeBoxProposeButton'
  /* TradeBox - Accept Button */
  public static readonly tradeBoxAcceptButtonExtraWrapperID = 'tradeBoxAcceptButtonExtraWrapper'
  public static readonly tradeBoxAcceptButtonWrapperID = 'tradeBoxAcceptButtonWrapper'
  public static readonly tradeBoxAcceptButtonID = 'tradeBoxAcceptButton'
  /* TradeBox - Remind Button */
  public static readonly tradeBoxRemindButtonExtraWrapperID = 'tradeBoxRemindButtonExtraWrapper'
  public static readonly tradeBoxRemindButtonWrapperID = 'tradeBoxRemindButtonWrapper'
  public static readonly tradeBoxRemindButtonID = 'tradeBoxRemindButton'
  /* HTML Elements */
  private readonly tradeBoxWrapper: HTMLDivElement
  private readonly tradeBoxCurrPlayerTurnHeader: HTMLHeadingElement
  private readonly tradeBoxProposeButtonExtraWrapper: HTMLDivElement
  private readonly tradeBoxProposeButtonWrapper: HTMLDivElement
  private readonly tradeBoxProposeButton: HTMLButtonElement
  private readonly tradeBoxAcceptButtonExtraWrapper: HTMLDivElement
  private readonly tradeBoxAcceptButtonWrapper: HTMLDivElement
  private readonly tradeBoxAcceptButton: HTMLButtonElement
  private readonly tradeBoxRemindButtonExtraWrapper: HTMLDivElement
  private readonly tradeBoxRemindButtonWrapper: HTMLDivElement
  private readonly tradeBoxRemindButton: HTMLButtonElement
  private readonly tradeBoxCloseButton: HTMLButtonElement
  private readonly tradeBoxCloseMessageButton: HTMLButtonElement
  private readonly resourceButtons: HTMLButtonElement[] = []
  /* Messages */
  private readonly tradeBoxReceivedMessageExtraWrapper: HTMLDivElement
  private readonly tradeBoxReceivedMessage: HTMLDivElement
  private readonly tradeBoxProposeMessageButtonExtraWrapper: HTMLDivElement
  private readonly tradeBoxProposeMessagesContainer: HTMLDivElement
  private readonly tradeBoxCloseMessagesContainer: HTMLDivElement
  /* Timeouts */
  private remindButtonTimeoutID: number | null = null

  constructor(
    scene: Scene,
    isCurrPlayerTurn: boolean,
    currPlayerId: string,
    currPlayerEq: TradeEquipment,
    otherPlayerId: string,
    resourceURL: string,
    resourceRepresentation: ClassResourceRepresentation[],
  ) {
    this.scene = scene
    this.currPlayerEq = currPlayerEq
    this.currPlayerId = currPlayerId
    this.otherPlayerId = otherPlayerId
    this.isCurrPlayerTurn = isCurrPlayerTurn
    this.resourceURL = resourceURL
    this.resourceRepresentation = resourceRepresentation
    this.cropper = new ImageCropper()
    this.youOffer = {
      money: 0,
      resources: currPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.youGet = {
      money: 0,
      resources: currPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.youOfferPrevious = {
      money: 0,
      resources: currPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.youGetPrevious = {
      money: 0,
      resources: currPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.changesDone = 0
    this.isFirstOffer = true

    // Wrapper
    this.tradeBoxWrapper = document.createElement('div')
    this.tradeBoxWrapper.id = TradeView.tradeBoxWrapperID

    // Header
    const tradeBoxHeaderWrapper = document.createElement('div')
    tradeBoxHeaderWrapper.id = TradeView.tradeBoxHeaderWrapperID

    const tradeBoxHeader = document.createElement('div')
    tradeBoxHeader.id = TradeView.tradeBoxHeaderID

    const workshopTitleHeader = document.createElement('h1')
    workshopTitleHeader.innerText = 'HANDEL'

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

    tradeBoxHeader.appendChild(leftArrows)
    tradeBoxHeader.appendChild(workshopTitleHeader)
    tradeBoxHeader.appendChild(rightArrows)
    tradeBoxHeaderWrapper.appendChild(tradeBoxHeader)

    // Close button
    this.tradeBoxCloseButton = document.createElement('button')
    this.tradeBoxCloseButton.id = TradeView.tradeBoxCloseButtonID
    this.tradeBoxCloseButton.addEventListener('click', () => {
      this.handleClose('')
    })
    const XIcon = document.createElement('i')
    XIcon.className = 'fa fa-times'
    XIcon.ariaHidden = 'true'
    XIcon.style.color = 'black'
    this.tradeBoxCloseButton.appendChild(XIcon)
    tradeBoxHeaderWrapper.appendChild(this.tradeBoxCloseButton)

    // Show/Hide close messages button
    this.tradeBoxCloseMessageButton = document.createElement('button')
    this.tradeBoxCloseMessageButton.id = 'tradeBoxCloseMessageButton'
    this.tradeBoxCloseMessageButton.addEventListener('click', () => {
      this.tradeBoxCloseMessagesContainer.style.display =
        this.tradeBoxCloseMessagesContainer.style.display === 'block' ? 'none' : 'block'
      this.tradeBoxCloseButton.id =
        this.tradeBoxCloseMessageButton.id === 'tradeBoxCloseMessageButtonActive'
          ? TradeView.tradeBoxCloseButtonID
          : TradeView.tradeBoxCloseButtonActiveID
      this.tradeBoxCloseMessageButton.id =
        this.tradeBoxCloseMessageButton.id === 'tradeBoxCloseMessageButtonActive'
          ? 'tradeBoxCloseMessageButton'
          : 'tradeBoxCloseMessageButtonActive'
    })
    const CloseChatIcon = document.createElement('i')
    CloseChatIcon.className = 'fa fa-comment'
    CloseChatIcon.ariaHidden = 'true'
    CloseChatIcon.style.color = 'black'
    this.tradeBoxCloseMessageButton.appendChild(CloseChatIcon)
    tradeBoxHeaderWrapper.appendChild(this.tradeBoxCloseMessageButton)

    // Close messages
    this.tradeBoxCloseMessagesContainer = document.createElement('div')
    this.tradeBoxCloseMessagesContainer.id = 'tradeBoxCloseMessagesContainer'

    const closePage1 = this.createMessagePage("first msg", "second msg", false, false, 'tradeCancel-page')
    closePage1.id = 'cancel-page-active'
    const closePage2 = this.createMessagePage("third msg", "forth msg", false, false, 'tradeCancel-page')

    this.tradeBoxCloseMessagesContainer.appendChild(closePage1)
    this.tradeBoxCloseMessagesContainer.appendChild(closePage2)

    const closePaginationBar = this.createPaginationBar(this.tradeBoxCloseMessagesContainer, 'tradeCancel-page', 'cancel-page-active', 0)
    this.tradeBoxCloseMessagesContainer.appendChild(closePaginationBar)

    tradeBoxHeaderWrapper.appendChild(this.tradeBoxCloseMessagesContainer)

    // Content
    const tradeBoxContent = document.createElement('div')
    tradeBoxContent.id = TradeView.tradeBoxContentID

    // Content left
    const tradeBoxContentLeftExtraWrapper = document.createElement('div')
    tradeBoxContentLeftExtraWrapper.id = 'tradeBoxContentLeftExtraWrapper'

    const tradeBoxContentLeftWrapper = document.createElement('div')
    tradeBoxContentLeftWrapper.id = TradeView.tradeBoxContentLeftWrapperID

    const tradeBoxContentLeftWrapperTitleExtraWrapper = document.createElement('div')
    tradeBoxContentLeftWrapperTitleExtraWrapper.id = 'tradeBoxContentLeftWrapperTitleExtraWrapper'
    const tradeBoxContentLeftWrapperTitleWrapper = document.createElement('div')
    tradeBoxContentLeftWrapperTitleWrapper.id = TradeView.tradeBoxContentLeftWrapperTitleWrapperID
    const tradeBoxContentLeftWrapperTitle = document.createElement('h2')
    tradeBoxContentLeftWrapperTitle.id = TradeView.tradeBoxContentLeftWrapperTitleID
    tradeBoxContentLeftWrapperTitle.innerText = 'Oferujesz'

    tradeBoxContentLeftWrapperTitleWrapper.appendChild(tradeBoxContentLeftWrapperTitle)
    tradeBoxContentLeftWrapperTitleExtraWrapper.appendChild(tradeBoxContentLeftWrapperTitleWrapper)

    const tradeBoxContentLeft = document.createElement('div')
    tradeBoxContentLeft.id = 'tradeBoxContentLeft'
    this.fillCurrentPlayerEq(currPlayerId, tradeBoxContentLeft, this.youOffer, currPlayerEq)

    tradeBoxContentLeftWrapper.appendChild(tradeBoxContentLeft)
    tradeBoxContentLeftExtraWrapper.appendChild(tradeBoxContentLeftWrapper)
    tradeBoxContentLeftExtraWrapper.appendChild(tradeBoxContentLeftWrapperTitleExtraWrapper)

    // Content right
    const tradeBoxContentRightExtraWrapper = document.createElement('div')
    tradeBoxContentRightExtraWrapper.id = 'tradeBoxContentRightExtraWrapper'

    const tradeBoxContentRightWrapper = document.createElement('div')
    tradeBoxContentRightWrapper.id = TradeView.tradeBoxContentRightWrapperID

    const tradeBoxContentRightWrapperTitleExtraWrapper = document.createElement('div')
    tradeBoxContentRightWrapperTitleExtraWrapper.id = 'tradeBoxContentRightWrapperTitleExtraWrapper'
    const tradeBoxContentRightWrapperTitleWrapper = document.createElement('div')
    tradeBoxContentRightWrapperTitleWrapper.id = TradeView.tradeBoxContentRightWrapperTitleWrapperID
    const tradeBoxContentRightWrapperTitle = document.createElement('h2')
    tradeBoxContentRightWrapperTitle.id = TradeView.tradeBoxContentRightWrapperTitleID
    tradeBoxContentRightWrapperTitle.innerText = 'Otrzymujesz'
    tradeBoxContentRightWrapperTitleWrapper.appendChild(tradeBoxContentRightWrapperTitle)
    tradeBoxContentRightWrapperTitleExtraWrapper.appendChild(
      tradeBoxContentRightWrapperTitleWrapper,
    )

    const tradeBoxContentRight = document.createElement('div')
    tradeBoxContentRight.id = 'tradeBoxContentRight'
    this.fillOtherPlayerEq(otherPlayerId, tradeBoxContentRight, this.youGet)

    this.tradeBoxReceivedMessageExtraWrapper = document.createElement('div')
    this.tradeBoxReceivedMessageExtraWrapper.id = 'tradeMessageReceivedExtraWrapper'
    this.tradeBoxReceivedMessageExtraWrapper.className = 'tradeMessageExtraWrapper'
    const tradeBoxReceivedMessageWrapper = document.createElement('div')
    tradeBoxReceivedMessageWrapper.className = 'tradeMessageWrapper'
    this.tradeBoxReceivedMessage = document.createElement('div')
    this.tradeBoxReceivedMessage.className = 'tradeMessage'
    this.tradeBoxReceivedMessage.innerText = ''

    this.tradeBoxReceivedMessageExtraWrapper.appendChild(tradeBoxReceivedMessageWrapper)
    tradeBoxReceivedMessageWrapper.appendChild(this.tradeBoxReceivedMessage)

    tradeBoxContentRightWrapper.appendChild(tradeBoxContentRight)
    tradeBoxContentRightExtraWrapper.appendChild(tradeBoxContentRightWrapper)
    tradeBoxContentRightExtraWrapper.appendChild(tradeBoxContentRightWrapperTitleExtraWrapper)
    tradeBoxContentRightExtraWrapper.appendChild(this.tradeBoxReceivedMessageExtraWrapper)

    // Content middle
    const tradeBoxContentMiddle = document.createElement('div')
    tradeBoxContentMiddle.id = TradeView.tradeBoxContentMiddleID

    const userTurnWrapper = document.createElement('div')
    userTurnWrapper.id = 'userTurnWrapper'
    this.tradeBoxCurrPlayerTurnHeader = document.createElement('h2')
    this.updatePlayerTurnElements()
    userTurnWrapper.appendChild(this.tradeBoxCurrPlayerTurnHeader)
    tradeBoxContentMiddle.appendChild(userTurnWrapper)

    const middleArrows = document.createElement('div')
    middleArrows.id = 'middleArrows'
    const middleArrowsLeft = document.createElement('img')
    middleArrowsLeft.src = '/assets/leftArrowCustomIcon.png'
    middleArrowsLeft.style.width = '100px'
    const middleArrowsRight = document.createElement('img')
    middleArrowsRight.src = '/assets/rightArrowCustomIcon.png'
    middleArrowsRight.style.width = '100px'
    middleArrows.appendChild(middleArrowsLeft)
    middleArrows.appendChild(middleArrowsRight)

    tradeBoxContentMiddle.appendChild(middleArrows)

    // Propose button
    const tradeBoxProposeContainer = document.createElement('div')

    this.tradeBoxProposeButtonExtraWrapper = document.createElement('div')
    this.tradeBoxProposeButtonExtraWrapper.id = TradeView.tradeBoxProposeButtonExtraWrapperID
    this.tradeBoxProposeButtonWrapper = document.createElement('div')
    this.tradeBoxProposeButtonWrapper.id = TradeView.tradeBoxProposeButtonWrapperID
    this.tradeBoxProposeButton = document.createElement('button')
    this.tradeBoxProposeButton.id = TradeView.tradeBoxProposeButtonID
    this.tradeBoxProposeButton.innerText = 'ZAPROPONUJ'
    this.tradeBoxProposeButton.addEventListener('click', () => {
      this.handlePropose('')
    })

    this.tradeBoxProposeButtonWrapper.appendChild(this.tradeBoxProposeButton)
    this.tradeBoxProposeButtonExtraWrapper.appendChild(this.tradeBoxProposeButtonWrapper)

    tradeBoxProposeContainer.appendChild(this.tradeBoxProposeButtonExtraWrapper)

  // Show/Hide propose messages button
  this.tradeBoxProposeMessageButtonExtraWrapper = document.createElement('div')
  this.tradeBoxProposeMessageButtonExtraWrapper.id = 'tradeBoxProposeMessageButtonExtraWrapper'
  const tradeBoxProposeMessageButtonWrapper = document.createElement('div')
  tradeBoxProposeMessageButtonWrapper.id = 'tradeBoxProposeMessageButtonWrapper'
  const tradeBoxProposeMessageButton = document.createElement('button')
  tradeBoxProposeMessageButton.id = 'tradeBoxProposeMessageButton'
  tradeBoxProposeMessageButton.addEventListener('click', () => {
    this.tradeBoxProposeMessagesContainer.style.display =
      this.tradeBoxProposeMessagesContainer.style.display === 'block' ? 'none' : 'block'
    this.tradeBoxProposeMessageButtonExtraWrapper.id =
      this.tradeBoxProposeMessageButtonExtraWrapper.id ===
      'tradeBoxProposeMessageButtonExtraWrapper'
        ? 'tradeBoxProposeMessageButtonExtraWrapperActive'
        : 'tradeBoxProposeMessageButtonExtraWrapper'
    this.tradeBoxProposeButtonExtraWrapper.className =
      this.tradeBoxProposeButtonExtraWrapper.className ===
      'tradeBoxMiddleButtonExtraWrapperEnabledActive'
        ? 'tradeBoxMiddleButtonExtraWrapperEnabled'
        : 'tradeBoxMiddleButtonExtraWrapperEnabledActive'
    this.tradeBoxProposeButtonWrapper.className =
      this.tradeBoxProposeButtonWrapper.className === 'tradeBoxMiddleButtonWrapperEnabledActive'
        ? 'tradeBoxMiddleButtonWrapperEnabled'
        : 'tradeBoxMiddleButtonWrapperEnabledActive'
    this.tradeBoxProposeButton.className =
      this.tradeBoxProposeButton.className === 'tradeBoxMiddleButtonEnabledActive'
        ? 'tradeBoxMiddleButtonEnabled'
        : 'tradeBoxMiddleButtonEnabledActive'
  })
  const ProposeChatIcon = document.createElement('i')
  ProposeChatIcon.className = 'fa fa-comment'
  ProposeChatIcon.ariaHidden = 'true'
  ProposeChatIcon.style.color = 'black'
  tradeBoxProposeMessageButton.appendChild(ProposeChatIcon)
  tradeBoxProposeMessageButtonWrapper.appendChild(tradeBoxProposeMessageButton)
  this.tradeBoxProposeMessageButtonExtraWrapper.appendChild(tradeBoxProposeMessageButtonWrapper)

  tradeBoxProposeContainer.appendChild(this.tradeBoxProposeMessageButtonExtraWrapper)

  tradeBoxContentMiddle.appendChild(tradeBoxProposeContainer)

  // Propose messages
  this.tradeBoxProposeMessagesContainer = document.createElement('div')
  this.tradeBoxProposeMessagesContainer.id = 'tradeBoxMessagesContainer'
  
  const page1 = this.createMessagePage("first msg", "second msg", false, true, 'tradePropose-page')
  page1.id = 'propose-page-active'
  const page2 = this.createMessagePage("third msg", "forth msg", false, true, 'tradePropose-page')
  const page3 = this.createMessagePage("fifth msg", null, false, true, 'tradePropose-page')

  this.tradeBoxProposeMessagesContainer.appendChild(page1)
  this.tradeBoxProposeMessagesContainer.appendChild(page2)
  this.tradeBoxProposeMessagesContainer.appendChild(page3)

  const paginationBar = this.createPaginationBar(this.tradeBoxProposeMessagesContainer, 'tradePropose-page', 'propose-page-active', 0)
  this.tradeBoxProposeMessagesContainer.appendChild(paginationBar)

  tradeBoxContentMiddle.appendChild(this.tradeBoxProposeMessagesContainer)

    // Accept button
    this.tradeBoxAcceptButtonExtraWrapper = document.createElement('div')
    this.tradeBoxAcceptButtonExtraWrapper.id = TradeView.tradeBoxAcceptButtonExtraWrapperID
    this.tradeBoxAcceptButtonWrapper = document.createElement('div')
    this.tradeBoxAcceptButtonWrapper.id = TradeView.tradeBoxAcceptButtonWrapperID
    this.tradeBoxAcceptButton = document.createElement('button')
    this.tradeBoxAcceptButton.id = TradeView.tradeBoxAcceptButtonID
    this.tradeBoxAcceptButton.innerText = 'POTWIERDŹ'
    this.tradeBoxAcceptButton.addEventListener('click', () => {
      if (this.isCurrPlayerTurn) {
        this.tradeBoxAcceptButtonExtraWrapper.className =
          this.tradeBoxAcceptButtonExtraWrapper.className ===
          'tradeBoxMiddleButtonExtraWrapperEnabledActive'
            ? 'tradeBoxMiddleButtonExtraWrapperEnabled'
            : 'tradeBoxMiddleButtonExtraWrapperEnabledActive'

        this.tradeBoxAcceptButtonWrapper.className =
          this.tradeBoxAcceptButtonWrapper.className === 'tradeBoxMiddleButtonWrapperEnabledActive'
            ? 'tradeBoxMiddleButtonWrapperEnabled'
            : 'tradeBoxMiddleButtonWrapperEnabledActive'

        this.tradeBoxAcceptButton.className =
          this.tradeBoxAcceptButton.className === 'tradeBoxMiddleButtonEnabledActive'
            ? 'tradeBoxMiddleButtonEnabled'
            : 'tradeBoxMiddleButtonEnabledActive'

        scene.finishTrade(this.youOffer, this.youGet)
      }
    })

    this.tradeBoxAcceptButtonWrapper.appendChild(this.tradeBoxAcceptButton)
    this.tradeBoxAcceptButtonExtraWrapper.appendChild(this.tradeBoxAcceptButtonWrapper)
    tradeBoxContentMiddle.appendChild(this.tradeBoxAcceptButtonExtraWrapper)

    // Remind button
    this.tradeBoxRemindButtonExtraWrapper = document.createElement('div')
    this.tradeBoxRemindButtonExtraWrapper.id = TradeView.tradeBoxRemindButtonExtraWrapperID
    this.tradeBoxRemindButtonWrapper = document.createElement('div')
    this.tradeBoxRemindButtonWrapper.id = TradeView.tradeBoxRemindButtonWrapperID
    this.tradeBoxRemindButton = document.createElement('button')
    this.tradeBoxRemindButton.id = TradeView.tradeBoxRemindButtonID
    this.tradeBoxRemindButton.innerText = 'PRZYPOMNIJ'
    this.tradeBoxRemindButton.addEventListener('click', () => {
      if (!this.isCurrPlayerTurn) {
        this.tradeBoxRemindButtonExtraWrapper.className =
          this.tradeBoxRemindButtonExtraWrapper.className ===
          'tradeBoxMiddleButtonExtraWrapperEnabledActive'
            ? 'tradeBoxMiddleButtonExtraWrapperEnabled'
            : 'tradeBoxMiddleButtonExtraWrapperEnabledActive'

        this.tradeBoxRemindButtonWrapper.className =
          this.tradeBoxRemindButtonWrapper.className === 'tradeBoxMiddleButtonWrapperEnabledActive'
            ? 'tradeBoxMiddleButtonWrapperEnabled'
            : 'tradeBoxMiddleButtonWrapperEnabledActive'

        this.tradeBoxRemindButton.className =
          this.tradeBoxRemindButton.className === 'tradeBoxMiddleButtonEnabledActive'
            ? 'tradeBoxMiddleButtonEnabled'
            : 'tradeBoxMiddleButtonEnabledActive'

        this.remind()
        this.disableRemindButton()
        this.remindButtonTimeoutID = setTimeout(() => {
          this.enableRemindButton()
        }, 5000)
      }
    })

    this.tradeBoxRemindButtonWrapper.appendChild(this.tradeBoxRemindButton)
    this.tradeBoxRemindButtonExtraWrapper.appendChild(this.tradeBoxRemindButtonWrapper)
    tradeBoxContentMiddle.appendChild(this.tradeBoxRemindButtonExtraWrapper)

    // Append elements
    tradeBoxContent.appendChild(tradeBoxContentLeftExtraWrapper)
    tradeBoxContent.appendChild(tradeBoxContentMiddle)
    tradeBoxContent.appendChild(tradeBoxContentRightExtraWrapper)
    this.tradeBoxWrapper.appendChild(tradeBoxHeaderWrapper)
    this.tradeBoxWrapper.appendChild(tradeBoxContent)

    // Disable buttons
    this.disableProposeButton()
    this.disableAcceptButton()
    this.disableRemindButton()

    // Hide messages
    this.hideReceivedMessage()
    this.hideCloseMessages()

    if (!this.isCurrPlayerTurn) {
      this.remindButtonTimeoutID = setTimeout(() => {
        this.enableRemindButton()
      }, 20000)
    }
  }

  public update(youOffer: TradeEquipment, youGet: TradeEquipment, msg: string): void {
    this.hideReceivedMessage()

    if (this.remindButtonTimeoutID) {
      clearTimeout(this.remindButtonTimeoutID)
      this.remindButtonTimeoutID = !this.isCurrPlayerTurn
        ? setTimeout(() => {
            this.enableRemindButton()
          }, 60000)
        : null
    }

    this.youOffer = youOffer
    this.youGet = youGet
    this.changesDone = 0
    this.isFirstOffer = false

    document.getElementById('tradeBoxContentLeft')?.remove()
    const tradeBoxContentLeft = document.createElement('div')
    tradeBoxContentLeft.id = 'tradeBoxContentLeft'
    this.fillCurrentPlayerEq(
      this.currPlayerId,
      tradeBoxContentLeft,
      this.youOffer,
      this.currPlayerEq,
    )
    document.getElementById('tradeBoxContentLeftWrapper')?.appendChild(tradeBoxContentLeft)

    document.getElementById('tradeBoxContentRight')?.remove()
    const tradeBoxContentRight = document.createElement('div')
    tradeBoxContentRight.id = 'tradeBoxContentRight'
    this.fillOtherPlayerEq(this.otherPlayerId, tradeBoxContentRight, this.youGet)
    document.getElementById('tradeBoxContentRightWrapper')?.appendChild(tradeBoxContentRight)

    if (
      this.youOffer.money <= this.currPlayerEq.money &&
      this.youOffer.resources.every(
        (resource) =>
          resource.value <= this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
      )
    ) {
      this.enableAcceptButton()
    } else {
      this.disableAcceptButton()
    }

    this.disableProposeButton()
    this.disableRemindButton()

    if (msg.length > 0) {
      this.showReceivedMessage(msg)
    } else {
      this.hideReceivedMessage()
    }
  }

  private fillCurrentPlayerEq(
    playerId: string,
    container: HTMLDivElement,
    currentState: TradeEquipment,
    limitedState: TradeEquipment,
  ): void {
    const bid = JSON.parse(JSON.stringify(currentState))

    const userName = document.createElement('h3')
    userName.innerText =
      playerId.length > TradeView.maxPlayerIdLength
        ? playerId.slice(0, TradeView.maxPlayerIdLength) + '...'
        : playerId
    container.appendChild(userName)

    const lineSeparator = document.createElement('hr')
    container.appendChild(lineSeparator)

    const resourcesWrapper = document.createElement('div')
    resourcesWrapper.id = 'tradeBoxContentLeftResources'
    for (const resource of currentState.resources) {
      const upperBoundary = limitedState.resources.find((item) => item.key === resource.key)!.value

      const resourceContainer = document.createElement('div')

      const resourceIconWrapper = document.createElement('div')
      const resourceIcon = this.cropper.crop(
        25,
        25,
        1,
        this.resourceURL,
        this.resourceRepresentation.length,
        getResourceMapping(this.resourceRepresentation)(resource.key),
        false,
      )
      resourceIconWrapper.appendChild(resourceIcon)
      resourceContainer.appendChild(resourceIconWrapper)

      const resourceValueWrapper = document.createElement('div')
      const valueWrapper = document.createElement('div')
      const value = document.createElement('h4')
      value.innerText = `${resource.value}`
      value.style.color = resource.value > upperBoundary ? 'red' : 'black'
      valueWrapper.appendChild(value)

      const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
      const plus = document.createElement('i')
      plus.className = 'fa fa-plus'
      plus.ariaHidden = 'true'
      tradeBoxPlayerOfferEqItemBtnUp.appendChild(plus)
      tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
        if (this.isCurrPlayerTurn && upperBoundary > resource.value) {
          value.innerText = `${parseInt(value.innerText) + 1}`
          resource.value += 1
          value.style.color = resource.value > upperBoundary ? 'red' : 'black'

          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value + 1
          ) {
            this.changesDone += 1
          }
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          ) {
            this.changesDone -= 1
          }

          if (
            this.changesDone !== 0 &&
            (this.youGet.resources.some((resource) => resource.value > 0) ||
              this.youOffer.resources.some((resource) => resource.value > 0) ||
              this.youGet.money > 0 ||
              this.youOffer.money > 0)
          ) {
            if (
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableProposeButton()
            }
            if (!this.isFirstOffer) {
              this.disableAcceptButton()
            }
          } else if (this.changesDone !== 0) {
            this.disableProposeButton()
            this.disableAcceptButton()
          } else {
            this.disableProposeButton()
            if (
              !this.isFirstOffer &&
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableAcceptButton()
            }
          }

          if (resource.value === 0) {
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}`)!.style.display =
              'none'
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}-value`)!.innerText =
              '0'
          } else {
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}`)!.style.display =
              'flex'
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}-value`)!.innerText =
              `${resource.value}`
          }

          this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
        }
      })
      this.resourceButtons.push(tradeBoxPlayerOfferEqItemBtnUp)

      const tradeBoxPlayerOfferEqItemBtnDown = document.createElement('button')
      const minus = document.createElement('i')
      minus.className = 'fa fa-minus'
      minus.ariaHidden = 'true'
      tradeBoxPlayerOfferEqItemBtnDown.appendChild(minus)
      tradeBoxPlayerOfferEqItemBtnDown.addEventListener('click', () => {
        if (this.isCurrPlayerTurn && resource.value > 0) {
          value.innerText = `${parseInt(value.innerText) - 1}`
          resource.value -= 1
          value.style.color = resource.value > upperBoundary ? 'red' : 'black'

          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value - 1
          ) {
            this.changesDone += 1
          }
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          ) {
            this.changesDone -= 1
          }

          if (
            this.changesDone !== 0 &&
            (this.youGet.resources.some((resource) => resource.value > 0) ||
              this.youOffer.resources.some((resource) => resource.value > 0) ||
              this.youGet.money > 0 ||
              this.youOffer.money > 0)
          ) {
            if (
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableProposeButton()
            }
            if (!this.isFirstOffer) {
              this.disableAcceptButton()
            }
          } else if (this.changesDone !== 0) {
            this.disableProposeButton()
            this.disableAcceptButton()
          } else {
            this.disableProposeButton()
            if (
              !this.isFirstOffer &&
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableAcceptButton()
            }
          }

          if (resource.value === 0) {
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}`)!.style.display =
              'none'
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}-value`)!.innerText =
              '0'
          } else {
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}`)!.style.display =
              'flex'
            document.getElementById(`tradeBoxContentLeftResult-${resource.key}-value`)!.innerText =
              `${resource.value}`
          }

          this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
        }
      })
      this.resourceButtons.push(tradeBoxPlayerOfferEqItemBtnDown)

      resourceValueWrapper.appendChild(tradeBoxPlayerOfferEqItemBtnDown)
      resourceValueWrapper.appendChild(valueWrapper)
      resourceValueWrapper.appendChild(tradeBoxPlayerOfferEqItemBtnUp)
      resourceContainer.appendChild(resourceValueWrapper)

      resourcesWrapper.appendChild(resourceContainer)
    }

    const moneyContainer = document.createElement('div')

    const moneyIconWrapper = document.createElement('div')
    const moneyIcon = document.createElement('img')
    moneyIcon.src = '/assets/coinCustomIcon.png'
    moneyIcon.style.width = '25px'
    moneyIconWrapper.appendChild(moneyIcon)
    moneyContainer.appendChild(moneyIconWrapper)

    const moneyValueWrapper = document.createElement('div')
    const valueWrapper = document.createElement('div')
    const value = document.createElement('h4')
    value.innerText = `${currentState.money}`
    value.style.color = currentState.money > this.currPlayerEq.money ? 'red' : 'black'
    valueWrapper.appendChild(value)

    const tradeBoxPlayerOfferEqMoneyBtnUp = document.createElement('button')
    const plus = document.createElement('i')
    plus.className = 'fa fa-plus'
    plus.ariaHidden = 'true'
    tradeBoxPlayerOfferEqMoneyBtnUp.appendChild(plus)
    tradeBoxPlayerOfferEqMoneyBtnUp.addEventListener('click', () => {
      if (this.isCurrPlayerTurn && this.currPlayerEq.money > currentState.money) {
        value.innerText = `${parseInt(value.innerText) + 1}`
        currentState.money += 1
        value.style.color = currentState.money > this.currPlayerEq.money ? 'red' : 'black'

        if (currentState.money === bid.money + 1) {
          this.changesDone += 1
        }
        if (currentState.money === bid.money) {
          this.changesDone -= 1
        }
        if (
          this.changesDone !== 0 &&
          (this.youGet.resources.some((resource) => resource.value > 0) ||
            this.youOffer.resources.some((resource) => resource.value > 0) ||
            this.youGet.money > 0 ||
            this.youOffer.money > 0)
        ) {
          if (
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableProposeButton()
          }
          if (!this.isFirstOffer) {
            this.disableAcceptButton()
          }
        } else if (this.changesDone !== 0) {
          this.disableProposeButton()
          this.disableAcceptButton()
        } else {
          this.disableProposeButton()
          if (
            !this.isFirstOffer &&
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableAcceptButton()
          }
        }

        if (currentState.money === 0) {
          document.getElementById('tradeBoxContentLeftResult-money')!.style.display = 'none'
          document.getElementById('tradeBoxContentLeftResult-money-value')!.innerText = '0'
        } else {
          document.getElementById('tradeBoxContentLeftResult-money')!.style.display = 'flex'
          document.getElementById('tradeBoxContentLeftResult-money-value')!.innerText =
            `${currentState.money}`
        }

        this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
      }
    })
    this.resourceButtons.push(tradeBoxPlayerOfferEqMoneyBtnUp)

    const tradeBoxPlayerOfferEqMoneyBtnDown = document.createElement('button')
    const minus = document.createElement('i')
    minus.className = 'fa fa-minus'
    minus.ariaHidden = 'true'
    tradeBoxPlayerOfferEqMoneyBtnDown.appendChild(minus)
    tradeBoxPlayerOfferEqMoneyBtnDown.addEventListener('click', () => {
      if (this.isCurrPlayerTurn && currentState.money > 0) {
        value.innerText = `${parseInt(value.innerText) - 1}`
        currentState.money -= 1
        value.style.color = currentState.money > this.currPlayerEq.money ? 'red' : 'black'

        if (currentState.money === bid.money - 1) {
          this.changesDone += 1
        }
        if (currentState.money === bid.money) {
          this.changesDone -= 1
        }
        if (
          this.changesDone !== 0 &&
          (this.youGet.resources.some((resource) => resource.value > 0) ||
            this.youOffer.resources.some((resource) => resource.value > 0) ||
            this.youGet.money > 0 ||
            this.youOffer.money > 0)
        ) {
          if (
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableProposeButton()
          }
          if (!this.isFirstOffer) {
            this.disableAcceptButton()
          }
        } else if (this.changesDone !== 0) {
          this.disableProposeButton()
          this.disableAcceptButton()
        } else {
          this.disableProposeButton()
          if (
            !this.isFirstOffer &&
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableAcceptButton()
          }
        }

        if (currentState.money === 0) {
          document.getElementById('tradeBoxContentLeftResult-money')!.style.display = 'none'
          document.getElementById('tradeBoxContentLeftResult-money-value')!.innerText = '0'
        } else {
          document.getElementById('tradeBoxContentLeftResult-money')!.style.display = 'flex'
          document.getElementById('tradeBoxContentLeftResult-money-value')!.innerText =
            `${currentState.money}`
        }

        this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
      }
    })
    this.resourceButtons.push(tradeBoxPlayerOfferEqMoneyBtnDown)

    moneyValueWrapper.appendChild(tradeBoxPlayerOfferEqMoneyBtnDown)
    moneyValueWrapper.appendChild(valueWrapper)
    moneyValueWrapper.appendChild(tradeBoxPlayerOfferEqMoneyBtnUp)
    moneyContainer.appendChild(moneyValueWrapper)

    resourcesWrapper.appendChild(moneyContainer)

    container.appendChild(resourcesWrapper)

    const resultExtraWrapper = document.createElement('div')
    resultExtraWrapper.id = 'tradeBoxContentLeftResultExtraWrapper'
    const resultWrapper = document.createElement('div')
    resultWrapper.id = 'tradeBoxContentLeftResultWrapper'
    const result = document.createElement('div')
    result.id = 'tradeBoxContentLeftResult'

    for (const resource of currentState.resources) {
      const resultResourceContainer = document.createElement('div')
      resultResourceContainer.id = `tradeBoxContentLeftResult-${resource.key}`

      const resultResourceIconWrapper = document.createElement('div')
      const resultResourceIcon = this.cropper.crop(
        25,
        25,
        1,
        this.resourceURL,
        this.resourceRepresentation.length,
        getResourceMapping(this.resourceRepresentation)(resource.key),
        false,
      )
      resultResourceIconWrapper.appendChild(resultResourceIcon)
      resultResourceContainer.appendChild(resultResourceIconWrapper)

      const valueWrapper = document.createElement('div')
      const value = document.createElement('h4')
      value.id = `tradeBoxContentLeftResult-${resource.key}-value`
      value.innerText = `${resource.value}`
      valueWrapper.appendChild(value)
      resultResourceContainer.appendChild(valueWrapper)

      const exclamationMark = document.createElement('h4')
      exclamationMark.innerText = '!'
      exclamationMark.id = `tradeBoxContentLeftResult-${resource.key}-exclamationMark`
      exclamationMark.className = 'tradeBoxContentResultExclamationMark'
      resultResourceContainer.appendChild(exclamationMark)
      if (
        !this.isFirstOffer &&
        resource.value !==
        this.youOfferPrevious.resources.find((r) => r.key === resource.key)!.value
      ) {
        exclamationMark.style.display = 'block'
      } else {
        exclamationMark.style.display = 'none'
      }

      result.appendChild(resultResourceContainer)

      if (resource.value > 0) {
        resultResourceContainer.style.display = 'flex'
      } else {
        resultResourceContainer.style.display = 'none'
      }
    }

    const resultResourceContainer = document.createElement('div')
    resultResourceContainer.id = `tradeBoxContentLeftResult-money`

    const resultMoneyIconWrapper = document.createElement('div')
    const resultMoneyIcon = document.createElement('img')
    resultMoneyIcon.src = '/assets/coinCustomIcon.png'
    resultMoneyIcon.style.width = '25px'
    resultMoneyIconWrapper.appendChild(resultMoneyIcon)
    resultResourceContainer.appendChild(resultMoneyIconWrapper)

    const resultValueWrapper = document.createElement('div')
    const resultValue = document.createElement('h4')
    resultValue.id = `tradeBoxContentLeftResult-money-value`
    resultValue.innerText = `${currentState.money}`
    resultValueWrapper.appendChild(resultValue)
    resultResourceContainer.appendChild(resultValueWrapper)

    const exclamationMark = document.createElement('h4')
    exclamationMark.innerText = '!'
    exclamationMark.id = 'tradeBoxContentLeftResult-money-exclamationMark'
    exclamationMark.className = 'tradeBoxContentResultExclamationMark'
    resultResourceContainer.appendChild(exclamationMark)
    if (!this.isFirstOffer && currentState.money !== this.youOfferPrevious.money) {
      exclamationMark.style.display = 'block'
    } else {
      exclamationMark.style.display = 'none'
    }

    result.appendChild(resultResourceContainer)
    if (currentState.money > 0) {
      resultResourceContainer.style.display = 'flex'
    } else {
      resultResourceContainer.style.display = 'none'
    }

    resultWrapper.appendChild(result)

    if (this.isCurrPlayerTurn) {
      result.style.display = 'flex'
    } else {
      result.style.display = 'none'
    }

    resultExtraWrapper.appendChild(resultWrapper)
    container.appendChild(resultExtraWrapper)
  }

  private fillOtherPlayerEq(
    playerId: string,
    container: HTMLDivElement,
    currentState: TradeEquipment,
  ): void {
    const bid = JSON.parse(JSON.stringify(currentState))

    const userName = document.createElement('h3')
    userName.innerText =
      playerId.length > TradeView.maxPlayerIdLength
        ? playerId.slice(0, TradeView.maxPlayerIdLength) + '...'
        : playerId
    container.appendChild(userName)

    const lineSeparator = document.createElement('hr')
    container.appendChild(lineSeparator)

    const resourcesWrapper = document.createElement('div')
    resourcesWrapper.id = 'tradeBoxContentRightResources'

    for (const resource of currentState.resources) {
      const resourceContainer = document.createElement('div')

      const resourceIconWrapper = document.createElement('div')
      const resourceIcon = this.cropper.crop(
        25,
        25,
        1,
        this.resourceURL,
        this.resourceRepresentation.length,
        getResourceMapping(this.resourceRepresentation)(resource.key),
        false,
      )
      resourceIconWrapper.appendChild(resourceIcon)
      resourceContainer.appendChild(resourceIconWrapper)

      const resourceValueWrapper = document.createElement('div')
      const valueWrapper = document.createElement('div')
      const value = document.createElement('h4')
      value.innerText = `${resource.value}`
      valueWrapper.appendChild(value)

      const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
      const plus = document.createElement('i')
      plus.className = 'fa fa-plus'
      plus.ariaHidden = 'true'
      tradeBoxPlayerOfferEqItemBtnUp.appendChild(plus)
      tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
        if (this.isCurrPlayerTurn) {
          value.innerText = `${parseInt(value.innerText) + 1}`
          resource.value += 1

          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value + 1
          ) {
            this.changesDone += 1
          }
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          ) {
            this.changesDone -= 1
          }

          if (
            this.changesDone !== 0 &&
            (this.youGet.resources.some((resource) => resource.value > 0) ||
              this.youOffer.resources.some((resource) => resource.value > 0) ||
              this.youGet.money > 0 ||
              this.youOffer.money > 0)
          ) {
            if (
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableProposeButton()
            }
            if (!this.isFirstOffer) {
              this.disableAcceptButton()
            }
          } else if (this.changesDone !== 0) {
            this.disableProposeButton()
            this.disableAcceptButton()
          } else {
            this.disableProposeButton()
            if (
              !this.isFirstOffer &&
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableAcceptButton()
            }
          }

          if (resource.value === 0) {
            document.getElementById(`tradeBoxContentRightResult-${resource.key}`)!.style.display =
              'none'
            document.getElementById(`tradeBoxContentRightResult-${resource.key}-value`)!.innerText =
              '0'
          } else {
            document.getElementById(`tradeBoxContentRightResult-${resource.key}`)!.style.display =
              'flex'
            document.getElementById(`tradeBoxContentRightResult-${resource.key}-value`)!.innerText =
              `${resource.value}`
          }

          this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
        }
      })
      this.resourceButtons.push(tradeBoxPlayerOfferEqItemBtnUp)

      const tradeBoxPlayerOfferEqItemBtnDown = document.createElement('button')
      const minus = document.createElement('i')
      minus.className = 'fa fa-minus'
      minus.ariaHidden = 'true'
      tradeBoxPlayerOfferEqItemBtnDown.appendChild(minus)
      tradeBoxPlayerOfferEqItemBtnDown.addEventListener('click', () => {
        if (this.isCurrPlayerTurn && resource.value > 0) {
          value.innerText = `${parseInt(value.innerText) - 1}`
          resource.value -= 1

          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value - 1
          ) {
            this.changesDone += 1
          }
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          ) {
            this.changesDone -= 1
          }

          if (
            this.changesDone !== 0 &&
            (this.youGet.resources.some((resource) => resource.value > 0) ||
              this.youOffer.resources.some((resource) => resource.value > 0) ||
              this.youGet.money > 0 ||
              this.youOffer.money > 0)
          ) {
            if (
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableProposeButton()
            }
            if (!this.isFirstOffer) {
              this.disableAcceptButton()
            }
          } else if (this.changesDone !== 0) {
            this.disableProposeButton()
            this.disableAcceptButton()
          } else {
            this.disableProposeButton()
            if (
              !this.isFirstOffer &&
              this.youOffer.money <= this.currPlayerEq.money &&
              this.youOffer.resources.every(
                (resource) =>
                  resource.value <=
                  this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
              )
            ) {
              this.enableAcceptButton()
            }
          }

          if (resource.value === 0) {
            document.getElementById(`tradeBoxContentRightResult-${resource.key}`)!.style.display =
              'none'
            document.getElementById(`tradeBoxContentRightResult-${resource.key}-value`)!.innerText =
              '0'
          } else {
            document.getElementById(`tradeBoxContentRightResult-${resource.key}`)!.style.display =
              'flex'
            document.getElementById(`tradeBoxContentRightResult-${resource.key}-value`)!.innerText =
              `${resource.value}`
          }

          this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
        }
      })
      this.resourceButtons.push(tradeBoxPlayerOfferEqItemBtnDown)

      resourceValueWrapper.appendChild(tradeBoxPlayerOfferEqItemBtnDown)
      resourceValueWrapper.appendChild(valueWrapper)
      resourceValueWrapper.appendChild(tradeBoxPlayerOfferEqItemBtnUp)
      resourceContainer.appendChild(resourceValueWrapper)

      resourcesWrapper.appendChild(resourceContainer)
    }

    const moneyContainer = document.createElement('div')

    const moneyIconWrapper = document.createElement('div')
    const moneyIcon = document.createElement('img')
    moneyIcon.src = '/assets/coinCustomIcon.png'
    moneyIcon.style.width = '25px'
    moneyIconWrapper.appendChild(moneyIcon)
    moneyContainer.appendChild(moneyIconWrapper)

    const moneyValueWrapper = document.createElement('div')
    const valueWrapper = document.createElement('div')
    const value = document.createElement('h4')
    value.innerText = `${currentState.money}`
    valueWrapper.appendChild(value)

    const tradeBoxPlayerOfferEqMoneyBtnUp = document.createElement('button')
    const plus = document.createElement('i')
    plus.className = 'fa fa-plus'
    plus.ariaHidden = 'true'
    tradeBoxPlayerOfferEqMoneyBtnUp.appendChild(plus)
    tradeBoxPlayerOfferEqMoneyBtnUp.addEventListener('click', () => {
      if (this.isCurrPlayerTurn) {
        value.innerText = `${parseInt(value.innerText) + 1}`
        currentState.money += 1

        if (currentState.money === bid.money + 1) {
          this.changesDone += 1
        }
        if (currentState.money === bid.money) {
          this.changesDone -= 1
        }

        if (
          this.changesDone !== 0 &&
          (this.youGet.resources.some((resource) => resource.value > 0) ||
            this.youOffer.resources.some((resource) => resource.value > 0) ||
            this.youGet.money > 0 ||
            this.youOffer.money > 0)
        ) {
          if (
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableProposeButton()
          }
          if (!this.isFirstOffer) {
            this.disableAcceptButton()
          }
        } else if (this.changesDone !== 0) {
          this.disableProposeButton()
          this.disableAcceptButton()
        } else {
          this.disableProposeButton()
          if (
            !this.isFirstOffer &&
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableAcceptButton()
          }
        }

        if (currentState.money === 0) {
          document.getElementById('tradeBoxContentRightResult-money')!.style.display = 'none'
          document.getElementById('tradeBoxContentRightResult-money-value')!.innerText = '0'
        } else {
          document.getElementById('tradeBoxContentRightResult-money')!.style.display = 'flex'
          document.getElementById('tradeBoxContentRightResult-money-value')!.innerText =
            `${currentState.money}`
        }

        this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
      }
    })
    this.resourceButtons.push(tradeBoxPlayerOfferEqMoneyBtnUp)

    const tradeBoxPlayerOfferEqMoneyBtnDown = document.createElement('button')
    const minus = document.createElement('i')
    minus.className = 'fa fa-minus'
    minus.ariaHidden = 'true'
    tradeBoxPlayerOfferEqMoneyBtnDown.appendChild(minus)
    tradeBoxPlayerOfferEqMoneyBtnDown.addEventListener('click', () => {
      if (this.isCurrPlayerTurn && currentState.money > 0) {
        value.innerText = `${parseInt(value.innerText) - 1}`
        currentState.money -= 1

        if (currentState.money === bid.money - 1) {
          this.changesDone += 1
        }
        if (currentState.money === bid.money) {
          this.changesDone -= 1
        }

        if (
          this.changesDone !== 0 &&
          (this.youGet.resources.some((resource) => resource.value > 0) ||
            this.youOffer.resources.some((resource) => resource.value > 0) ||
            this.youGet.money > 0 ||
            this.youOffer.money > 0)
        ) {
          if (
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableProposeButton()
          }
          if (!this.isFirstOffer) {
            this.disableAcceptButton()
          }
        } else if (this.changesDone !== 0) {
          this.disableProposeButton()
          this.disableAcceptButton()
        } else {
          this.disableProposeButton()
          if (
            !this.isFirstOffer &&
            this.youOffer.money <= this.currPlayerEq.money &&
            this.youOffer.resources.every(
              (resource) =>
                resource.value <=
                this.currPlayerEq.resources.find((r) => r.key === resource.key)!.value,
            )
          ) {
            this.enableAcceptButton()
          }
        }

        if (currentState.money === 0) {
          document.getElementById('tradeBoxContentRightResult-money')!.style.display = 'none'
          document.getElementById('tradeBoxContentRightResult-money-value')!.innerText = '0'
        } else {
          document.getElementById('tradeBoxContentRightResult-money')!.style.display = 'flex'
          document.getElementById('tradeBoxContentRightResult-money-value')!.innerText =
            `${currentState.money}`
        }

        this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
      }
    })
    this.resourceButtons.push(tradeBoxPlayerOfferEqMoneyBtnDown)

    moneyValueWrapper.appendChild(tradeBoxPlayerOfferEqMoneyBtnDown)
    moneyValueWrapper.appendChild(valueWrapper)
    moneyValueWrapper.appendChild(tradeBoxPlayerOfferEqMoneyBtnUp)
    moneyContainer.appendChild(moneyValueWrapper)

    resourcesWrapper.appendChild(moneyContainer)
    container.appendChild(resourcesWrapper)

    const resultExtraWrapper = document.createElement('div')
    resultExtraWrapper.id = 'tradeBoxContentRightResultExtraWrapper'
    const resultWrapper = document.createElement('div')
    resultWrapper.id = 'tradeBoxContentRightResultWrapper'
    const result = document.createElement('div')
    result.id = 'tradeBoxContentRightResult'

    for (const resource of currentState.resources) {
      const resultResourceContainer = document.createElement('div')
      resultResourceContainer.id = `tradeBoxContentRightResult-${resource.key}`

      const resultResourceIconWrapper = document.createElement('div')
      const resultResourceIcon = this.cropper.crop(
        25,
        25,
        1,
        this.resourceURL,
        this.resourceRepresentation.length,
        getResourceMapping(this.resourceRepresentation)(resource.key),
        false,
      )
      resultResourceIconWrapper.appendChild(resultResourceIcon)
      resultResourceContainer.appendChild(resultResourceIconWrapper)

      const valueWrapper = document.createElement('div')
      const value = document.createElement('h4')
      value.id = `tradeBoxContentRightResult-${resource.key}-value`
      value.innerText = `${resource.value}`
      valueWrapper.appendChild(value)
      resultResourceContainer.appendChild(valueWrapper)

      const exclamationMark = document.createElement('h4')
      exclamationMark.innerText = '!'
      exclamationMark.id = `tradeBoxContentLeftResult-${resource.key}-exclamationMark`
      exclamationMark.className = 'tradeBoxContentResultExclamationMark'
      resultResourceContainer.appendChild(exclamationMark)
      if (
        !this.isFirstOffer &&
        resource.value !== this.youGetPrevious.resources.find((r) => r.key === resource.key)!.value
      ) {
        exclamationMark.style.display = 'block'
      } else {
        exclamationMark.style.display = 'none'
      }

      result.appendChild(resultResourceContainer)

      if (resource.value > 0) {
        resultResourceContainer.style.display = 'flex'
      } else {
        resultResourceContainer.style.display = 'none'
      }
    }

    const resultResourceContainer = document.createElement('div')
    resultResourceContainer.id = `tradeBoxContentRightResult-money`

    const resultMoneyIconWrapper = document.createElement('div')
    const resultMoneyIcon = document.createElement('img')
    resultMoneyIcon.src = '/assets/coinCustomIcon.png'
    resultMoneyIcon.style.width = '25px'
    resultMoneyIconWrapper.appendChild(resultMoneyIcon)
    resultResourceContainer.appendChild(resultMoneyIconWrapper)

    const resultValueWrapper = document.createElement('div')
    const resultValue = document.createElement('h4')
    resultValue.id = `tradeBoxContentRightResult-money-value`
    resultValue.innerText = `${currentState.money}`
    resultValueWrapper.appendChild(resultValue)
    resultResourceContainer.appendChild(resultValueWrapper)

    const exclamationMark = document.createElement('h4')
    exclamationMark.innerText = '!'
    exclamationMark.id = 'tradeBoxContentLeftResult-money-exclamationMark'
    exclamationMark.className = 'tradeBoxContentResultExclamationMark'
    resultResourceContainer.appendChild(exclamationMark)
    if (!this.isFirstOffer && currentState.money !== this.youGetPrevious.money) {
      exclamationMark.style.display = 'block'
    } else {
      exclamationMark.style.display = 'none'
    }

    result.appendChild(resultResourceContainer)
    if (currentState.money > 0) {
      resultResourceContainer.style.display = 'flex'
    } else {
      resultResourceContainer.style.display = 'none'
    }

    resultWrapper.appendChild(result)

    if (this.isCurrPlayerTurn) {
      result.style.display = 'flex'
    } else {
      result.style.display = 'none'
    }
    resultExtraWrapper.appendChild(resultWrapper)
    container.appendChild(resultExtraWrapper)
  }

  public handleClose(msg: string): void {
    this.scene.cancelTrade(msg)
    const cloud = document.getElementById(`actionCloud-${this.scene.playerId}`)
    if (cloud) {
      cloud.style.visibility = 'hidden'
    }
    this.close(false, '')
  }

  public handlePropose(msg: string): void {
    if (this.isCurrPlayerTurn) {
      this.tradeBoxProposeMessageButtonExtraWrapper.id = 'tradeBoxProposeMessageButtonExtraWrapper'
      this.tradeBoxCloseMessagesContainer.style.display = 'none'
      this.tradeBoxCloseButton.id = TradeView.tradeBoxCloseButtonID
      this.tradeBoxCloseMessageButton.id = 'tradeBoxCloseMessageButton'
      this.tradeBoxProposeButtonExtraWrapper.className =
        this.tradeBoxProposeButtonExtraWrapper.className ===
        'tradeBoxMiddleButtonExtraWrapperEnabledActive'
          ? 'tradeBoxMiddleButtonExtraWrapperEnabled'
          : 'tradeBoxMiddleButtonExtraWrapperEnabledActive'

      this.tradeBoxProposeButtonWrapper.className =
        this.tradeBoxProposeButtonWrapper.className === 'tradeBoxMiddleButtonWrapperEnabledActive'
          ? 'tradeBoxMiddleButtonWrapperEnabled'
          : 'tradeBoxMiddleButtonWrapperEnabledActive'

      this.tradeBoxProposeButton.className =
        this.tradeBoxProposeButton.className === 'tradeBoxMiddleButtonEnabledActive'
          ? 'tradeBoxMiddleButtonEnabled'
          : 'tradeBoxMiddleButtonEnabledActive'

      this.disableProposeButton()
      this.hideReceivedMessage()

      this.scene.sendTradeBid(this.youOffer, this.youGet, msg)
      this.setCurrPlayerTurn(false)
      this.updatePlayerTurnElements()
      this.youOfferPrevious = JSON.parse(JSON.stringify(this.youOffer))
      this.youGetPrevious = JSON.parse(JSON.stringify(this.youGet))

      this.remindButtonTimeoutID = setTimeout(() => {
        this.enableRemindButton()
      }, 60000)
    }
  }

  public setCurrPlayerTurn(currPlayerTurn: boolean): void {
    this.isCurrPlayerTurn = currPlayerTurn
  }

  public updatePlayerTurnElements(): void {
    if (this.isCurrPlayerTurn) {
      this.tradeBoxCurrPlayerTurnHeader.innerText = 'Twoja kolej!'
      this.tradeBoxCurrPlayerTurnHeader.id = 'userTurnUserTurn'

      for (const button of this.resourceButtons) {
        this.enableResourceButton(button)
      }
    } else {
      this.tradeBoxCurrPlayerTurnHeader.innerText = 'Poczekaj!'
      this.tradeBoxCurrPlayerTurnHeader.id = 'userTurnNotUserTurn'
      for (const button of this.resourceButtons) {
        this.disableResourceButton(button)
      }

      document
        .querySelectorAll('.tradeBoxContentResultExclamationMark')
        .forEach((exclamationMark) => {
          ;(exclamationMark as HTMLElement).style.display = 'none'
        })
    }
  }

  public showCloseMessages(): void {
    this.tradeBoxCloseMessagesContainer.style.display = 'block'
  }

  public hideCloseMessages(): void {
    this.tradeBoxCloseMessagesContainer.style.display = 'none'
  }

  public showProposeMessagesButton(): void {
    this.tradeBoxProposeMessageButtonExtraWrapper.style.display = 'flex'
  }

  public hideProposeMessagesButton(): void {
    this.tradeBoxProposeMessageButtonExtraWrapper.id = 'tradeBoxProposeMessageButtonExtraWrapper'
    this.tradeBoxProposeMessageButtonExtraWrapper.style.display = 'none'
  }

  public showProposeMessages(): void {
    this.tradeBoxProposeMessagesContainer.style.display = 'block'
  }

  public hideProposeMessages(): void {
    this.tradeBoxProposeMessagesContainer.style.display = 'none'
  }

  public showReceivedMessage(message: string): void {
    this.tradeBoxReceivedMessage.innerText = message
    this.tradeBoxReceivedMessageExtraWrapper.style.display = 'block'
  }

  public hideReceivedMessage(): void {
    this.tradeBoxReceivedMessage.innerText = ''
    this.tradeBoxReceivedMessageExtraWrapper.style.display = 'none'
  }

  public remind(): void {
    this.scene.sendRemind()
  }

  public onRemind(): void {
    this.tradeBoxCurrPlayerTurnHeader.style.transform = 'scale(1.2)'
    setTimeout(() => {
      this.tradeBoxCurrPlayerTurnHeader.style.transform = 'none'
    }, 200)
    setTimeout(() => {
      this.tradeBoxCurrPlayerTurnHeader.style.transform = 'scale(1.2)'
    }, 400)
    setTimeout(() => {
      this.tradeBoxCurrPlayerTurnHeader.style.transform = 'none'
    }, 600)
    setTimeout(() => {
      this.tradeBoxCurrPlayerTurnHeader.style.transform = 'scale(1.2)'
    }, 800)
    setTimeout(() => {
      this.tradeBoxCurrPlayerTurnHeader.style.transform = 'none'
    }, 1000)
  }

  public enableResourceButton(button: HTMLButtonElement): void {
    button.disabled = false
    button.className = 'tradeBoxResourceButtonEnabled'
  }

  public disableResourceButton(button: HTMLButtonElement): void {
    button.disabled = true
    button.className = 'tradeBoxResourceButtonDisabled'
  }

  public enableRemindButton(): void {
    this.tradeBoxRemindButton.disabled = false

    this.tradeBoxRemindButtonExtraWrapper.style.display = 'block'
    this.tradeBoxRemindButtonExtraWrapper.className = 'tradeBoxMiddleButtonExtraWrapperEnabled'
    this.tradeBoxRemindButtonWrapper.className = 'tradeBoxMiddleButtonWrapperEnabled'
    this.tradeBoxRemindButton.className = 'tradeBoxMiddleButtonEnabled'
  }

  public disableRemindButton(): void {
    this.tradeBoxRemindButton.disabled = true

    this.tradeBoxRemindButtonExtraWrapper.style.display = 'none'
    this.tradeBoxRemindButtonExtraWrapper.className = 'tradeBoxMiddlleButtonExtraWrapperDisabled'
    this.tradeBoxRemindButtonWrapper.className = 'tradeBoxMiddleButtonWrapperDisabled'
    this.tradeBoxRemindButton.className = 'tradeBoxMiddleButtonDisabled'
  }

  public enableAcceptButton(): void {
    this.tradeBoxAcceptButton.disabled = false

    this.tradeBoxAcceptButtonExtraWrapper.style.display = 'block'
    this.tradeBoxAcceptButtonExtraWrapper.className = 'tradeBoxMiddleButtonExtraWrapperEnabled'
    this.tradeBoxAcceptButtonWrapper.className = 'tradeBoxMiddleButtonWrapperEnabled'
    this.tradeBoxAcceptButton.className = 'tradeBoxMiddleButtonEnabled'
  }

  public disableAcceptButton(): void {
    this.tradeBoxAcceptButton.disabled = true

    this.tradeBoxAcceptButtonExtraWrapper.style.display = 'none'
    this.tradeBoxAcceptButtonExtraWrapper.className = 'tradeBoxMiddlleButtonExtraWrapperDisabled'
    this.tradeBoxAcceptButtonWrapper.className = 'tradeBoxMiddleButtonWrapperDisabled'
    this.tradeBoxAcceptButton.className = 'tradeBoxMiddleButtonDisabled'
  }

  public enableProposeButton(): void {
    this.tradeBoxProposeButton.disabled = false

    this.tradeBoxProposeButtonExtraWrapper.style.display = 'block'
    this.tradeBoxProposeButtonExtraWrapper.className = 
      (this.tradeBoxProposeMessageButtonExtraWrapper.id == 'tradeBoxProposeMessageButtonExtraWrapperActive') 
      ? 'tradeBoxMiddleButtonExtraWrapperEnabledActive'
      : 'tradeBoxMiddleButtonExtraWrapperEnabled'
    this.tradeBoxProposeButtonWrapper.className = 
      (this.tradeBoxProposeMessageButtonExtraWrapper.id == 'tradeBoxProposeMessageButtonExtraWrapperActive')
      ? 'tradeBoxMiddleButtonWrapperEnabledActive'
      : 'tradeBoxMiddleButtonWrapperEnabled'
    this.tradeBoxProposeButton.className = 
      (this.tradeBoxProposeMessageButtonExtraWrapper.id == 'tradeBoxProposeMessageButtonExtraWrapperActive') 
      ? 'tradeBoxMiddleButtonEnabledActive'
      : 'tradeBoxMiddleButtonEnabled'

    this.showProposeMessagesButton()
  }

  public disableProposeButton(): void {
    this.tradeBoxProposeButton.disabled = true

    this.tradeBoxProposeButtonExtraWrapper.style.display = 'none'
    this.tradeBoxProposeButtonExtraWrapper.className = 'tradeBoxMiddlleButtonExtraWrapperDisabled'
    this.tradeBoxProposeButtonWrapper.className = 'tradeBoxMiddleButtonWrapperDisabled'
    this.tradeBoxProposeButton.className = 'tradeBoxMiddleButtonDisabled'

    this.hideProposeMessagesButton()
    this.hideProposeMessages()
  }

  private createMessageButton(message: string, propose: boolean): HTMLDivElement {
    const tradeBoxProposeMessageExtraWrapper = document.createElement('div')
    tradeBoxProposeMessageExtraWrapper.classList.add(
      'tradeMessageExtraWrapper',
      'tradeMessageClickable',
    )
    tradeBoxProposeMessageExtraWrapper.addEventListener('click', () => {
      propose ? this.handlePropose(message) : this.handleClose(message)
    })
    const tradeBoxProposeMessageWrapper = document.createElement('div')
    tradeBoxProposeMessageWrapper.className = 'tradeMessageWrapper'
    const tradeBoxProposeMessage = document.createElement('div')
    tradeBoxProposeMessage.classList.add('tradeMessage', 'tradeMessageMiddle')
    tradeBoxProposeMessage.innerText = message
    tradeBoxProposeMessageExtraWrapper.appendChild(tradeBoxProposeMessageWrapper)
    tradeBoxProposeMessageWrapper.appendChild(tradeBoxProposeMessage)
    return tradeBoxProposeMessageExtraWrapper
  }

  private createMessagePage(msgFirst: string, msgSecond: string | null, row: boolean, propose: boolean, className: string): HTMLDivElement {
    const page = document.createElement('div')
    page.className = className
    page.style.display = 'flex'
    page.style.flexDirection = row ? 'row' : 'column'
    page.style.justifyContent = 'space-around'
    const firstModal = this.createMessageButton(msgFirst, propose)
    page.appendChild(firstModal)
    if (msgSecond) {
      page.style.justifyContent = 'flex-start'
      const secondModal = this.createMessageButton(msgSecond, propose)
      page.appendChild(secondModal)
    }
    return page
  }

  private createPaginationBar(parent: HTMLDivElement, defaultClass: string, choosenId: string, startingPage: number): HTMLDivElement {
    const bar = document.createElement('div')
    bar.id = 'pagination-bar'
    const pageCounter = parent.querySelectorAll(`.${defaultClass}`).length
    let page = startingPage
    const pages = parent.querySelectorAll(`.${defaultClass}`)

    const buttonUpWrapper = document.createElement('div')
    buttonUpWrapper.id = 'pagination-buttonUpWrapper'
    const buttonUp = document.createElement('button')
    const buttonDownWrapper = document.createElement('div')
    buttonDownWrapper.id = 'pagination-buttonDownWrapper'
    const buttonDown = document.createElement('button')
    const dots: HTMLDivElement[] = []
    for(let i=0; i<pageCounter; i++) {
      const dot = document.createElement('div')
      dot.id = 'pagination-dot'
      dots.push(dot)
    }
    dots[startingPage].id = 'pagination-dot-active'

    buttonUp.addEventListener('click', () => {
      pages[page].id = ''
      dots[page].id = 'pagination-dot'
      page = ((page - 1) + pageCounter) % pageCounter
      pages[page].id = choosenId
      dots[page].id = 'pagination-dot-active'
    })

    buttonDown.addEventListener('click', () => {
      pages[page].id = ''
      dots[page].id = 'pagination-dot'
      page = ((page + 1) + pageCounter) % pageCounter
      pages[page].id = choosenId
      dots[page].id = 'pagination-dot-active'
    })

    bar.appendChild(buttonUpWrapper)
    for(let i=0; i<pageCounter; i++) {
      bar.appendChild(dots[i])
    } 
    bar.appendChild(buttonDownWrapper)
    buttonUpWrapper.appendChild(buttonUp)
    buttonDownWrapper.appendChild(buttonDown)

    const barWrapper = document.createElement('div')
    barWrapper.id = 'pagination-bar-wrapper'
    barWrapper.appendChild(bar)
    return barWrapper
  }

  public show(): void {
    this.scene.interactionCloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.TALK)
    window.document.body.appendChild(this.tradeBoxWrapper)
    this.scene.movingEnabled = false
  }

  public close(success: boolean, message: string): void {
    document.getElementById(TradeView.tradeBoxWrapperID)?.remove()

    if (success) {
      const succesView = new TradeSuccessView(
        this.resourceURL,
        this.resourceRepresentation,
        this.scene.playerId,
        this.youOffer,
        this.otherPlayerId,
        this.youGet,
        () => {
          this.scene.interactionCloudBuilder.hideInteractionCloud(
            this.scene.playerId,
            CloudType.TALK,
          )
          this.scene.tradeWindow = null
          this.scene.movingEnabled = true
          this.scene.otherPlayerId = undefined
        },
      )
      succesView.show()
    } else {
      if (message.length > 0) {
        const failureView = new TradeFailureView(
          this.scene.playerId,
          this.otherPlayerId,
          message,
          () => {
            this.scene.interactionCloudBuilder.hideInteractionCloud(
              this.scene.playerId,
              CloudType.TALK,
            )
            this.scene.tradeWindow = null
            this.scene.movingEnabled = true
            this.scene.otherPlayerId = undefined
          },
        )
        failureView.show()
      } else {
        this.scene.interactionCloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.TALK)
        this.scene.tradeWindow = null
        this.scene.movingEnabled = true
        this.scene.otherPlayerId = undefined
      }
    }
  }
}
