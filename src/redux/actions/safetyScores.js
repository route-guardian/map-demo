import axios from 'axios';
import { SAFETY_API } from '../constants';

const ROOT_URL = SAFETY_API + '/score';
export const FETCH_SAFETYSCORES = 'FETCH_SAFETYSCORES';

export function fetchSafetyScores() {
    const request = axios.get(ROOT_URL);

    return {
        type: FETCH_SAFETYSCORES,
        payload: request
    };
}