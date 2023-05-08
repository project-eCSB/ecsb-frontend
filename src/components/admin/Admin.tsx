import { useRef, useState } from 'react'
import './Admin.css'
import CreateGameForm from './forms/CreateGameForm'
import GetGameSettingsForm from './forms/GetGameSettingsForm'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/auth/AuthService'

enum FormType {
  CreateGame = 1,
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
      <div className='navbar'>
        <div className='buttons'>
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
        <div className='buttons'>
          <button
            onClick={() => {
              navigate('/')
            }}
          >
            Home
          </button>
          <button className='home-navbar-btn' onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
      <div className='form-container'>
        {form && form === FormType.CreateGame && <CreateGameForm />}
        {form && form === FormType.GetGameSettings && <GetGameSettingsForm />}
      </div>
    </div>
  )
}

export default Admin
