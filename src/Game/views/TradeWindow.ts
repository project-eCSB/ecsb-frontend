import { type Scene } from '../scenes/Scene'
import { type PlayerEquipment } from '../../services/game/Types'

export class TradeWindow {
  isUserTurn: boolean
  scene: Scene
  currPlayerId: string
  otherPlayerId: string
  currPlayer: PlayerEquipment
  otherPlayer: PlayerEquipment
  youOffer: PlayerEquipment
  youGet: PlayerEquipment
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
      resources: currPlayer.resources.map((dto) => ({ name: dto.name, value: 0 })),
    }
    this.youGet = {
      time: 0,
      money: 0,
      resources: otherPlayer.resources.map((dto) => ({ name: dto.name, value: 0 })),
    }

    // CONTAIENR
    this.tradeBox = document.createElement('div')
    this.tradeBox.id = 'tradeBox'

    // TITLE
    this.tradeBoxTitle = document.createElement('h1')
    this.tradeBoxTitle.id = 'tradeBoxTitle'
    this.tradeBoxTitle.innerText = `Trade with ${this.otherPlayerId} - ${
      this.isUserTurn ? 'your turn' : 'wait for your turn'
    }`

    // CONTENT
    this.tradeBoxContent = document.createElement('div')
    this.tradeBoxContent.id = 'tradeBoxContent'

    this.tradeBoxPlayer = document.createElement('div')
    this.tradeBoxPlayer.id = 'tradeBoxContentPlayer'

    this.tradeBoxPlayerTitle = document.createElement('h2')
    this.tradeBoxPlayerTitle.innerText = 'You Offer'

    this.tradeBoxPlayerOfferEq = document.createElement('div')
    this.tradeBoxPlayerOfferEq.id = 'tradeBoxContentPlayerOfferEq'

    this.fillEq(this.tradeBoxPlayerOfferEq, this.youOffer, this.currPlayer)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerTitle)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

    this.tradeBoxNeighbor = document.createElement('div')
    this.tradeBoxNeighbor.id = 'tradeBoxContentNeighbor'

    this.tradeBoxNeighborTitle = document.createElement('h2')
    this.tradeBoxNeighborTitle.innerText = 'You Get'

    this.tradeBoxNeighborOfferEq = document.createElement('div')
    this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'

    this.fillEq(this.tradeBoxNeighborOfferEq, this.youGet, this.otherPlayer)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborTitle)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborOfferEq)

    this.tradeBoxContent.appendChild(this.tradeBoxPlayer)
    this.tradeBoxContent.appendChild(this.tradeBoxNeighbor)

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
  ): void {
    for (const resource of offer.resources) {
      const resourceItem = document.createElement('div')
      const upperBoundary = realState?.resources.find((item) => item.name === resource.name)?.value
      const resourceItemName = document.createElement('h5')
      resourceItemName.innerText = resource.name

      const tradeBoxPlayerOfferEqItemAmount = document.createElement('p')
      tradeBoxPlayerOfferEqItemAmount.innerText = `${resource.value}`

      const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
      tradeBoxPlayerOfferEqItemBtnUp.innerText = '+'
      tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.isUserTurn && upperBoundary! > resource.value) {
          tradeBoxPlayerOfferEqItemAmount.innerText = `${
            parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) + 1
          }`
          resource.value += 1
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
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
          this.enableSendOfferBtn()
          this.disableAcceptBtn()
        }
      })

      resourceItem.appendChild(resourceItemName)
      resourceItem.appendChild(tradeBoxPlayerOfferEqItemAmount)
      resourceItem.appendChild(tradeBoxPlayerOfferEqItemBtnUp)
      resourceItem.appendChild(tradeBoxPlayerOfferEqItemBtnDown)

      container.appendChild(resourceItem)
    }

    const moneyItem = document.createElement('div')
    const moneyUpperBoundary = realState.money
    const moneyItemName = document.createElement('h5')
    moneyItemName.innerText = 'money'

    const moneyItemAmount = document.createElement('p')
    moneyItemAmount.innerText = `${offer.money}`

    const moneyItemAmountBtnUp = document.createElement('button')
    moneyItemAmountBtnUp.innerText = '+'
    moneyItemAmountBtnUp.addEventListener('click', () => {
      if (this.isUserTurn && moneyUpperBoundary > offer.money) {
        moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) + 1}`
        offer.money += 1
        this.enableSendOfferBtn()
        this.disableAcceptBtn()
      }
    })
    const moneyItemAmountBtnDown = document.createElement('button')
    moneyItemAmountBtnDown.innerText = '-'
    moneyItemAmountBtnDown.addEventListener('click', () => {
      if (this.isUserTurn && offer.money > 0) {
        if (parseInt(moneyItemAmount.innerText) === 0) return
        moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) - 1}`
        offer.money -= 1
        this.enableSendOfferBtn()
        this.disableAcceptBtn()
      }
    })

    moneyItem.appendChild(moneyItemName)
    moneyItem.appendChild(moneyItemAmount)
    moneyItem.appendChild(moneyItemAmountBtnUp)
    moneyItem.appendChild(moneyItemAmountBtnDown)
    container.appendChild(moneyItem)

    const timeItem = document.createElement('div')
    const timeUpperBoundary = realState.time
    const timeItemName = document.createElement('h5')
    timeItemName.innerText = 'time'

    const timeItemAmount = document.createElement('p')
    timeItemAmount.innerText = `${offer.time}`

    const timeItemBtnUp = document.createElement('button')
    timeItemBtnUp.innerText = '+'
    timeItemBtnUp.addEventListener('click', () => {
      if (this.isUserTurn && timeUpperBoundary > offer.time) {
        timeItemAmount.innerText = `${parseInt(timeItemAmount.innerText) + 1}`
        offer.time += 1
        this.enableSendOfferBtn()
        this.disableAcceptBtn()
      }
    })
    const timeItemBtnUpDown = document.createElement('button')
    timeItemBtnUpDown.innerText = '-'
    timeItemBtnUpDown.addEventListener('click', () => {
      if (this.isUserTurn && offer.time > 0) {
        if (parseInt(timeItemAmount.innerText) === 0) return
        timeItemAmount.innerText = `${parseInt(timeItemAmount.innerText) - 1}`
        offer.time -= 1
        this.enableSendOfferBtn()
        this.disableAcceptBtn()
      }
    })

    timeItem.appendChild(timeItemName)
    timeItem.appendChild(timeItemAmount)
    timeItem.appendChild(timeItemBtnUp)
    timeItem.appendChild(timeItemBtnUpDown)
    container.appendChild(timeItem)
  }

  update(youOffer: PlayerEquipment, youGet: PlayerEquipment): void {
    this.youOffer = youOffer
    this.youGet = youGet

    document.getElementById('tradeBoxContentPlayerOfferEq')?.remove()
    this.tradeBoxPlayerOfferEq = document.createElement('div')
    this.tradeBoxPlayerOfferEq.id = 'tradeBoxContentPlayerOfferEq'
    this.fillEq(this.tradeBoxPlayerOfferEq, youOffer, this.currPlayer)
    this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

    document.getElementById('tradeBoxContentNeighborOfferEq')?.remove()
    this.tradeBoxNeighborOfferEq = document.createElement('div')
    this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'
    this.fillEq(this.tradeBoxNeighborOfferEq, youGet, this.otherPlayer)
    this.tradeBoxNeighbor.appendChild(this.tradeBoxNeighborOfferEq)
  }

  setUserTurn(value: boolean): void {
    this.isUserTurn = value
    this.tradeBoxTitle.innerText = `Trade with ${this.otherPlayerId} - ${
      this.isUserTurn ? 'your turn' : 'wait for your turn'
    }`
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

  show(): void {
    window.document.body.appendChild(this.tradeBox)
    this.scene.movingEnabled = false
  }

  close(): void {
    document.getElementById('tradeBox')?.remove()
    this.scene.tradeWindow = null
    this.scene.movingEnabled = true
  }
}
