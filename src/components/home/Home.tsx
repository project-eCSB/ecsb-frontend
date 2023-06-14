import { useNavigate } from 'react-router'
import type { NavigateFunction } from 'react-router'
import { useRef, useState } from 'react'
import gameService from '../../services/game/GameService'
import { decodeAuthToken, getAuthToken, getGameToken } from '../../apis/apis'
import './Home.css'
import HomeNavbar from './HomeNavbar'
import { useGameStore } from '../../store/GameStore'
import { startGame } from '../../Game/Game'
import LoadingSpinner from '../common/spinner/LoadingSpinner'

const Home = () => {
  const navigate: NavigateFunction = useNavigate()

  const { setGameData } = useGameStore()
  const [gameCode, setGameCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const submitBtnRef = useRef<HTMLButtonElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  
    setIsLoading(true)
    disableSubmitBtn()

    try {
      const authToken = getAuthToken()
  
      if (authToken) {
        const decodedAuthToken = decodeAuthToken(authToken);
  
        const gameSession = await gameService.getGameSession(gameCode, decodedAuthToken.name)
        const gameSettings = await gameService.getUserGameSettings()
        const gameStatus = await gameService.getUserGameStatus()

        const gameToken = getGameToken()
  
        if (!gameToken) {
          setError('Error getting game token')
        } else {
          const mapConfig = await gameService.getAssetConfig(gameSettings.gameAssets.mapAssetId)
          const gameData = startGame(gameToken, gameStatus, gameSettings, mapConfig)

          setGameData(gameData)

          document.body.style.overflow = 'hidden'

          navigate(`/game/${gameSession}`)
        }
      }
    } catch (error: any) {
      setError(`Error joining game: ${error.message}`)
    } finally {
      setIsLoading(false)
      enableSubmitBtn()
    }
  }

  return (
    <>
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
    {isLoading && <LoadingSpinner />}
    </>
  )
}

export default Home
