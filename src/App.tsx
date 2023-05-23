import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Game from './components/game/Game'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Home from './components/home/Home'
import AuthTokenProtectedRoute from './components/protectedRoutes/AuthTokenProtectedRoute'
import NoAuthTokenProtectedRoute from './components/protectedRoutes/NoAuthTokenProtectedRoute'
import GameTokenProtectedRoute from './components/protectedRoutes/GameTokenProtectedRoute'
import './App.css'
import Admin from './components/admin/Admin'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/login' element={<NoAuthTokenProtectedRoute children={<LoginForm />} />} />
        <Route
          path='/register'
          element={<NoAuthTokenProtectedRoute children={<RegisterForm />} />}
        />
        <Route
          path='/home'
          element={<AuthTokenProtectedRoute children={<Home />} roles={['USER']} />}
        />
        <Route
          path='/admin'
          element={<AuthTokenProtectedRoute children={<Admin />} roles={['ADMIN']} />}
        />
        <Route
          path='/game/:gameId'
          element={
            <AuthTokenProtectedRoute
              children={<GameTokenProtectedRoute children={<Game />} roles={['USER']} />}
              roles={['USER']}
            />
          }
        />
        <Route path='*' element={<Navigate to='/home' replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
