import { type Scene } from '../scenes/Scene'

export class LoadingView {
  scene: Scene
  loading: HTMLDivElement

  constructor(scene: Scene) {
    this.scene = scene

    this.loading = document.createElement('div')
    this.loading.id = 'modal-overlay'

    const spinnerContainer = document.createElement('div')
    spinnerContainer.id = 'spinner-container'

    const spinner = document.createElement('div')
    spinner.id = 'loading-spinner'

    spinnerContainer.appendChild(spinner)
    this.loading.appendChild(spinnerContainer)
  }

  show(): void {
    window.document.body.appendChild(this.loading)
    this.scene.loadingView = this
  }

  close(): void {
    document.getElementById('modal-overlay')?.remove()
    this.scene.loadingView = null
  }
}
