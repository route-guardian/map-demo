import { FETCH_CAMERAS } from '../actions/cameras';

export default function (state = [], action) {
    // eslint-disable-next-line
    switch (action.type) {
        case FETCH_CAMERAS:
            return [action.payload.data[0], ...state];
    }

    return state;
}