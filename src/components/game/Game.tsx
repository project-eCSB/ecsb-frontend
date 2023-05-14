import { useEffect } from 'react'
import { stopGame } from '../../Game/Game'
import './Game.css'
import { useGameStore } from '../../store/GameStore'
import { Navigate } from 'react-router-dom'

const Game = () => {
  const { game, setGame } = useGameStore()

  useEffect(() => {
    return () => {
      if (game) {
        stopGame(game)
        setGame(null)
      }
    }

    // eslint-disable-next-line
  }, [])

  return game ? <div id='game-content' /> : <Navigate to='/' replace />
}

export default Game
