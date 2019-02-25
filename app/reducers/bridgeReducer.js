import ActionTypes from '../actions'

export const bridgeReducer = (state = [], action) => {
    console.log('bridgeReducer', action)
    switch (action.type) {
        case ActionTypes.FETCH_BRIDGES_SUCCESS:
            return action.payload;
        case ActionTypes.CLEAR_BRIDGES:
            return [];
        case ActionTypes.ADD_BRIDGE_STATUS_THRESHOLD:
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, statusThreshold: action.payload.statusThreshold }]
        default:
            return state;
    }
};


function removeItem(array, action) {
    return array.filter((item) => item.id !== action.id)
}

