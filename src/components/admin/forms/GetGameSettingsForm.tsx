import {useState} from 'react'
import './Form.css'
import gameService from '../../../services/game/GameService'
import type {GameSettings} from '../../../services/game/Types'

const GetGameSettingsForm = () => {
  const [gameSessionId, setGameSessionId] = useState<number>(0)
  const [error, setError] = useState<string | null>('')
  const [settings, setSettings] = useState<GameSettings | null>(null)

  const handleGameSessionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGameSessionId = Number(e.target.value)
    if (newGameSessionId < 1) {
      return
    }

    setGameSessionId(Number(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSettings(null)
    setError(null)

    await gameService
      .getAdminGameSettings(gameSessionId)
      .then((settings: GameSettings) => {
        setSettings(settings)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <>
      <form className='admin-form' onSubmit={handleSubmit}>
        <label htmlFor='gameSessionId'>Game Session ID</label>
        <input
          id='gameSessionId'
          type='number'
          value={gameSessionId}
          min={1}
          onChange={(e) => {
            handleGameSessionIdChange(e)
          }}
          required
        />
        <button
          type='submit'
          className={`${gameSessionId < 1 ? 'disabled' : ''}`}
          disabled={gameSessionId < 1}
        >
          Get Settings
        </button>
      </form>
      <div className='admin-form-result'>
        {settings && (
          <>
            <div className='success'>
              <h2>Settings</h2>
              <div className='settings'>
                <p>
                  <strong>Name:</strong> {settings.name}
                </p>
                <p>
                  <strong>Short Name:</strong> {settings.shortName}
                </p>
                <p>
                  <strong>Asset URL:</strong> {settings.assetUrl}
                </p>
                <div className='classes'>
                  <h3>
                    <strong>Class Representation:</strong>
                  </h3>
                  {settings.classResourceRepresentation.map(classDto => (
                    <p key={classDto.classAsset}>
                      {classDto.classAsset} : <strong>{classDto.gameClassName}</strong> : {classDto.gameResourceName}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {error && <p className='error'>{error}</p>}
      </div>
    </>
  )
}

export default GetGameSettingsForm
