import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'

export class InteractionCloudBuilder {
  private readonly icons: Record<CloudType, HTMLElement> = {
    [CloudType.WORK]: this.createCloudIcon('fa-gavel'),
    [CloudType.TALK]: this.createCloudIcon('fa-commenting'),
    [CloudType.TRAVEL]: this.createCloudIcon('fa-map'),
    [CloudType.PRODUCTION]: this.createCloudIcon('fa-gavel'),
  }

  private readonly notMoveableIconTypes: CloudType[] = [
    CloudType.WORK,
    CloudType.TALK,
    CloudType.TRAVEL,
  ]

  private createCloudIcon(iconClassName: string): HTMLElement {
    const iconElement = document.createElement('i')
    iconElement.className = `fa ${iconClassName}`
    iconElement.ariaHidden = 'true'
    return iconElement
  }

  build(scene: Scene, playerId: string): Phaser.GameObjects.DOMElement {
    const cloud = document.createElement('div')
    cloud.className = 'actionCloud'
    cloud.id = `cloud-${playerId}`

    const cloudSymbol = scene.add.dom(13, -5, cloud)
    return cloudSymbol
  }

  showInteractionCloud(playerId: string, cloudType: CloudType): void {
    const cloud = document.getElementById(`cloud-${playerId}`)
    if (!cloud) return

    this.clearInteractionCloud(playerId)
    const cloudIcon = this.icons[cloudType].cloneNode(false) as HTMLElement
    cloudIcon.id = `${cloudType}-${playerId}`
    cloud.appendChild(cloudIcon)
    cloud.style.visibility = 'visible'
  }

  hideInteractionCloud(playerId: string, cloudType: CloudType): void {
    const cloud = document.getElementById(`cloud-${playerId}`)
    if (cloud) {
      document.getElementById(`${cloudType}-${playerId}`)?.remove()

      if (cloud.childNodes.length === 0) {
        cloud.style.visibility = 'hidden'
      }
    }
  }

  clearInteractionCloud(playerId: string): void {
    const cloud = document.getElementById(`cloud-${playerId}`)
    if (!cloud) return

    while (cloud.firstChild) {
      cloud.removeChild(cloud.firstChild)
    }
  }

  purgeUnnecessaryIcons(playerId: string): void {
    this.notMoveableIconTypes.forEach((cloudType) => {
      this.hideInteractionCloud(playerId, cloudType)
    })
  }
}
