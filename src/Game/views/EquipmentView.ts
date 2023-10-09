import { type ClassResourceRepresentation } from '../../apis/game/Types'
import { type Equipment } from '../../services/game/Types'
import { RESOURCE_ICON_SCALE, RESOURCE_ICON_WIDTH, getResourceMapping } from '../GameUtils'
import { ImageCropper } from '../tools/ImageCropper'

export class EquipmentView {
  public static readonly equipmentBoxID = 'equipmentBox'
  public static readonly equipmentBoxContentID = 'equipmentBoxContent'

  private readonly equipmentBox: HTMLDivElement
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper

  constructor(eq: Equipment, url: string, resRepresentation: ClassResourceRepresentation[]) {
    this.resourceURL = url
    this.resourceRepresentation = resRepresentation
    this.cropper = new ImageCropper()

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

      const itemIcon = this.cropper.crop(
        RESOURCE_ICON_WIDTH,
        RESOURCE_ICON_WIDTH,
        RESOURCE_ICON_SCALE,
        this.resourceURL,
        3,
        getResourceMapping(this.resourceRepresentation)(item.key),
        false,
      )
      const itemValueWrapper = document.createElement('div')
      const itemValue = document.createElement('p')
      itemValue.innerText = item.value.toString()

      itemValueWrapper.appendChild(itemValue)
      itemBox.appendChild(itemIcon)
      itemBox.appendChild(itemValueWrapper)

      equipmentBoxContent.appendChild(itemBox)
    }

    const moneyBox = document.createElement('div')

    const moneyBoxicon = document.createElement('img')
    moneyBoxicon.src = '/assets/coinCustomIcon.png'
    moneyBoxicon.style.width = '38px'
    moneyBoxicon.style.height = '38px'
    const moneyValueWrapper = document.createElement('div')
    const moneyBoxValue = document.createElement('p')
    moneyBoxValue.innerText = eq.money.toString()

    moneyValueWrapper.appendChild(moneyBoxValue)
    moneyBox.appendChild(moneyBoxicon)
    moneyBox.appendChild(moneyValueWrapper)

    equipmentBoxContent.appendChild(moneyBox)

    this.equipmentBox.appendChild(equipmentBoxContent)
  }

  public show(): void {
    if (!document.getElementById(EquipmentView.equipmentBoxID)) {
      window.document.body.appendChild(this.equipmentBox)
    }
  }

  public close(): void {
    document.getElementById(EquipmentView.equipmentBoxID)?.remove()
  }
}
