import gameService from '../../services/game/GameService'
import { type PlayerEquipment } from '../../services/game/Types'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { WorkshopMessageType, sendWorkshopMessage } from '../webSocketMessage/chat/WorkshopMessage'
import { InteractionView } from './InteractionView'
import { LoadingView } from './LoadingView'

export class WorkshopView {
  scene: Scene
  workshopContainer: HTMLDivElement
  workshopHeader: HTMLDivElement
  workshopTitle: HTMLHeadingElement
  workshopContent: HTMLDivElement
  workshopContentValue: HTMLDivElement
  workshopContentCost: HTMLDivElement
  workshopButtons: HTMLDivElement
  workshopBtnSubmit: HTMLButtonElement
  workshopBtnClose: HTMLButtonElement

  constructor(scene: Scene) {
    this.scene = scene

    // CONTAIENR
    this.workshopContainer = document.createElement('div')
    this.workshopContainer.id = 'workshop-container'

    // TITLE
    this.workshopHeader = document.createElement('div')
    this.workshopHeader.id = 'workshop-header'

    this.workshopTitle = document.createElement('h1')
    this.workshopTitle.id = 'workshop-header-title'
    this.workshopTitle.innerText = `${
      this.scene.status.className.charAt(0).toUpperCase() + this.scene.status.className.slice(1)
    } Workshop`

    this.workshopHeader.appendChild(this.workshopTitle)

    // CONTENT
    this.workshopContent = document.createElement('div')
    this.workshopContent.id = 'workshop-content'

    this.workshopContentCost = document.createElement('div')
    this.workshopContentCost.id = 'workshop-content-cost'

    const pCostLabel = document.createElement('p')
    pCostLabel.innerText = `Cost: 0 money & 0 time`

    this.workshopContentCost.appendChild(pCostLabel)

    this.workshopContentValue = document.createElement('div')
    this.workshopContentValue.id = 'workshop-content-value'

    const pWantLabel = document.createElement('p')
    pWantLabel.innerText = `How many ${this.scene.playerWorkshopResouseName}s to produce: `

    const pWantInput = document.createElement('p')
    pWantInput.innerText = '0'

    const plusBtn = document.createElement('button')
    const iconPlus = document.createElement('i')
    iconPlus.className = 'fa fa-plus'
    iconPlus.ariaHidden = 'true'

    plusBtn.addEventListener('click', () => {
      const value = parseInt(pWantInput.innerText)
      pWantInput.innerText = `${value + 1}`

      const moneyCost = parseInt(pWantInput.innerText) * this.scene.playerWorkshopUnitPrice
      const timeCost = Math.ceil(
        parseInt(pWantInput.innerText) / this.scene.playerWorkshopMaxProduction,
      )

      if (moneyCost > this.scene.equipment!.money || timeCost > this.scene.equipment!.time) {
        this.disableSubmitBtn()
      } else {
        this.enableSubmitBtn()
      }

      pCostLabel.innerText = `Cost: ${moneyCost} money & ${timeCost} time`
    })

    plusBtn.appendChild(iconPlus)

    const minusBtn = document.createElement('button')
    const iconMinus = document.createElement('i')
    iconMinus.className = 'fa fa-minus'
    iconMinus.ariaHidden = 'true'

    minusBtn.addEventListener('click', () => {
      const value = parseInt(pWantInput.innerText)
      if (value > 0) {
        pWantInput.innerText = `${value - 1}`

        const moneyCost = parseInt(pWantInput.innerText) * this.scene.playerWorkshopUnitPrice
        const timeCost = Math.ceil(
          parseInt(pWantInput.innerText) / this.scene.playerWorkshopMaxProduction,
        )

        if (moneyCost === 0) {
          this.disableSubmitBtn()
        } else {
          if (moneyCost > this.scene.equipment!.money || timeCost > this.scene.equipment!.time) {
            this.disableSubmitBtn()
          } else {
            this.enableSubmitBtn()
          }
        }

        pCostLabel.innerText = `Cost: ${moneyCost} money & ${timeCost} time`
      }
    })

    minusBtn.appendChild(iconMinus)

    const buttons = document.createElement('div')
    buttons.id = 'workshop-content-value-buttons'
    buttons.appendChild(plusBtn)
    buttons.appendChild(minusBtn)

    this.workshopContentValue.appendChild(pWantLabel)
    this.workshopContentValue.appendChild(pWantInput)
    this.workshopContentValue.appendChild(buttons)

    this.workshopContent.appendChild(this.workshopContentValue)
    this.workshopContent.appendChild(this.workshopContentCost)

    // BUTTONS
    this.workshopButtons = document.createElement('div')
    this.workshopButtons.id = 'workshop-buttons'

    this.workshopBtnSubmit = document.createElement('button')
    this.workshopBtnSubmit.id = 'workshop-button-submit'
    this.workshopBtnSubmit.innerText = 'Submit'
    this.workshopBtnSubmit.addEventListener('click', () => {
      this.disableSubmitBtn()
      this.scene.loadingView = new LoadingView(this.scene)
      this.scene.loadingView.show()

      gameService
        .produce(parseInt(pWantInput.innerText))
        .then(() => {
          gameService
            .getPlayerEquipment()
            .then((res: PlayerEquipment) => {
              this.scene.equipment = res
              this.scene.equipmentView!.update()
              this.scene.loadingView?.close()
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

    this.workshopBtnClose = document.createElement('button')
    this.workshopBtnClose.id = 'workshop-button-close'
    this.workshopBtnClose.innerText = 'Close'
    this.workshopBtnClose.addEventListener('click', () => {
      this.close()
    })

    this.workshopButtons.appendChild(this.workshopBtnClose)
    this.workshopButtons.appendChild(this.workshopBtnSubmit)

    this.workshopContainer.appendChild(this.workshopHeader)
    this.workshopContainer.appendChild(this.workshopContent)
    this.workshopContainer.appendChild(this.workshopButtons)

    this.disableSubmitBtn()
  }

  disableSubmitBtn(): void {
    this.workshopBtnSubmit.disabled = true
    this.workshopBtnSubmit.style.visibility = 'hidden'
  }

  enableSubmitBtn(): void {
    this.workshopBtnSubmit.disabled = false
    this.workshopBtnSubmit.style.visibility = 'visible'
  }

  show(): void {
    sendWorkshopMessage(this.scene.tradeWs, {
      type: WorkshopMessageType.WorkshopStart,
    })
    this.scene.cloudBuilder.showInteractionCloud(this.scene.playerId, CloudType.WORK)
    window.document.body.appendChild(this.workshopContainer)
    this.scene.workshopView = this
    this.scene.movingEnabled = false
    const cloud = document.getElementById(`actionCloud-${this.scene.playerId}`)
    if (cloud) {
      cloud.style.visibility = 'visible'
    }
  }

  close(): void {
    sendWorkshopMessage(this.scene.tradeWs, {
      type: WorkshopMessageType.WorkshopStop,
    })
    this.scene.cloudBuilder.hideInteractionCloud(this.scene.playerId, CloudType.WORK)
    document.getElementById('workshop-container')?.remove()
    this.scene.workshopView = null
    this.scene.movingEnabled = true

    this.scene.interactionView = new InteractionView(this.scene, 'enter the workshop...')
    this.scene.interactionView.show()
  }
}
