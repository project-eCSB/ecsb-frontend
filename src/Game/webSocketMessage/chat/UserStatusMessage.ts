import { type Websocket } from 'websocket-ts'

export enum UserStatusMessageType {
  UserBusy = 'userBusy',
  UserInterrupt = 'userInterrupt',
}

export interface UserBusyMessage {
  senderId: string
  message: {
    type: UserStatusMessageType.UserBusy
    reason: string
    receiverId: string
  }
}

export interface UserInterruptMessage {
  senderId: string
  message: {
    type: UserStatusMessageType.UserInterrupt
    reason: string
    receiverId: string
  }
}

export type UserStatusMessage = UserBusyMessage | UserInterruptMessage

export const sendUserStatusMessage = (socket: Websocket, message: UserStatusMessage): void => {
  try {
    const serialized = JSON.stringify(message.message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing user status message. Reason: ${(error as Error).message}`)
  }
}
