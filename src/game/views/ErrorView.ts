import { createDivWithClassName, createIElementWithColor } from './ViewUtils'

export class ErrorView {
  public static readonly containerID = 'errorsAndInfo'
  public static readonly errorBoxClassName = 'errorBox'
  public static readonly errorBoxWrapperClassName = 'errorBoxWrapper'

  private readonly errorBox: HTMLDivElement
  private readonly errorBoxWrapper: HTMLDivElement
  private readonly errorBoxText: HTMLParagraphElement

  private isHidden: boolean

  constructor() {
    this.errorBox = createDivWithClassName(ErrorView.errorBoxClassName)
    const icon = createIElementWithColor('exclamation-triangle', '#BE0017')
    this.errorBoxText = document.createElement('p')

    this.errorBox.append(icon, this.errorBoxText)

    this.errorBoxWrapper = createDivWithClassName(ErrorView.errorBoxWrapperClassName)
    this.errorBoxWrapper.appendChild(this.errorBox)

    this.isHidden = true
  }

  setText(text: string): void {
    this.errorBoxText.innerHTML = text
  }

  show(): void {
    if (!this.isHidden) return

    const container = document.getElementById(ErrorView.containerID)
    if (container) {
      container.appendChild(this.errorBoxWrapper)
      this.isHidden = false
    }
  }

  close(): void {
    if (this.isHidden) return

    const container = document.getElementById(ErrorView.containerID)
    if (container) {
      container.removeChild(this.errorBoxWrapper)
      this.isHidden = true
    }
  }
}
