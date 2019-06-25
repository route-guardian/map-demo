import { FETCH_SAFETYSCORES } from '../actions/safetyScores';

export default function (state = [], action) {
    // eslint-disable-next-line
    switch (action.type) {
        case FETCH_SAFETYSCORES:
            return [action.payload.data[0], ...state];
    }

    return state;
}