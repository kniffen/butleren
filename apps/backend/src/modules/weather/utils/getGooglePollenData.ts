import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { GOOGLE_API_KEY } from '../constants';

export const getGooglePollenData = async function(lat: number, lon: number): Promise<GooglePollenData> {
  const url = new URL('https://pollen.googleapis.com/v1/forecast:lookup');
  url.searchParams.set('key', GOOGLE_API_KEY);
  url.searchParams.set('location.latitude', lat.toString());
  url.searchParams.set('location.longitude', lon.toString());
  url.searchParams.set('days', '1');

  const res = await fetch(url.toString());
  logInfo('Weather', 'Fetched pollen data', { url: url.toString(), status: res.status });
  if (!res.ok) {
    logError('Weather', `Unable to fetch pollen data: ${res.status} ${res.statusText}`, { url: url.toString() });
    throw new Error(`Unable to fetch pollen data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as GooglePollenData;
  logDebug('Weather', 'Fetched pollen data', { url: url.toString(), data });
  return data;
};

export interface GooglePollenData {
  regionCode: string;
  dailyInfo: GooglePollenDayInfo[];
  nextPageToken?: string;
}

export type GooglePollenType = 'POLLEN_TYPE_UNSPECIFIED' | 'GRASS' | 'TREE' | 'WEE';

export type GooglePollenIndex = 'INDEX_UNSPECIFIED' | 'UPI';

export interface GooglePollenDayInfo {
  date: {
    year: number;
    month: number;
    day: number;
  };
  pollenTypeInfo: {
    code: GooglePollenType;
    displayName: string;
    indexInfo?: GooglePollenIndexInfo;
    healthRecommendations?: string[];
    inSeason?: boolean;
  }[];
  plantInfo: GooglePollenPlantInfo[]
}


export interface GooglePollenIndexInfo {
  code: GooglePollenIndex,
  displayName: string;
  category: string;
  indexDescription: string;
  color: Record<string, number>,
  value: number;
}

export type GooglePollenPlant =
  | 'PLANT_UNSPECIFIED'
  | 'ALDER'
  | 'ASH'
  | 'BIRCH'
  | 'COTTONWOOD'
  | 'ELM'
  | 'MAPLE'
  | 'OLIVE'
  | 'JUNIPER'
  | 'OAK'
  | 'PINE'
  | 'CYPRESS_PINE'
  | 'HAZEL'
  | 'GRAMINALES'
  | 'RAGWEED'
  | 'MUGWORT'

export interface GooglePollenPlantInfo {
  code: GooglePollenPlant;
  displayName: string;
  indexInfo?: GooglePollenIndexInfo,
  plantDescription?: {
    type: GooglePollenType,
    family: string,
    season: string,
    specialColors: string,
    specialShapes: string,
    crossReaction: string,
    picture: string,
    pictureCloseup: string
  },
  inSeason?: boolean
}