import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { type ClassResourceRepresentation, type GameResourceDto, type TradeEquipment } from '../../apis/game/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { TradeSuccessView } from './TradeSuccessView'
import { TradeFailureView } from './TradeFailureView'
import {
  createArrowIcon,
  createButtonWithId,
  createButtonWithInnerText,
  createDivWithIdClass,
  createDivWithClassName,
  createDivWithId,
  createElWithText,
  createElWithIdClassText,
  createElWithIdText,
  createIconWithWidth,
  createIElement,
  createIElementWithColor,
  createTradeCrop,
  getClassName,
  getId,
  getValue,
} from './ViewUtils'

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
  private static readonly tradeBoxWrapperID = 'tradeBoxWrapper'
  private static readonly tradeBoxHeaderWrapperID = 'tradeBoxHeaderWrapper'
  private static readonly tradeBoxHeaderID = 'tradeBoxHeader'
  private static readonly tradeBoxCloseButtonID = 'tradeBoxCloseButton'
  private static readonly tradeBoxCloseButtonActiveID = 'tradeBoxCloseButtonActive'
  private static readonly tradeBoxCloseMessageButtonID = 'tradeBoxCloseMessageButton'
  /* TradeBox - Content */
  private static readonly tradeBoxContentID = 'tradeBoxContent'
  private static readonly tradeBoxContentLeftID = 'tradeBoxContentLeft'
  private static readonly tradeBoxContentLeftExtraWrapperID = 'tradeBoxContentLeftExtraWrapper'
  private static readonly tradeBoxContentLeftWrapperID = 'tradeBoxContentLeftWrapper'
  private static readonly tradeBoxContentLeftWrapperTitleExtraWrapperID = 'tradeBoxContentLeftWrapperTitleExtraWrapper'
  private static readonly tradeBoxContentLeftWrapperTitleWrapperID = 'tradeBoxContentLeftWrapperTitleWrapper'
  private static readonly tradeBoxContentLeftWrapperTitleID = 'tradeBoxContentLeftWrapperTitle'
  private static readonly tradeBoxContentMiddleID = 'tradeBoxContentMiddle'
  private static readonly tradeBoxContentRightID = 'tradeBoxContentRight'
  private static readonly tradeBoxContentRightWrapperID = 'tradeBoxContentRightWrapper'
  private static readonly tradeBoxContentRightWrapperTitleExtraWrapperID = 'tradeBoxContentRightWrapperTitleExtraWrapper'
  private static readonly tradeBoxContentRightWrapperTitleWrapperID = 'tradeBoxContentRightWrapperTitleWrapper'
  private static readonly tradeBoxContentRightWrapperTitleID = 'tradeBoxContentRightWrapperTitle'
  /* TradeBox - Propose Button */
  private static readonly tradeBoxProposeButtonExtraWrapperID = 'tradeBoxProposeButtonExtraWrapper'
  private static readonly tradeBoxProposeButtonWrapperID = 'tradeBoxProposeButtonWrapper'
  private static readonly tradeBoxProposeButtonID = 'tradeBoxProposeButton'
  /* TradeBox - Accept Button */
  private static readonly tradeBoxAcceptButtonExtraWrapperID = 'tradeBoxAcceptButtonExtraWrapper'
  private static readonly tradeBoxAcceptButtonWrapperID = 'tradeBoxAcceptButtonWrapper'
  private static readonly tradeBoxAcceptButtonID = 'tradeBoxAcceptButton'
  /* TradeBox - Remind Button */
  private static readonly tradeBoxRemindButtonExtraWrapperID = 'tradeBoxRemindButtonExtraWrapper'
  private static readonly tradeBoxRemindButtonWrapperID = 'tradeBoxRemindButtonWrapper'
  private static readonly tradeBoxRemindButtonID = 'tradeBoxRemindButton'

  private static readonly tradeBoxMiddleButtonExtraWrapperID = 'tradeBoxMiddleButtonExtraWrapper'
  private static readonly tradeBoxMiddleButtonWrapperID = 'tradeBoxMiddleButtonWrapper'
  private static readonly tradeBoxMiddleButtonID = 'tradeBoxMiddleButton'
  private static readonly tradeBoxProposeMessageButtonExtraWrapperID = 'tradeBoxProposeMessageButtonExtraWrapper'
  private static readonly tradeBoxProposeMessageButtonWrapperID = 'tradeBoxProposeMessageButtonWrapper'
  private static readonly tradeBoxProposeMessageButtonID = 'tradeBoxProposeMessageButton'
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
    this.youOffer = this.emptyEq(currPlayerEq)
    this.youGet = this.emptyEq(currPlayerEq)
    this.youOfferPrevious = this.emptyEq(currPlayerEq)
    this.youGetPrevious = this.emptyEq(currPlayerEq)
    this.changesDone = 0
    this.isFirstOffer = true

    // Wrapper
    this.tradeBoxWrapper = createDivWithId(TradeView.tradeBoxWrapperID)
    // Header
    const tradeBoxHeaderWrapper = createDivWithId(TradeView.tradeBoxHeaderWrapperID)
    const tradeBoxHeader = createDivWithId(TradeView.tradeBoxHeaderID)
    const workshopTitleHeader = createElWithText('h1', 'HANDEL')

    tradeBoxHeader.append(createArrowIcon(), workshopTitleHeader, createArrowIcon())
    tradeBoxHeaderWrapper.appendChild(tradeBoxHeader)

    // Close button
    this.tradeBoxCloseButton = createButtonWithId(TradeView.tradeBoxCloseButtonID)
    this.tradeBoxCloseButton.addEventListener('click', () => {
      this.handleClose('')
    })
    const XIcon = createIElementWithColor('times', 'black')
    this.tradeBoxCloseButton.appendChild(XIcon)
    tradeBoxHeaderWrapper.appendChild(this.tradeBoxCloseButton)

    // Show/Hide close messages button
    this.tradeBoxCloseMessageButton = createButtonWithId(TradeView.tradeBoxCloseMessageButtonID)
    this.tradeBoxCloseMessageButton.addEventListener('click', () => {
      this.tradeBoxCloseMessagesContainer.style.display = getValue(this.tradeBoxCloseMessagesContainer.style.display, 'block', 'none')
      this.tradeBoxCloseButton.id = this.tradeBoxCloseMessageButton.id === 'tradeBoxCloseMessageButtonActive' ? TradeView.tradeBoxCloseButtonID : TradeView.tradeBoxCloseButtonActiveID
      this.tradeBoxCloseMessageButton.id = getId(this.tradeBoxCloseMessageButton, TradeView.tradeBoxCloseMessageButtonID)
    })
    const CloseChatIcon = createIElementWithColor('comment', 'black')
    this.tradeBoxCloseMessageButton.appendChild(CloseChatIcon)
    tradeBoxHeaderWrapper.appendChild(this.tradeBoxCloseMessageButton)

    // Close messages
    this.tradeBoxCloseMessagesContainer = createDivWithId('tradeBoxCloseMessagesContainer')
    const closePage1 = this.createMessagePage('Jednak nie chcę', ['Za drogo'], false, false, 'tradeCancel-page')
    closePage1.id = 'cancel-page-active'
    const closePage2 = this.createMessagePage('Wrócę z towarem', ['Może wyprawa?'], false, false, 'tradeCancel-page')
    this.tradeBoxCloseMessagesContainer.append(closePage1, closePage2)
    const closePaginationBar = this.createPaginationBar(this.tradeBoxCloseMessagesContainer, 'tradeCancel-page', 'cancel-page-active', 0)
    this.tradeBoxCloseMessagesContainer.appendChild(closePaginationBar)
    tradeBoxHeaderWrapper.appendChild(this.tradeBoxCloseMessagesContainer)

    // Content
    const tradeBoxContent = createDivWithId(TradeView.tradeBoxContentID)
    // Content left
    const tradeBoxContentLeftExtraWrapper = createDivWithId(TradeView.tradeBoxContentLeftExtraWrapperID)
    const tradeBoxContentLeftWrapper = createDivWithId(TradeView.tradeBoxContentLeftWrapperID)
    const tradeBoxContentLeftWrapperTitleExtraWrapper = createDivWithId(TradeView.tradeBoxContentLeftWrapperTitleExtraWrapperID)
    const tradeBoxContentLeftWrapperTitleWrapper = createDivWithId(TradeView.tradeBoxContentLeftWrapperTitleWrapperID)
    const tradeBoxContentLeftWrapperTitle = createElWithIdText('h2', TradeView.tradeBoxContentLeftWrapperTitleID, 'Oferujesz')
    tradeBoxContentLeftWrapperTitleWrapper.appendChild(tradeBoxContentLeftWrapperTitle)
    tradeBoxContentLeftWrapperTitleExtraWrapper.appendChild(tradeBoxContentLeftWrapperTitleWrapper)

    const tradeBoxContentLeft = createDivWithId(TradeView.tradeBoxContentLeftID)
    this.fillCurrentPlayerEq(currPlayerId, tradeBoxContentLeft, this.youOffer, currPlayerEq)

    tradeBoxContentLeftWrapper.appendChild(tradeBoxContentLeft)
    tradeBoxContentLeftExtraWrapper.append(tradeBoxContentLeftWrapper, tradeBoxContentLeftWrapperTitleExtraWrapper)

    // Content right
    const tradeBoxContentRightExtraWrapper = createDivWithId('tradeBoxContentRightExtraWrapper')
    const tradeBoxContentRightWrapper = createDivWithId(TradeView.tradeBoxContentRightWrapperID)
    const tradeBoxContentRightWrapperTitleExtraWrapper = createDivWithId(TradeView.tradeBoxContentRightWrapperTitleExtraWrapperID)
    const tradeBoxContentRightWrapperTitleWrapper = createDivWithId(TradeView.tradeBoxContentRightWrapperTitleWrapperID)
    const tradeBoxContentRightWrapperTitle = createElWithIdText('h2', TradeView.tradeBoxContentRightWrapperTitleID, 'Otrzymujesz')
    tradeBoxContentRightWrapperTitleWrapper.appendChild(tradeBoxContentRightWrapperTitle)
    tradeBoxContentRightWrapperTitleExtraWrapper.appendChild(tradeBoxContentRightWrapperTitleWrapper)

    const tradeBoxContentRight = createDivWithId(TradeView.tradeBoxContentRightID)
    this.fillOtherPlayerEq(otherPlayerId, tradeBoxContentRight, this.youGet)

    this.tradeBoxReceivedMessageExtraWrapper = createDivWithIdClass('tradeMessageReceivedExtraWrapper', 'tradeMessageExtraWrapper')
    const tradeBoxReceivedMessageWrapper = createDivWithClassName('tradeMessageWrapper')
    this.tradeBoxReceivedMessage = createDivWithClassName('tradeMessage')
    this.tradeBoxReceivedMessage.innerText = ''

    this.tradeBoxReceivedMessageExtraWrapper.appendChild(tradeBoxReceivedMessageWrapper)
    tradeBoxReceivedMessageWrapper.appendChild(this.tradeBoxReceivedMessage)

    tradeBoxContentRightWrapper.appendChild(tradeBoxContentRight)
    tradeBoxContentRightExtraWrapper.append(tradeBoxContentRightWrapper, tradeBoxContentRightWrapperTitleExtraWrapper, this.tradeBoxReceivedMessageExtraWrapper)

    // Content middle
    const tradeBoxContentMiddle = createDivWithId(TradeView.tradeBoxContentMiddleID)
    const userTurnWrapper = createDivWithId('userTurnWrapper')
    this.tradeBoxCurrPlayerTurnHeader = document.createElement('h2')
    this.updatePlayerTurnElements()
    userTurnWrapper.appendChild(this.tradeBoxCurrPlayerTurnHeader)
    tradeBoxContentMiddle.appendChild(userTurnWrapper)

    const middleArrows = createDivWithId('middleArrows')
    const middleArrowsLeft = createIconWithWidth('/assets/leftArrowCustomIcon.png', '100px')
    const middleArrowsRight = createIconWithWidth('/assets/rightArrowCustomIcon.png', '100px')
    middleArrows.append(middleArrowsLeft, middleArrowsRight)

    tradeBoxContentMiddle.appendChild(middleArrows)

    // Propose button
    const tradeBoxProposeContainer = document.createElement('div')

    this.tradeBoxProposeButtonExtraWrapper = createDivWithId(TradeView.tradeBoxProposeButtonExtraWrapperID)
    this.tradeBoxProposeButtonWrapper = createDivWithId(TradeView.tradeBoxProposeButtonWrapperID)
    this.tradeBoxProposeButton = createButtonWithInnerText(TradeView.tradeBoxProposeButtonID, 'ZAPROPONUJ')
    this.tradeBoxProposeButton.addEventListener('click', () => {
      this.handlePropose('')
    })

    this.tradeBoxProposeButtonWrapper.appendChild(this.tradeBoxProposeButton)
    this.tradeBoxProposeButtonExtraWrapper.appendChild(this.tradeBoxProposeButtonWrapper)

    tradeBoxProposeContainer.appendChild(this.tradeBoxProposeButtonExtraWrapper)

    // Show/Hide propose messages button
    this.tradeBoxProposeMessageButtonExtraWrapper = createDivWithId(TradeView.tradeBoxProposeMessageButtonExtraWrapperID)
    const tradeBoxProposeMessageButtonWrapper = createDivWithId(TradeView.tradeBoxProposeMessageButtonWrapperID)
    const tradeBoxProposeMessageButton = createButtonWithId(TradeView.tradeBoxProposeMessageButtonID)
    tradeBoxProposeMessageButton.addEventListener('click', () => {
      this.tradeBoxProposeMessagesContainer.style.display = getValue(this.tradeBoxProposeMessagesContainer.style.display, 'block', 'none')
      this.tradeBoxProposeMessageButtonExtraWrapper.id = getId(this.tradeBoxProposeMessageButtonExtraWrapper, TradeView.tradeBoxProposeMessageButtonExtraWrapperID)
      this.tradeBoxProposeButtonExtraWrapper.className = getClassName(this.tradeBoxProposeButtonExtraWrapper, TradeView.tradeBoxMiddleButtonExtraWrapperID)
      this.tradeBoxProposeButtonWrapper.className = getClassName(this.tradeBoxProposeButtonWrapper, TradeView.tradeBoxMiddleButtonWrapperID)
      this.tradeBoxProposeButton.className = getClassName(this.tradeBoxProposeButton, TradeView.tradeBoxMiddleButtonID)
    })
    const ProposeChatIcon = createIElementWithColor('comment', 'black')
    tradeBoxProposeMessageButton.appendChild(ProposeChatIcon)
    tradeBoxProposeMessageButtonWrapper.appendChild(tradeBoxProposeMessageButton)
    this.tradeBoxProposeMessageButtonExtraWrapper.appendChild(tradeBoxProposeMessageButtonWrapper)

    tradeBoxProposeContainer.appendChild(this.tradeBoxProposeMessageButtonExtraWrapper)

    tradeBoxContentMiddle.appendChild(tradeBoxProposeContainer)

    // Propose messages
    this.tradeBoxProposeMessagesContainer = createDivWithId('tradeBoxMessagesContainer')
    const page1 = this.createMessagePage('Nie stać mnie', ['Za drogo', 'Zdobędę więcej'], false, true, 'tradePropose-page')
    page1.id = 'propose-page-active'
    const page2 = this.createMessagePage('Zbieram na wyprawę', ['Tego nie dam!', 'Potrzebuję tego!'], false, true, 'tradePropose-page')
    this.tradeBoxProposeMessagesContainer.append(page1, page2)
    const paginationBar = this.createPaginationBar(this.tradeBoxProposeMessagesContainer, 'tradePropose-page', 'propose-page-active', 0)
    this.tradeBoxProposeMessagesContainer.appendChild(paginationBar)

    tradeBoxContentMiddle.appendChild(this.tradeBoxProposeMessagesContainer)

    // Accept button
    this.tradeBoxAcceptButtonExtraWrapper = createDivWithId(TradeView.tradeBoxAcceptButtonExtraWrapperID)
    this.tradeBoxAcceptButtonWrapper = createDivWithId(TradeView.tradeBoxAcceptButtonWrapperID)
    this.tradeBoxAcceptButton = createButtonWithInnerText(TradeView.tradeBoxAcceptButtonID, 'POTWIERDŹ')
    this.tradeBoxAcceptButton.addEventListener('click', () => {
      if (this.isCurrPlayerTurn) {
        this.tradeBoxAcceptButtonExtraWrapper.className = getClassName(this.tradeBoxAcceptButtonExtraWrapper, TradeView.tradeBoxMiddleButtonExtraWrapperID)
        this.tradeBoxAcceptButtonWrapper.className = getClassName(this.tradeBoxAcceptButtonWrapper, TradeView.tradeBoxMiddleButtonWrapperID)
        this.tradeBoxAcceptButton.className = getClassName(this.tradeBoxAcceptButton, TradeView.tradeBoxMiddleButtonID)
        scene.finishTrade(this.youOffer, this.youGet)
      }
    })

    this.tradeBoxAcceptButtonWrapper.appendChild(this.tradeBoxAcceptButton)
    this.tradeBoxAcceptButtonExtraWrapper.appendChild(this.tradeBoxAcceptButtonWrapper)
    tradeBoxContentMiddle.appendChild(this.tradeBoxAcceptButtonExtraWrapper)

    // Remind button
    this.tradeBoxRemindButtonExtraWrapper = createDivWithId(TradeView.tradeBoxRemindButtonExtraWrapperID)
    this.tradeBoxRemindButtonWrapper = createDivWithId(TradeView.tradeBoxRemindButtonWrapperID)
    this.tradeBoxRemindButton = createButtonWithInnerText(TradeView.tradeBoxRemindButtonID, 'PRZYPOMNIJ')
    this.tradeBoxRemindButton.addEventListener('click', () => {
      if (!this.isCurrPlayerTurn) {
        this.tradeBoxRemindButtonExtraWrapper.className = getClassName(this.tradeBoxRemindButtonExtraWrapper, TradeView.tradeBoxMiddleButtonExtraWrapperID)
        this.tradeBoxRemindButtonWrapper.className = getClassName(this.tradeBoxRemindButtonWrapper, TradeView.tradeBoxMiddleButtonWrapperID)
        this.tradeBoxRemindButton.className = getClassName(this.tradeBoxRemindButton, TradeView.tradeBoxMiddleButtonID)
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
    tradeBoxContent.append(tradeBoxContentLeftExtraWrapper, tradeBoxContentMiddle, tradeBoxContentRightExtraWrapper)
    this.tradeBoxWrapper.append(tradeBoxHeaderWrapper, tradeBoxContent)

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

  private emptyEq(eq: TradeEquipment): TradeEquipment {
    return {
      money: 0,
      resources: eq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
  }

  public update(youOffer: TradeEquipment, youGet: TradeEquipment, msg: string): void {
    this.hideReceivedMessage()

    if (this.remindButtonTimeoutID) {
      clearTimeout(this.remindButtonTimeoutID)
      this.remindButtonTimeoutID = !this.isCurrPlayerTurn
        ? setTimeout(() => {
          this.enableRemindButton()
        }, 20000)
        : null
    }

    this.youOffer = youOffer
    this.youGet = youGet
    this.changesDone = 0
    this.isFirstOffer = false

    document.getElementById(TradeView.tradeBoxContentLeftID)?.remove()
    const tradeBoxContentLeft = createDivWithId(TradeView.tradeBoxContentLeftID)
    this.fillCurrentPlayerEq(
      this.currPlayerId,
      tradeBoxContentLeft,
      this.youOffer,
      this.currPlayerEq,
    )
    document.getElementById(TradeView.tradeBoxContentLeftWrapperID)?.appendChild(tradeBoxContentLeft)

    document.getElementById(TradeView.tradeBoxContentRightID)?.remove()
    const tradeBoxContentRight = createDivWithId(TradeView.tradeBoxContentRightID)
    this.fillOtherPlayerEq(this.otherPlayerId, tradeBoxContentRight, this.youGet)
    document.getElementById(TradeView.tradeBoxContentRightWrapperID)?.appendChild(tradeBoxContentRight)

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

  private fillUserName(
    playerId: string,
    container: HTMLDivElement,
    currentState: TradeEquipment,
  ): any {
    const bid = JSON.parse(JSON.stringify(currentState))

    const userName = document.createElement('h3')
    userName.innerText =
      playerId.length > TradeView.maxPlayerIdLength
        ? playerId.slice(0, TradeView.maxPlayerIdLength) + '...'
        : playerId
    container.appendChild(userName)

    const lineSeparator = document.createElement('hr')
    container.appendChild(lineSeparator)
    return bid
  }

  private fillCurrentPlayerEq(
    playerId: string,
    container: HTMLDivElement,
    currentState: TradeEquipment,
    limitedState: TradeEquipment,
  ): void {
    this.fillEq(playerId, currentState, container, 'Left', limitedState)
  }

  private fillOtherPlayerEq(
    playerId: string,
    container: HTMLDivElement,
    currentState: TradeEquipment,
  ): void {
    this.fillEq(playerId, currentState, container, 'Right', null)
  }

  private fillEq(playerId: string, currentState: TradeEquipment, container: HTMLDivElement, what: string, limitedState: any): void {
    const bid = this.fillUserName(playerId, container, currentState)
    const resourcesWrapper = createDivWithId('tradeBoxContentLeftResources')
    for (const resource of currentState.resources) {
      const resourceContainer = document.createElement('div')
      const resourceIconWrapper = document.createElement('div')
      const resourceIcon = createTradeCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
      resourceIconWrapper.appendChild(resourceIcon)
      resourceContainer.appendChild(resourceIconWrapper)

      const resourceValueWrapper = document.createElement('div')
      const valueWrapper = document.createElement('div')
      const value = createElWithText('h4', `${resource.value}`)
      let upperBoundary = Number.MAX_VALUE
      if (what === 'Left') {
        upperBoundary = limitedState.resources.find((item: GameResourceDto) => item.key === resource.key)!.value
        value.style.color = resource.value > upperBoundary ? 'red' : 'black'
      }
      valueWrapper.appendChild(value)

      const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
      const plus = createIElement('plus')
      tradeBoxPlayerOfferEqItemBtnUp.appendChild(plus)
      tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
        if (this.isCurrPlayerTurn && upperBoundary > resource.value) {
          value.innerText = `${parseInt(value.innerText) + 1}`
          resource.value += 1
          if (what === 'Left') {
            value.style.color = resource.value > upperBoundary ? 'red' : 'black'
          }
          const resourceObject = bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          if (resource.value === resourceObject + 1) {
            this.changesDone += 1
          }
          if (resource.value === resourceObject) {
            this.changesDone -= 1
          }
          this.listener(resource, what)
        }
      })
      this.resourceButtons.push(tradeBoxPlayerOfferEqItemBtnUp)

      const tradeBoxPlayerOfferEqItemBtnDown = document.createElement('button')
      const minus = createIElement('minus')
      tradeBoxPlayerOfferEqItemBtnDown.appendChild(minus)
      tradeBoxPlayerOfferEqItemBtnDown.addEventListener('click', () => {
        if (this.isCurrPlayerTurn && resource.value > 0) {
          value.innerText = `${parseInt(value.innerText) - 1}`
          resource.value -= 1
          if (what === 'Left') {
            value.style.color = resource.value > upperBoundary ? 'red' : 'black'
          }
          const resourceObject = bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          if (resource.value === resourceObject - 1) {
            this.changesDone += 1
          }
          if (resource.value === resourceObject) {
            this.changesDone -= 1
          }
          this.listener(resource, what)
        }
      })
      this.resourceButtons.push(tradeBoxPlayerOfferEqItemBtnDown)

      resourceValueWrapper.append(tradeBoxPlayerOfferEqItemBtnDown, valueWrapper, tradeBoxPlayerOfferEqItemBtnUp)
      resourceContainer.appendChild(resourceValueWrapper)
      resourcesWrapper.appendChild(resourceContainer)
    }

    const moneyContainer = document.createElement('div')
    const moneyIconWrapper = document.createElement('div')
    const moneyIcon = createIconWithWidth('/assets/coinCustomIcon.png', '25px')
    moneyIconWrapper.appendChild(moneyIcon)
    moneyContainer.appendChild(moneyIconWrapper)

    const moneyValueWrapper = document.createElement('div')
    const valueWrapper = document.createElement('div')
    const value = createElWithText('h4', `${currentState.money}`)
    if (what === 'Left') {
      value.style.color = currentState.money > this.currPlayerEq.money ? 'red' : 'black'
    }
    valueWrapper.appendChild(value)

    const tradeBoxPlayerOfferEqMoneyBtnUp = document.createElement('button')
    const plus = createIElement('plus')
    tradeBoxPlayerOfferEqMoneyBtnUp.appendChild(plus)
    tradeBoxPlayerOfferEqMoneyBtnUp.addEventListener('click', () => {
      if (this.isCurrPlayerTurn && (what === 'Right' || this.currPlayerEq.money > currentState.money)) {
        value.innerText = `${parseInt(value.innerText) + 1}`
        currentState.money += 1
        if (what === 'Left') {
          value.style.color = currentState.money > this.currPlayerEq.money ? 'red' : 'black'
        }
        if (currentState.money === bid.money + 1) {
          this.changesDone += 1
        }
        if (currentState.money === bid.money) {
          this.changesDone -= 1
        }
        this.moneyListener(currentState, what)
      }
    })
    this.resourceButtons.push(tradeBoxPlayerOfferEqMoneyBtnUp)

    const tradeBoxPlayerOfferEqMoneyBtnDown = document.createElement('button')
    const minus = createIElement('minus')
    tradeBoxPlayerOfferEqMoneyBtnDown.appendChild(minus)
    tradeBoxPlayerOfferEqMoneyBtnDown.addEventListener('click', () => {
        if (this.isCurrPlayerTurn && currentState.money > 0) {
          value.innerText = `${parseInt(value.innerText) - 1}`
          currentState.money -= 1
          if (what === 'Left') {
            value.style.color = currentState.money > this.currPlayerEq.money ? 'red' : 'black'
          }
          if (currentState.money === bid.money - 1) {
            this.changesDone += 1
          }
          if (currentState.money === bid.money) {
            this.changesDone -= 1
          }
          this.moneyListener(currentState, what)
        }
      },
    )
    this.resourceButtons.push(tradeBoxPlayerOfferEqMoneyBtnDown)

    moneyValueWrapper.append(tradeBoxPlayerOfferEqMoneyBtnDown, valueWrapper, tradeBoxPlayerOfferEqMoneyBtnUp)
    moneyContainer.appendChild(moneyValueWrapper)
    resourcesWrapper.appendChild(moneyContainer)
    container.appendChild(resourcesWrapper)
    const resultExtraWrapper = createDivWithId(`tradeBoxContent${what}ResultExtraWrapper`)
    const resultWrapper = createDivWithId(`tradeBoxContent${what}ResultWrapper`)
    const result = createDivWithId(`tradeBoxContent${what}Result`)

    for (const resource of currentState.resources) {
      const resultResourceContainer = createDivWithId(`tradeBoxContent${what}Result-${resource.key}`)
      const resultResourceIconWrapper = document.createElement('div')
      const resultResourceIcon = createTradeCrop(this.cropper, this.resourceURL, this.resourceRepresentation, resource.key)
      resultResourceIconWrapper.appendChild(resultResourceIcon)
      const valueWrapper = document.createElement('div')
      const value = createElWithIdText('h4', `tradeBoxContent${what}Result-${resource.key}-value`, `${resource.value}`)
      valueWrapper.appendChild(value)

      const exclamationMark = createElWithIdClassText('h4', `tradeBoxContent${what}Result-${resource.key}-exclamationMark`, '!', 'tradeBoxContentResultExclamationMark')
      let resourceObject
      if (what === 'Left') {
        resourceObject = this.youGetPrevious.resources.find((r) => r.key === resource.key)!.value
      } else {
        resourceObject = this.youOfferPrevious.resources.find((r) => r.key === resource.key)!.value
      }
      exclamationMark.style.display = !this.isFirstOffer && resource.value !== resourceObject ? 'block' : 'none'
      resultResourceContainer.append(resultResourceIconWrapper, valueWrapper, exclamationMark)
      resultResourceContainer.style.display = resource.value > 0 ? 'flex' : 'none'
      result.appendChild(resultResourceContainer)
    }

    const resultResourceContainer = createDivWithId(`tradeBoxContent${what}Result-money`)
    const resultMoneyIconWrapper = document.createElement('div')
    const resultMoneyIcon = createIconWithWidth('/assets/coinCustomIcon.png', '25px')
    resultMoneyIconWrapper.appendChild(resultMoneyIcon)

    const resultValueWrapper = document.createElement('div')
    const resultValue = createElWithIdText('h4', `tradeBoxContent${what}Result-money-value`, `${currentState.money}`)
    resultValueWrapper.appendChild(resultValue)

    const exclamationMark = createElWithIdClassText('h4', `tradeBoxContent${what}Result-money-exclamationMark`, '!', 'tradeBoxContentResultExclamationMark')
    if (what === 'Left') {
      exclamationMark.style.display = !this.isFirstOffer && currentState.money !== this.youGetPrevious.money ? 'block' : 'none'
    } else {
      exclamationMark.style.display = !this.isFirstOffer && currentState.money !== this.youOfferPrevious.money ? 'block' : 'none'
    }

    resultResourceContainer.append(resultMoneyIconWrapper, resultValueWrapper, exclamationMark)
    resultResourceContainer.style.display = currentState.money > 0 ? 'flex' : 'none'
    result.appendChild(resultResourceContainer)
    result.style.display = this.isCurrPlayerTurn ? 'flex' : 'none'
    resultWrapper.appendChild(result)
    resultExtraWrapper.appendChild(resultWrapper)
    container.appendChild(resultExtraWrapper)
  }

  private listener(resource: GameResourceDto, where: string): void {
    this.doAllStuff()
    if (resource.value === 0) {
      document.getElementById(`tradeBoxContent${where}Result-${resource.key}`)!.style.display = 'none'
      document.getElementById(`tradeBoxContent${where}Result-${resource.key}-value`)!.innerText = '0'
    } else {
      document.getElementById(`tradeBoxContent${where}Result-${resource.key}`)!.style.display = 'flex'
      document.getElementById(`tradeBoxContent${where}Result-${resource.key}-value`)!.innerText = `${resource.value}`
    }
    this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
  }

  private moneyListener(currentState: TradeEquipment, where: string): void {
    this.doAllStuff()
    if (currentState.money === 0) {
      document.getElementById(`tradeBoxContent${where}Result-money`)!.style.display = 'none'
      document.getElementById(`tradeBoxContent${where}Result-money-value`)!.innerText = '0'
    } else {
      document.getElementById(`tradeBoxContent${where}Result-money`)!.style.display = 'flex'
      document.getElementById(`tradeBoxContent${where}Result-money-value`)!.innerText = `${currentState.money}`
    }
    this.scene.sendTradeMinorChange(this.youOffer, this.youGet)
  }

  private doAllStuff(): void {
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
      this.tradeBoxCloseMessageButton.id = TradeView.tradeBoxCloseMessageButtonID
      this.tradeBoxProposeButtonExtraWrapper.className = getClassName(this.tradeBoxProposeButtonExtraWrapper, TradeView.tradeBoxMiddleButtonExtraWrapperID)
      this.tradeBoxProposeButtonWrapper.className = getClassName(this.tradeBoxProposeButtonWrapper, TradeView.tradeBoxMiddleButtonWrapperID)
      this.tradeBoxProposeButton.className = getClassName(this.tradeBoxProposeButton, TradeView.tradeBoxMiddleButtonID)

      this.disableProposeButton()
      this.hideReceivedMessage()

      this.scene.sendTradeBid(this.youOffer, this.youGet, msg)
      this.setCurrPlayerTurn(false)
      this.updatePlayerTurnElements()
      this.youOfferPrevious = JSON.parse(JSON.stringify(this.youOffer))
      this.youGetPrevious = JSON.parse(JSON.stringify(this.youGet))

      this.remindButtonTimeoutID = setTimeout(() => {
        this.enableRemindButton()
      }, 20000)
    }
  }

  public setCurrPlayerTurn(currPlayerTurn: boolean): void {
    this.isCurrPlayerTurn = currPlayerTurn
  }

  public updatePlayerTurnElements(): void {
    if (this.isCurrPlayerTurn
    ) {
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

      document.querySelectorAll('.tradeBoxContentResultExclamationMark')
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
    this.tradeBoxRemindButton.className = TradeView.tradeBoxMiddleButtonID + 'Enabled'
    this.tradeBoxRemindButtonExtraWrapper.style.display = 'block'
    this.tradeBoxRemindButtonExtraWrapper.className = TradeView.tradeBoxMiddleButtonExtraWrapperID + 'Enabled'
    this.tradeBoxRemindButtonWrapper.className = TradeView.tradeBoxMiddleButtonWrapperID + 'Enabled'
  }

  public disableRemindButton(): void {
    this.tradeBoxRemindButton.disabled = true
    this.tradeBoxRemindButton.className = TradeView.tradeBoxMiddleButtonID + 'Disabled'
    this.tradeBoxRemindButtonExtraWrapper.style.display = 'none'
    this.tradeBoxRemindButtonExtraWrapper.className = TradeView.tradeBoxMiddleButtonExtraWrapperID + 'Disabled'
    this.tradeBoxRemindButtonWrapper.className = TradeView.tradeBoxMiddleButtonWrapperID + 'Disabled'
  }

  public enableAcceptButton(): void {
    this.tradeBoxAcceptButton.disabled = false
    this.tradeBoxAcceptButton.className = TradeView.tradeBoxMiddleButtonID + 'Enabled'
    this.tradeBoxAcceptButtonExtraWrapper.style.display = 'block'
    this.tradeBoxAcceptButtonExtraWrapper.className = TradeView.tradeBoxMiddleButtonExtraWrapperID + 'Enabled'
    this.tradeBoxAcceptButtonWrapper.className = TradeView.tradeBoxMiddleButtonWrapperID + 'Enabled'
  }

  public disableAcceptButton(): void {
    this.tradeBoxAcceptButton.disabled = true
    this.tradeBoxAcceptButton.className = TradeView.tradeBoxMiddleButtonID + 'Disabled'
    this.tradeBoxAcceptButtonExtraWrapper.style.display = 'none'
    this.tradeBoxAcceptButtonExtraWrapper.className = TradeView.tradeBoxMiddleButtonExtraWrapperID + 'Disabled'
    this.tradeBoxAcceptButtonWrapper.className = TradeView.tradeBoxMiddleButtonWrapperID + 'Disabled'
  }

  public enableProposeButton(): void {
    this.tradeBoxProposeButton.disabled = false
    this.tradeBoxProposeButtonExtraWrapper.style.display = 'block'
    const condition = this.tradeBoxProposeMessageButtonExtraWrapper.id === 'tradeBoxProposeMessageButtonExtraWrapperActive'
    this.tradeBoxProposeButtonExtraWrapper.className = condition ? TradeView.tradeBoxMiddleButtonExtraWrapperID + 'EnabledActive' : TradeView.tradeBoxMiddleButtonExtraWrapperID + 'Enabled'
    this.tradeBoxProposeButtonWrapper.className = condition ? TradeView.tradeBoxMiddleButtonWrapperID + 'EnabledActive' : TradeView.tradeBoxMiddleButtonWrapperID + 'Enabled'
    this.tradeBoxProposeButton.className = condition ? TradeView.tradeBoxMiddleButtonID + 'EnabledActive' : TradeView.tradeBoxMiddleButtonID + 'Enabled'
    this.showProposeMessagesButton()
  }

  public disableProposeButton(): void {
    this.tradeBoxProposeButton.disabled = true
    this.tradeBoxProposeButton.className = TradeView.tradeBoxMiddleButtonID + 'Disabled'
    this.tradeBoxProposeButtonExtraWrapper.style.display = 'none'
    this.tradeBoxProposeButtonExtraWrapper.className = TradeView.tradeBoxMiddleButtonExtraWrapperID + 'Disabled'
    this.tradeBoxProposeButtonWrapper.className = TradeView.tradeBoxMiddleButtonWrapperID + 'Disabled'

    this.hideProposeMessagesButton()
    this.hideProposeMessages()
  }

  private createMessageButton(message: string, propose: boolean): HTMLDivElement {
    const tradeBoxProposeMessageExtraWrapper = document.createElement('div')
    tradeBoxProposeMessageExtraWrapper.classList.add('tradeMessageExtraWrapper', 'tradeMessageClickable')
    tradeBoxProposeMessageExtraWrapper.addEventListener('click', () => {
      propose ? this.handlePropose(message) : this.handleClose(message)
    })
    const tradeBoxProposeMessageWrapper = createDivWithClassName('tradeMessageWrapper')
    const tradeBoxProposeMessage = document.createElement('div')
    tradeBoxProposeMessage.classList.add('tradeMessage')
    if (propose) {
      tradeBoxProposeMessage.classList.add('tradeMessageMiddle')
    }
    tradeBoxProposeMessage.innerText = message
    tradeBoxProposeMessageExtraWrapper.appendChild(tradeBoxProposeMessageWrapper)
    tradeBoxProposeMessageWrapper.appendChild(tradeBoxProposeMessage)
    return tradeBoxProposeMessageExtraWrapper
  }

  private createMessagePage(msgFirst: string, msgTail: string[], row: boolean, propose: boolean, className: string): HTMLDivElement {
    const page = createDivWithClassName(className)
    page.style.display = 'flex'
    page.style.flexDirection = row ? 'row' : 'column'
    page.style.justifyContent = 'space-around'
    const firstModal = this.createMessageButton(msgFirst, propose)
    page.appendChild(firstModal)
    msgTail.forEach(element => {
      if (element) {
        page.style.justifyContent = 'flex-start'
        const secondModal = this.createMessageButton(element, propose)
        page.appendChild(secondModal)
      }
    })
    return page
  }

  private createPaginationBar(
    parent: HTMLDivElement,
    defaultClass: string,
    chosenId: string,
    startingPage: number,
  ): HTMLDivElement {
    const bar = createDivWithId('pagination-bar')
    const pageCounter = parent.querySelectorAll(`.${defaultClass}`).length
    console.log(pageCounter)
    let page = startingPage
    const pages = parent.querySelectorAll(`.${defaultClass}`)

    const buttonUpWrapper = createDivWithId('pagination-buttonUpWrapper')
    const buttonUp = document.createElement('button')
    const buttonDownWrapper = createDivWithId('pagination-buttonDownWrapper')
    const buttonDown = document.createElement('button')
    const dots: HTMLDivElement[] = []
    for (let i = 0; i < pageCounter; i++) {
      const dot = createDivWithId('pagination-dot')
      dots.push(dot)
    }
    dots[startingPage].id = 'pagination-dot-active'

    buttonUp.addEventListener('click', () => {
      pages[page].id = ''
      dots[page].id = 'pagination-dot'
      page = ((page - 1) + pageCounter) % pageCounter
      pages[page].id = chosenId
      dots[page].id = 'pagination-dot-active'
    })

    buttonDown.addEventListener('click', () => {
      pages[page].id = ''
      dots[page].id = 'pagination-dot'
      page = ((page + 1) + pageCounter) % pageCounter
      pages[page].id = chosenId
      dots[page].id = 'pagination-dot-active'
    })

    bar.appendChild(buttonUpWrapper)
    for (let i = 0; i < pageCounter; i++) {
      bar.appendChild(dots[i])
    }
    bar.appendChild(buttonDownWrapper)
    buttonUpWrapper.appendChild(buttonUp)
    buttonDownWrapper.appendChild(buttonDown)

    const barWrapper = createDivWithId('pagination-bar-wrapper')
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
      const successView = new TradeSuccessView(
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
      successView.show()
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
