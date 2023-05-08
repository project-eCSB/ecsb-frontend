import { useState } from 'react'
import './Form.css'
import gameService from '../../../services/game/GameService'

const CreateGameForm = () => {
  const [gameName, setGameName] = useState<string>('')
  const [charactersSpreadsheetUrl, setCharactersSpreadsheetUrl] = useState<string>('')
  const [classRepresentation, setClassRepresentation] = useState({})
  const [error, setError] = useState<string | null>('')
  const [sessionId, setSessionId] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSessionId(null)
    setError(null)

    await gameService
      .createGame(classRepresentation, charactersSpreadsheetUrl, gameName)
      .then((sessionId: number) => {
        setSessionId(sessionId)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <>
      <form className='admin-form' onSubmit={handleSubmit}>
        <label htmlFor='game-name'>Game name</label>
        <input
          id='game-name'
          type='text'
          value={gameName}
          onChange={(e) => {
            setGameName(e.target.value)
          }}
          required
        />

        <label htmlFor='characters-spreadsheet-url'>Characters spreadsheet URL</label>
        <input
          id='characters-spreadsheet-url'
          type='text'
          value={charactersSpreadsheetUrl}
          onChange={(e) => {
            setCharactersSpreadsheetUrl(e.target.value)
          }}
          required
        />

        <label htmlFor='class-representation'>Class representation</label>
        <input
          id='class-representation'
          type='text'
          value={JSON.stringify(classRepresentation)}
          onChange={(e) => {
            setClassRepresentation(JSON.parse(e.target.value))
          }}
          required
        />

        <button
          type='submit'
          className={`${
            gameName.length === 0 || charactersSpreadsheetUrl.length === 0 ? 'disabled' : ''
          }`}
          disabled={gameName.length === 0 || charactersSpreadsheetUrl.length === 0}
        >
          Create game
        </button>
      </form>
      <div className='admin-form-result'>
        {sessionId && (
          <p className='success'>
            Game created with session id: <strong>{sessionId}</strong>
          </p>
        )}
        {error && <p className='error'>{error}</p>}
      </div>
    </>
  )
}

export default CreateGameForm
