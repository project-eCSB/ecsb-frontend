import { type ClassResourceRepresentation } from "../apis/game/Types"

// MAP
export const LAYER_SCALE = 2.25
export const RANGE = 3

// PLAYERS
export const SPRITE_WIDTH = 52
export const SPRITE_HEIGHT = 72
export const MOVEMENT_SPEED = 4.5
export const PLAYER_DESC_OFFSET_LEFT = 10
export const ALL_PLAYERS_DESC_OFFSET_TOP = 75
export const getPlayerMapping =
  (initialCharacterMapping: ClassResourceRepresentation[]) =>
  (playerClass: string): number =>
    initialCharacterMapping.find((dto) => dto.key === playerClass)?.value.classAsset ?? 0