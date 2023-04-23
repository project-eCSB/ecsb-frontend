import Phaser from 'phaser'
import GridEngine from 'grid-engine'
import { Scene } from './scenes/Scene'

export const createGame = (): Phaser.Game => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    render: {
      antialias: false,
    },
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    parent: 'game-content',
    scene: Scene,
    plugins: {
      scene: [
        {
          key: 'gridEngine',
          plugin: GridEngine,
          mapping: 'gridEngine',
        },
      ],
    },
  }

  const game = new Phaser.Game(config)

  return game
}
