import { toast } from 'react-toastify';
import { type Scene, RANGE } from '../../Game/scenes/Scene';
import './TradeOfferPopup.css'

interface tradeProps{
    scene: Scene
    from: string
}

export const TradeOfferPopup = (props: tradeProps) => {
    return <div className='container'>
        <h4>{props.from} wants to trade</h4>
        <button className='accept' id={`${props.from}-accept`} onClick={() => {
            const neighbor = props.scene.players[props.from]
            const currPlayer = props.scene.players[props.scene.playerId]
            if (!(
                    Math.abs(neighbor.coords.x - currPlayer.coords.x) <= RANGE &&
                    Math.abs(neighbor.coords.y - currPlayer.coords.y) <= RANGE
                )){
                    toast.info(`${props.from} wants to trade with you, but you are too far, get closer if you wanna trade with him`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    return
                } 
            if (!props.scene.movingEnabled) return
            const btn = document.getElementById(`${props.from}-accept`)?.style
            if(btn !== undefined){
                btn.display = "none"
            }
            const tag = document.getElementById(`${props.from}-hiddenTag`)?.style
            if(tag !== undefined){
                tag.display = "inline"
            }
            props.scene.acceptTradeInvitation(props.from)}
        }>Accept</button>
        <h4 className='tag' id={`${props.from}-hiddenTag`}>Accepted</h4>
    </div>
}