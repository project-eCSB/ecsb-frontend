import { type Websocket } from 'websocket-ts'

export enum TravelMessageType {
  TravelStart = 'travel/start', // Signal opening travel window
  TravelStop = 'travel/stop', // Signal closing travel window
  TravelChange = 'travel/change'
}

export interface TravelStartMessage {
  type: TravelMessageType.TravelStart
}

export interface TravelStopMessage {
  type: TravelMessageType.TravelStop
}

export interface TravelChangeMessage {
  type: TravelMessageType.TravelChange
  travelName: string
}

export type TravelMessage = TravelStartMessage | TravelStopMessage | TravelChangeMessage

export const sendTravelMessage = (socket: Websocket, message: TravelMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
