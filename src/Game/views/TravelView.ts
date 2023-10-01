import gameService from '../../services/game/GameService'
import { ERROR_TIMEOUT } from '../GameUtils'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { TravelMessageType, sendTravelMessage } from '../webSocketMessage/chat/TravelMessage'
import { ErrorView } from './ErrorView'

export enum TravelType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class TravelView {
  private readonly scene: Scene
  private readonly travelType: TravelType
  private selectedTravel: string | null

  private readonly travelContainer: HTMLDivElement
  private readonly travelBtnSubmit: HTMLButtonElement
  private readonly travelBtnClose: HTMLButtonElement

  constructor(scene: Scene, travelType: TravelType) {
    this.scene = scene
    this.travelType = travelType
    this.selectedTravel = null

    this.travelContainer = document.createElement('div')
    this.travelContainer.id = 'travel-container'

    const travelHeader = document.createElement('div')
    travelHeader.id = 'travel-header'

    const travelTitle = document.createElement('h1')
    travelTitle.id = 'travel-header-title'

    let headerTitle = ''
    switch (travelType) {
      case TravelType.LOW:
        headerTitle = 'Low Travel'
        break
      case TravelType.MEDIUM:
        headerTitle = 'Medium Travel'
        break
      case TravelType.HIGH:
        headerTitle = 'High Travel'
        break
      default:
        headerTitle = 'Travel'
        console.error('TravelType not found')
    }
    travelTitle.innerText = headerTitle

    travelHeader.appendChild(travelTitle)

    const travelContent = document.createElement('div')
    travelContent.id = 'travel-content'

    this.scene.settings.travels.forEach((travel) => {
      if (travel.key === this.travelType) {
        travel.value.forEach((travelItem) => {
          const travelItemContainer = document.createElement('div')
          travelItemContainer.className = 'travel-content-item'

          const travelItemHeader = document.createElement('div')
          travelItemHeader.className = 'travel-content-item-header'

          const travelItemTitle = document.createElement('h2')
          travelItemTitle.className = 'travel-content-item-title'
          travelItemTitle.innerText = travelItem.value.name

          const travelItemCheckbox = document.createElement('input')
          travelItemCheckbox.type = 'radio'
          travelItemCheckbox.name = 'travel-option'
          travelItemCheckbox.value = travelItem.value.name
          travelItemCheckbox.addEventListener('change', () => {
            this.selectedTravel = travelItemCheckbox.value
            sendTravelMessage(this.scene.chatWs, {
              type: TravelMessageType.TravelChange,
              travelName: this.selectedTravel,
            })
            this.enableSubmitBtn()
          })
          travelItemHeader.appendChild(travelItemCheckbox)
          travelItemHeader.appendChild(travelItemTitle)

          travelItemContainer.appendChild(travelItemHeader)

          const travelItemCostMoney = document.createElement('p')
          travelItemCostMoney.className = 'travel-content-item-money'
          travelItemCostMoney.innerText = `Reward: ${travelItem.value.moneyRange.from} - ${travelItem.value.moneyRange.to} $`

          travelItemContainer.appendChild(travelItemCostMoney)

          const travelItemCostResourcesTitle = document.createElement('p')
          travelItemCostResourcesTitle.className = 'travel-content-item-resources-title'
          travelItemCostResourcesTitle.innerText = 'Cost:'

          travelItemContainer.appendChild(travelItemCostResourcesTitle)

          const travelItemCostResources = document.createElement('ul')
          travelItemCostResources.className = 'travel-content-item-resources'

          travelItem.value.resources.forEach((resource) => {
            const travelItemCostResource = document.createElement('li')
            travelItemCostResource.className = 'travel-content-item-resource'
            travelItemCostResource.innerText = `${resource.key}: ${resource.value}`

            travelItemCostResources.appendChild(travelItemCostResource)
          })

          travelItemContainer.appendChild(travelItemCostResources)
          travelContent.appendChild(travelItemContainer)
        })
      }
    })

    const travelButtons = document.createElement('div')
    travelButtons.id = 'travel-buttons'

    this.travelBtnSubmit = document.createElement('button')
    this.travelBtnSubmit.id = 'travel-button-submit'
    this.travelBtnSubmit.innerText = 'Travel'
    this.travelBtnSubmit.addEventListener('click', () => {
      this.disableSubmitBtn()

      this.scene.loadingView.show()

      gameService
        .travel(this.selectedTravel!)
        .then(() => {
          this.close()
        })
        .catch((err) => {
          const errorMessage = new ErrorView();
          errorMessage.setText('Insufficient materials');
          errorMessage.show();
          setTimeout(() => {
            errorMessage.close();
          }, ERROR_TIMEOUT);
          console.error(err)
          this.scene.loadingView?.close()
          this.enableSubmitBtn()
        })
        .finally(() => {
          this.scene.loadingView.close()
        })
    })

    this.travelBtnClose = document.createElement('button')
    this.travelBtnClose.id = 'travel-button-close'
    this.travelBtnClose.innerText = 'Close'
    this.travelBtnClose.addEventListener('click', () => {
      this.close()
    })

    travelButtons.appendChild(this.travelBtnSubmit)
    travelButtons.appendChild(this.travelBtnClose)

    this.travelContainer.appendChild(travelHeader)
    this.travelContainer.appendChild(travelContent)
    this.travelContainer.appendChild(travelButtons)

    this.disableSubmitBtn()
  }

  public disableSubmitBtn(): void {
    this.travelBtnSubmit.disabled = true
    this.travelBtnSubmit.style.visibility = 'hidden'
  }

  public enableSubmitBtn(): void {
    this.travelBtnSubmit.disabled = false
    this.travelBtnSubmit.style.visibility = 'visible'
  }

  public show(): void {
    sendTravelMessage(this.scene.chatWs, {
      type: TravelMessageType.TravelStart,
    })
    this.scene.interactionCloudBuiler.showInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    window.document.body.appendChild(this.travelContainer)
    this.scene.travelView = this
    this.scene.movingEnabled = false
  }

  public close(): void {
    sendTravelMessage(this.scene.chatWs, {
      type: TravelMessageType.TravelStop,
    })
    this.scene.interactionCloudBuiler.hideInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    document.getElementById('travel-container')?.remove()
    this.scene.travelView = null
    this.scene.movingEnabled = true

    switch (this.travelType) {
      case TravelType.LOW:
        this.scene.interactionView.setText('start a short journey...')
        break
      case TravelType.MEDIUM:
        this.scene.interactionView.setText('start a medium-distance journey...')
        break
      case TravelType.HIGH:
        this.scene.interactionView.setText('start a long-distance journey...')
        break
    }

    this.scene.interactionView.show()
  }
}
