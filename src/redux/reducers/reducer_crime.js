import { FETCH_CRIME } from '../actions/crime';

export default function (state = [], action) {
    // eslint-disable-next-line
    switch (action.type) {
        case FETCH_CRIME:
            return [action.payload.data[0], ...state];
    }

    return state;
}