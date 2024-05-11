import { getResourceMapping, RESOURCE_ICON_HEIGHT, RESOURCE_ICON_SCALE, RESOURCE_ICON_WIDTH } from '../GameUtils'
import { type ImageCropper } from '../tools/ImageCropper'
import type { ClassResourceRepresentation } from '../../apis/game/Types'

export function getTimeIcon(className = ''): HTMLDivElement {
  const timeIconExtraWrapper = document.createElement('div')
  const timeIconWrapper = createDivWithClassName(className)
  const timeIcon = createIconWithSize('/assets/timeCustomIcon.png', '20px')
  timeIconWrapper.appendChild(timeIcon)
  timeIconExtraWrapper.appendChild(timeIconWrapper)
  return timeIconExtraWrapper
}

export function getTimeIconWithValue(innerText: string, span: boolean): HTMLDivElement {
  const timeIconExtraWrapper = document.createElement('div')
  const timeIconWrapper = createDivWithClassName('resourceNegotiationSuccessContentBoxResourcesTime')
  const timeIcon = createIconWithSize('/assets/timeCustomIcon.png', '20px')
  let timeValue
  if (span) {
    timeValue = createSpan(innerText)
    timeValue.style.marginLeft = '5px'
  } else {
    timeValue = createElWithText('h4', innerText)
  }
  timeIconWrapper.append(timeIcon, timeValue)
  timeIconExtraWrapper.appendChild(timeIconWrapper)
  return timeIconExtraWrapper
}

export function getTimeContainer(time: number, className = ''): HTMLDivElement {
  const timeContainer = document.createElement('div')
  if (time > 3) {
    timeContainer.appendChild(getTimeIconWithValue(`${time}`, true))
  } else {
    for (let i = 0; i < time; i++) {
      timeContainer.appendChild(getTimeIcon(className))
    }
  }
  return timeContainer
}

export function addResourcesTimes(time: number): HTMLDivElement {
  const coopDialogResourcesTimes = document.createElement('div')
  if (time <= 2) {
    for (let i = 0; i < time; i++) {
      coopDialogResourcesTimes.appendChild(getTimeIcon())
    }
  } else {
    coopDialogResourcesTimes.appendChild(getTimeIconWithValue(`${time}`, false))
  }
  return coopDialogResourcesTimes
}

export function getValue(currentValue: string, defaultValue: string, nextValue: string): string {
  return currentValue === defaultValue ? nextValue : defaultValue
}

export function getClassName(currentValue: HTMLElement, mainString: string): string {
  const defaultValue = mainString + 'EnabledActive'
  const nextValue = mainString + 'Enabled'
  return currentValue.className === defaultValue ? nextValue : defaultValue
}

export function getClassNameCondition(condition: boolean, mainString: string): string {
  const nextValue = mainString + 'Enabled'
  const defaultValue = mainString + 'EnabledActive'
  return condition ? nextValue : defaultValue
}

export function getId(currentValue: HTMLElement, mainString: string): string {
  const defaultValue = mainString + 'Active'
  return currentValue.id === defaultValue ? mainString : defaultValue
}


export function createArrowIcon(): HTMLDivElement {
  const arrowIcon = document.createElement('div')
  const rightArrowsLeftArrowIcon = createIconWithWidth('/assets/leftArrowCustomIcon.png', '54px')
  const rightArrowsRightArrowIcon = createIconWithWidth('/assets/rightArrowCustomIcon.png', '54px')
  arrowIcon.append(rightArrowsLeftArrowIcon, rightArrowsRightArrowIcon)
  return arrowIcon
}

export function createIcon(src: string): HTMLImageElement {
  const icon = document.createElement('img')
  icon.src = src
  return icon
}

export function createIconWithSize(src: string, size: string): HTMLImageElement {
  const icon = createIcon(src)
  icon.style.width = size
  icon.style.height = size
  return icon
}

export function createIconWithWidth(src: string, width: string): HTMLImageElement {
  const icon = createIcon(src)
  icon.style.width = width
  return icon
}

export function createMoneyContainer(innerText: string): HTMLDivElement {
  const moneyContainer = document.createElement('div')
  const moneyIconWrapper = document.createElement('div')
  const moneyIcon = createIconWithWidth('/assets/coinCustomIcon.png', '25px')
  moneyIconWrapper.appendChild(moneyIcon)
  const moneyValueWrapper = document.createElement('div')
  const moneyValue = createElWithText('h4', innerText)
  moneyValueWrapper.appendChild(moneyValue)
  moneyContainer.append(moneyIconWrapper, moneyValueWrapper)
  return moneyContainer
}

export function createItemContainer(innerText: string, itemIcon: HTMLDivElement): HTMLDivElement {
  const itemContainer = document.createElement('div')
  const itemIconWrapper = document.createElement('div')
  itemIconWrapper.appendChild(itemIcon)
  const itemValueWrapper = document.createElement('div')
  const itemValue = createElWithText('h4', innerText)
  itemValueWrapper.appendChild(itemValue)
  itemContainer.append(itemIconWrapper, itemValueWrapper)
  return itemContainer
}

export function createDivWithId(id: string): HTMLDivElement {
  const div = document.createElement('div')
  div.id = id
  return div
}

export function createDivWithClassName(className: string): HTMLDivElement {
  const div = document.createElement('div')
  div.className = className
  return div
}

export function createDivWithIdClass(id: string, className: string): HTMLDivElement {
  const div = document.createElement('div')
  div.id = id
  div.className = className
  return div
}

export function createParagraph(textContent: string): HTMLParagraphElement {
  const paragraph = document.createElement('p')
  paragraph.textContent = textContent
  return paragraph
}

export function createButtonWithId(id: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.id = id
  return button
}

export function createButtonWithInnerText(id: string, innerText: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.id = id
  button.innerText = innerText
  return button
}

export function createElWithText(type: string, innerText: string): HTMLElement {
  const element = document.createElement(type)
  element.innerText = innerText
  return element
}

export function createElWithIdText(type: string, id: string, innerText: string): HTMLElement {
  const element = document.createElement(type)
  element.id = id
  element.innerText = innerText
  return element
}

export function createElWithClassText(type: string, innerText: string, className: string): HTMLElement {
  const element = document.createElement(type)
  element.className = className
  element.innerText = innerText
  return element
}

export function createElWithIdClassText(type: string, id: string, innerText: string, className: string): HTMLElement {
  const element = createElWithIdText(type, id, innerText)
  element.className = className
  return element
}

export function createSpan(innerText: string): HTMLSpanElement {
  const span = document.createElement('span')
  span.innerText = innerText
  return span
}

export function createCrop(cropper: ImageCropper, url: string, repr: ClassResourceRepresentation[], key: string): HTMLDivElement {
  return cropper.crop(
    RESOURCE_ICON_WIDTH,
    RESOURCE_ICON_HEIGHT,
    RESOURCE_ICON_SCALE,
    url,
    repr.length,
    getResourceMapping(repr)(key),
    false,
  )
}

export function createTradeCrop(cropper: ImageCropper, url: string, repr: ClassResourceRepresentation[], key: string): HTMLDivElement {
  return cropper.crop(
    25,
    25,
    1,
    url,
    repr.length,
    getResourceMapping(repr)(key),
    false,
  )
}

export function createIElement(content: string): HTMLDivElement {
  const element = document.createElement('i')
  element.className = `fa fa-${content}`
  element.ariaHidden = 'true'
  return element as HTMLDivElement
}

export function createIElementWithColor(content: string, color: string): HTMLDivElement {
  const element = createIElement(content)
  element.style.color = color
  return element
}
