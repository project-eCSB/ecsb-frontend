import { useNavigate } from 'react-router'
import type { NavigateFunction } from 'react-router'
import { useState } from 'react'
import gameService from '../../services/game/GameService'
import { decodeAuthToken, getAuthToken } from '../../apis/apis'
import './Home.css'
import HomeNavbar from './HomeNavbar'

const Home = () => {
  const navigate: NavigateFunction = useNavigate()

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
        navigate(`/game/${res}`)
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
