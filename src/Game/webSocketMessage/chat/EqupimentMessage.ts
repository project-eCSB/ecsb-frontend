import { type Equipment } from "../../../services/game/Types"

export enum EquipmentMessageType {
  EquipmentChange = 'equipment/change',
}

export interface EquipmentChangeMessage {
  senderId: string
  message: {
    type: EquipmentMessageType.EquipmentChange
    playerEquipment: Equipment
  }
}

export type EquipmentMessage =
  | EquipmentChangeMessage
