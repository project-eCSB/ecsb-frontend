import { toast } from 'react-toastify'
import { type Scene } from '../scenes/Scene'
import {
  OutcomingTradeMessageType,
  sendTradeMessage,
} from '../webSocketMessage/chat/TradeMessageHandler'

export class ContextMenuBuilder {
  build(scene: Scene, id: string): HTMLDivElement {
    const div = document.createElement('div')
    div.id = 'btns'
    div.style.backgroundColor = 'transparent'

    const buttonPartnership = document.createElement('button')
    const buttonPartnershipText = document.createElement('p')
    const iconPartnership = document.createElement('i')
    iconPartnership.className = 'fa fa-handshake-o'
    iconPartnership.ariaHidden = 'true'
    buttonPartnershipText.innerText = 'Company'
    buttonPartnership.appendChild(iconPartnership)
    buttonPartnership.appendChild(buttonPartnershipText)
    buttonPartnership.onclick = (e: Event) => {
      window.document.getElementById('btns')?.remove()
      scene.actionTrade = null
    }

    const buttonTrade = document.createElement('button')
    const buttonTradeText = document.createElement('p')
    const iconTrade = document.createElement('i')
    iconTrade.className = 'fa fa-exchange'
    iconTrade.ariaHidden = 'true'
    buttonTradeText.innerText = 'Trade'
    buttonTrade.appendChild(iconTrade)
    buttonTrade.appendChild(buttonTradeText)
    buttonTrade.onclick = (e: Event) => {
      window.document.getElementById('btns')?.remove()
      sendTradeMessage(scene.chatWs, {
        senderId: scene.playerId,
        message: {
          type: OutcomingTradeMessageType.ProposeTrade,
          proposalReceiverId: id,
        },
      })
      toast.info('Trade invite sent', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
      scene.actionTrade = null
    }

    div.appendChild(buttonPartnership)
    div.appendChild(buttonTrade)

    return div
  }
}
