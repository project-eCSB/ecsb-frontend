import { createDivWithId } from './ViewUtils'

export class LoadingView {
  public static readonly loadingBoxID = 'loadingBox'
  public static readonly loadingBoxSpinnerContainerID = 'loadingBoxSpinnerContainer'
  public static readonly loadingBoxSpinnerID = 'loadingBoxSpinner'

  private readonly loadingBox: HTMLDivElement

  constructor() {
    this.loadingBox = createDivWithId(LoadingView.loadingBoxID)
    const spinnerContainer = createDivWithId(LoadingView.loadingBoxSpinnerContainerID)
    const spinner = createDivWithId(LoadingView.loadingBoxSpinnerID)
    spinnerContainer.appendChild(spinner)
    this.loadingBox.appendChild(spinnerContainer)
  }

  public show(): void {
    if (!document.getElementById(LoadingView.loadingBoxID)) {
      window.document.body.appendChild(this.loadingBox)
    }
  }

  public close(): void {
    document.getElementById(LoadingView.loadingBoxID)?.remove()
  }
}
