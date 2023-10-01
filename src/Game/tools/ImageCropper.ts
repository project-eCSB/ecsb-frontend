export class ImageCropper {
  crop(
    width: number,
    height: number,
    scale: number,
    path: string,
    columns: number,
    resourceIndex: number,
  ): HTMLDivElement {
    const cropContainer = document.createElement('div')
    cropContainer.style.width = `${width * scale}px`
    cropContainer.style.height = `${height * scale}px`
    cropContainer.style.overflow = 'hidden'

    const im = document.createElement('img')
    im.src = path
    im.style.height = 'auto'
    im.style.width = `${columns * width * scale}px`
    
    const marginLeft = -(width * ((resourceIndex - 1) % columns)) * scale
    const marginTop = -(height * Math.floor((resourceIndex - 1) / columns)) * scale
    im.style.marginLeft = `${marginLeft}px`
    im.style.marginTop = `${marginTop}px`

    cropContainer.appendChild(im)
    return cropContainer
  }
}
