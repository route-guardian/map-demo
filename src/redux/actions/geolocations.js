import axios from 'axios';
import { SAFETY_API } from '../constants';

const ROOT_URL = SAFETY_API + '/geolocations';
export const FETCH_GEOLOCATIONS = 'FETCH_GEOLOCATIONS';

export function fetchGeolocations() {
    const request = axios.get(ROOT_URL);

    return {
        type: FETCH_GEOLOCATIONS,
        payload: request
    };
}