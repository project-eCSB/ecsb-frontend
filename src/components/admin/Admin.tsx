import { useRef, useState } from 'react'
import GetGameSettingsForm from './forms/getGameSettingsForm/GetGameSettingsForm'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/auth/AuthService'
import CreateGameForm from './forms/createGameForm/CreateGameForm'
import './Admin.css'

enum FormType {
  CreateGame,
  GetGameSettings,
}

const Admin = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormType | null>(null)
  const btnCreateGame = useRef<HTMLButtonElement>(null)
  const btnGetGameSettings = useRef<HTMLButtonElement>(null)

  const handleLogOut = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className='admin-container'>
      <div className='admin-container-navbar'>
        <div className='admin-container-navbar-buttons'>
          <button
            ref={btnCreateGame}
            onClick={() => {
              setForm(FormType.CreateGame)
            }}
            className={`${form === FormType.CreateGame ? 'disabled' : ''}`}
            disabled={form === FormType.CreateGame}
          >
            Create Game
          </button>
          <button
            ref={btnGetGameSettings}
            onClick={() => {
              setForm(FormType.GetGameSettings)
            }}
            className={`${form === FormType.GetGameSettings ? 'disabled' : ''}`}
            disabled={form === FormType.GetGameSettings}
          >
            Get Game Settings
          </button>
        </div>
        <div className='admin-container-navbar-buttons'>
          <button
            onClick={() => {
              navigate('/')
            }}
          >
            Home
          </button>
          <button
            onClick={() => {
              handleLogOut()
            }}
          >
            Log Out
          </button>
        </div>
      </div>
      <div className='admin-container-form'>
        {form === FormType.CreateGame && <CreateGameForm />}
        {form === FormType.GetGameSettings && <GetGameSettingsForm />}
      </div>
    </div>
  )
}

export default Admin
