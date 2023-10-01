export class ErrorView {
  public static readonly interactionBoxID = 'interactionBox';
  public static readonly interactionBoxWrapperID = 'interactionBoxWrapper';

  error: HTMLDivElement
  errorWrapper: HTMLDivElement
  errorText: HTMLParagraphElement

  constructor() {
    this.error = document.createElement('div')
    this.error.id = ErrorView.interactionBoxID

    const icon = document.createElement('i')
    icon.className = 'fa fa-exclamation-triangle'
    icon.ariaHidden = 'true'
    icon.style.color = '#BE0017'

    this.errorText = document.createElement('p')
    this.errorText.id = 'interactionTitle'

    this.error.appendChild(icon)
    this.error.appendChild(this.errorText)

    this.errorWrapper = document.createElement('div')
    this.errorWrapper.id = ErrorView.interactionBoxWrapperID
    this.errorWrapper.appendChild(this.error)
  }

  setText(text: string): void {
    this.errorText.innerHTML = `${text}`
  }

  show(): void {
    const container = document.getElementById('errorsAndInfo');
    if (container) {
      container.appendChild(this.errorWrapper)
    }
  }

  close(): void {
    const container = document.getElementById('errorsAndInfo');
    if (container) {
      container.removeChild(this.errorWrapper)
    }
  }
}