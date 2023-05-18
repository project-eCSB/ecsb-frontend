import type { Websocket } from 'websocket-ts'
import { type PlayerEquipment } from '../../services/game/Types'

export enum TradeMessageType {
  Multicast = 'multicast',
  TradeBid = 'tradeBid',
  TradeStart = 'tradeStart',
  TradeStartAck = 'tradeStartAck',
  TradeFinish = 'tradeFinish',
  TradeCancel = 'tradeCancel',
  TradeServerAck = 'tradeServerAck',
  TradeServerFinish = 'tradeServerFinish',
  UserBusy = 'userBusy',
  UserInterrupt = 'userInterrupt',
}

export interface TradeBid {
  senderOffer: PlayerEquipment
  senderRequest: PlayerEquipment
}

export interface MulticastMessage {
  senderId: string
  message: {
    type: TradeMessageType.Multicast
    message: string
  }
}

export interface TradeBidMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeBid
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
    otherTrader: PlayerEquipment
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

export interface UserBusyMessage {
  senderId: string
  message: {
    type: TradeMessageType.UserBusy
    reason: string
    receiverId: string
  }
}

export interface UserInterruptMessage {
  senderId: string
  message: {
    type: TradeMessageType.UserInterrupt
    reason: string
    receiverId: string
  }
}

export type Message =
  | TradeStartMessage
  | TradeStartAckMessage
  | TradeServerAckMessage
  | TradeBidMessage
  | TradeFinishMessage
  | TradeServerFinishMessage
  | TradeCancelMessage
  | MulticastMessage
  | UserBusyMessage
  | UserInterruptMessage

export const parseTradeMessage = (message: string): Message | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case TradeMessageType.TradeStart:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeStartAck:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeServerAck:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeBid:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeCancel:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.TradeServerFinish:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.UserBusy:
        return { senderId: parsed.senderId, message: parsed.message }
      case TradeMessageType.UserInterrupt:
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

export const sendTradeMessage = (socket: Websocket, message: Message): void => {
  try {
    const serialized = JSON.stringify(message.message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
