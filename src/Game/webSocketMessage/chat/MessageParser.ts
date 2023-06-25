import {type NotificationMessage, NotificationMessageType} from './NotificationMessage'
import {type TradeMessage, TradeMessageType} from './TradeMessageHandler'
import {type UserStatusMessage, UserStatusMessageType} from './UserStatusMessage'

export const parseChatMessage = (
  message: string,
): TradeMessage | NotificationMessage | UserStatusMessage | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case TradeMessageType.ProposeTrade:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.ProposeTradeAck:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeServerStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeBid:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeCancel:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeServerCancel:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeServerFinish:
        return { senderId: parsed.senderId, message: parsed.message }
      case UserStatusMessageType.UserBusy:
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
