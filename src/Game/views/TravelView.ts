import gameService from '../../services/game/GameService'
import { type PlayerEquipment } from '../../services/game/Types'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { TravelMessageType, sendTravelMessage } from '../webSocketMessage/chat/TravelMessage'
import { InteractionView } from './InteractionView'
import { LoadingView } from './LoadingView'

export enum TravelType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class TravelView {
  scene: Scene
  travelContainer: HTMLDivElement
  travelBtnSubmit: HTMLButtonElement
  travelBtnClose: HTMLButtonElement
  travelType: TravelType
  selectedTravel: string | null
  constructor(scene: Scene, travelType: TravelType) {
    this.scene = scene
    this.travelType = travelType
    this.selectedTravel = null

    // CONTAIENR
    this.travelContainer = document.createElement('div')
    this.travelContainer.id = 'travel-container'

    // HEADER & TITLE
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

    // CONTENT
    const travelContent = document.createElement('div')
    travelContent.id = 'travel-content'

    this.scene.settings.travels.forEach((travel) => {
      if (travel.key === this.travelType) {
        travel.value.forEach((travelItem) => {
          const travelItemContainer = document.createElement('div')
          travelItemContainer.className = 'travel-content-item'

          // ITEM HEADER
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
            this.enableSubmitBtn()
          })

          travelItemHeader.appendChild(travelItemCheckbox)
          travelItemHeader.appendChild(travelItemTitle)

          travelItemContainer.appendChild(travelItemHeader)

          // ITEM CONTENT
          const travelItemCostMoney = document.createElement('p')
          travelItemCostMoney.className = 'travel-content-item-money'
          travelItemCostMoney.innerText = `Possible reward: ${travelItem.value.moneyRange.from} - ${travelItem.value.moneyRange.to} $`

          travelItemContainer.appendChild(travelItemCostMoney)

          const travelItemCostResourcesTitle = document.createElement('p')
          travelItemCostResourcesTitle.className = 'travel-content-item-resources-title'
          travelItemCostResourcesTitle.innerText = 'Journey cost:'

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

    // BUTTONS
    const travelButtons = document.createElement('div')
    travelButtons.id = 'travel-buttons'

    this.travelBtnSubmit = document.createElement('button')
    this.travelBtnSubmit.id = 'travel-button-submit'
    this.travelBtnSubmit.innerText = 'Travel'
    this.travelBtnSubmit.addEventListener('click', () => {
      this.disableSubmitBtn()
      this.scene.loadingView = new LoadingView(this.scene)
      this.scene.loadingView.show()

      gameService
        .travel(this.selectedTravel!)
        .then(() => {
          gameService
            .getPlayerEquipment()
            .then((res: PlayerEquipment) => {
              this.scene.equipment = res
              this.scene.loadingView?.close()

              for (const resource of res.resources) {
                const val = this.scene.visibleEquipment?.resources.find(
                  (it) => it.key === resource.key,
                )
                if (val) {
                  val.value = Math.min(resource.value, val.value)
                }
              }
              if (this.scene.visibleEquipment) {
                this.scene.visibleEquipment.money = Math.min(this.scene.visibleEquipment.money, res.money)
                this.scene.visibleEquipment.time = Math.min(this.scene.visibleEquipment.time, res.time)
              }
              this.scene.equipmentView!.update()

              this.close()
            })
            .catch((err) => {
              console.error(err)
              this.scene.loadingView?.close()
              this.close()
            })
        })
        .catch((err) => {
          console.error(err)
          this.scene.loadingView?.close()
          this.enableSubmitBtn()
        })
    })

    this.travelBtnClose = document.createElement('button')
    this.travelBtnClose.id = 'travel-button-close'
    this.travelBtnClose.innerText = 'Close'
    this.travelBtnClose.addEventListener('click', () => {
      this.close()
    })

    travelButtons.appendChild(this.travelBtnClose)
    travelButtons.appendChild(this.travelBtnSubmit)

    this.travelContainer.appendChild(travelHeader)
    this.travelContainer.appendChild(travelContent)
    this.travelContainer.appendChild(travelButtons)

    this.disableSubmitBtn()
  }

  disableSubmitBtn(): void {
    this.travelBtnSubmit.disabled = true
    this.travelBtnSubmit.style.visibility = 'hidden'
  }

  enableSubmitBtn(): void {
    this.travelBtnSubmit.disabled = false
    this.travelBtnSubmit.style.visibility = 'visible'
  }

  show(): void {
    sendTravelMessage(this.scene.tradeWs, {
      type: TravelMessageType.TravelStart,
    })
    this.scene.cloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    window.document.body.appendChild(this.travelContainer)
    this.scene.travelView = this
    this.scene.movingEnabled = false
  }

  close(): void {
    sendTravelMessage(this.scene.tradeWs, {
      type: TravelMessageType.TravelStop,
    })
    this.scene.cloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.TRAVEL)
    document.getElementById('travel-container')?.remove()
    this.scene.travelView = null
    this.scene.movingEnabled = true

    switch (this.travelType) {
      case TravelType.LOW:
        this.scene.interactionView = new InteractionView(this.scene, 'start a short journey...')
        break
      case TravelType.MEDIUM:
        this.scene.interactionView = new InteractionView(
          this.scene,
          'start a medium-distance journey...',
        )
        break
      case TravelType.HIGH:
        this.scene.interactionView = new InteractionView(
          this.scene,
          'start a long-distance journey...',
        )
        break
    }

    this.scene.interactionView.show()
  }
}
