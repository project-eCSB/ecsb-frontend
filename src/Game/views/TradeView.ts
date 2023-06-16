import { type Scene } from '../scenes/Scene'
import { type PlayerEquipment } from '../../services/game/Types'
import { CloudType } from '../scenes/Types'
import { SPRITE_WIDTH, SPRITE_HEIGHT } from '../GameUtils'

export class TradeView {
  isUserTurn: boolean
  scene: Scene
  currPlayerId: string
  otherPlayerId: string
  currPlayer: PlayerEquipment
  otherPlayer: PlayerEquipment
  youOfferPrevious: PlayerEquipment
  youGetPrevious: PlayerEquipment
  youOffer: PlayerEquipment
  youGet: PlayerEquipment
  changesDone: number
  tradeBox: HTMLDivElement
  tradeBoxTitle: HTMLHeadingElement
  tradeBoxContent: HTMLDivElement
  tradeBoxPlayer: HTMLDivElement
  tradeBoxPlayerTitle: HTMLHeadingElement
  tradeBoxPlayerOfferEq: HTMLDivElement
  tradeBoxNeighbor: HTMLDivElement
  tradeBoxNeighborTitle: HTMLHeadingElement
  tradeBoxNeighborOfferEq: HTMLDivElement
  tradeBoxButtons: HTMLDivElement
  tradeBoxAccept: HTMLButtonElement
  tradeBoxSendOffer: HTMLButtonElement
  tradeBoxClose: HTMLButtonElement

  constructor(
    scene: Scene,
    currPlayer: PlayerEquipment,
    currPlayerId: string,
    otherPlayer: PlayerEquipment,
    otherPlayerId: string,
    isUserTurn: boolean,
  ) {
    this.isUserTurn = isUserTurn
    this.currPlayerId = currPlayerId
    this.otherPlayerId = otherPlayerId
    this.scene = scene
    this.currPlayer = currPlayer
    this.otherPlayer = otherPlayer
    this.youOffer = {
      time: 0,
      money: 0,
      resources: currPlayer.resources.map((dto) => ({ key: dto.key, value: 0 })),
    }
    this.youGet = {
      time: 0,
      money: 0,
      resources: otherPlayer.resources.map((dto) => ({ key: dto.key, value: 0 })),
    }
    this.youOfferPrevious = {
      time: 0,
      money: 0,
      resources: currPlayer.resources.map((dto) => ({ key: dto.key, value: 0 })),
    }
    this.youGetPrevious = {
      time: 0,
      money: 0,
      resources: otherPlayer.resources.map((dto) => ({ key: dto.key, value: 0 })),
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

    this.fillEq(this.tradeBoxPlayerOfferEq, this.youOffer, this.currPlayer, true)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerTitle)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

    this.tradeBoxNeighbor = document.createElement('div')
    this.tradeBoxNeighbor.id = 'tradeBoxContentNeighbor'

    this.tradeBoxNeighborTitle = document.createElement('h2')
    this.tradeBoxNeighborTitle.innerText = 'You Get'

    this.tradeBoxNeighborOfferEq = document.createElement('div')
    this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'

    this.fillEq(this.tradeBoxNeighborOfferEq, this.youGet, this.otherPlayer, false)
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
    youDiv.appendChild(scene.imageCropper.crop(scene, currPlayerId, SPRITE_WIDTH, SPRITE_HEIGHT, '/assets/characters.png', 4))
    youDiv.appendChild(iconUp)
    opponentDiv.appendChild(scene.imageCropper.crop(scene, otherPlayerId, SPRITE_WIDTH, SPRITE_HEIGHT, '/assets/characters.png', 4))
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
    offer: PlayerEquipment,
    realState: PlayerEquipment,
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
      downBid.className = 'arrow fa fa-arrow-down'
      downBid.ariaHidden = 'true'
      downBid.id = 'downBid'
      const stableBid = document.createElement('i')
      stableBid.className = 'arrow fa fa-minus'
      stableBid.ariaHidden = 'true'
      stableBid.id = 'stableBid'
      const upBid = document.createElement('i')
      upBid.className = 'arrow fa fa-arrow-up'
      upBid.ariaHidden = 'true'
      upBid.id = 'upBid'

      this.updateBidIndicators(
        (playerEq ? this.youOfferPrevious : this.youGetPrevious).resources.find((item) => item.key === resource.key)!.value,
        resource.value,
        downBid,
        stableBid,
        upBid,
      )

      const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
      tradeBoxPlayerOfferEqItemBtnUp.innerText = '+'
      tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.isUserTurn && upperBoundary! > resource.value) {
          tradeBoxPlayerOfferEqItemAmount.innerText = `${
            parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) + 1
          }`
          resource.value += 1

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (resource.value === bid.resources.find((item: { key: string }) => item.key === resource.key)!.value + 1) this.changesDone += 1
          if (resource.value === bid.resources.find((item: { key: string }) => item.key === resource.key)!.value) this.changesDone -= 1

          if (this.changesDone !== 0){
            this.enableSendOfferBtn()
            this.disableAcceptBtn()
          } else {
            this.disableSendOfferBtn()
            this.enableAcceptBtn()
          }
        }
      })
      const tradeBoxPlayerOfferEqItemBtnDown = document.createElement('button')
      tradeBoxPlayerOfferEqItemBtnDown.innerText = '-'
      tradeBoxPlayerOfferEqItemBtnDown.addEventListener('click', () => {
        if (this.isUserTurn && resource.value > 0) {
          if (parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) === 0) return
          tradeBoxPlayerOfferEqItemAmount.innerText = `${
            parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) - 1
          }`
          resource.value -= 1

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (resource.value === bid.resources.find((item: { key: string }) => item.key === resource.key)!.value - 1) this.changesDone += 1
          if (resource.value === bid.resources.find((item: { key: string }) => item.key === resource.key)!.value) this.changesDone -= 1

          if (this.changesDone !== 0){
            this.enableSendOfferBtn()
            this.disableAcceptBtn()
          } else {
            this.disableSendOfferBtn()
            this.enableAcceptBtn()
          }
        }
      })

      resourceItem.appendChild(resourceItemName)
      resourceItem.appendChild(tradeBoxPlayerOfferEqItemAmount)
      resourceItem.appendChild(tradeBoxPlayerOfferEqItemBtnUp)
      resourceItem.appendChild(tradeBoxPlayerOfferEqItemBtnDown)
      resourceItem.appendChild(downBid)
      resourceItem.appendChild(stableBid)
      resourceItem.appendChild(upBid)

      container.appendChild(resourceItem)
    }

    const moneyItem = document.createElement('div')
    const moneyUpperBoundary = realState.money
    const moneyItemName = document.createElement('h5')
    moneyItemName.innerText = 'money'

    const moneyItemAmount = document.createElement('p')
    moneyItemAmount.innerText = `${offer.money}`

    const downBidMoney = document.createElement('i')
    downBidMoney.className = 'arrow fa fa-arrow-down'
    downBidMoney.ariaHidden = 'true'
    downBidMoney.id = 'downBid'
    const stableBidMoney = document.createElement('i')
    stableBidMoney.className = 'arrow fa fa-minus'
    stableBidMoney.ariaHidden = 'true'
    stableBidMoney.id = 'stableBid'
    const upBidMoney = document.createElement('i')
    upBidMoney.className = 'arrow fa fa-arrow-up'
    upBidMoney.ariaHidden = 'true'
    upBidMoney.id = 'upBid'

    this.updateBidIndicators(
      (playerEq ? this.youOfferPrevious : this.youGetPrevious).money,
      offer.money,
      downBidMoney,
      stableBidMoney,
      upBidMoney,
    )

    const moneyItemAmountBtnUp = document.createElement('button')
    moneyItemAmountBtnUp.innerText = '+'
    moneyItemAmountBtnUp.addEventListener('click', () => {
      if (this.isUserTurn && moneyUpperBoundary > offer.money) {
        moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) + 1}`
        offer.money += 1
        
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (offer.money === bid.money + 1) this.changesDone += 1
        if (offer.money === bid.money) this.changesDone -= 1

        if (this.changesDone !== 0){
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        } else {
          this.disableSendOfferBtn()
          this.enableAcceptBtn()
        }
      }
    })
    const moneyItemAmountBtnDown = document.createElement('button')
    moneyItemAmountBtnDown.innerText = '-'
    moneyItemAmountBtnDown.addEventListener('click', () => {
      if (this.isUserTurn && offer.money > 0) {
        if (parseInt(moneyItemAmount.innerText) === 0) return
        moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) - 1}`
        offer.money -= 1
        
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (offer.money === bid.money - 1) this.changesDone += 1
        if (offer.money === bid.money) this.changesDone -= 1

        if (this.changesDone !== 0){
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        } else {
          this.disableSendOfferBtn()
          this.enableAcceptBtn()
        }
      }
    })

    moneyItem.appendChild(moneyItemName)
    moneyItem.appendChild(moneyItemAmount)
    moneyItem.appendChild(moneyItemAmountBtnUp)
    moneyItem.appendChild(moneyItemAmountBtnDown)
    moneyItem.appendChild(downBidMoney)
    moneyItem.appendChild(stableBidMoney)
    moneyItem.appendChild(upBidMoney)

    container.appendChild(moneyItem)

    const timeItem = document.createElement('div')
    const timeUpperBoundary = realState.time
    const timeItemName = document.createElement('h5')
    timeItemName.innerText = 'time'

    const timeItemAmount = document.createElement('p')
    timeItemAmount.innerText = `${offer.time}`

    const downBidTime = document.createElement('i')
    downBidTime.className = 'arrow fa fa-arrow-down'
    downBidTime.ariaHidden = 'true'
    downBidTime.id = 'downBid'
    const stableBidTime = document.createElement('i')
    stableBidTime.className = 'arrow fa fa-minus'
    stableBidTime.ariaHidden = 'true'
    stableBidTime.id = 'stableBid'
    const upBidTime = document.createElement('i')
    upBidTime.className = 'arrow fa fa-arrow-up'
    upBidTime.ariaHidden = 'true'
    upBidTime.id = 'upBid'

    this.updateBidIndicators(
      (playerEq ? this.youOfferPrevious : this.youGetPrevious).time,
      offer.time,
      downBidTime,
      stableBidTime,
      upBidTime,
    )

    const timeItemBtnUp = document.createElement('button')
    timeItemBtnUp.innerText = '+'
    timeItemBtnUp.addEventListener('click', () => {
      if (this.isUserTurn && timeUpperBoundary > offer.time) {
        timeItemAmount.innerText = `${parseInt(timeItemAmount.innerText) + 1}`
        offer.time += 1
        
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (offer.time === bid.time + 1) this.changesDone += 1
        if (offer.time === bid.time) this.changesDone -= 1

        if (this.changesDone !== 0){
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        } else {
          this.disableSendOfferBtn()
          this.enableAcceptBtn()
        }
      }
    })
    const timeItemBtnUpDown = document.createElement('button')
    timeItemBtnUpDown.innerText = '-'
    timeItemBtnUpDown.addEventListener('click', () => {
      if (this.isUserTurn && offer.time > 0) {
        if (parseInt(timeItemAmount.innerText) === 0) return
        timeItemAmount.innerText = `${parseInt(timeItemAmount.innerText) - 1}`
        offer.time -= 1
        
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (offer.time === bid.time - 1) this.changesDone += 1
        if (offer.time === bid.time) this.changesDone -= 1

        if (this.changesDone !== 0){
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        } else {
          this.disableSendOfferBtn()
          this.enableAcceptBtn()
        }
      }
    })

    timeItem.appendChild(timeItemName)
    timeItem.appendChild(timeItemAmount)
    timeItem.appendChild(timeItemBtnUp)
    timeItem.appendChild(timeItemBtnUpDown)
    timeItem.appendChild(downBidTime)
    timeItem.appendChild(stableBidTime)
    timeItem.appendChild(upBidTime)

    container.appendChild(timeItem)
  }

  update(youOffer: PlayerEquipment, youGet: PlayerEquipment): void {
    this.youOffer = youOffer
    this.youGet = youGet
    this.changesDone = 0

    document.getElementById('tradeBoxContentPlayerOfferEq')?.remove()
    this.tradeBoxPlayerOfferEq = document.createElement('div')
    this.tradeBoxPlayerOfferEq.id = 'tradeBoxContentPlayerOfferEq'
    this.fillEq(this.tradeBoxPlayerOfferEq, youOffer, this.currPlayer, true)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

    document.getElementById('tradeBoxContentNeighborOfferEq')?.remove()
    this.tradeBoxNeighborOfferEq = document.createElement('div')
    this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'
    this.fillEq(this.tradeBoxNeighborOfferEq, youGet, this.otherPlayer, false)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborOfferEq)
  }

  setUserTurn(value: boolean): void {
    this.isUserTurn = value
    this.tradeBoxTitle.innerText = `Trade with ${this.otherPlayerId}`

    const you = document.getElementById('you')
    if(you) you.style.visibility = this.isUserTurn ? 'visible' : 'hidden'
    const notYou = document.getElementById('notYou')
    if(notYou) notYou.style.visibility = this.isUserTurn ? 'hidden' : 'visible'
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

  updateBidIndicators(oldValue: number, newValue: number, down: HTMLElement, stable: HTMLElement, up: HTMLElement): void {
    if (oldValue > newValue){
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

  show(): void {
    this.scene.cloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.TALK)
    window.document.body.appendChild(this.tradeBox)
    this.scene.movingEnabled = false
  }

  close(): void {
    this.scene.cloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.TALK)
    document.getElementById('tradeBox')?.remove()
    this.scene.tradeWindow = null
    this.scene.movingEnabled = true
  }
}
