import Phaser from 'phaser'
import GridEngine from 'grid-engine'
import { Scene } from './scenes/Scene'
import type { GameSettings, GameStatus } from '../services/game/Types'

export interface GameData {
  game : Phaser.Game
  scene: Scene
}

export const startGame = (
  gameToken: string,
  userStatus: GameStatus,
  settings: GameSettings,
): GameData => {
  const scene = new Scene(gameToken, userStatus, settings)

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    dom: {
      createContainer: true,
    },
    render: {
      antialias: false,
    },
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    parent: 'game-content',
    scene: scene,
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

  return {
    game,
    scene
  }
}

export const stopGame = (gameData: GameData): void => {
  gameData.scene.destroy()
  gameData.scene.sys.plugins.removeScenePlugin('gridEngine')
  gameData.scene.sys.game.destroy(true)
  gameData.game.plugins.removeScenePlugin('gridEngine')
  gameData.game.destroy(true)
}
