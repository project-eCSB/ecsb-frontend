import { type Websocket } from 'websocket-ts'

export enum WorkshopMessageType {
  WorkshopStart = 'workshop/start',
  WorkshopStop = 'workshop/stop',
}

export interface WorkshopStartMessage {
  type: WorkshopMessageType.WorkshopStart
}

export interface WorkshopStopMessage {
  type: WorkshopMessageType.WorkshopStop
}

export type WorkshopMessage = WorkshopStartMessage | WorkshopStopMessage

export const sendWorkshopMessage = (socket: Websocket, message: WorkshopMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
