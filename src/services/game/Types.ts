import {
  type Coordinate,
  type ClassResourceRepresentation,
  type GameAssets,
  type GameSettingsTravels,
} from '../../apis/game/Types'

export interface GameSettings {
  classResourceRepresentation: ClassResourceRepresentation[]
  travels: GameSettingsTravels[]
  gameSessionId: number
  name: string
  shortName: string
  gameAssets: GameAssets
}

export interface AssetConfig {
  lowLevelTravels: Coordinate[]
  mediumLevelTravels: Coordinate[]
  highLevelTravels: Coordinate[]
  professionWorkshops: {
    [profession: string]: Coordinate[]
  }
  startingPoint: Coordinate
}

export interface GameStatus {
  coords: {
    x: number
    y: number
  }
  direction: string
  className: string
  playerId: string
}

export interface GameResourceDto {
  key: string
  value: number
}

export interface TradeEquipment {
  money: number;
  resources: GameResourceDto[];
}

export interface Equipment {
  money: number
  time: number
  resources: GameResourceDto[]
}

export interface PlayerEquipment {
  full: Equipment
  shared: Equipment
}
