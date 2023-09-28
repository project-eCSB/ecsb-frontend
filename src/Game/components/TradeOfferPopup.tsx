import { toast } from 'react-toastify'
import { type Scene } from '../../Game/scenes/Scene'
import './TradeOfferPopup.css'
import { RANGE } from '../GameUtils'

interface TradeProps {
  scene: Scene
  from: string
}

export const TradeOfferPopup = (props: TradeProps) => {
  const { scene, from } = props

  const isPlayerInRange = () => {
    const neighbor = scene.players[from]
    const currPlayer = scene.players[scene.playerId]
    return (
      Math.abs(neighbor.coords.x - currPlayer.coords.x) <= RANGE &&
      Math.abs(neighbor.coords.y - currPlayer.coords.y) <= RANGE
    )
  }

  const handleAcceptTrade = () => {
    if (!isPlayerInRange()) {
      toast.error(`${from} wants to trade with you, but you are too far`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
      return
    }

    if (!scene.movingEnabled) return

    const btnAccept = document.getElementById(`${from}-accept`)?.style
    if (btnAccept) {
      btnAccept.display = 'none'
    }

    const btnDecline = document.getElementById(`${from}-decline`)?.style
    if (btnDecline) {
      btnDecline.display = 'none'
    }

    const tag = document.getElementById(`${from}-hiddenTag`)?.style
    if (tag) {
      tag.display = 'inline'
    }

    setTimeout(() => {
      toast.dismiss(from)
    }, 500)
    scene.acceptTradeInvitation(from)
  }

  const handleDeclineTrade = () => {
    toast.dismiss(from)
  }

  return (
    <div className='container'>
      <p>{from} wants to trade</p>
      <div className='buttons-container'>
        <button className='accept' id={`${from}-accept`} onClick={handleAcceptTrade}>
          Accept
        </button>
        <button className='decline' id={`${from}-decline`} onClick={handleDeclineTrade}>
          Decline
        </button>
      </div>
      <h4 className='tag' id={`${from}-hiddenTag`}>
        Accepted
      </h4>
    </div>
  )
}
