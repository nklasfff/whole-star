// ─── Planets ───────────────────────────────────────────────────────────────────

export type Planet =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
];

// ─── Zodiac ────────────────────────────────────────────────────────────────────

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// ─── Dignity ───────────────────────────────────────────────────────────────────

export type DignityLevel = 'domicile' | 'exaltation' | 'peregrine' | 'fall' | 'exile';

export const DIGNITY_STRESS: Record<DignityLevel, number> = {
  domicile: 0,
  exaltation: 15,
  peregrine: 40,
  fall: 70,
  exile: 85,
};

// ─── Aspects ───────────────────────────────────────────────────────────────────

export type AspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition';

export interface AspectDefinition {
  type: AspectType;
  angle: number;
  orb: number;
}

export interface DetectedAspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  angle: number;
  orb: number;
  exactAngle: number;
}

export type BeneficMalefic = 'benefic' | 'malefic' | 'neutral';

export const PLANET_NATURE: Record<Planet, BeneficMalefic> = {
  Sun: 'neutral',
  Moon: 'neutral',
  Mercury: 'neutral',
  Venus: 'benefic',
  Mars: 'malefic',
  Jupiter: 'benefic',
  Saturn: 'malefic',
  Uranus: 'neutral',
  Neptune: 'neutral',
  Pluto: 'neutral',
};

// ─── Houses ────────────────────────────────────────────────────────────────────

export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type HouseType = 'angular' | 'succedent' | 'cadent';

export const HOUSE_TYPE: Record<HouseNumber, HouseType> = {
  1: 'angular', 2: 'succedent', 3: 'cadent',
  4: 'angular', 5: 'succedent', 6: 'cadent',
  7: 'angular', 8: 'succedent', 9: 'cadent',
  10: 'angular', 11: 'succedent', 12: 'cadent',
};

export const HOUSE_STRESS: Record<HouseType, number> = {
  angular: -10,
  succedent: 0,
  cadent: 10,
};

export const OPPOSITE_HOUSE: Record<HouseNumber, HouseNumber> = {
  1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 12,
  7: 1, 8: 2, 9: 3, 10: 4, 11: 5, 12: 6,
};

// ─── Retrograde ────────────────────────────────────────────────────────────────

export const RETROGRADE_STRESS = 15;

// ─── Planet Position (from ephemeris) ──────────────────────────────────────────

export interface PlanetPosition {
  planet: Planet;
  longitude: number;        // 0–360 degrees ecliptic longitude
  sign: ZodiacSign;
  signDegree: number;       // 0–30 degree within sign
  house: HouseNumber;
  isRetrograde: boolean;
}

// ─── Birth Data ────────────────────────────────────────────────────────────────

export interface BirthData {
  date: string;             // ISO date: YYYY-MM-DD
  time: string;             // HH:MM (24-hour)
  latitude: number;
  longitude: number;
  timezone: string;         // IANA timezone, e.g. "Europe/Copenhagen"
}

// ─── Stress & Twin ─────────────────────────────────────────────────────────────

export interface StressComponents {
  dignity: number;
  aspects: number;
  retrograde: number;
  house: number;
  transit: number;
}

export interface StressResult {
  planet: Planet;
  components: StressComponents;
  stressIndex: number;      // 0–100, clamped
}

export interface TwinState {
  planet: Planet;
  twinName: string;
  intensity: number;        // = stressIndex, 0–100
  twinHouse: HouseNumber;   // opposite of planet's house
  planetHouse: HouseNumber;
}

// ─── Twin Pairs ────────────────────────────────────────────────────────────────

export interface TwinPair {
  twin1: Planet;
  twin2: Planet;
  quality: string;
  description: string;
}

export interface ActiveTwinPair extends TwinPair {
  intensity1: number;
  intensity2: number;
  combinedIntensity: number;
}

export const TWIN_PAIR_THRESHOLD = 50;

// ─── Twin Definitions (from data/twins.json) ───────────────────────────────────

export interface TwinDefinition {
  planet: Planet;
  name: string;
  classicalQuality: string;
  twinQuality: string;
  color: string;
  colorName: string;
  orbitalPeriodDays: number;
}

// ─── House Axis ────────────────────────────────────────────────────────────────

export interface HouseAxis {
  house: HouseNumber;
  opposite: HouseNumber;
  theme: string;
}

// ─── Transit ───────────────────────────────────────────────────────────────────

/** A simplified planet position for transit calculations (no house needed) */
export interface TransitPosition {
  planet: Planet;
  longitude: number;
  isRetrograde: boolean;
}

export interface TransitAspect {
  transitPlanet: Planet;
  natalPlanet: Planet;
  type: AspectType;
  orb: number;
}

// ─── Full Chart State ──────────────────────────────────────────────────────────

export interface ChartState {
  birthData: BirthData;
  positions: PlanetPosition[];
  stressResults: StressResult[];
  twinStates: TwinState[];
  activePairs: ActiveTwinPair[];
  brightestTwin: TwinState;
  transitDate?: string;
  transitPositions?: TransitPosition[];
  transitAspects?: TransitAspect[];
}

// ─── Daily Invitation ──────────────────────────────────────────────────────────

export interface DailyInvitation {
  twinName: string;
  planet: Planet;
  intensity: number;
  houseAxis: HouseAxis;
  invitationText: string;
}
