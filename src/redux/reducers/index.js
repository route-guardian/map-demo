import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import GeolocationsReducer from './reducer_geolocations';
import SafetyScoreReducer from './reducer_safetyscores';

const rootReducer = combineReducers({
    weather: WeatherReducer,
    geolocations: GeolocationsReducer,
    safetyScores: SafetyScoreReducer
});

export default rootReducer;
