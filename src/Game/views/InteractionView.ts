import { type Scene } from '../scenes/Scene'

export class InteractionView {
  scene: Scene
  interaction: HTMLDivElement
  interactionText: HTMLParagraphElement

  constructor(scene: Scene) {
    this.scene = scene

    this.interaction = document.createElement('div')
    this.interaction.id = 'interaction'

    const icon = document.createElement('i')
    icon.className = 'fa fa-question-circle'
    icon.ariaHidden = 'true'

    this.interactionText = document.createElement('p')
    this.interactionText.id = 'interactionTitle'

    this.interaction.appendChild(icon)
    this.interaction.appendChild(this.interactionText)

    this.interaction.style.display = 'none'
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
