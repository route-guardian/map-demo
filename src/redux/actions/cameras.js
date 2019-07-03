import axios from 'axios';
import { SAFETY_API } from '../constants';

const ROOT_URL = SAFETY_API + '/cameras';
export const FETCH_CAMERAS = 'FETCH_CAMERAS';

export function fetchCameras() {
    const request = axios.get(ROOT_URL);

    return {
        type: FETCH_CAMERAS,
        payload: request
    };
}