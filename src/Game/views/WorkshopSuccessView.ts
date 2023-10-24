export class WorkshopSuccessView {
  private readonly onClose: () => void

  public static readonly workshopSuccessBoxID = 'workshopSuccessBox'
  public static readonly workshopSuccessBoxTitleWrapperID = 'workshopSuccessBoxTitleBoxWrapper'
  public static readonly workshopSuccessBoxTitleBoxID = 'workshopSuccessBoxTitleBox'
  public static readonly workshopSuccessBoxHeaderBoxWrapperID = 'workshopSuccessBoxHeaderBoxWrapper'
  public static readonly workshopSuccessBoxHeaderBoxID = 'workshopSuccessBoxHeaderBox'
  public static readonly workshopSuccessBoxContentBoxWrapperID =
    'workshopSuccessBoxContentBoxWrapper'
  public static readonly workshopSuccessBoxContentBoxID = 'workshopSuccessBoxContentBox'
  public static readonly workshopSuccessBoxContentBoxIconWrapperID =
    'workshopSuccessBoxContentBoxIconWrapper'
  public static readonly workshopSuccessBoxContentBoxResultBoxID =
    'workshopSuccessBoxContentBoxResultBox'
  public static readonly workshopSuccessBoxContentBoxResultBoxResourcesBoxID =
    'workshopSuccessBoxContentBoxResultBoxResourcesBox'
  public static readonly workshopSuccessBoxContentBoxResultBoxResourcesBoxValueID =
    'workshopSuccessBoxContentBoxResultBoxResourcesBoxValue'
  public static readonly workshopSuccessBoxContentBoxPlayerBoxID =
    'workshopSuccessBoxContentBoxPlayerBox'
  public static readonly workshopSuccessBoxCloseButtonExtraWrapperID =
    'workshopSuccessBoxCloseButtonExtraWrapper'
  public static readonly workshopSuccessBoxCloseButtonWrapperID =
    'workshopSuccessBoxCloseButtonWrapper'
  public static readonly workshopSuccessBoxCloseButtonID = 'workshopSuccessBoxCloseButton'

  private readonly workshopSuccessBox: HTMLDivElement

  constructor(
    userName: string,
    className: string,
    resultValue: number,
    leftItemIcon: HTMLDivElement,
    rightItemIcon: HTMLDivElement,
    onClose: () => void,
  ) {
    this.onClose = onClose

    // Container
    this.workshopSuccessBox = document.createElement('div')
    this.workshopSuccessBox.id = WorkshopSuccessView.workshopSuccessBoxID

    // Title
    const workshopBoxTitleBoxWrapper = document.createElement('div')
    workshopBoxTitleBoxWrapper.id = WorkshopSuccessView.workshopSuccessBoxTitleWrapperID

    const workshopBoxTitleBox = document.createElement('div')
    workshopBoxTitleBox.id = WorkshopSuccessView.workshopSuccessBoxTitleBoxID
    const workshopTitleHeader = document.createElement('h1')
    workshopTitleHeader.innerText = 'WARSZTAT'

    const workshopTitleClassWrapper = document.createElement('div')

    const workshopTitleClass = document.createElement('h2')
    workshopTitleClass.innerText = `${className.toUpperCase()}A`

    workshopTitleClassWrapper.appendChild(leftItemIcon)
    workshopTitleClassWrapper.appendChild(workshopTitleClass)
    workshopTitleClassWrapper.appendChild(rightItemIcon)

    workshopBoxTitleBox.appendChild(workshopTitleHeader)
    workshopBoxTitleBox.appendChild(workshopTitleClassWrapper)

    workshopBoxTitleBoxWrapper.appendChild(workshopBoxTitleBox)

    // Header
    const workshopSuccessBoxHeaderBoxWrapper = document.createElement('div')
    workshopSuccessBoxHeaderBoxWrapper.id = WorkshopSuccessView.workshopSuccessBoxHeaderBoxWrapperID

    const workshopSuccessBoxHeaderBox = document.createElement('div')
    workshopSuccessBoxHeaderBox.id = WorkshopSuccessView.workshopSuccessBoxHeaderBoxID
    const workshopSuccessBoxHeaderBoxTitle = document.createElement('h1')
    workshopSuccessBoxHeaderBoxTitle.innerText = 'Produkcja zakonczona sukcesem!'
    const leftSuccessIcon = document.createElement('img')
    leftSuccessIcon.src = '/assets/successCustomIcon.png'
    const rightSuccessIcon = document.createElement('img')
    rightSuccessIcon.src = '/assets/successCustomIcon.png'

    workshopSuccessBoxHeaderBox.appendChild(leftSuccessIcon)
    workshopSuccessBoxHeaderBox.appendChild(workshopSuccessBoxHeaderBoxTitle)
    workshopSuccessBoxHeaderBox.appendChild(rightSuccessIcon)

    workshopSuccessBoxHeaderBoxWrapper.appendChild(workshopSuccessBoxHeaderBox)

    // Content
    const workshopSuccessBoxContentBoxWrapper = document.createElement('div')
    workshopSuccessBoxContentBoxWrapper.id =
      WorkshopSuccessView.workshopSuccessBoxContentBoxWrapperID

    const workshopSuccessBoxContentBox = document.createElement('div')
    workshopSuccessBoxContentBox.id = WorkshopSuccessView.workshopSuccessBoxContentBoxID

    const resultResources = document.createElement('div')
    resultResources.id = WorkshopSuccessView.workshopSuccessBoxContentBoxResultBoxResourcesBoxID

    const resultResourcesResourceValueWrapper = document.createElement('div')
    const resultResourcesResourceValue = document.createElement('p')
    resultResourcesResourceValue.id =
      WorkshopSuccessView.workshopSuccessBoxContentBoxResultBoxResourcesBoxValueID
    resultResourcesResourceValue.innerText = `${resultValue}`
    resultResourcesResourceValueWrapper.appendChild(resultResourcesResourceValue)

    resultResources.appendChild(rightItemIcon.cloneNode(true))
    resultResources.appendChild(resultResourcesResourceValueWrapper)

    const transferIcon = document.createElement('img')
    transferIcon.src = '/assets/arrow.svg'

    const playerBox = document.createElement('div')
    playerBox.id = WorkshopSuccessView.workshopSuccessBoxContentBoxPlayerBoxID
    const playerName = document.createElement('p')
    playerName.innerText = userName
    playerBox.appendChild(playerName)

    workshopSuccessBoxContentBox.appendChild(resultResources)
    workshopSuccessBoxContentBox.appendChild(transferIcon)
    workshopSuccessBoxContentBox.appendChild(playerBox)

    workshopSuccessBoxContentBoxWrapper.appendChild(workshopSuccessBoxContentBox)

    // Close button
    const workshopSuccessBoxCloseButtonExtraWrapper = document.createElement('div')
    workshopSuccessBoxCloseButtonExtraWrapper.id =
      WorkshopSuccessView.workshopSuccessBoxCloseButtonExtraWrapperID

    const workshopSuccessBoxCloseButtonWrapper = document.createElement('div')
    workshopSuccessBoxCloseButtonWrapper.id =
      WorkshopSuccessView.workshopSuccessBoxCloseButtonWrapperID
    const workshopSuccessBoxCloseButton = document.createElement('button')
    workshopSuccessBoxCloseButton.id = WorkshopSuccessView.workshopSuccessBoxCloseButtonID
    workshopSuccessBoxCloseButton.innerText = 'OK'
    workshopSuccessBoxCloseButton.addEventListener('click', () => {
      workshopSuccessBoxCloseButtonExtraWrapper.id =
        workshopSuccessBoxCloseButtonExtraWrapper.id ===
        'workshopSuccessBoxCloseButtonExtraWrapperActive'
          ? 'workshopSuccessBoxCloseButtonExtraWrapper'
          : 'workshopSuccessBoxCloseButtonExtraWrapperActive'
      workshopSuccessBoxCloseButtonWrapper.id =
        workshopSuccessBoxCloseButtonWrapper.id === 'workshopSuccessBoxCloseButtonWrapperActive'
          ? 'workshopSuccessBoxCloseButtonWrapper'
          : 'workshopSuccessBoxCloseButtonWrapperActive'
      workshopSuccessBoxCloseButton.id =
        workshopSuccessBoxCloseButton.id === 'workshopSuccessBoxCloseButtonActive'
          ? 'workshopSuccessBoxCloseButton'
          : 'workshopSuccessBoxCloseButtonActive'

      this.close()
    })
    workshopSuccessBoxCloseButtonWrapper.appendChild(workshopSuccessBoxCloseButton)
    workshopSuccessBoxCloseButtonExtraWrapper.appendChild(workshopSuccessBoxCloseButtonWrapper)

    this.workshopSuccessBox.appendChild(workshopBoxTitleBoxWrapper)
    this.workshopSuccessBox.appendChild(workshopSuccessBoxHeaderBoxWrapper)
    this.workshopSuccessBox.appendChild(workshopSuccessBoxContentBoxWrapper)
    this.workshopSuccessBox.appendChild(workshopSuccessBoxCloseButtonExtraWrapper)
  }

  public show(): void {
    if (!document.getElementById(WorkshopSuccessView.workshopSuccessBoxID)) {
      window.document.body.appendChild(this.workshopSuccessBox)
    }
  }

  public close(): void {
    document.getElementById(WorkshopSuccessView.workshopSuccessBoxID)?.remove()
    this.onClose()
  }
}
