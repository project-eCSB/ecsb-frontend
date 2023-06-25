import {type Websocket} from 'websocket-ts'
import {type Equipment} from '../../../services/game/Types'

export enum TradeMessageType {
  TradeMinorChange = 'trade/minor_change',
  TradeBid = 'trade/trade_bid',
  ProposeTrade = 'trade/propose_trade',
  ProposeTradeAck = 'trade/propose_trade_ack',
  TradeBidAck = 'trade/trade_bid_ack',
  TradeCancel = 'trade/cancel_trade',
  TradeServerCancel = 'trade/server_cancel_trade',
  TradeServerStart = 'trade/server_start_trade',
  TradeServerFinish = 'trade/server_finish_trade',
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

export interface ProposeTradeMessage {
  senderId: string
  message: {
    type: TradeMessageType.ProposeTrade
    proposalReceiverId: string
  }
}

export interface ProposeTradeAckMessage {
  senderId: string
  message: {
    type: TradeMessageType.ProposeTradeAck
    proposalSenderId: string
  }
}

export interface TradeFinishMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeBidAck
    finalBid: TradeBid
    receiverId: string
  }
}

export interface TradeCancelMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeCancel
  }
}

export interface TradeServerCancelMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeServerCancel
  }
}

export interface TradeServerAckMessage {
  senderId: string
  message: {
    type: TradeMessageType.TradeServerStart
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
  | ProposeTradeMessage
  | ProposeTradeAckMessage
  | TradeServerAckMessage
  | TradeBidMessage
  | TradeFinishMessage
  | TradeServerFinishMessage
  | TradeCancelMessage
  | TradeMinorChangeMessage
  | TradeServerCancelMessage

export const sendTradeMessage = (socket: Websocket, message: TradeMessage): void => {
  try {
    const serialized = JSON.stringify(message.message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing trade message. Reason: ${(error as Error).message}`)
  }
}
