import type { Websocket } from 'websocket-ts'

interface tradeAdvertisement {
  buy: string | null
  sell: string | null
}

export enum AdvertisementMessageType {
  SyncRequest = 'advertisement/sync',
  SyncTradeResponse = 'trade/sync/response',
  SyncCoopResponse = 'coop/sync/response',
}

export interface AdvertisementSyncTradeResponseMessage {
  senderId: string
  message: {
    type: AdvertisementMessageType.SyncTradeResponse
    states: { key: string; value: tradeAdvertisement }[] | null
  }
}

export interface AdvertisementSyncCoopResponseMessage {
  senderId: string
  message: {
    type: AdvertisementMessageType.SyncCoopResponse
    states: { key: string; value: string }[] | null
  }
}

export type AdvertisementMessage =
  | AdvertisementSyncTradeResponseMessage
  | AdvertisementSyncCoopResponseMessage

export interface AdvertisementSyncRequestMessage {
  type: AdvertisementMessageType.SyncRequest
}

export const sendAdvertisementMessage = (
  socket: Websocket,
  message: AdvertisementSyncRequestMessage,
): void => {
  try {
    const serialized = JSON.stringify(message)
    socket.send(serialized)
  } catch (error) {
    console.error(`Error serializing message. Reason: ${(error as Error).message}`)
  }
}
