import { type Scene } from '../scenes/Scene'
import { type TradeEquipment } from '../../services/game/Types'
import { CloudType } from '../scenes/Types'
import { SPRITE_WIDTH, SPRITE_HEIGHT, getPlayerMapping } from '../GameUtils'

export class TradeView {
  private readonly scene: Scene

  private isUserTurn: boolean

  currPlayerId: string
  currPlayerEq: TradeEquipment
  otherPlayerId: string
  otherPlayerEq: TradeEquipment
  youOffer: TradeEquipment
  youGet: TradeEquipment
  youOfferPrevious: TradeEquipment
  youGetPrevious: TradeEquipment

  private changesDone: number

  private readonly tradeBox: HTMLDivElement
  private readonly tradeBoxTitle: HTMLHeadingElement
  private readonly tradeBoxContent: HTMLDivElement
  private readonly tradeBoxPlayer: HTMLDivElement
  private readonly tradeBoxPlayerTitle: HTMLHeadingElement
  private tradeBoxPlayerOfferEq: HTMLDivElement
  private readonly tradeBoxNeighbor: HTMLDivElement
  private readonly tradeBoxNeighborTitle: HTMLHeadingElement
  private tradeBoxNeighborOfferEq: HTMLDivElement
  private readonly tradeBoxButtons: HTMLDivElement
  private readonly tradeBoxAccept: HTMLButtonElement
  private readonly tradeBoxSendOffer: HTMLButtonElement
  private readonly tradeBoxClose: HTMLButtonElement

  constructor(
    scene: Scene,
    isUserTurn: boolean,
    currPlayerId: string,
    currPlayerEq: TradeEquipment,
    otherPlayerId: string,
    otherPlayerEq: TradeEquipment,
  ) {
    this.scene = scene
    this.isUserTurn = isUserTurn
    this.currPlayerId = currPlayerId
    this.currPlayerEq = currPlayerEq
    this.otherPlayerId = otherPlayerId
    this.otherPlayerEq = otherPlayerEq
    this.youOffer = {
      money: 0,
      resources: currPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.youGet = {
      money: 0,
      resources: otherPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.youOfferPrevious = {
      money: 0,
      resources: currPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.youGetPrevious = {
      money: 0,
      resources: otherPlayerEq.resources.map((resource) => ({ key: resource.key, value: 0 })),
    }
    this.changesDone = 69

    // CONTAIENR
    this.tradeBox = document.createElement('div')
    this.tradeBox.id = 'tradeBox'

    // TITLE
    this.tradeBoxTitle = document.createElement('h1')
    this.tradeBoxTitle.id = 'tradeBoxTitle'
    this.tradeBoxTitle.innerText = `Trade with ${this.otherPlayerId}`

    // CONTENT
    this.tradeBoxContent = document.createElement('div')
    this.tradeBoxContent.id = 'tradeBoxContent'

    this.tradeBoxPlayer = document.createElement('div')
    this.tradeBoxPlayer.id = 'tradeBoxContentPlayer'

    this.tradeBoxPlayerTitle = document.createElement('h2')
    this.tradeBoxPlayerTitle.innerText = 'You Offer'

    this.tradeBoxPlayerOfferEq = document.createElement('div')
    this.tradeBoxPlayerOfferEq.id = 'tradeBoxContentPlayerOfferEq'

    this.fillEq(this.tradeBoxPlayerOfferEq, this.youOffer, this.currPlayerEq, true)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerTitle)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

    this.tradeBoxNeighbor = document.createElement('div')
    this.tradeBoxNeighbor.id = 'tradeBoxContentNeighbor'

    this.tradeBoxNeighborTitle = document.createElement('h2')
    this.tradeBoxNeighborTitle.innerText = 'You Get'

    this.tradeBoxNeighborOfferEq = document.createElement('div')
    this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'

    this.fillEq(this.tradeBoxNeighborOfferEq, this.youGet, this.otherPlayerEq, false)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborTitle)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborOfferEq)

    // AVATARS
    const youDiv = document.createElement('div')
    youDiv.className = 'arrow-container'
    const opponentDiv = document.createElement('div')
    opponentDiv.className = 'arrow-container'
    const iconUp = document.createElement('i')
    iconUp.className = 'arrow fa fa-arrow-up'
    iconUp.id = 'you'
    iconUp.ariaHidden = 'true'
    const iconUp2 = document.createElement('i')
    iconUp2.className = 'arrow fa fa-arrow-up'
    iconUp2.ariaHidden = 'true'
    iconUp2.id = 'notYou'
    youDiv.appendChild(
      scene.imageCropper.crop(
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        1,
        this.scene.characterUrl,
        4,
        getPlayerMapping(scene.settings.classResourceRepresentation)(
          scene.playersClasses.get(currPlayerId)!,
        ),
        false,
      ),
    )
    youDiv.appendChild(iconUp)
    opponentDiv.appendChild(
      scene.imageCropper.crop(
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        1,
        this.scene.characterUrl,
        4,
        getPlayerMapping(scene.settings.classResourceRepresentation)(
          scene.playersClasses.get(otherPlayerId)!,
        ),
        false,
      ),
    )
    opponentDiv.appendChild(iconUp2)

    iconUp.style.visibility = this.isUserTurn ? 'visible' : 'hidden'
    iconUp2.style.visibility = this.isUserTurn ? 'hidden' : 'visible'

    this.tradeBoxContent.appendChild(youDiv)
    this.tradeBoxContent.appendChild(this.tradeBoxPlayer)
    this.tradeBoxContent.appendChild(this.tradeBoxNeighbor)
    this.tradeBoxContent.appendChild(opponentDiv)

    // BUTTONS
    this.tradeBoxButtons = document.createElement('div')
    this.tradeBoxButtons.id = 'tradeBoxButtons'

    this.tradeBoxAccept = document.createElement('button')
    this.tradeBoxAccept.id = 'tradeBoxAcceptBtn'
    this.tradeBoxAccept.innerText = 'Accept'
    this.tradeBoxAccept.addEventListener('click', () => {
      if (this.isUserTurn) {
        scene.finishTrade(this.youOffer, this.youGet)
        this.close()
        this.scene.loadingView.close()
      }
    })
    this.disableAcceptBtn()

    this.tradeBoxSendOffer = document.createElement('button')
    this.tradeBoxSendOffer.id = 'tradeBoxSendOfferBtn'
    this.tradeBoxSendOffer.innerText = 'Send Offer'
    this.tradeBoxSendOffer.addEventListener('click', () => {
      if (this.isUserTurn) {
        scene.sendTradeBid(this.youOffer, this.youGet)
        this.setUserTurn(false)
        this.resetBidIndicators()
        this.youOfferPrevious = JSON.parse(JSON.stringify(this.youOffer))
        this.youGetPrevious = JSON.parse(JSON.stringify(this.youGet))
      }
    })
    if (isUserTurn) {
      this.enableSendOfferBtn()
    } else {
      this.disableSendOfferBtn()
    }

    this.tradeBoxClose = document.createElement('button')
    this.tradeBoxClose.id = 'tradeBoxCloseBtn'
    this.tradeBoxClose.innerText = 'Close'
    this.tradeBoxClose.addEventListener('click', () => {
      scene.cancelTrade()
      const cloud = document.getElementById(`actionCloud-${this.scene.playerId}`)
      if (cloud) {
        cloud.style.visibility = 'hidden'
      }
      this.close()
    })

    this.tradeBoxButtons.appendChild(this.tradeBoxAccept)
    this.tradeBoxButtons.appendChild(this.tradeBoxSendOffer)
    this.tradeBoxButtons.appendChild(this.tradeBoxClose)

    this.tradeBox.appendChild(this.tradeBoxTitle)
    this.tradeBox.appendChild(this.tradeBoxContent)
    this.tradeBox.appendChild(this.tradeBoxButtons)
  }

  private fillEq(
    container: HTMLDivElement,
    offer: TradeEquipment,
    realState: TradeEquipment,
    playerEq: boolean,
  ): void {
    const bid = JSON.parse(JSON.stringify(offer))
    for (const resource of offer.resources) {
      const resourceItem = document.createElement('div')
      const upperBoundary = realState?.resources.find((item) => item.key === resource.key)?.value
      const resourceItemName = document.createElement('h5')
      resourceItemName.innerText = resource.key

      const tradeBoxPlayerOfferEqItemAmount = document.createElement('p')
      tradeBoxPlayerOfferEqItemAmount.innerText = `${resource.value}`

      const downBid = document.createElement('i')
      downBid.className = 'arrow downBid fa fa-arrow-down'
      downBid.ariaHidden = 'true'
      const stableBid = document.createElement('i')
      stableBid.className = 'arrow stableBid fa fa-minus'
      stableBid.ariaHidden = 'true'
      const upBid = document.createElement('i')
      upBid.className = 'arrow upBid fa fa-arrow-up'
      upBid.ariaHidden = 'true'

      this.updateBidIndicators(
        (playerEq ? this.youOfferPrevious : this.youGetPrevious).resources.find(
          (item) => item.key === resource.key,
        )!.value,
        resource.value,
        downBid,
        stableBid,
        upBid,
      )

      const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
      const plus = document.createElement('i')
      plus.className = 'fa fa-plus'
      plus.ariaHidden = 'true'
      tradeBoxPlayerOfferEqItemBtnUp.appendChild(plus)
      tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.isUserTurn && upperBoundary! > resource.value) {
          tradeBoxPlayerOfferEqItemAmount.innerText = `${
            parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) + 1
          }`
          resource.value += 1

          this.scene.sendTradeMinorChange(this.youOffer, this.youGet)

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (resource.value === bid.resources.find((item: { key: string }) => item.key === resource.key)!.value + 1)
            this.changesDone += 1
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          )
            this.changesDone -= 1
          if (this.changesDone !== 0) {
            this.enableSendOfferBtn()
            this.disableAcceptBtn()
          } else {
            this.disableSendOfferBtn()
            this.enableAcceptBtn()
          }
        }
      })
      const tradeBoxPlayerOfferEqItemBtnDown = document.createElement('button')
      const minus = document.createElement('i')
      minus.className = 'fa fa-minus'
      minus.ariaHidden = 'true'
      tradeBoxPlayerOfferEqItemBtnDown.appendChild(minus)
      tradeBoxPlayerOfferEqItemBtnDown.addEventListener('click', () => {
        if (this.isUserTurn && resource.value > 0) {
          if (parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) === 0) return
          tradeBoxPlayerOfferEqItemAmount.innerText = `${
            parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) - 1
          }`
          resource.value -= 1

          this.scene.sendTradeMinorChange(this.youOffer, this.youGet)

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value - 1
          )
            this.changesDone += 1
          if (
            resource.value ===
            bid.resources.find((item: { key: string }) => item.key === resource.key)!.value
          )
            this.changesDone -= 1
          if (this.changesDone !== 0) {
            this.enableSendOfferBtn()
            this.disableAcceptBtn()
          } else {
            this.disableSendOfferBtn()
            this.enableAcceptBtn()
          }
        }
      })

      const resourceWrapper = document.createElement('div')
      resourceWrapper.id = 'resourceWrapper'
      resourceWrapper.appendChild(resourceItemName)
      resourceWrapper.appendChild(tradeBoxPlayerOfferEqItemAmount)
      resourceItem.appendChild(resourceWrapper)
      const tradeButtonWrapper = document.createElement('div')
      tradeButtonWrapper.id = 'tradeButtonWrapper'
      tradeButtonWrapper.appendChild(tradeBoxPlayerOfferEqItemBtnUp)
      tradeButtonWrapper.appendChild(tradeBoxPlayerOfferEqItemBtnDown)
      resourceItem.appendChild(tradeButtonWrapper)
      const bidIndicatorWrapper = document.createElement('div')
      bidIndicatorWrapper.id = 'bidIndicatorWrapper'
      bidIndicatorWrapper.appendChild(downBid)
      bidIndicatorWrapper.appendChild(stableBid)
      bidIndicatorWrapper.appendChild(upBid)
      resourceItem.appendChild(bidIndicatorWrapper)

      container.appendChild(resourceItem)
    }

    const moneyItem = document.createElement('div')
    const moneyUpperBoundary = realState.money
    const moneyItemName = document.createElement('h5')
    moneyItemName.innerText = 'money'

    const moneyItemAmount = document.createElement('p')
    moneyItemAmount.innerText = `${offer.money}`

    const downBidMoney = document.createElement('i')
    downBidMoney.className = 'arrow downBid fa fa-arrow-down'
    downBidMoney.ariaHidden = 'true'
    const stableBidMoney = document.createElement('i')
    stableBidMoney.className = 'arrow stableBid fa fa-minus'
    stableBidMoney.ariaHidden = 'true'
    const upBidMoney = document.createElement('i')
    upBidMoney.className = 'arrow upBid fa fa-arrow-up'
    upBidMoney.ariaHidden = 'true'

    this.updateBidIndicators(
      (playerEq ? this.youOfferPrevious : this.youGetPrevious).money,
      offer.money,
      downBidMoney,
      stableBidMoney,
      upBidMoney,
    )

    const moneyItemAmountBtnUp = document.createElement('button')
    const plus = document.createElement('i')
    plus.className = 'fa fa-plus'
    plus.ariaHidden = 'true'
    moneyItemAmountBtnUp.appendChild(plus)
    moneyItemAmountBtnUp.addEventListener('click', () => {
      if (this.isUserTurn && moneyUpperBoundary > offer.money) {
        moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) + 1}`
        offer.money += 1

        this.scene.sendTradeMinorChange(this.youOffer, this.youGet)

        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (offer.money === bid.money + 1) this.changesDone += 1
        if (offer.money === bid.money) this.changesDone -= 1

        if (this.changesDone !== 0) {
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        } else {
          this.disableSendOfferBtn()
          this.enableAcceptBtn()
        }
      }
    })
    const moneyItemAmountBtnDown = document.createElement('button')
    const minus = document.createElement('i')
    minus.className = 'fa fa-minus'
    minus.ariaHidden = 'true'
    moneyItemAmountBtnDown.appendChild(minus)
    moneyItemAmountBtnDown.addEventListener('click', () => {
      if (this.isUserTurn && offer.money > 0) {
        if (parseInt(moneyItemAmount.innerText) === 0) return
        moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) - 1}`
        offer.money -= 1

        this.scene.sendTradeMinorChange(this.youOffer, this.youGet)

        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (offer.money === bid.money - 1) this.changesDone += 1
        if (offer.money === bid.money) this.changesDone -= 1

        if (this.changesDone !== 0) {
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        } else {
          this.disableSendOfferBtn()
          this.enableAcceptBtn()
        }
      }
    })

    const resourceWrapperMoney = document.createElement('div')
    resourceWrapperMoney.id = 'resourceWrapper'
    resourceWrapperMoney.appendChild(moneyItemName)
    resourceWrapperMoney.appendChild(moneyItemAmount)
    moneyItem.appendChild(resourceWrapperMoney)
    const tradeButtonWrapperMoney = document.createElement('div')
    tradeButtonWrapperMoney.id = 'tradeButtonWrapper'
    tradeButtonWrapperMoney.appendChild(moneyItemAmountBtnUp)
    tradeButtonWrapperMoney.appendChild(moneyItemAmountBtnDown)
    moneyItem.appendChild(tradeButtonWrapperMoney)
    const bidIndicatorWrapperMoney = document.createElement('div')
    bidIndicatorWrapperMoney.id = 'bidIndicatorWrapper'
    bidIndicatorWrapperMoney.appendChild(downBidMoney)
    bidIndicatorWrapperMoney.appendChild(stableBidMoney)
    bidIndicatorWrapperMoney.appendChild(upBidMoney)
    moneyItem.appendChild(bidIndicatorWrapperMoney)

    container.appendChild(moneyItem)
  }

  update(youOffer: TradeEquipment, youGet: TradeEquipment): void {
    this.youOffer = youOffer
    this.youGet = youGet
    this.changesDone = 0

    document.getElementById('tradeBoxContentPlayerOfferEq')?.remove()
    this.tradeBoxPlayerOfferEq = document.createElement('div')
    this.tradeBoxPlayerOfferEq.id = 'tradeBoxContentPlayerOfferEq'
    this.fillEq(this.tradeBoxPlayerOfferEq, youOffer, this.currPlayerEq, true)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

    document.getElementById('tradeBoxContentNeighborOfferEq')?.remove()
    this.tradeBoxNeighborOfferEq = document.createElement('div')
    this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'
    this.fillEq(this.tradeBoxNeighborOfferEq, youGet, this.otherPlayerEq, false)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborOfferEq)
  }

  setUserTurn(value: boolean): void {
    this.isUserTurn = value
    this.tradeBoxTitle.innerText = `Trade with ${this.otherPlayerId}`

    const you = document.getElementById('you')
    if (you) you.style.visibility = this.isUserTurn ? 'visible' : 'hidden'
    const notYou = document.getElementById('notYou')
    if (notYou) notYou.style.visibility = this.isUserTurn ? 'hidden' : 'visible'
  }

  disableAcceptBtn(): void {
    this.tradeBoxAccept.disabled = true
    this.tradeBoxAccept.style.display = 'none'
  }

  enableAcceptBtn(): void {
    this.tradeBoxAccept.disabled = false
    this.tradeBoxAccept.style.display = 'block'
  }

  disableSendOfferBtn(): void {
    this.tradeBoxSendOffer.disabled = true
    this.tradeBoxSendOffer.style.display = 'none'
  }

  enableSendOfferBtn(): void {
    this.tradeBoxSendOffer.disabled = false
    this.tradeBoxSendOffer.style.display = 'block'
  }

  disableBidElement(element: HTMLElement): void {
    element.style.display = 'none'
  }

  enableBidElement(element: HTMLElement): void {
    element.style.display = 'inline'
  }

  updateBidIndicators(
    oldValue: number,
    newValue: number,
    down: HTMLElement,
    stable: HTMLElement,
    up: HTMLElement,
  ): void {
    if (oldValue > newValue) {
      this.enableBidElement(down)
      this.disableBidElement(stable)
      this.disableBidElement(up)
    } else if (oldValue === newValue) {
      this.disableBidElement(down)
      this.enableBidElement(stable)
      this.disableBidElement(up)
    } else {
      this.disableBidElement(down)
      this.disableBidElement(stable)
      this.enableBidElement(up)
    }
  }

  resetBidIndicators(): void {
    for (const element of document.getElementsByClassName('stableBid'))
      (element as HTMLElement).style.display = 'inline'
    for (const element of document.getElementsByClassName('upBid'))
      (element as HTMLElement).style.display = 'none'
    for (const element of document.getElementsByClassName('downBid'))
      (element as HTMLElement).style.display = 'none'
  }

  show(): void {
    this.scene.interactionCloudBuiler.showInteractionCloud(this.scene.playerId, CloudType.TALK)
    window.document.body.appendChild(this.tradeBox)
    this.scene.movingEnabled = false
  }

  close(): void {
    this.scene.interactionCloudBuiler.hideInteractionCloud(this.scene.playerId, CloudType.TALK)
    document.getElementById('tradeBox')?.remove()
    this.scene.tradeWindow = null
    this.scene.movingEnabled = true
    this.scene.otherEquipment = undefined
    this.scene.otherPlayerId = undefined
  }
}
