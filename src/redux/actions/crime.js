import axios from 'axios';
import { SAFETY_API } from '../constants';

const ROOT_URL = SAFETY_API + '/crime';
export const FETCH_CRIME = 'FETCH_CRIME';

export function fetchCrime() {
    const request = axios.get(ROOT_URL);

    return {
        type: FETCH_CRIME,
        payload: request
    };
}