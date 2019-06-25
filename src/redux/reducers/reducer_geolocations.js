import { FETCH_GEOLOCATIONS } from '../actions/geolocations';

export default function (state = [], action) {
    // eslint-disable-next-line
    switch (action.type) {
        case FETCH_GEOLOCATIONS:
            return [action.payload.data[0], ...state];
    }

    return state;
}