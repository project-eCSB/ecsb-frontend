import type { Direction } from 'grid-engine'
import type { Websocket } from 'websocket-ts'

export enum MovementMessageType {
  PlayerAdded = 'player_added',
  PlayerRemoved = 'player_remove',
  PlayerMoved = 'player_moved',
  SyncRequest = 'sync_request',
  PlayerSyncing = 'player_syncing',
  Move = 'move',
}

export interface Coordinates {
  x: number
  y: number
}

export interface PlayerAddedMessage {
  type: MovementMessageType.PlayerAdded
  id: string
  coords: Coordinates
  direction: Direction
  className: string
}

export interface PlayerRemovedMessage {
  type: MovementMessageType.PlayerRemoved
  id: string
}

export interface PlayerMovedMessage {
  type: MovementMessageType.PlayerMoved
  id: string
  coords: Coordinates
  direction: Direction
}

export interface MoveMessage {
  type: MovementMessageType.Move
  coords: Coordinates
  direction: string
}

export interface SyncRequestMessage {
  type: MovementMessageType.SyncRequest
}

export interface PlayerPositionWithClass {
  className: string
  playerPosition: PlayerPosition
}

export interface PlayerPosition {
  id: string
  coords: Coordinates
  direction: Direction
}

export interface PlayersSyncMessage {
  type: MovementMessageType.PlayerSyncing
  players: PlayerPositionWithClass[]
}

export type Message =
  | PlayerAddedMessage
  | PlayerRemovedMessage
  | PlayerMovedMessage
  | SyncRequestMessage
  | PlayersSyncMessage
  | MoveMessage

export const parseMovementMessage = (message: string): Message | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case MovementMessageType.PlayerAdded:
        return parsed.message
      case MovementMessageType.PlayerRemoved:
        return parsed.message
      case MovementMessageType.PlayerMoved:
        return parsed.message
      case MovementMessageType.PlayerSyncing:
        return parsed.message
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

export const sendMovementMessage = (socket: Websocket, message: Message): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
