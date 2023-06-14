import { type Scene } from '../scenes/Scene'

export class InteractionView {
  scene: Scene
  interaction: HTMLDivElement
  interactionText: HTMLParagraphElement

  constructor(
    scene: Scene,
    text: string,
  ) {
    this.scene = scene

    // CONTAIENR
    this.interaction = document.createElement('div')
    this.interaction.id = 'interaction'

    // TITLE
    const icon = document.createElement('i')
    icon.className = "fa fa-question-circle"
    icon.ariaHidden = "true"

    this.interactionText = document.createElement('p')
    this.interactionText.id = 'interactionTitle'
    this.interactionText.innerHTML = `Press <strong>space</strong> to ${text}`

    this.interaction.appendChild(icon)
    this.interaction.appendChild(this.interactionText)
  }

  show(): void {
    window.document.body.appendChild(this.interaction)
    this.scene.interactionView = this
  }

  close(): void {
    document.getElementById('interaction')?.remove()
    this.scene.interactionView = null
  }
}
