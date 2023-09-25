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

    const iconBox = document.createElement('div')
    iconBox.id = 'iconBox'

    this.equipmentBoxContent.appendChild(iconBox)

    for (const item of this.scene.equipment.resources) {
      const itemBox = document.createElement('div')
      itemBox.id = 'box'

      const itemName = document.createElement('h5')
      itemName.innerText = item.key
      const itemValue = document.createElement('p')
      itemValue.innerText = item.value.toString()

      itemBox.appendChild(itemName)
      itemBox.appendChild(itemValue)
      this.equipmentBoxContent.appendChild(itemBox)
    }

    const moneyBox = document.createElement('div')
    moneyBox.id = 'box'

    const moneyBoxName = document.createElement('h5')
    moneyBoxName.innerText = 'Money'
    const moneyBoxValue = document.createElement('p')
    moneyBoxValue.innerText = this.scene.equipment.money.toString()

    moneyBox.appendChild(moneyBoxName)
    moneyBox.appendChild(moneyBoxValue)
    this.equipmentBoxContent.appendChild(moneyBox)

    const timeBox = document.createElement('div')
    timeBox.id = 'box'

    const timeBoxName = document.createElement('h5')
    timeBoxName.innerText = 'Time'
    const timeBoxValue = document.createElement('p')
    timeBoxValue.innerText = this.scene.equipment.time.toString()

    timeBox.appendChild(timeBoxName)
    timeBox.appendChild(timeBoxValue)
    this.equipmentBoxContent.appendChild(timeBox)

    this.equipmentBox.appendChild(this.equipmentBoxContent)
  }

  show(): void {
    window.document.body.appendChild(this.equipmentBox)
  }
}
