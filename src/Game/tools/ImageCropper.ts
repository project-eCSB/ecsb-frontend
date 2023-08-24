import { getPlayerMapping } from "../GameUtils"
import { type Scene } from "../scenes/Scene"

export class ImageCropper {
  crop(scene: Scene, id: string, width: number, height: number, path: string, columns: number): HTMLDivElement {
    const cropContainer = document.createElement('div')
    cropContainer.style.width = `${width}px`
    cropContainer.style.height = `${height}px`
    cropContainer.style.overflow = 'hidden'

    const className = scene.playersClasses.get(id)
    if (!className) {
        return cropContainer
    }
    const idx = getPlayerMapping(scene.settings.classResourceRepresentation)(className)
    
    const im = document.createElement('img')
    im.src = path
    const marginLeft = -((3 * width) * (idx % columns) + width)
    const marginTop = -(height * Math.floor(idx / columns))
    im.style.marginLeft = `${marginLeft}px`
    im.style.marginTop = `${marginTop}px`

    cropContainer.appendChild(im)
    return cropContainer
  }
}
