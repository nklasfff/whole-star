import type { HouseNumber, HouseType, HouseAxis } from './types';
import { HOUSE_TYPE, OPPOSITE_HOUSE } from './types';
import housesData from '../data/houses.json';

const axes = housesData as { house: number; opposite: number; theme: string }[];

export function getHouseType(house: HouseNumber): HouseType {
  return HOUSE_TYPE[house];
}

export function getOppositeHouse(house: HouseNumber): HouseNumber {
  return OPPOSITE_HOUSE[house];
}

export function getHouseAxis(house: HouseNumber): HouseAxis {
  const entry = axes.find(a => a.house === house);
  const opposite = OPPOSITE_HOUSE[house];
  return {
    house,
    opposite,
    theme: entry?.theme ?? `House ${house} ↔ House ${opposite}`,
  };
}
