import {
  type ClassResourceRepresentation,
  type Coordinate,
  type GameAsset,
  type GameSettingsTravels,
} from '../../apis/game/Types'

export interface GameSettings {
  classResourceRepresentation: ClassResourceRepresentation[]
  travels: GameSettingsTravels[]
  gameSessionId: number
  name: string
  shortName: string
  gameAssets: GameAsset[]
  timeForGame: number
  walkingSpeed: number
  interactionRadius: number
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
  money: number
  resources: GameResourceDto[]
}

export interface CoopEquipment {
  resources: ResourceDiff[]
  timeTokensCoopInfo: {
    time: AmountDiff
  } | null
}

export interface CoopEquipmentDto {
  key: string
  value: CoopEquipment
}

export interface Equipment {
  money: number
  time: number
  resources: GameResourceDto[]
}

export interface PlayerResultDto {
  playerId: string
  money: number
}

export interface EndGameStatus {
  gameSessionName: string
  playersLeaderboard: PlayerResultDto[]
}

export interface ResourceDiff {
  key: string
  value: AmountDiff
}

export interface AmountDiff {
  amount: number
  needed: number
}
