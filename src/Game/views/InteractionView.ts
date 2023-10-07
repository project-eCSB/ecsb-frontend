export class InteractionView {
  public static readonly interactionBoxID = 'interactionBox'
  public static readonly interactionBoxWrapperID = 'interactionBoxWrapper'

  interaction: HTMLDivElement
  interactionWrapper: HTMLDivElement
  interactionText: HTMLParagraphElement
  hidden: boolean

  constructor() {
    this.interaction = document.createElement('div')
    this.interaction.id = InteractionView.interactionBoxID

    const icon = document.createElement('i')
    icon.className = 'fa fa-question-circle'
    icon.ariaHidden = 'true'
    icon.style.color = '#835211'

    this.interactionText = document.createElement('p')
    this.interactionText.id = 'interactionTitle'

    this.interaction.appendChild(icon)
    this.interaction.appendChild(this.interactionText)

    this.interactionWrapper = document.createElement('div')
    this.interactionWrapper.id = InteractionView.interactionBoxWrapperID
    this.interactionWrapper.appendChild(this.interaction)

    this.hidden = true
  }

  setText(text: string): void {
    this.interactionText.innerHTML = `Wciśnij <strong>spacje</strong> by ${text}`
  }

  show(): void {
    const container = document.getElementById('errorsAndInfo')
    if (container) {
      container.appendChild(this.interactionWrapper)
      this.hidden = false
    }
  }

  close(): void {
    const container = document.getElementById('errorsAndInfo')
    if (container && !this.hidden) {
      container.removeChild(this.interactionWrapper)
      this.hidden = true
    }
  }
}
