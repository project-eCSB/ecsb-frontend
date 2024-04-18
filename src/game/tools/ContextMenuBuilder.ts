import { toast } from 'react-toastify'
import { type Scene } from '../scenes/Scene'
import { OutcomingTradeMessageType, sendTradeMessage } from '../webSocketMessage/chat/TradeMessageHandler'
import { TOAST_INVITE_MSG, TOAST_INVITE_MSG_COOP } from '../GameUtils'
import { OutcomingCoopMessageType, sendCoopMessage } from '../webSocketMessage/chat/CoopMessageHandler'

export class ContextMenuBuilder {
  private static readonly buttonPartnershipWrapperID = 'buttonPartnershipWrapper'
  private static readonly buttonTradeWrapperID = 'buttonTradeWrapper'
  private static readonly buttonsWrapperID = 'buttonsWrapper'
  private static readonly buttonWithCloudID = 'buttonWithCloud'
  private static readonly cityCloudID = 'cityCloud'

  build(scene: Scene, id: string): HTMLDivElement {
    const div = document.createElement('div')
    div.id = 'btns'
    div.style.backgroundColor = 'transparent'
    const divInside = document.createElement('div')
    divInside.id = ContextMenuBuilder.buttonsWrapperID

    if (
      scene.plannedTravel &&
      scene.plannedTravel.travel.value.name === scene.playerAdvertisedTravel[id]
    ) {
      const otherTravel = this.configureOtherTravel()
      const imgGetIntoPartnership = this.configureImage()
      const buttonGetIntoPartnership = this.configureButton()
      buttonGetIntoPartnership.appendChild(imgGetIntoPartnership)
      buttonGetIntoPartnership.onclick = (_: Event) => {
        window.document.getElementById('btns')?.remove()
        scene.actionTrade = null

        sendCoopMessage(scene.chatWs, {
          type: OutcomingCoopMessageType.ProposeOwnTravel,
          travelName: scene.plannedTravel!.travel.value.name,
          guestId: id,
        })
        this.coopInviteConfirmation()
      }
      this.addCity(scene, id, otherTravel, divInside, buttonGetIntoPartnership)
    } else {
      if (scene.plannedTravel) {
        const imgProposePartnership = this.configureImage()
        const buttonProposePartnership = this.configureButton()
        if (scene.playerAdvertisedTravel[id]) {
          imgProposePartnership.src = '/assets/coopProposeCustomIcon.png'
          imgProposePartnership.style.width = '25px'
        }
        buttonProposePartnership.appendChild(imgProposePartnership)
        buttonProposePartnership.onclick = (_: Event) => {
          window.document.getElementById('btns')?.remove()
          scene.actionTrade = null

          sendCoopMessage(scene.chatWs, {
            type: OutcomingCoopMessageType.ProposeOwnTravel,
            travelName: scene.plannedTravel!.travel.value.name,
            guestId: id,
          })
          this.coopInviteConfirmation()
        }
        const buttonProposePartnershipWrapper = document.createElement('div')
        buttonProposePartnershipWrapper.id = ContextMenuBuilder.buttonPartnershipWrapperID
        buttonProposePartnershipWrapper.appendChild(buttonProposePartnership)
        divInside.appendChild(buttonProposePartnershipWrapper)
      }

      if (scene.playerAdvertisedTravel[id]) {
        const otherTravel = this.configureOtherTravel()
        const imgGetIntoPartnership = this.configureImage()
        const buttonGetIntoPartnership = this.configureButton()
        if (scene.plannedTravel) {
          imgGetIntoPartnership.src = '/assets/coopJoinCustomIcon.png'
          imgGetIntoPartnership.style.width = '25px'
        }
        buttonGetIntoPartnership.appendChild(imgGetIntoPartnership)
        buttonGetIntoPartnership.onclick = (_: Event) => {
          window.document.getElementById('btns')?.remove()
          scene.actionTrade = null
          if (scene.playerAdvertisedTravel[id] !== undefined) {
            if (scene.plannedTravel) {
              sendCoopMessage(scene.chatWs, {
                type: OutcomingCoopMessageType.GatheringJoinPlanning,
                ownerId: id,
              })
            } else {
              sendCoopMessage(scene.chatWs, {
                type: OutcomingCoopMessageType.SimpleJoinPlanning,
                ownerId: id,
              })
            }
            this.coopInviteConfirmation()
          }
        }
        this.addCity(scene, id, otherTravel, divInside, buttonGetIntoPartnership)
      }
    }

    const buttonTrade = this.configureButton()
    const imgTrade = document.createElement('img')
    imgTrade.src = '/assets/tradeCustomIcon.png'
    imgTrade.style.width = '25px'
    buttonTrade.appendChild(imgTrade)
    buttonTrade.onclick = (_: Event) => {
      window.document.getElementById('btns')?.remove()
      sendTradeMessage(scene.chatWs, {
        type: OutcomingTradeMessageType.ProposeTrade,
        proposalReceiverId: id,
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
    const buttonTradeWrapper = document.createElement('div')
    buttonTradeWrapper.id = ContextMenuBuilder.buttonTradeWrapperID
    buttonTradeWrapper.appendChild(buttonTrade)
    divInside.appendChild(buttonTradeWrapper)

    div.appendChild(divInside)

    return div
  }

  coopInviteConfirmation(): void {
    toast(TOAST_INVITE_MSG_COOP, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeButton: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    })
  }

  addCity(scene: Scene, id: string, otherTravel: HTMLDivElement, divInside: HTMLDivElement, buttonGetIntoPartnership: HTMLButtonElement): void {
    const cityCloud = document.createElement('div')
    cityCloud.id = ContextMenuBuilder.cityCloudID
    const cityText = document.createElement('h3')
    cityText.textContent = scene.playerAdvertisedTravel[id]
    cityCloud.appendChild(cityText)
    otherTravel.appendChild(cityCloud)
    const buttonGetIntoPartnershipWrapper = document.createElement('div')
    buttonGetIntoPartnershipWrapper.id = ContextMenuBuilder.buttonPartnershipWrapperID
    buttonGetIntoPartnershipWrapper.appendChild(buttonGetIntoPartnership)
    otherTravel.appendChild(buttonGetIntoPartnershipWrapper)
    divInside.appendChild(otherTravel)
  }

  configureOtherTravel(): HTMLDivElement {
    const otherTravel = document.createElement('div')
    otherTravel.id = ContextMenuBuilder.buttonWithCloudID
    return otherTravel
  }

  configureButton(): HTMLButtonElement {
    const button = document.createElement('button')
    button.style.width = '50px'
    button.style.height = '45px'
    return button
  }

  configureImage(): HTMLImageElement {
    const img = document.createElement('img')
    img.src = '/assets/coopCustomIcon.png'
    img.style.width = '35px'
    return img
  }
}
