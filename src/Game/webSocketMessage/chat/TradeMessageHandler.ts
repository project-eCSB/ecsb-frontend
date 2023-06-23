import { type Websocket } from 'websocket-ts'
import { type Equipment } from '../../../services/game/Types'

export enum TradeMessageType {
  TradeMinorChange = 'tradeMinorChange',
  TradeBid = 'tradeBid',
  TradeStart = 'tradeStart',
  TradeStartAck = 'tradeStartAck',
  TradeFinish = 'tradeFinish',
  TradeCancel = 'tradeCancel',
  TradeServerAck = 'tradeServerAck',
  TradeServerFinish = 'tradeServerFinish',
}

export interface TradeBid {
  senderOffer: Equipment
  senderRequest: Equipment
}

export interface TradeBidMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeBid
    tradeBid: TradeBid
    receiverId: string
  }
}

export interface TradeMinorChangeMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeMinorChange
    tradeBid: TradeBid
    receiverId: string
  }
}

export interface TradeStartMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeStart
    receiverId: string
  }
}

export interface TradeStartAckMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeStartAck
    receiverId: string
  }
}

export interface TradeFinishMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeFinish
    finalBid: TradeBid
    receiverId: string
  }
}

export interface TradeCancelMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeCancel
    receiverId: string
  }
}

export interface TradeServerAckMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeServerAck
    myTurn: boolean
    otherTrader: Equipment
    receiverId: string
  }
}

export interface TradeServerFinishMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeServerFinish
    receiverId: string
  }
}

export type TradeMessage =
  | TradeStartMessage
  | TradeStartAckMessage
  | TradeServerAckMessage
  | TradeBidMessage
  | TradeFinishMessage
  | TradeServerFinishMessage
  | TradeCancelMessage
  | TradeMinorChangeMessage

export const sendTradeMessage = (socket: Websocket, message: TradeMessage): void => {
  try {
    const serialized = JSON.stringify(message.message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing trade message. Reason: ${(error as Error).message}`)
  }
}
