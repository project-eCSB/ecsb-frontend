import {type CoopEquipmentDto, type GameResourceDto} from "../../../services/game/Types";
import {type Websocket} from "websocket-ts";

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
    CoopTravelCompleted = 'coop/system/travel_completed',
    CoopCancel = 'coop/system/cancel_coop',
    CoopCancelPlanning = 'coop/system/cancel_planning'
}

export interface CoopStartPlanningMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopStartPlanning
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
        myTurn: boolean
        receiverId: string
    }
}

export interface CoopNegotiationBidMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopNegotiationBid
        coopBid: CoopBid
        receiverId: string
    }
}

export interface CoopFinishNegotiationMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopFinishNegotiation
        equipments: CoopEquipmentDto[]
    }
}

export interface CoopResourceChangeMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopResourceChange
        equipments: CoopEquipmentDto[]
    }
}

export interface CoopWaitForTravelMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopWaitForTravel
        travelerId: string
        travelName: string
    }
}

export interface CoopGoToTravelMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopGoToTravel
        waitingPlayerId: string
        travelName: string
    }
}

export interface CoopTravelCompletedMessage {
    senderId: string
    message: {
        type: IncomingCoopMessageType.CoopTravelCompleted
        receiverId: string
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
    | CoopTravelCompletedMessage
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
    StartTravel = 'coop/start_travel',
}

export interface StartPlanningMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.StartPlanning
        travelName: string
    }
}

export interface FindCompanyMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.FindCompany
        travelName: string
    }
}

export interface StopFindingMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.StopFinding
    }
}

export interface JoinPlanningMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.JoinPlanning
        ownerId: string
    }
}

export interface JoinPlanningAckMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.JoinPlanningAck
        guestId: string
    }
}

export interface ProposeCompanyMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.ProposeCompany
        travelName: string
        guestId: string
    }
}

export interface ProposeCompanyAckMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.ProposeCompanyAck
        travelName: string
        ownerId: string
    }
}

export interface ResourceDecideMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.ResourceDecide
        yourBid: CoopBid
        otherPlayerId: string
    }
}

export interface ResourceDecideAckMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.ResourceDecideAck
        otherPlayerBid: CoopBid
        otherPlayerId: string
    }
}

export interface CancelCoopMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.CancelCoop
    }
}

export interface CancelPlanningMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.CancelPlanning
    }
}

export interface StartTravelMessage {
    senderId: string
    message: {
        type: OutcomingCoopMessageType.StartTravel
        travelName: string
    }
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
    | StartTravelMessage

export const sendCoopMessage = (socket: Websocket, message: OutcomingCoopMessage): void => {
    try {
        const serialized = JSON.stringify(message.message)
        socket.send(serialized)
    } catch (error) {
        console.error(`Error serializing trade message. Reason: ${(error as Error).message}`)
    }
}
