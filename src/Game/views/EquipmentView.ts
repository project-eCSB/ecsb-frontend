import { type Equipment } from "../../services/game/Types";

export class EquipmentView {
  public static readonly equipmentBoxID = 'equipmentBox';
  public static readonly equipmentBoxContentID = 'equipmentBoxContent';

  equipmentBox: HTMLDivElement

  constructor(eq: Equipment) {
    this.equipmentBox = document.createElement('div')
    this.equipmentBox.id = EquipmentView.equipmentBoxID

    this.fillEq(eq)
  }

  public update(newEq: Equipment): void {
    document.getElementById(EquipmentView.equipmentBoxContentID)?.remove()
    this.fillEq(newEq)
  }

  private fillEq(eq: Equipment): void {
    const equipmentBoxContent = document.createElement('div')
    equipmentBoxContent.id = EquipmentView.equipmentBoxContentID

    for (const item of eq.resources) {
      const itemBox = document.createElement('div')

      const itemName = document.createElement('h1')
      itemName.innerText = item.key
      const itemValue = document.createElement('p')
      itemValue.innerText = item.value.toString()

      itemBox.appendChild(itemName)
      itemBox.appendChild(itemValue)

      equipmentBoxContent.appendChild(itemBox)
    }

    const moneyBox = document.createElement('div')

    const moneyBoxName = document.createElement('h1')
    moneyBoxName.innerText = 'money'
    const moneyBoxValue = document.createElement('p')
    moneyBoxValue.innerText = eq.money.toString()

    moneyBox.appendChild(moneyBoxName)
    moneyBox.appendChild(moneyBoxValue)
    
    equipmentBoxContent.appendChild(moneyBox)

    const timeBox = document.createElement('div')

    const timeBoxName = document.createElement('h1')
    timeBoxName.innerText = 'time'
    const timeBoxValue = document.createElement('p')
    timeBoxValue.innerText = eq.time.toString()

    timeBox.appendChild(timeBoxName)
    timeBox.appendChild(timeBoxValue)

    equipmentBoxContent.appendChild(timeBox)

    this.equipmentBox.appendChild(equipmentBoxContent)
  }

  public show(): void {
    window.document.body.appendChild(this.equipmentBox)
  }

  public close(): void {
    document.getElementById(EquipmentView.equipmentBoxID)?.remove()
  }
}
