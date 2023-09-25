import {type Websocket} from 'websocket-ts'
import {type Equipment, type TradeEquipment} from '../../../services/game/Types'

export interface TradeBid {
  senderOffer: TradeEquipment
  senderRequest: TradeEquipment
}

export enum IncomingTradeMessageType {
  TradeServerPropose = 'trade/system/propose_trade',
  TradeServerStart = 'trade/system/start_trade',
  TradeServerBid = 'trade/system/trade_bid',
  TradeServerFinish = 'trade/system/finish_trade',
  TradeServerCancel = 'trade/system/cancel_trade',
  TradeSecondPlayerEqupimentChange = 'trade/system/second_player_equipment_change',
}

export interface TradeServerProposeMessage {
  senderId: string
  message: {
    type: IncomingTradeMessageType.TradeServerPropose
    proposalReceiverId: string
  }
}

export interface TradeServerStartMessage {
  senderId: string
  message: {
    type: IncomingTradeMessageType.TradeServerStart
    myTurn: boolean
    otherTrader: TradeEquipment
    receiverId: string
  }
}

export interface TradeServerBidMessage {
  senderId: string
  message: {
    type: IncomingTradeMessageType.TradeServerBid
    tradeBid: TradeBid
    receiverId: string
  }
}

export interface TradeServerFinishMessage {
  senderId: string
  message: {
    type: IncomingTradeMessageType.TradeServerFinish
    receiverId: string
  }
}

export interface TradeServerCancelMessage {
  senderId: string
  message: {
    type: IncomingTradeMessageType.TradeServerCancel
  }
}

export interface TradeSecondPlayerEqupimentChangeMessage {
  senderId: string
  message: {
    type: IncomingTradeMessageType.TradeSecondPlayerEqupimentChange
    secondPlayerEqupiment: Equipment
  }
}

export type IncomingTradeMessage =
    | TradeServerProposeMessage
    | TradeServerStartMessage
    | TradeServerBidMessage
    | TradeServerFinishMessage
    | TradeServerCancelMessage
    | TradeSecondPlayerEqupimentChangeMessage

export enum OutcomingTradeMessageType {
  ProposeTrade = 'trade/propose_trade',
  ProposeTradeAck = 'trade/propose_trade_ack',
  TradeMinorChange = 'trade/minor_change',
  TradeBid = 'trade/trade_bid',
  TradeBidAck = 'trade/trade_bid_ack',
  TradeCancel = 'trade/cancel_trade',
}

export interface ProposeTradeMessage {
  senderId: string
  message: {
    type: OutcomingTradeMessageType.ProposeTrade
    proposalReceiverId: string
  }
}

export interface ProposeTradeAckMessage {
  senderId: string
  message: {
    type: OutcomingTradeMessageType.ProposeTradeAck
    proposalSenderId: string
  }
}

export interface TradeBidMessage {
  senderId: string
  message: {
    type: OutcomingTradeMessageType.TradeBid
    tradeBid: TradeBid
    receiverId: string
  }
}

export interface TradeMinorChangeMessage {
  senderId: string
  message: {
    type: OutcomingTradeMessageType.TradeMinorChange
    tradeBid: TradeBid
    receiverId: string
  }
}

export interface TradeFinishMessage {
  senderId: string
  message: {
    type: OutcomingTradeMessageType.TradeBidAck
    finalBid: TradeBid
    receiverId: string
  }
}

export interface TradeCancelMessage {
  senderId: string
  message: {
    type: OutcomingTradeMessageType.TradeCancel
  }
}

export type OutcomingTradeMessage =
    | ProposeTradeMessage
    | ProposeTradeAckMessage
    | TradeBidMessage
    | TradeFinishMessage
    | TradeCancelMessage
    | TradeMinorChangeMessage

export const sendTradeMessage = (socket: Websocket, message: OutcomingTradeMessage): void => {
  try {
    const serialized = JSON.stringify(message.message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing trade message. Reason: ${(error as Error).message}`)
  }
}
