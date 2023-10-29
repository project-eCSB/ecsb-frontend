import { type Websocket } from 'websocket-ts'

export enum WorkshopMessageType {
  WorkshopStart = 'workshop/choosing/start', // Signal opening workshop window
  WorkshopStop = 'workshop/choosing/stop', // Signal closing workshop window
  WorkshopChange = 'workshop/choosing/change',
}

export interface WorkshopStartMessage {
  type: WorkshopMessageType.WorkshopStart
}

export interface WorkshopStopMessage {
  type: WorkshopMessageType.WorkshopStop
}

export interface WorkshopChangeMessage {
  type: WorkshopMessageType.WorkshopChange
  amount: number
}

export type WorkshopMessage = WorkshopStartMessage | WorkshopStopMessage | WorkshopChangeMessage

export const sendWorkshopMessage = (socket: Websocket, message: WorkshopMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
