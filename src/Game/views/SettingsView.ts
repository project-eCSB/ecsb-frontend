export class SettingsView {
  public static readonly settingsID = 'settingsButton'
  public static readonly settingsWrapperID = 'settingsButtonWrapper'
  public static readonly settingsContainerID = 'settingsContainer'
  public static readonly settingsContainerWrapperID = 'settingsContainerWrapper'
  public static readonly leaveButtonWrapperID = 'leaveButtonWrapper'

  settings: HTMLDivElement
  settingsWrapper: HTMLDivElement
  settingsContainer: HTMLDivElement
  settingsContainerWrapper: HTMLDivElement

  permanentAds: HTMLInputElement

  constructor(destroy: () => void) {
    const image = document.createElement('img')
    image.src = '/assets/settingsCustomIcon.png'

    this.settings = document.createElement('div')
    this.settings.addEventListener('click', () => {
      this.settingsContainerWrapper.style.right =
        this.settingsContainerWrapper.style.right === '10px' ? '-400px' : '10px'
      this.settings.id =
        this.settings.id === 'settingsButtonActive' ? 'settingsButton' : 'settingsButtonActive'
      this.settingsWrapper.id =
        this.settingsWrapper.id === 'settingsButtonWrapperActive'
          ? 'settingsButtonWrapper'
          : 'settingsButtonWrapperActive'
    })
    this.settings.id = SettingsView.settingsID

    this.settingsWrapper = document.createElement('div')
    this.settingsWrapper.id = SettingsView.settingsWrapperID

    this.settings.appendChild(image)
    this.settingsWrapper.appendChild(this.settings)

    this.settingsContainer = document.createElement('div')
    this.settingsContainer.id = SettingsView.settingsContainerID

    this.permanentAds = document.createElement('input')
    this.permanentAds.type = 'checkbox'
    this.permanentAds.checked = true
    const permanentAdsLabel = document.createElement('label')
    permanentAdsLabel.innerText = 'Zawsze widoczne ogłoszenia'
    const settingsRow = document.createElement('div')
    settingsRow.appendChild(this.permanentAds)
    settingsRow.appendChild(permanentAdsLabel)
    this.settingsContainer.appendChild(settingsRow)
    const leaveButton = document.createElement('button')
    leaveButton.innerHTML = 'Opuść grę'
    leaveButton.addEventListener('click', () => {
      destroy()
      window.location.href = '/home'
    })
    const leaveButtonWrapper = document.createElement('div')
    leaveButtonWrapper.id = SettingsView.leaveButtonWrapperID
    leaveButtonWrapper.appendChild(leaveButton)
    this.settingsContainer.appendChild(leaveButtonWrapper)

    this.settingsContainerWrapper = document.createElement('div')
    this.settingsContainerWrapper.id = SettingsView.settingsContainerWrapperID

    this.settingsContainerWrapper.appendChild(this.settingsContainer)
  }

  show(): void {
    window.document.body.appendChild(this.settingsWrapper)
    window.document.body.appendChild(this.settingsContainerWrapper)
  }

  close(): void {
    window.document.body.removeChild(this.settingsWrapper)
    window.document.body.removeChild(this.settingsContainerWrapper)
  }

  permanentAdsSetting(): boolean {
    return this.permanentAds.checked
  }
}
