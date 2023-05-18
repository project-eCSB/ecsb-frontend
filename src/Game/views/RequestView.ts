import { type Scene } from '../scenes/Scene'

export class RequestView {
  scene: Scene
  requestBox: HTMLDivElement

  constructor(scene: Scene) {
    this.scene = scene
    this.requestBox = document.createElement('div')
    this.requestBox.id = 'requestBox'
  }

  setContent(request: string, acceptFunc: () => void, rejectFunc: () => void): void {
    document.getElementById('requestBoxContent')?.remove()

    const requestBoxContent = document.createElement('div')
    requestBoxContent.id = 'requestBoxContent'

    const requestText = document.createElement('h5')
    requestText.innerText = request

    const buttonsBox = document.createElement('div')
    buttonsBox.id = 'requestButtonsBox'

    const acceptButton = document.createElement('button')
    acceptButton.id = 'acceptButton'
    acceptButton.innerText = 'Accept'
    acceptButton.addEventListener('click', acceptFunc)

    const closeButton = document.createElement('button')
    closeButton.id = 'rejectButton'
    closeButton.innerText = 'Reject'
    closeButton.addEventListener('click', rejectFunc)

    buttonsBox.appendChild(acceptButton)
    buttonsBox.appendChild(closeButton)

    requestBoxContent.appendChild(requestText)
    requestBoxContent.appendChild(buttonsBox)

    this.requestBox.appendChild(requestBoxContent)
  }

  show(): void {
    window.document.body.appendChild(this.requestBox)
  }

  close(): void {
    document.getElementById('requestBox')?.remove()
    this.scene.requestView = null
  }
}
