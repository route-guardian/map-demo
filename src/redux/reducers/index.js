import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import GeolocationsReducer from './reducer_geolocations';
import SafetyScoreReducer from './reducer_safetyscores';
import CrimeReducer from './reducer_crime';
import CameraReducer from './reducer_cameras';

const rootReducer = combineReducers({
    weather: WeatherReducer,
    geolocations: GeolocationsReducer,
    safetyScores: SafetyScoreReducer,
    crime: CrimeReducer,
    cameras: CameraReducer
});

export default rootReducer;
