import { type Scene } from '../scenes/Scene'
import { CloudType } from '../scenes/Types'

export interface Clouds {
  workSymbol: Phaser.GameObjects.DOMElement
  travelSymbol: Phaser.GameObjects.DOMElement
  talkSymbol: Phaser.GameObjects.DOMElement
  productionSymbol: Phaser.GameObjects.DOMElement
}

export class CloudBuilder {
  build(scene: Scene, playerId: string): Clouds {
    const cloudWork = document.createElement('div')
    cloudWork.className = 'actionCloud'
    cloudWork.id = `cloud-${CloudType.WORK}-${playerId}`
    const iconWork = document.createElement('i')
    iconWork.className = 'fa fa-gavel'
    iconWork.ariaHidden = 'true'
    cloudWork.appendChild(iconWork)
    const workSymbol = scene.add.dom(13, 0, cloudWork)

    const cloudTravel = document.createElement('div')
    cloudTravel.className = 'actionCloud'
    cloudTravel.id = `cloud-${CloudType.TRAVEL}-${playerId}`
    const iconTravel = document.createElement('i')
    iconTravel.className = 'fa fa-map'
    iconTravel.ariaHidden = 'true'
    cloudTravel.appendChild(iconTravel)
    const travelSymbol = scene.add.dom(13, 0, cloudTravel)

    const cloudTalk = document.createElement('div')
    cloudTalk.className = 'actionCloud'
    cloudTalk.id = `cloud-${CloudType.TALK}-${playerId}`
    const iconTalk = document.createElement('i')
    iconTalk.className = 'fa fa-commenting'
    iconTalk.ariaHidden = 'true'
    cloudTalk.appendChild(iconTalk)
    const talkSymbol = scene.add.dom(13, 0, cloudTalk)

    const cloudProduction = document.createElement('div')
    cloudProduction.className = 'actionCloud'
    cloudProduction.id = `cloud-${CloudType.PRODUCTION}-${playerId}`
    const iconProduction = document.createElement('i')
    iconProduction.className = 'fa fa-gavel'
    iconProduction.ariaHidden = 'true'
    cloudProduction.appendChild(iconProduction)
    const productionSymbol = scene.add.dom(13, 0, cloudProduction)

    return {
      workSymbol: workSymbol,
      travelSymbol: travelSymbol,
      talkSymbol: talkSymbol,
      productionSymbol: productionSymbol,
    }
  }

  showInteractionCloud(playerId: string, cloudType: CloudType): void {
    const cloud = document.getElementById(`cloud-${cloudType}-${playerId}`)
    if (cloud) {
      cloud.style.visibility = 'visible'
    }
  }

  hideInteractionCloud(playerId: string, cloudType: CloudType): void {
    const cloud = document.getElementById(`cloud-${cloudType}-${playerId}`)
    if (cloud) {
      cloud.style.visibility = 'hidden'
    }
  }
}
