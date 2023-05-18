import { useState } from 'react'
import './Form.css'
import gameService from '../../../services/game/GameService'
import { type GameClassResourceDto } from '../../../apis/game/Types'

const validateClassRepresentation = (classRepresentation: string): boolean => {
  try {
    const classRepresentationJSON: GameClassResourceDto[] = JSON.parse(classRepresentation)
    if (!Array.isArray(classRepresentationJSON)) {
      return false
    }
    for (const classResource of classRepresentationJSON) {
      if (
        !Object.prototype.hasOwnProperty.call(classResource, 'gameClassName') ||
        !Object.prototype.hasOwnProperty.call(classResource, 'classAsset') ||
        !Object.prototype.hasOwnProperty.call(classResource, 'gameResourceName') ||
        !Object.prototype.hasOwnProperty.call(classResource, 'resourceAsset')
      ) {
        return false
      }
    }
    return true
  } catch (error) {
    return false
  }
}

const CreateGameForm = () => {
  const [gameName, setGameName] = useState<string>('')
  const [charactersSpreadsheetUrl, setCharactersSpreadsheetUrl] = useState<string>('')
  const [classResourceRepresentation, setClassResourceRepresentation] = useState<string>('')
  const [error, setError] = useState<string | null>('')
  const [sessionId, setSessionId] = useState<number | null>(null)

  const handleClassResourceRepresentationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassResourceRepresentation(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError(null)
    setSessionId(null)

    if (!validateClassRepresentation(classResourceRepresentation)) {
      setError(
        'Invalid class representation! Make sure your JSON is valid and has the correct structure.',
      )
      return
    }

    const classRepresentationJSON: GameClassResourceDto[] = JSON.parse(classResourceRepresentation)

    await gameService
      .createGame(classRepresentationJSON, charactersSpreadsheetUrl, gameName)
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
          value={classResourceRepresentation}
          onChange={(e) => {
            handleClassResourceRepresentationChange(e)
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
