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
    for (const item of this.scene.equipment.resources) {
      const itemBox = document.createElement('div')

      const itemName = document.createElement('h5')
      itemName.innerText = item.name
      const itemValue = document.createElement('p')
      itemValue.innerText = item.value.toString()

      itemBox.appendChild(itemName)
      itemBox.appendChild(itemValue)

      this.equipmentBoxContent.appendChild(itemBox)
    }

    const timeBox = document.createElement('div')

    const timeBoxName = document.createElement('h5')
    timeBoxName.innerText = 'time'
    const timeBoxValue = document.createElement('p')
    timeBoxValue.innerText = this.scene.equipment.time.toString()

    timeBox.appendChild(timeBoxName)
    timeBox.appendChild(timeBoxValue)

    this.equipmentBoxContent.appendChild(timeBox)

    const moneyBox = document.createElement('div')

    const moneyBoxName = document.createElement('h5')
    moneyBoxName.innerText = 'money'
    const moneyBoxValue = document.createElement('p')
    moneyBoxValue.innerText = this.scene.equipment.money.toString()

    moneyBox.appendChild(moneyBoxName)
    moneyBox.appendChild(moneyBoxValue)

    this.equipmentBoxContent.appendChild(moneyBox)

    this.equipmentBox.appendChild(this.userName)
    this.equipmentBox.appendChild(this.equipmentBoxContent)
  }

  show(): void {
    window.document.body.appendChild(this.equipmentBox)
  }

  close(): void {
    document.getElementById('equipmentBox')?.remove()
  }
}
