import { useState } from 'react'
import { createGame } from '../Game/Game'

const Game = () => {
  const [game, setGame] = useState<Phaser.Game | null>(null)

  const handleCreateGame = () => {
    const game = createGame()
    setGame(game)
  }

  return (
    <>
      {!game && <button onClick={handleCreateGame}>JOIN THE GAME</button>}
      <div id='game-content' />
    </>
  )
}

export default Game
