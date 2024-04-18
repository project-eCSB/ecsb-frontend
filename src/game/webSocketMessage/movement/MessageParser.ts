import { type MovementMessage, MovementMessageType } from './MovementMessage'

export const parseMovementMessage = (message: string): MovementMessage | null => {
  try {
    const parsed = JSON.parse(message)

    switch (parsed.message.type) {
      case MovementMessageType.PlayerAdded:
      case MovementMessageType.PlayerRemoved:
      case MovementMessageType.PlayerMoved:
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
