export enum NotificationMessageType {
  NotificationAdvertisementBuy = 'notification/buy', // One of the players wants to buy something
  NotificationAdvertisementSell = 'notification/sell', // One of the players wants to sell something
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
  NotificationAdvertiseCoop = 'notification/coop/advertise/start',
  NotificationStopAdvertiseCoop = 'notification/coop/advertise/stop',
  NotificationStartNegotiation = 'notification/coop/decide/start',
  NotificationStopNegotiation = 'notification/coop/decide/stop',
}

export interface NotificationAdvertisementBuyMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationAdvertisementBuy
    gameResourceName: string
  }
}

export interface NotificationAdvertisementSellMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationAdvertisementSell
    gameResourceName: string
  }
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

export interface NotificationAdvertiseCoopMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationAdvertiseCoop
    ownerId: string
  }
}

export interface NotificationStopAdvertiseMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationStopAdvertiseCoop
    ownerId: string
  }
}

export interface NotificationStartNegotiationMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationStartNegotiation
    playerId: string
  }
}

export interface NotificationStopNegotiationMessage {
  senderId: string
  message: {
    type: NotificationMessageType.NotificationStopNegotiation
    playerId: string
  }
}

export type NotificationMessage =
  | NotificationAdvertisementBuyMessage
  | NotificationAdvertisementSellMessage
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
  | NotificationAdvertiseCoopMessage
  | NotificationStopAdvertiseMessage
  | NotificationStartNegotiationMessage
  | NotificationStopNegotiationMessage