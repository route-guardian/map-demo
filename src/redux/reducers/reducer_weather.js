import { FETCH_WEATHER } from '../actions/weather';

export default function (state = [], action) {
    // eslint-disable-next-line
    switch (action.type) {
        case FETCH_WEATHER:
            return [action.payload.data, ...state];
    }

    return state;
}