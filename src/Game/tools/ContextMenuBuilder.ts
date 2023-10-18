import { toast } from 'react-toastify'
import { type Scene } from '../scenes/Scene'
import {
  OutcomingTradeMessageType,
  sendTradeMessage,
} from '../webSocketMessage/chat/TradeMessageHandler'
import { TOAST_INVITE_MSG } from '../GameUtils'

export class ContextMenuBuilder {
  private static readonly buttonPartnershipWrapperID = 'buttonPartnershipWrapper'
  private static readonly buttonTradeWrapperID = 'buttonTradeWrapper'

  build(scene: Scene, id: string): HTMLDivElement {
    const div = document.createElement('div')
    div.id = 'btns'
    div.style.backgroundColor = 'transparent'

    const buttonPartnership = document.createElement('button')
    buttonPartnership.style.width = '69px'
    buttonPartnership.style.height = '61px'
    const imgPartnership = document.createElement('img')
    imgPartnership.src = '/assets/coopCustomIcon.png'
    buttonPartnership.appendChild(imgPartnership)
    buttonPartnership.onclick = (_: Event) => {
      window.document.getElementById('btns')?.remove()
      scene.actionTrade = null
    }

    const buttonTrade = document.createElement('button')
    buttonTrade.style.width = '69px'
    buttonTrade.style.height = '61px'
    const imgTrade = document.createElement('img')
    imgTrade.src = '/assets/tradeCustomIcon.png'
    buttonTrade.appendChild(imgTrade)
    buttonTrade.onclick = (_: Event) => {
      window.document.getElementById('btns')?.remove()
      sendTradeMessage(scene.chatWs, {
        senderId: scene.playerId,
        message: {
          type: OutcomingTradeMessageType.ProposeTrade,
          proposalReceiverId: id,
        },
      })
      toast(TOAST_INVITE_MSG, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
      scene.actionTrade = null
    }

    const buttonPartnershipWrapper = document.createElement('div')
    buttonPartnershipWrapper.id = ContextMenuBuilder.buttonPartnershipWrapperID
    buttonPartnershipWrapper.appendChild(buttonPartnership)
    const buttonTradeWrapper = document.createElement('div')
    buttonTradeWrapper.id = ContextMenuBuilder.buttonTradeWrapperID
    buttonTradeWrapper.appendChild(buttonTrade)
    div.appendChild(buttonPartnershipWrapper)
    div.appendChild(buttonTradeWrapper)

    return div
  }
}
