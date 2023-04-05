import {createGame, endGame} from "./Game/Game"

const App = () => {
  return (
    <>
    <button onClick={() => {createGame()} }>START</button>
    <button onClick={() => {endGame()} }>END</button>
    <div id="game-content" />
    </>
  )
}

export default App
