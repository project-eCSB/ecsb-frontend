import { type Websocket } from 'websocket-ts'

export enum TravelMessageType {
  TravelStart = 'travel/start',
  TravelStop = 'travel/stop',
}

export interface TravelStartMessage {
  type: TravelMessageType.TravelStart
}

export interface TravelStopMessage {
  type: TravelMessageType.TravelStop
}

export type TravelMessage = TravelStartMessage | TravelStopMessage

export const sendTravelMessage = (socket: Websocket, message: TravelMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
