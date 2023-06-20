import { type Scene } from '../scenes/Scene'

export class EquipmentView {
  scene: Scene
  equipmentBox: HTMLDivElement
  userName: HTMLHeadingElement
  equipmentBoxContent: HTMLDivElement

  constructor(scene: Scene) {
    this.scene = scene
    this.equipmentBox = document.createElement('div')
    this.equipmentBox.id = 'equipmentBox'

    this.userName = document.createElement('h3')
    this.userName.innerText = this.scene.playerId

    this.equipmentBoxContent = document.createElement('div')
    this.equipmentBoxContent.id = 'equipmentBoxContent'

    this.equipmentBox.appendChild(this.userName)

    this.fillEq()
  }

  update(): void {
    document.getElementById('equipmentBoxContent')?.remove()
    this.equipmentBoxContent = document.createElement('div')
    this.equipmentBoxContent.id = 'equipmentBoxContent'
    this.fillEq()
  }

  fillEq(): void {
    if (!this.scene.equipment) return
    if (!this.scene.visibleEquipment) return

    const iconBox = document.createElement('div')
    iconBox.id = 'iconBox'

    const visibilityText = document.createElement('h5')
    visibilityText.id = 'visibilityText'
    visibilityText.innerText = 'x'
    const icon = document.createElement('i')
    icon.className = 'fa fa-eye-slash'
    icon.ariaHidden = 'true'
    const icon2 = document.createElement('i')
    icon2.className = 'fa fa-eye'
    icon2.ariaHidden = 'true'

    iconBox.appendChild(visibilityText)
    iconBox.appendChild(icon)
    iconBox.appendChild(document.createElement('hr'))
    iconBox.appendChild(icon2)

    this.equipmentBoxContent.appendChild(iconBox)

    for (const item of this.scene.equipment.resources) {
      const itemBox = document.createElement('div')
      itemBox.id = 'box'

      const itemName = document.createElement('h5')
      itemName.innerText = item.key
      const itemValue = document.createElement('p')
      itemValue.innerText = item.value.toString()

      const iconUp = document.createElement('i')
      iconUp.className = 'arrow fa fa-arrow-up'
      iconUp.ariaHidden = 'true'
      const iconDown = document.createElement('i')
      iconDown.className = 'arrow fa fa-arrow-down'
      iconDown.ariaHidden = 'true'
      const visibleAmountContainer = document.createElement('div')
      visibleAmountContainer.id = 'visibleAmountContainer'
      const up = document.createElement('button')
      up.appendChild(iconUp)
      up.id = 'up'
      const down = document.createElement('button')
      down.appendChild(iconDown)
      down.id = 'down'
      const itemValue2 = document.createElement('p')
      const visibleValue = this.scene.visibleEquipment.resources.find((it) => it.key === item.key)
      if (visibleValue) {
        itemValue2.innerText = visibleValue.value.toString()
      }

      up.onclick = (e: Event) => {
        const val = this.scene.visibleEquipment?.resources.find((it) => it.key === item.key)
        const boundary = this.scene.equipment?.resources.find((it) => it.key === item.key)
        if (val && boundary && val.value < boundary.value) {
          val.value += 1
          itemValue2.innerText = `${parseInt(itemValue2.innerText) + 1}`
        }
      }
      down.onclick = (e: Event) => {
        const val = this.scene.visibleEquipment?.resources.find((it) => it.key === item.key)
        if (val && val.value > 0) {
          val.value -= 1
          itemValue2.innerText = `${parseInt(itemValue2.innerText) - 1}`
        }
      }

      visibleAmountContainer.appendChild(down)
      visibleAmountContainer.appendChild(itemValue2)
      visibleAmountContainer.appendChild(up)

      itemBox.appendChild(itemName)
      itemBox.appendChild(itemValue)
      itemBox.appendChild(document.createElement('hr'))
      itemBox.appendChild(visibleAmountContainer)
      this.equipmentBoxContent.appendChild(itemBox)
    }

    const moneyBox = document.createElement('div')
    moneyBox.id = 'box'

    const moneyBoxName = document.createElement('h5')
    moneyBoxName.innerText = 'Money'
    const moneyBoxValue = document.createElement('p')
    moneyBoxValue.innerText = this.scene.equipment.money.toString()

    const iconUpMoney = document.createElement('i')
    iconUpMoney.className = 'arrow fa fa-arrow-up'
    iconUpMoney.ariaHidden = 'true'
    const iconDownMoney = document.createElement('i')
    iconDownMoney.className = 'arrow fa fa-arrow-down'
    iconDownMoney.ariaHidden = 'true'
    const visibleAmountContainerMoney = document.createElement('div')
    visibleAmountContainerMoney.id = 'visibleAmountContainer'
    const upMoney = document.createElement('button')
    upMoney.appendChild(iconUpMoney)
    upMoney.id = 'up'
    const downMoney = document.createElement('button')
    downMoney.appendChild(iconDownMoney)
    downMoney.id = 'down'
    const moneyBoxValue2 = document.createElement('p')
    moneyBoxValue2.innerText = this.scene.visibleEquipment.money.toString()
    visibleAmountContainerMoney.appendChild(downMoney)
    visibleAmountContainerMoney.appendChild(moneyBoxValue2)
    visibleAmountContainerMoney.appendChild(upMoney)

    upMoney.onclick = (e: Event) => {
      const val = this.scene.visibleEquipment
      const boundary = this.scene.equipment
      if (val && boundary && val.money < boundary.money) {
        val.money += 1
        moneyBoxValue2.innerText = `${parseInt(moneyBoxValue2.innerText) + 1}`
      }
    }
    downMoney.onclick = (e: Event) => {
      const val = this.scene.visibleEquipment
      if (val && val.money > 0) {
        val.money -= 1
        moneyBoxValue2.innerText = `${parseInt(moneyBoxValue2.innerText) - 1}`
      }
    }

    moneyBox.appendChild(moneyBoxName)
    moneyBox.appendChild(moneyBoxValue)
    moneyBox.appendChild(document.createElement('hr'))
    moneyBox.appendChild(visibleAmountContainerMoney)
    this.equipmentBoxContent.appendChild(moneyBox)

    const timeBox = document.createElement('div')
    timeBox.id = 'box'

    const timeBoxName = document.createElement('h5')
    timeBoxName.innerText = 'Time'
    const timeBoxValue = document.createElement('p')
    timeBoxValue.innerText = this.scene.equipment.time.toString()

    const iconUpTime = document.createElement('i')
    iconUpTime.className = 'arrow fa fa-arrow-up'
    iconUpTime.ariaHidden = 'true'
    const iconDownTime = document.createElement('i')
    iconDownTime.className = 'arrow fa fa-arrow-down'
    iconDownTime.ariaHidden = 'true'
    const visibleAmountContainerTime = document.createElement('div')
    visibleAmountContainerTime.id = 'visibleAmountContainer'
    const upTime = document.createElement('button')
    upTime.appendChild(iconUpTime)
    upTime.id = 'up'
    const downTime = document.createElement('button')
    downTime.appendChild(iconDownTime)
    downTime.id = 'down'
    const timeBoxValue2 = document.createElement('p')
    timeBoxValue2.innerText = this.scene.visibleEquipment.time.toString()
    visibleAmountContainerTime.appendChild(downTime)
    visibleAmountContainerTime.appendChild(timeBoxValue2)
    visibleAmountContainerTime.appendChild(upTime)

    upTime.onclick = (e: Event) => {
      const val = this.scene.visibleEquipment
      const boundary = this.scene.equipment
      if (val && boundary && val.time < boundary.time) {
        val.time += 1
        timeBoxValue2.innerText = `${parseInt(timeBoxValue2.innerText) + 1}`
      }
    }
    downTime.onclick = (e: Event) => {
      const val = this.scene.visibleEquipment
      if (val && val.time > 0) {
        val.time -= 1
        timeBoxValue2.innerText = `${parseInt(timeBoxValue2.innerText) - 1}`
      }
    }

    timeBox.appendChild(timeBoxName)
    timeBox.appendChild(timeBoxValue)
    timeBox.appendChild(document.createElement('hr'))
    timeBox.appendChild(visibleAmountContainerTime)
    this.equipmentBoxContent.appendChild(timeBox)

    this.equipmentBox.appendChild(this.equipmentBoxContent)
  }

  show(): void {
    window.document.body.appendChild(this.equipmentBox)
  }
}
