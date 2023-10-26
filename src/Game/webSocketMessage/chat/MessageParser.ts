import {type EquipmentMessage, EquipmentMessageType} from './EqupimentMessage'
import {type NotificationMessage, NotificationMessageType} from './NotificationMessage'
import {type TimeMessage, TimeMessageType} from './TimeMessage'
import {type IncomingTradeMessage, IncomingTradeMessageType} from './TradeMessageHandler'
import {type UserStatusMessage, UserStatusMessageType} from './UserStatusMessage'
import {type IncomingCoopMessage, IncomingCoopMessageType} from './CoopMessageHandler';

export type ChatMessage =
  | IncomingTradeMessage
  | NotificationMessage
  | UserStatusMessage
  | EquipmentMessage
  | TimeMessage
  | IncomingCoopMessage

export const parseChatMessage = (message: string): ChatMessage | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case IncomingTradeMessageType.TradeServerPropose:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingTradeMessageType.TradeServerStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingTradeMessageType.TradeServerBid:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingTradeMessageType.TradeServerCancel:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingTradeMessageType.TradeServerFinish:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopStartPlanning:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopJoinPlanning:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopProposeCompany:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopStartNegotiation:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopNegotiationBid:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopFinishNegotiation:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopResourceChange:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopWaitForTravel:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopGoToTravel:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopTravelCompleted:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopCancel:
        return { senderId: parsed.senderId, message: parsed.message }
      case IncomingCoopMessageType.CoopCancelPlanning:
        return { senderId: parsed.senderId, message: parsed.message }
      case UserStatusMessageType.UserWarning:
        return { senderId: parsed.senderId, message: parsed.message }
      case EquipmentMessageType.EquipmentChange:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationAdvertisementBuy:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationAdvertisementSell:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationTradeStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationTradeEnd:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationTravelStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationTravelEnd:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationTravelChoosingStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationTravelChoosingStop:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationWorkshopChoosingStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationWorkshopChoosingStop:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationProductionStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case NotificationMessageType.NotificationProductionEnd:
        return { senderId: parsed.senderId, message: parsed.message }
      case TimeMessageType.SyncResponse:
        return { senderId: parsed.senderId, message: parsed.message }
      case TimeMessageType.End:
        return { senderId: parsed.senderId, message: parsed.message }
      case TimeMessageType.Remaining:
        return { senderId: parsed.senderId, message: parsed.message }
      case TimeMessageType.PlayerRegen:
        return { senderId: parsed.senderId, message: parsed.message }
      default:
        console.error(
          `Unrecognized message type: ${(parsed as { message: { type: string } }).message.type}`,
        )
        return null
    }
  } catch (error) {
    console.error(`Error parsing message: ${message}. Reason: ${(error as Error).message}`)
    return null
  }
}
