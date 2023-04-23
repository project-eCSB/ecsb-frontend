import type { Direction } from 'grid-engine'
import type { Websocket } from 'websocket-ts'

export enum MessageType {
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
  type: MessageType.PlayerAdded
  id: string
  coords: Coordinates
  direction: Direction
}

export interface PlayerRemovedMessage {
  type: MessageType.PlayerRemoved
  id: string
}

export interface PlayerMovedMessage {
  type: MessageType.PlayerMoved
  id: string
  coords: Coordinates
  direction: Direction
}

export interface MoveMessage {
  type: MessageType.Move
  coords: Coordinates
  direction: string
}

export interface SyncRequestMessage {
  type: MessageType.SyncRequest
}

export interface PlayerPosition {
  id: string
  coords: Coordinates
  direction: Direction
}

export interface PlayersSyncMessage {
  type: MessageType.PlayerSyncing
  players: PlayerPosition[]
}

export type Message =
  | PlayerAddedMessage
  | PlayerRemovedMessage
  | PlayerMovedMessage
  | SyncRequestMessage
  | PlayersSyncMessage
  | MoveMessage

export const parseMessage = (message: string): Message | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case MessageType.PlayerAdded:
        return {
          type: MessageType.PlayerAdded,
          id: parsed.message.id,
          coords: parsed.message.coords,
          direction: parsed.message.direction,
        }
      case MessageType.PlayerRemoved:
        return {
          type: MessageType.PlayerRemoved,
          id: parsed.message.id,
        }
      case MessageType.PlayerMoved:
        return {
          type: MessageType.PlayerMoved,
          id: parsed.message.id,
          coords: parsed.message.coords,
          direction: parsed.message.direction,
        }
      case MessageType.PlayerSyncing:
        return {
          type: MessageType.PlayerSyncing,
          players: parsed.message.players,
        }
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

export const sendMessage = (socket: Websocket, message: Message): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
