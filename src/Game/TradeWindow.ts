import { PlayerState, Scene } from "./scenes/Scene";

export class TradeWindow {
    scene: Scene
    currPlayer: PlayerState;
    otherPlayer: PlayerState;
    tradeBox: HTMLDivElement;
    tradeBoxTitle: HTMLHeadingElement;
    tradeBoxContent: HTMLDivElement;
    tradeBoxPlayer: HTMLDivElement;
    tradeBoxPlayerTitle: HTMLHeadingElement;
    tradeBoxPlayerOfferEq: HTMLDivElement;
    tradeBoxNeighbor: HTMLDivElement;
    tradeBoxNeighborTitle: HTMLHeadingElement;
    tradeBoxNeighborOfferEq: HTMLDivElement;
    tradeBoxButtons: HTMLDivElement;
    tradeBoxAccept: HTMLButtonElement;
    tradeBoxSendOffer: HTMLButtonElement;
    tradeBoxClose: HTMLButtonElement;

    constructor(scene: Scene, currPlayer: PlayerState, currPlayerId: string, otherPlayer: PlayerState, otherPlayerId: string) {
        scene.movingEnabled = false
        this.scene = scene
        this.currPlayer = currPlayer;
        this.otherPlayer = otherPlayer;

        // CONTAIENR
        this.tradeBox = document.createElement('div')
        this.tradeBox.id = 'tradeBox'
    
        // TITLE
        this.tradeBoxTitle = document.createElement('h1')
        this.tradeBoxTitle.id = 'tradeBoxTitle'
        this.tradeBoxTitle.innerText = `Trade with ${otherPlayerId}`
        
        // CONTENT
        this.tradeBoxContent = document.createElement('div')
        this.tradeBoxContent.id = 'tradeBoxContent'

        this.tradeBoxPlayer = document.createElement('div')
        this.tradeBoxPlayer.id = 'tradeBoxContentPlayer'

        this.tradeBoxPlayerTitle = document.createElement('h2')
        this.tradeBoxPlayerTitle.innerText = 'You Offer'

        this.tradeBoxPlayerOfferEq = document.createElement('div')
        this.tradeBoxPlayerOfferEq.id = 'tradeBoxContentPlayerOfferEq'

        this.fillEq(this.tradeBoxPlayerOfferEq)
        this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerTitle)
        this.tradeBoxPlayer.appendChild(this.tradeBoxPlayerOfferEq)

        this.tradeBoxNeighbor = document.createElement('div')
        this.tradeBoxNeighbor.id = 'tradeBoxContentNeighbor'

        this.tradeBoxNeighborTitle = document.createElement('h2')
        this.tradeBoxNeighborTitle.innerText = 'You Get'

        this.tradeBoxNeighborOfferEq = document.createElement('div')
        this.tradeBoxNeighborOfferEq.id = 'tradeBoxContentNeighborOfferEq'

        this.fillEq(this.tradeBoxNeighborOfferEq)
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
            // TODO
        })

        this.tradeBoxSendOffer = document.createElement('button')
        this.tradeBoxSendOffer.id = 'tradeBoxSendOfferBtn'
        this.tradeBoxSendOffer.innerText = 'Send Offer'
        this.tradeBoxSendOffer.addEventListener('click', () => {
            // TODO
        })

        this.tradeBoxClose = document.createElement('button')
        this.tradeBoxClose.id = 'tradeBoxCloseBtn'
        this.tradeBoxClose.innerText = 'Close'
        this.tradeBoxClose.addEventListener('click', () => {
        document.getElementById('tradeBox')?.remove()
        this.close()
            scene.movingEnabled = true
        })

        this.tradeBoxButtons.appendChild(this.tradeBoxAccept)
        this.tradeBoxButtons.appendChild(this.tradeBoxSendOffer)
        this.tradeBoxButtons.appendChild(this.tradeBoxClose)

        this.tradeBox.appendChild(this.tradeBoxTitle)
        this.tradeBox.appendChild(this.tradeBoxContent)
        this.tradeBox.appendChild(this.tradeBoxButtons)
    }

    private fillEq(container: HTMLDivElement): void {
        for (const eq of this.scene.settings.classResourceRepresentation) {
          const resourceItem = document.createElement('div')
    
          const resourceItemName = document.createElement('h5')
          resourceItemName.innerText = eq.gameResourceName
    
          const tradeBoxPlayerOfferEqItemAmount = document.createElement('p')
          tradeBoxPlayerOfferEqItemAmount.innerText = `${0}`
    
          const tradeBoxPlayerOfferEqItemBtnUp = document.createElement('button')
          tradeBoxPlayerOfferEqItemBtnUp.innerText = '+'
          tradeBoxPlayerOfferEqItemBtnUp.addEventListener('click', () => {
            tradeBoxPlayerOfferEqItemAmount.innerText = `${parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) + 1}`
          })
          const tradeBoxPlayerOfferEqItemBtnDown = document.createElement('button')
          tradeBoxPlayerOfferEqItemBtnDown.innerText = '-'
          tradeBoxPlayerOfferEqItemBtnDown.addEventListener('click', () => {
            if (parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) === 0) return
            tradeBoxPlayerOfferEqItemAmount.innerText = `${parseInt(tradeBoxPlayerOfferEqItemAmount.innerText) - 1}`
          })
    
          resourceItem.appendChild(resourceItemName)
          resourceItem.appendChild(tradeBoxPlayerOfferEqItemAmount)
          resourceItem.appendChild(tradeBoxPlayerOfferEqItemBtnUp)
          resourceItem.appendChild(tradeBoxPlayerOfferEqItemBtnDown)
    
          container.appendChild(resourceItem)
        }
    
        const moneyItem = document.createElement('div')
    
        const moneyItemName = document.createElement('h5')
        moneyItemName.innerText = 'money'
    
        const moneyItemAmount = document.createElement('p')
        moneyItemAmount.innerText = `${0}`
    
        const moneyItemAmountBtnUp = document.createElement('button')
        moneyItemAmountBtnUp.innerText = '+'
        moneyItemAmountBtnUp.addEventListener('click', () => {
          moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) + 1}`
        })
        const moneyItemAmountBtnDown = document.createElement('button')
        moneyItemAmountBtnDown.innerText = '-'
        moneyItemAmountBtnDown.addEventListener('click', () => {
          if (parseInt(moneyItemAmount.innerText) === 0) return
          moneyItemAmount.innerText = `${parseInt(moneyItemAmount.innerText) - 1}`
        })
    
        moneyItem.appendChild(moneyItemName)
        moneyItem.appendChild(moneyItemAmount)
        moneyItem.appendChild(moneyItemAmountBtnUp)
        moneyItem.appendChild(moneyItemAmountBtnDown)
        container.appendChild(moneyItem)
    
        const timeItem = document.createElement('div')
    
        const timeItemName = document.createElement('h5')
        timeItemName.innerText = 'time'
    
        const timeItemAmount = document.createElement('p')
        timeItemAmount.innerText = `${0}`
    
        const timeItemBtnUp = document.createElement('button')
        timeItemBtnUp.innerText = '+'
        timeItemBtnUp.addEventListener('click', () => {
          timeItemAmount.innerText = `${parseInt(timeItemAmount.innerText) + 1}`
        })
        const timeItemBtnUpDown = document.createElement('button')
        timeItemBtnUpDown.innerText = '-'
        timeItemBtnUpDown.addEventListener('click', () => {
          if (parseInt(timeItemAmount.innerText) === 0) return
          timeItemAmount.innerText = `${parseInt(timeItemAmount.innerText) - 1}`
        })
    
        timeItem.appendChild(timeItemName)
        timeItem.appendChild(timeItemAmount)
        timeItem.appendChild(timeItemBtnUp)
        timeItem.appendChild(timeItemBtnUpDown)
        container.appendChild(timeItem)
      }
    
    disableAcceptBtn() {
        this.tradeBoxAccept.disabled = true
        this.tradeBoxAccept.style.display = 'none'
    }

    enableAcceptBtn() {
        this.tradeBoxAccept.disabled = false
        this.tradeBoxAccept.style.display = 'block'
    }

    disableSendOfferBtn() {
        this.tradeBoxSendOffer.disabled = true
        this.tradeBoxSendOffer.style.display = 'none'
    }

    enableSendOfferBtn() {
        this.tradeBoxSendOffer.disabled = false
        this.tradeBoxSendOffer.style.display = 'block'
    }

    show() {
        window.document.body.appendChild(this.tradeBox) 
    }

    close() {
        document.getElementById('tradeBox')?.remove()
        this.scene.tradeWindow = null
    }
}