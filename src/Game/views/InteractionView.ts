export class InteractionView {
  public static readonly interactionBoxID = 'interactionBox';

  interaction: HTMLDivElement
  interactionText: HTMLParagraphElement

  constructor() {
    this.interaction = document.createElement('div')
    this.interaction.id = InteractionView.interactionBoxID

    const icon = document.createElement('i')
    icon.className = 'fa fa-question-circle'
    icon.ariaHidden = 'true'

    this.interactionText = document.createElement('p')
    this.interactionText.id = 'interactionTitle'

    this.interaction.appendChild(icon)
    this.interaction.appendChild(this.interactionText)

    window.document.body.appendChild(this.interaction)
  }

  setText(text: string): void {
    this.interactionText.innerHTML = `Press <strong>space</strong> to ${text}`
  }

  show(): void {
    this.interaction.style.display = 'flex'
  }

  close(): void {
    this.interaction.style.display = 'none'
  }
}
