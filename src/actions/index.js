import axios from 'axios';

const API_KEY = '4b8236a02d89eb3781cb61435e6e0d58';
const ROOT_URL = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;

export const FETCH_WEATHER = 'FETCH_WEATHER';

export function fetchWeather(city) {
    const url = `${ROOT_URL}&q=${city},nl`;
    const request = axios.get(url);

    return {
        type: FETCH_WEATHER,
        payload: request
    };
}