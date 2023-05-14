import { create } from 'zustand'

interface GameState {
  game: Phaser.Game | null
  setGame: (game: Phaser.Game | null) => void
}

export const useGameStore = create<GameState>((set) => ({
  game: null,
  setGame: (game: Phaser.Game | null) => {
    set({ game })
  },
}))
