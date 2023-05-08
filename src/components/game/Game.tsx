import { useEffect, useState } from 'react'
import { startGame } from '../../Game/Game'
import gameService from '../../services/game/GameService'
import type { GameSettings, GameStatus } from '../../services/game/Types'
import { getGameToken } from '../../apis/apis'
import './Game.css'

const Game = () => {
  const [game, setGame] = useState<Phaser.Game | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    gameService
      .getUserGameSettings()
      .then((gameSettings: GameSettings) => {
        gameService
          .getUserGameStatus()
          .then((gameStatus: GameStatus) => {
            const gameToken = getGameToken()
            if (!gameToken) {
              setError("Game token doesn't exist")
              return
            }

            const game = startGame(gameToken, gameStatus, gameSettings)
            setGame(game)
          })
          .catch((error: Error) => {
            setError(error.message)
          })
      })
      .catch((error: Error) => {
        setError(error.message)
      })
  }, [])

  return game ? (
    <div id='game-content' />
  ) : (
    <>
      {!error ? (
        <span className='game-error' style={{ color: 'red' }}>
          {error}
        </span>
      ) : (
        <div id='game-loading'>
          <h1>Loading...</h1>
        </div>
      )}
    </>
  )
}

export default Game
