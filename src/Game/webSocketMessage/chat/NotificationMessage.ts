import type { Websocket } from 'websocket-ts'

export enum NotificationMessageType {
  NotificationWorkshopStart = 'notification/workshop/start',
  NotificationWorkshopStop = 'notification/workshop/stop',
  NotificationTradeStart = 'notification/tradeStart',
  NotificationTradeEnd = 'notification/tradeEnd',
  NotificationTravelStart = 'notification/travelStart',
  NotificationTravelEnd = 'notification/travelEnd',
  NotificationProductionStart = 'notification/productionStart',
  NotificationProductionEnd = 'notification/productionEnd',
}

export interface NotificationTradeStartMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationTradeStart
    playerId: string
  }
}

export interface NotificationTradeEndMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationTradeEnd
    playerId: string
  }
}

export interface NotificationTravelStartMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationTravelStart
    playerId: string
  }
}

export interface NotificationTravelEndMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationTravelEnd
    playerId: string
  }
}

export interface NotificationWorkshopStartMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationWorkshopStart
    playerId: string
  }
}

export interface NotificationWorkshopStopMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationWorkshopStop
    playerId: string
  }
}

export interface NotificationProductionStartMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationProductionStart
    playerId: string
  }
}

export interface NotificationProductionEndMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationProductionEnd
    playerId: string
  }
}

export type NotificationMessage =
  | NotificationTradeStartMessage
  | NotificationTradeEndMessage
  | NotificationTravelStartMessage
  | NotificationTravelEndMessage
  | NotificationWorkshopStartMessage
  | NotificationWorkshopStopMessage
  | NotificationProductionStartMessage
  | NotificationProductionEndMessage

export const sendNotificationMessage = (socket: Websocket, message: NotificationMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing notification message. Reason: ${(error as Error).message}`)
  }
}
