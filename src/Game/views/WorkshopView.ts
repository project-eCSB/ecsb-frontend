import gameService from '../../services/game/GameService'
import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'
import { WorkshopMessageType, sendWorkshopMessage } from '../webSocketMessage/chat/WorkshopMessage'

export class WorkshopView {
  private readonly scene: Scene

  private readonly workshopContainer: HTMLDivElement
  private readonly workshopHeader: HTMLDivElement
  private readonly workshopTitle: HTMLHeadingElement
  private readonly workshopContent: HTMLDivElement
  private readonly workshopContentValue: HTMLDivElement
  private readonly workshopContentCost: HTMLDivElement
  private readonly workshopButtons: HTMLDivElement
  private readonly workshopBtnSubmit: HTMLButtonElement
  private readonly workshopBtnClose: HTMLButtonElement

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

    const pMoneyLabel = document.createElement('h4')
    pMoneyLabel.innerText = 'money: '
    const pMoneyInput = document.createElement('h4')
    pMoneyInput.innerText = '0'
    const pMoney = document.createElement('div')
    pMoney.appendChild(pMoneyLabel)
    pMoney.appendChild(pMoneyInput)

    const pTimeLabel = document.createElement('h4')
    pTimeLabel.innerText = 'time: '
    const pTimeInput = document.createElement('h4')
    pTimeInput.innerText = '0'
    const pTime = document.createElement('div')
    pTime.appendChild(pTimeLabel)
    pTime.appendChild(pTimeInput)

    const costHeader = document.createElement('h2')
    costHeader.innerText = `Cost:`
    this.workshopContentCost.appendChild(costHeader)

    const costResources = document.createElement('div')
    costResources.id = 'workshop-content-value-resources'
    costResources.appendChild(pMoney)
    costResources.appendChild(pTime)
    this.workshopContentCost.appendChild(costResources)

    this.workshopContentValue = document.createElement('div')
    this.workshopContentValue.id = 'workshop-content-value'

    const pWantLabel = document.createElement('h2')
    pWantLabel.innerText = `Produce: `
    const pWantInput = document.createElement('h2')
    pWantInput.innerText = '0'

    const plusBtn = document.createElement('button')
    const iconPlus = document.createElement('i')
    iconPlus.className = 'fa fa-plus'
    iconPlus.ariaHidden = 'true'

    plusBtn.addEventListener('click', () => {
      const costTime = parseInt(pTimeInput.innerText) + 1
      const costMoney =
        costTime * (this.scene.playerWorkshopUnitPrice * this.scene.playerWorkshopMaxProduction)

      if (costMoney > this.scene.equipment!.money || costTime > this.scene.equipment!.time) {
        this.disableSubmitBtn()
      } else {
        this.enableSubmitBtn()
      }

      const resource = costTime * this.scene.playerWorkshopMaxProduction

      pWantInput.innerText = `${resource}`
      pMoneyInput.innerText = `${costMoney}`
      pTimeInput.innerText = `${costTime}`

      sendWorkshopMessage(this.scene.chatWs, {
        type: WorkshopMessageType.WorkshopChange,
        amount: resource,
      })
    })

    plusBtn.appendChild(iconPlus)

    const minusBtn = document.createElement('button')
    const iconMinus = document.createElement('i')
    iconMinus.className = 'fa fa-minus'
    iconMinus.ariaHidden = 'true'

    minusBtn.addEventListener('click', () => {
      const costTime = parseInt(pTimeInput.innerText) - 1
      if (costTime >= 0) {
        const costMoney =
          costTime * (this.scene.playerWorkshopUnitPrice * this.scene.playerWorkshopMaxProduction)
        if (costMoney === 0) {
          this.disableSubmitBtn()
        } else {
          if (costMoney > this.scene.equipment!.money || costTime > this.scene.equipment!.time) {
            this.disableSubmitBtn()
          } else {
            this.enableSubmitBtn()
          }
        }

        const resource = costTime * this.scene.playerWorkshopMaxProduction

        pWantInput.innerText = `${resource}`
        pMoneyInput.innerText = `${costMoney}`
        pTimeInput.innerText = `${costTime}`

        sendWorkshopMessage(this.scene.chatWs, {
          type: WorkshopMessageType.WorkshopChange,
          amount: resource,
        })
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

      this.scene.loadingView.show()

      gameService
        .produce(parseInt(pWantInput.innerText))
        .then(() => {
          this.close()
        })
        .catch((err) => {
          console.error(err)
          this.enableSubmitBtn()
        })
        .finally(() => {
          this.scene.loadingView.close()
        })
    })

    this.workshopBtnClose = document.createElement('button')
    this.workshopBtnClose.id = 'workshop-button-close'
    this.workshopBtnClose.innerText = 'Close'
    this.workshopBtnClose.addEventListener('click', () => {
      this.close()
    })

    this.workshopButtons.appendChild(this.workshopBtnSubmit)
    this.workshopButtons.appendChild(this.workshopBtnClose)

    this.workshopContainer.appendChild(this.workshopHeader)
    this.workshopContainer.appendChild(this.workshopContent)
    this.workshopContainer.appendChild(this.workshopButtons)

    this.disableSubmitBtn()
  }

  public disableSubmitBtn(): void {
    this.workshopBtnSubmit.disabled = true
    this.workshopBtnSubmit.style.visibility = 'hidden'
  }

  public enableSubmitBtn(): void {
    this.workshopBtnSubmit.disabled = false
    this.workshopBtnSubmit.style.visibility = 'visible'
  }

  public show(): void {
    sendWorkshopMessage(this.scene.chatWs, {
      type: WorkshopMessageType.WorkshopStart,
    })
    this.scene.interactionCloudBuiler.showInteractionCloud(this.scene.playerId, CloudType.WORK)
    window.document.body.appendChild(this.workshopContainer)
    this.scene.workshopView = this
    this.scene.movingEnabled = false
  }

  public close(): void {
    sendWorkshopMessage(this.scene.chatWs, {
      type: WorkshopMessageType.WorkshopStop,
    })
    this.scene.interactionCloudBuiler.hideInteractionCloud(this.scene.playerId, CloudType.WORK)
    document.getElementById('workshop-container')?.remove()
    this.scene.workshopView = null
    this.scene.movingEnabled = true

    this.scene.interactionView.setText('enter the workshop...')
    this.scene.interactionView.show()
  }
}
