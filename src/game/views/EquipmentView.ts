import { type ClassResourceRepresentation, type Equipment } from '../../apis/game/Types'
import { ImageCropper } from '../tools/ImageCropper'
import { createCrop, createDivWithClassName, createDivWithId, createIconWithAll, createParagraph } from './ViewUtils'

export class EquipmentView {
  public static readonly equipmentBoxID = 'equipmentBox'
  public static readonly equipmentBoxContentID = 'equipmentBoxContent'
  public static readonly equipmentHoverBoxID = 'equipmentHoverBox'

  private readonly equipmentBox: HTMLDivElement
  private readonly equipmentHoverBox: HTMLDivElement
  private readonly resourceURL: string
  private readonly resourceRepresentation: ClassResourceRepresentation[]
  private readonly cropper: ImageCropper

  constructor(eq: Equipment, url: string, resRepresentation: ClassResourceRepresentation[]) {
    this.resourceURL = url
    this.resourceRepresentation = resRepresentation
    this.cropper = new ImageCropper()

    this.equipmentBox = createDivWithId(EquipmentView.equipmentBoxID)
    this.equipmentHoverBox = createDivWithId(EquipmentView.equipmentHoverBoxID)
    this.fillEq(eq)
  }

  public update(newEq: Equipment): void {
    document.getElementById(EquipmentView.equipmentBoxContentID)?.remove()
    this.fillEq(newEq)
  }

  private fillEq(eq: Equipment): void {
    const equipmentBoxContent = createDivWithId(EquipmentView.equipmentBoxContentID)

    eq.resources.forEach((item, idx) => {
      const itemBox = document.createElement('div')
      const itemIcon = createCrop(this.cropper, this.resourceURL, this.resourceRepresentation, item.key)
      const itemValueWrapper = document.createElement('div')
      const itemValue = createParagraph(item.value.toString())

      itemValueWrapper.appendChild(itemValue)
      itemBox.append(itemIcon, itemValueWrapper)

      const itemHoverWrapper = createDivWithClassName('equipmentResourceHoverBoxWrapper')
      itemHoverWrapper.style.transform = `translateX(${idx * 74}px)`
      itemHoverWrapper.style.visibility = 'hidden'

      const itemHover = createDivWithClassName('equipmentResourceHoverBox')
      const itemHoverContent = createDivWithClassName('equipmentResourceHoverBoxContent')
      const classResource = this.resourceRepresentation.find((res) => res.value.gameResourceName === item.key)!.value
      const itemHoverContentValues = document.createElement('div')
      const itemHoverContentValuesText = createParagraph('Cena')
      const itemHoverContentValuesValue = createParagraph(`${classResource.unitPrice}`)
      itemHoverContentValues.append(itemHoverContentValuesText, itemHoverContentValuesValue)

      const itemHoverContentBuyouts = document.createElement('div')
      const itemHoverContentBuyoutsText = createParagraph('Wykup')
      const itemHoverContentBuyoutsValue = createParagraph(`${classResource.buyoutPrice}`)
      itemHoverContentBuyouts.append(itemHoverContentBuyoutsText, itemHoverContentBuyoutsValue)

      itemHoverContent.append(itemHoverContentValues, itemHoverContentBuyouts)

      itemHover.appendChild(itemHoverContent)
      itemHoverWrapper.appendChild(itemHover)

      itemBox.addEventListener('mouseover', () => {
        itemHoverWrapper.style.visibility = 'visible'
      })

      itemBox.addEventListener('mouseleave', () => {
        itemHoverWrapper.style.visibility = 'hidden'
      })

      this.equipmentHoverBox.appendChild(itemHoverWrapper)

      equipmentBoxContent.appendChild(itemBox)
    })
    const moneyBox = document.createElement('div')
    const moneyBoxIcon = createIconWithAll('/assets/coinCustomIcon.png', '38px')
    const moneyValueWrapper = document.createElement('div')
    const moneyBoxValue = createParagraph(eq.money.toString())

    moneyValueWrapper.appendChild(moneyBoxValue)
    moneyBox.append(moneyBoxIcon, moneyValueWrapper)

    equipmentBoxContent.appendChild(moneyBox)

    this.equipmentBox.appendChild(equipmentBoxContent)
  }

  public show(): void {
    if (!document.getElementById(EquipmentView.equipmentBoxID)) {
      window.document.body.append(this.equipmentBox, this.equipmentHoverBox)
    }
  }

  public close(): void {
    document.getElementById(EquipmentView.equipmentBoxID)?.remove()
    document.getElementById(EquipmentView.equipmentHoverBoxID)?.remove()
  }
}
