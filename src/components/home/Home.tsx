import { useNavigate } from 'react-router'
import type { NavigateFunction } from 'react-router'
import { useRef, useState } from 'react'
import gameService from '../../services/game/GameService'
import { decodeAuthToken, getAuthToken, getGameToken } from '../../apis/apis'
import './Home.css'
import HomeNavbar from './HomeNavbar'
import { useGameStore } from '../../store/GameStore'
import type { GameSettings, GameStatus } from '../../services/game/Types'
import { startGame } from '../../Game/Game'

const Home = () => {
  const navigate: NavigateFunction = useNavigate()

  const { setGameData } = useGameStore()
  const [gameCode, setGameCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const submitBtnRef = useRef<HTMLButtonElement | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value)
  }

  const enableSubmitBtn = (): void => {
    if (submitBtnRef && submitBtnRef.current) {
      submitBtnRef.current.disabled = false
    }
  }

  const disableSubmitBtn = (): void => {
    if (submitBtnRef && submitBtnRef.current) {
      submitBtnRef.current.disabled = true
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    disableSubmitBtn()

    const authToken = getAuthToken()
    if (authToken) {
      const decodedAuthToken = decodeAuthToken(authToken)
      gameService
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
                    enableSubmitBtn()
                  } else {
                    const gameData = startGame(gameToken, gameStatus, gameSettings)
                    setGameData(gameData)
                    navigate(`/game/${res}`)
                  }
                })
                .catch((error: Error) => {
                  setError(error.message)
                  enableSubmitBtn()
                })
            })
            .catch((error: Error) => {
              setError(error.message)
              enableSubmitBtn()
            })
        })
        .catch((error: Error) => {
          setError(error.message)
          enableSubmitBtn()
        })

      return
    }

    enableSubmitBtn()
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
          <button
            ref={submitBtnRef}
            className={`${
              submitBtnRef && submitBtnRef.current && submitBtnRef.current.disabled
                ? 'disabled'
                : ''
            } home-form-btn-submit`}
            type='submit'
          >
            JOIN THE GAME
          </button>
        </form>
      </div>
    </div>
  )
}

export default Home
