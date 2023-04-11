import Phaser from 'phaser'
import GridEngine from 'grid-engine'
import { Scene } from './scenes/Scene'

let game: Phaser.Game | null = null

export const createGame = (): void => {
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

  game = new Phaser.Game(config)
}

export const endGame = (): void => {
  if (game) {
    game.destroy(true)
    game = null
  }
}
