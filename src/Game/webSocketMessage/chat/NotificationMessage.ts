import type {Websocket} from 'websocket-ts'

export enum NotificationMessageType {
  NotificationWorkshopChoosingStart = 'notification/choosing/workshop/start', // One of the players opened workshop window
  NotificationWorkshopChoosingStop = 'notification/choosing/workshop/stop', // One of the players closed workshop window
  NotificationProductionStart = 'notification/production/start', // One of the players started production
  NotificationProductionEnd = 'notification/production/end', // One of the players ended production
  NotificationTravelChoosingStart = 'notification/choosing/travel/start', // One of the players opened travel window
  NotificationTravelChoosingStop = 'notification/choosing/travel/stop', // One of the players closed travel window
  NotificationTravelStart = 'notification/travel/start', // One of the players started travel
  NotificationTravelEnd = 'notification/travel/end', // One of the players ended travel
  NotificationTradeStart = 'notification/trade/start', // One of the players opened trade window
  NotificationTradeEnd = 'notification/trade/end', // One of the players closed trade window
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

export interface NotificationTravelChoosingStartMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationTravelChoosingStart
    playerId: string
  }
}

export interface NotificationTravelChoosingStopMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationTravelChoosingStop
    playerId: string
  }
}

export interface NotificationWorkshopChoosingStartMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationWorkshopChoosingStart
    playerId: string
  }
}

export interface NotificationWorkshopChoosingStopMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationWorkshopChoosingStop
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
  | NotificationTravelChoosingStartMessage
  | NotificationTravelChoosingStopMessage
  | NotificationWorkshopChoosingStartMessage
  | NotificationWorkshopChoosingStopMessage
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
