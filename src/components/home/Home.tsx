import { useNavigate } from 'react-router'
import type { NavigateFunction } from 'react-router'
import { useState } from 'react'
import gameService from '../../services/game/GameService'
import { decodeAuthToken, getAuthToken, getGameToken } from '../../apis/apis'
import './Home.css'
import HomeNavbar from './HomeNavbar'
import { useGameStore } from '../../store/GameStore'
import type { GameSettings, GameStatus } from '../../services/game/Types'
import { startGame } from '../../Game/Game'

const Home = () => {
  const navigate: NavigateFunction = useNavigate()

  const { setGame } = useGameStore()
  const [gameCode, setGameCode] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const authToken = getAuthToken()
    if (!authToken) {
      return
    }

    const decodedAuthToken = decodeAuthToken(authToken)

    await gameService
      .getGameSession(gameCode, decodedAuthToken.name)
      .then((res: number) => {
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
                navigate(`/game/${res}`)
              })
              .catch((error: Error) => {
                setError(error.message)
              })
          })
          .catch((error: Error) => {
            setError(error.message)
          })
      })
      .catch((error: Error) => {
        setError(error.message)
      })
  }

  return (
    <div className='home-container'>
      <HomeNavbar />
      <div className='home-form-container'>
        <form className='home-form' onSubmit={handleSubmit}>
          <input
            type='text'
            id='gameCode'
            name='gameCode'
            placeholder='Enter game code'
            value={gameCode}
            onChange={handleInputChange}
            maxLength={255}
            required
          />
          {error && <span className='home-form-error'>{error}</span>}
          <button className='home-form-btn-submit' type='submit'>
            JOIN THE GAME
          </button>
        </form>
      </div>
    </div>
  )
}

export default Home
