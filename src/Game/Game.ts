import Phaser from 'phaser'
import GridEngine from "grid-engine";
import { Scene } from './scenes/Scene';

export let game: Phaser.Game|null = null;

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
  parent: "game-content",
  scene: Scene,
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine", 
      },
    ],
  },
};

export const createGame = () => { game = new Phaser.Game(config)};
export const endGame = () => { game?.destroy(true) };
