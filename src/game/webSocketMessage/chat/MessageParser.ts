import { type EquipmentMessage, EquipmentMessageType } from './EqupimentMessage'
import { type IncomingNotificationMessage, NotificationMessageType } from './NotificationMessage'
import { type TimeMessage, TimeMessageType } from './TimeMessage'
import { type IncomingTradeMessage, IncomingTradeMessageType } from './TradeMessageHandler'
import { type BackendWarningMessage, BackendWarningMessageType } from './BackendWarningMessage'
import { type IncomingCoopMessage, IncomingCoopMessageType } from './CoopMessageHandler'
import { type IncomingWorkshopMessage, IncomingWorkshopMessageType } from './WorkshopMessageHandler'

export type ChatMessage =
  | IncomingTradeMessage
  | IncomingNotificationMessage
  | BackendWarningMessage
  | EquipmentMessage
  | TimeMessage
  | IncomingCoopMessage
  | IncomingWorkshopMessage

export const parseChatMessage = (message: string): ChatMessage | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case IncomingTradeMessageType.TradeServerPropose:
      case IncomingTradeMessageType.TradeServerStart:
      case IncomingTradeMessageType.TradeServerBid:
      case IncomingTradeMessageType.TradeServerCancel:
      case IncomingTradeMessageType.TradeServerFinish:
      case IncomingTradeMessageType.TradeServerRemind:
      case IncomingCoopMessageType.CoopStartPlanning:
      case IncomingCoopMessageType.CoopSimpleJoinPlanning:
      case IncomingCoopMessageType.CoopGatheringJoinPlanning:
      case IncomingCoopMessageType.CoopProposeOwnTravel:
      case IncomingCoopMessageType.CoopStartNegotiation:
      case IncomingCoopMessageType.CoopNegotiationBid:
      case IncomingCoopMessageType.CoopFinishNegotiation:
      case IncomingCoopMessageType.CoopResourceChange:
      case IncomingCoopMessageType.CoopWaitForTravel:
      case IncomingCoopMessageType.CoopGoToTravel:
      case IncomingCoopMessageType.CoopTravelAccept:
      case IncomingCoopMessageType.CoopTravelDeny:
      case IncomingCoopMessageType.CoopFinish:
      case IncomingCoopMessageType.CoopCancel:
      case IncomingCoopMessageType.CoopCancelNegotiation:
      case IncomingCoopMessageType.CoopCancelPlanning:
      case IncomingWorkshopMessageType.WorkshopAccept:
      case IncomingWorkshopMessageType.WorkshopDeny:
      case BackendWarningMessageType.UserWarning:
      case EquipmentMessageType.EquipmentChange:
      case EquipmentMessageType.QueueProcessed:
      case NotificationMessageType.NotificationAdvertisementBuy:
      case NotificationMessageType.NotificationAdvertisementSell:
      case NotificationMessageType.NotificationTradeStart:
      case NotificationMessageType.NotificationTradeEnd:
      case NotificationMessageType.NotificationTravelStart:
      case NotificationMessageType.NotificationTravelEnd:
      case NotificationMessageType.NotificationTravelChoosingStart:
      case NotificationMessageType.NotificationTravelChoosingStop:
      case NotificationMessageType.NotificationWorkshopChoosingStart:
      case NotificationMessageType.NotificationWorkshopChoosingStop:
      case NotificationMessageType.NotificationProductionStart:
      case NotificationMessageType.NotificationProductionEnd:
      case NotificationMessageType.NotificationStartAdvertiseCoop:
      case NotificationMessageType.NotificationStopAdvertiseCoop:
      case NotificationMessageType.NotificationStartNegotiation:
      case NotificationMessageType.NotificationStopNegotiation:
      case TimeMessageType.SyncResponse:
      case TimeMessageType.End:
      case TimeMessageType.Remaining:
      case TimeMessageType.PlayerRegen:
      case NotificationMessageType.NotificationSyncTradeResponse:
      case NotificationMessageType.NotificationSyncCoopResponse:
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
