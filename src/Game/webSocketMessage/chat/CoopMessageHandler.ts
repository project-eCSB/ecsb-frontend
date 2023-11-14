import { type CoopEquipmentDto, type GameResourceDto } from '../../../services/game/Types'
import { type Websocket } from 'websocket-ts'

export interface CoopBid {
  travelerId: string
  moneyRatio: number
  resources: GameResourceDto[]
}

export enum IncomingCoopMessageType {
  CoopStartPlanning = 'coop/system/start_planning',
  CoopJoinPlanning = 'coop/system/join_planning',
  CoopProposeCompany = 'coop/system/propose_company',
  CoopStartNegotiation = 'coop/system/negotiation/start',
  CoopNegotiationBid = 'coop/system/negotiation/bid',
  CoopFinishNegotiation = 'coop/system/negotiation/finish',
  CoopResourceChange = 'coop/system/resource_change',
  CoopWaitForTravel = 'coop/system/travel_ready/wait',
  CoopGoToTravel = 'coop/system/travel_ready/go',
  CoopTravelAccept = 'coop/system/travel/accept',
  CoopTravelDeny = 'coop/system/travel/deny',
  CoopFinish = 'coop/system/finish',
  CoopCancel = 'coop/system/cancel_coop',
  CoopCancelPlanning = 'coop/system/cancel_planning',
}

export interface CoopStartPlanningMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopStartPlanning
    ownerId: string
    travelName: string
  }
}

export interface CoopJoinPlanningMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopJoinPlanning
    ownerId: string
  }
}

export interface CoopProposeCompanyMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopProposeCompany
    guestId: string
  }
}

export interface CoopStartNegotiationMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopStartNegotiation
    receiverId: string
    myTurn: boolean
  }
}

export interface CoopNegotiationBidMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopNegotiationBid
    receiverId: string
    coopBid: CoopBid
  }
}

export interface CoopFinishNegotiationMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopFinishNegotiation
    receiverId: string
  }
}

export interface CoopResourceChangeMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopResourceChange
    travelName: string
    equipments: CoopEquipmentDto[]
  }
}

export interface CoopWaitForTravelMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopWaitForTravel
    receiverId: string
    travelerId: string
    travelName: string
    equipments: CoopEquipmentDto[]
  }
}

export interface CoopGoToTravelMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopGoToTravel
    receiverId: string
    travelName: string
    equipments: CoopEquipmentDto[]
  }
}

export interface CoopTravelAcceptMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopTravelAccept
    receiverId: string
    time: number
  }
}

export interface CoopTravelDenyMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopTravelDeny
    receiverId: string
    reason: string
  }
}

// message received by second guy for coop, who didn't travel
export interface CoopFinishMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopFinish
    receiverId: string
    travelerId: string
    travelName: string
  }
}

export interface CoopCancelMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopCancel
    receiverId: string
  }
}

export interface CoopCancelPlanningMessage {
  senderId: string
  message: {
    type: IncomingCoopMessageType.CoopCancelPlanning
    receiverId: string
  }
}

export type IncomingCoopMessage =
  | CoopStartPlanningMessage
  | CoopJoinPlanningMessage
  | CoopProposeCompanyMessage
  | CoopStartNegotiationMessage
  | CoopNegotiationBidMessage
  | CoopFinishNegotiationMessage
  | CoopResourceChangeMessage
  | CoopWaitForTravelMessage
  | CoopGoToTravelMessage
  | CoopTravelAcceptMessage
  | CoopTravelDenyMessage
  | CoopFinishMessage
  | CoopCancelMessage
  | CoopCancelPlanningMessage

export enum OutcomingCoopMessageType {
  StartPlanning = 'coop/start_planning',
  FindCompany = 'coop/find_company',
  StopFinding = 'coop/stop_finding',
  JoinPlanning = 'coop/join_planning',
  JoinPlanningAck = 'coop/join_planning/ack',
  ProposeCompany = 'coop/propose_company',
  ProposeCompanyAck = 'coop/propose_company/ack',
  ResourceDecide = 'coop/resource_decide',
  ResourceDecideAck = 'coop/resource_decide/ack',
  CancelCoop = 'coop/cancel_coop',
  CancelPlanning = 'coop/cancel_planning',
  StartPlanningTravel = 'coop/start_planning_travel',
  StartSimpleTravel = 'coop/start_simple_travel', // done
}

export interface StartPlanningMessage {
  type: OutcomingCoopMessageType.StartPlanning
  travelName: string
}

export interface FindCompanyMessage {
  type: OutcomingCoopMessageType.FindCompany
  travelName: string
}

export interface StopFindingMessage {
  type: OutcomingCoopMessageType.StopFinding
}

export interface JoinPlanningMessage {
  type: OutcomingCoopMessageType.JoinPlanning
  ownerId: string
}

export interface JoinPlanningAckMessage {
  type: OutcomingCoopMessageType.JoinPlanningAck
  guestId: string
}

export interface ProposeCompanyMessage {
  type: OutcomingCoopMessageType.ProposeCompany
  travelName: string
  guestId: string
}

export interface ProposeCompanyAckMessage {
  type: OutcomingCoopMessageType.ProposeCompanyAck
  travelName: string
  ownerId: string
}

export interface ResourceDecideMessage {
  type: OutcomingCoopMessageType.ResourceDecide
  yourBid: CoopBid
  otherPlayerId: string
}

export interface ResourceDecideAckMessage {
  type: OutcomingCoopMessageType.ResourceDecideAck
  otherPlayerBid: CoopBid
  otherPlayerId: string
}

export interface CancelCoopMessage {
  type: OutcomingCoopMessageType.CancelCoop
}

export interface CancelPlanningMessage {
  type: OutcomingCoopMessageType.CancelPlanning
}

export interface StartPlanningTravelMessage {
  type: OutcomingCoopMessageType.StartPlanningTravel
  travelName: string
}

export interface StartSimpleTravelMessage {
  type: OutcomingCoopMessageType.StartSimpleTravel
  travelName: string
}

export type OutcomingCoopMessage =
  | StartPlanningMessage
  | FindCompanyMessage
  | StopFindingMessage
  | JoinPlanningMessage
  | JoinPlanningAckMessage
  | ProposeCompanyMessage
  | ProposeCompanyAckMessage
  | ResourceDecideMessage
  | ResourceDecideAckMessage
  | CancelCoopMessage
  | CancelPlanningMessage
  | StartPlanningTravelMessage
  | StartSimpleTravelMessage

export const sendCoopMessage = (socket: Websocket, message: OutcomingCoopMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing trade message. Reason: ${(error as Error).message}`)
  }
}
