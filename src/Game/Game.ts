import Phaser from 'phaser'
import GridEngine from 'grid-engine'
import { Scene } from './scenes/Scene'
import type { GameSettings, GameStatus } from '../services/game/Types'

export const startGame = (
  gameToken: string,
  userStatus: GameStatus,
  settings: GameSettings,
): Phaser.Game => {
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
    scene: new Scene(gameToken, userStatus, settings),
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

export const stopGame = (game: Phaser.Game): void => {
  game.plugins.removeScenePlugin('gridEngine')
  game.plugins.removeScenePlugin('GridEngine')
  game.destroy(true)
}
