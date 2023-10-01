export class SettingsView {
    public static readonly settingsID = 'settings';
    public static readonly settingsWrapperID = 'settingsWrapper';

    settings: HTMLButtonElement
    settingsWrapper: HTMLDivElement

    constructor() {
        const image = document.createElement('img')
        image.src = "/assets/settingsCustomIcon.png"

        this.settings = document.createElement('button')
        this.settings.addEventListener('click', () => {
            this.settings.id = (this.settings.id === 'settingsActive') ? 'settings' : 'settingsActive'
            this.settingsWrapper.id = (this.settingsWrapper.id === 'settingsWrapperActive') ? 'settingsWrapper' : 'settingsWrapperActive'
        })
        this.settings.id = SettingsView.settingsID

        this.settingsWrapper = document.createElement('div')
        this.settingsWrapper.id = SettingsView.settingsWrapperID

        this.settings.appendChild(image)
        this.settingsWrapper.appendChild(this.settings)
    }

    show(): void {
        window.document.body.appendChild(this.settingsWrapper)
    }
    
    close(): void {
        window.document.body.removeChild(this.settingsWrapper)
    }
}