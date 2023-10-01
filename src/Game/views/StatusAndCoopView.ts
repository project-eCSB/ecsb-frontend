import { type ClassResourceRepresentation } from "../../apis/game/Types"
import { type Equipment } from "../../services/game/Types"
import { RESOURCE_ICON_SCALE, RESOURCE_ICON_WIDTH, getResourceMapping } from "../GameUtils"
import { ImageCropper } from "../tools/ImageCropper"

export class StatusAndCoopView {
    public static readonly statusButtonID = 'statusButton'
    public static readonly statusButtonWrapperID = 'statusButtonWrapper'
    public static readonly coopButtonID = 'coopButton'
    public static readonly coopButtonWrapperID = 'coopButtonWrapper'
    public static readonly statusAndCoopConatinerID = 'statusAndCoopContainer'
    public static readonly advertisementContainerID = 'advertisementContainer'
  
    private readonly statusButton: HTMLButtonElement
    private readonly statusButtonWrapper: HTMLDivElement
    private readonly coopButton: HTMLButtonElement
    private readonly coopButtonWrapper: HTMLDivElement
    private readonly container: HTMLDivElement
    private readonly advertisementContainer: HTMLDivElement
  
    constructor(equipment: Equipment, url: string, resRepresentation: ClassResourceRepresentation[]) {
      const cropper = new ImageCropper()

      this.advertisementContainer = document.createElement('div')
      this.advertisementContainer.id = StatusAndCoopView.advertisementContainerID
      equipment.resources.forEach(element => {
        const row = document.createElement('div')
        const buttonGiveWrapper = document.createElement('div')
        buttonGiveWrapper.id = 'adButtonWrapper'
        const buttonGive = document.createElement('button')
        buttonGive.className = 'adGive'
        buttonGive.id = 'adButton'
        buttonGive.addEventListener('click', () => {
          document.querySelectorAll('.adGive').forEach(el => {
            if (el !== buttonGive) el.id = 'adButton'
            if (el.parentElement !== buttonGiveWrapper) el.parentElement!.id = 'adButtonWrapper'
          })
          document.getElementsByClassName('adGive')
          buttonGive.id = (buttonGive.id === 'adButtonActive') ? 'adButton' : 'adButtonActive'
          buttonGiveWrapper.id = (buttonGiveWrapper.id === 'adButtonWrapperActive') ? 'adButtonWrapper' : 'adButtonWrapperActive'
        })
        const giveImage = document.createElement('img')
        giveImage.src = '/assets/giveCustomIcon.png'
        buttonGive.appendChild(giveImage)
        buttonGive.appendChild(cropper.crop(
          RESOURCE_ICON_WIDTH,
          RESOURCE_ICON_WIDTH,
          RESOURCE_ICON_SCALE,
          url,
          3,
          getResourceMapping(resRepresentation)(element.key)
        ))
        buttonGiveWrapper.appendChild(buttonGive)
        const buttonReceiveWrapper = document.createElement('div')
        buttonReceiveWrapper.id = 'adButtonWrapper'
        const buttonReceive = document.createElement('button')
        buttonReceive.className = 'adReceive'
        buttonReceive.id = 'adButton'
        buttonReceive.addEventListener('click', () => {
          document.querySelectorAll('.adReceive').forEach(el => {
            if (el !== buttonReceive) el.id = 'adButton'
            if (el.parentElement !== buttonReceiveWrapper) el.parentElement!.id = 'adButtonWrapper'
          })
          document.getElementsByClassName('adGive')
          buttonReceive.id = (buttonReceive.id === 'adButtonActive') ? 'adButton' : 'adButtonActive'
          buttonReceiveWrapper.id = (buttonReceiveWrapper.id === 'adButtonWrapperActive') ? 'adButtonWrapper' : 'adButtonWrapperActive'
        })
        const receiveImage = document.createElement('img')
        receiveImage.src = '/assets/receiveCustomIcon.png'
        buttonReceive.appendChild(receiveImage)
        buttonReceive.appendChild(cropper.crop(
          RESOURCE_ICON_WIDTH,
          RESOURCE_ICON_WIDTH,
          RESOURCE_ICON_SCALE,
          url,
          3,
          getResourceMapping(resRepresentation)(element.key)
        ))
        buttonReceiveWrapper.appendChild(buttonReceive)
        row.appendChild(buttonGiveWrapper)
        row.appendChild(buttonReceiveWrapper)
        this.advertisementContainer.appendChild(row)
      });
      const coopAdvertisementWrapper = document.createElement('div')
      coopAdvertisementWrapper.id = "coopAdWrapper"
      const coopAdvertisementButton = document.createElement('button')
      coopAdvertisementButton.addEventListener('click', () => {
        coopAdvertisementWrapper.id = (coopAdvertisementWrapper.id === 'coopAdWrapperActive') ? 'coopAdWrapper' : 'coopAdWrapperActive'
      })
      const coopAdvertisementImage = document.createElement('img')
      coopAdvertisementImage.src = '/assets/coopCustomIcon.png'
      coopAdvertisementButton.appendChild(coopAdvertisementImage)
      coopAdvertisementWrapper.appendChild(coopAdvertisementButton)
      this.advertisementContainer.appendChild(coopAdvertisementWrapper)
      this.advertisementContainer.style.display = 'none'
      
      this.statusButton = document.createElement('button')
      this.statusButton.addEventListener('click', () => {
        this.statusButton.id = (this.statusButton.id === 'statusButtonActive') ? 'statusButton' : 'statusButtonActive'
        this.statusButtonWrapper.id = (this.statusButtonWrapper.id === 'statusButtonWrapperActive') ? 'statusButtonWrapper' : 'statusButtonWrapperActive'
      })
      this.statusButton.id = StatusAndCoopView.statusButtonID
      const spanStatus = document.createElement('span')
      spanStatus.textContent = "Status"
      const iconStatus = document.createElement('i')
      iconStatus.className = "fa fa-caret-down"
      iconStatus.ariaHidden = "true"
      this.statusButton.addEventListener('click', () => {
        iconStatus.className = (iconStatus.className === "fa fa-caret-up") ? "fa fa-caret-down" : "fa fa-caret-up"
        this.advertisementContainer.style.display = (this.advertisementContainer.style.display === "none") ? "block" : "none"
      })
      this.statusButton.appendChild(spanStatus)
      this.statusButton.appendChild(iconStatus)
  
      this.statusButtonWrapper = document.createElement('div')
      this.statusButtonWrapper.id = StatusAndCoopView.statusButtonWrapperID

  
      this.coopButton = document.createElement('button')
      this.coopButton.addEventListener('click', () => {
        this.coopButton.id = (this.coopButton.id === 'coopButtonActive') ? 'coopButton' : 'coopButtonActive'
        this.coopButtonWrapper.id = (this.coopButtonWrapper.id === 'coopButtonWrapperActive') ? 'coopButtonWrapper' : 'coopButtonWrapperActive'
      })
      this.coopButton.id = StatusAndCoopView.coopButtonID
      const spanCoop = document.createElement('span')
      spanCoop.textContent = "Coop"
      const iconCoop = document.createElement('i')
      iconCoop.className = "fa fa-caret-down"
      iconCoop.ariaHidden = "true"
      this.coopButton.addEventListener('click', () => {
        iconCoop.className = (iconCoop.className === "fa fa-caret-up") ? "fa fa-caret-down" : "fa fa-caret-up"
      })
      this.coopButton.appendChild(spanCoop)
      this.coopButton.appendChild(iconCoop)
  
      this.coopButtonWrapper = document.createElement('div')
      this.coopButtonWrapper.id = StatusAndCoopView.coopButtonWrapperID


      this.container = document.createElement('div')
      this.container.id = StatusAndCoopView.statusAndCoopConatinerID

      this.statusButtonWrapper.appendChild(this.statusButton)
      this.coopButtonWrapper.appendChild(this.coopButton)
      this.container.appendChild(this.statusButtonWrapper)
      this.container.appendChild(this.advertisementContainer)
      this.container.appendChild(this.coopButtonWrapper)
    }
  
    public show(): void {
      window.document.body.appendChild(this.container)
    }
  
    public close(): void {
      window.document.body.removeChild(this.container)
    }


}