import type { Websocket } from 'websocket-ts'

interface TimeState {
  actual: number;
  max: number;
}

export enum TimeMessageType {
  SyncRequest = 'time/sync_request',
  SyncResponse = 'time/sync_response',
  End = 'time/end',
  Remaining = 'time/remaining',
  PlayerRegen = 'time/player_regen',
  SessionRegen = 'time/session_regen'
}

export interface TimeSyncResponseMessage {
  senderId: string
  message: {
      type: TimeMessageType.SyncResponse
      timeLeftSeconds: number
      timeTokens: Record<number, TimeState>;
  }
}

export interface TimeEndMessage {
  senderId: string
  message: {
      type: TimeMessageType.End
  }
}

export interface TimeRemainingMessage {
  senderId: string
  message: {
      type: TimeMessageType.Remaining
      timeLeftSeconds: number
  }
}

export interface TimeSessionRegenMessage {
  senderId: string
  message: {
      type: TimeMessageType.SessionRegen
      tokens: Record<number, Record<number, TimeState>>;
  }
}

export interface TimePlayerRegenMessage {
  senderId: string
  message: {
      type: TimeMessageType.PlayerRegen
      playerId: string
      tokens: Record<number, TimeState>;
  }
}

export type TimeMessage =
  | TimeSyncResponseMessage
  | TimeEndMessage
  | TimeRemainingMessage
  | TimeSessionRegenMessage
  | TimePlayerRegenMessage

export interface TimeSyncRequestMessage {
  type: TimeMessageType.SyncRequest
}

export const sendTimeMessage = (socket: Websocket, message: TimeSyncRequestMessage): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
