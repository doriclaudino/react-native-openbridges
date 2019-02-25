import ActionTypes from '../actions'

export const bridgeReducer = (state = [], action) => {
    console.log('bridgeReducer', action)
    switch (action.type) {
        case ActionTypes.FETCH_BRIDGES_SUCCESS:
            return action.payload;
        case ActionTypes.FETCH_BRIDGES:
            return state;
        case ActionTypes.CLEAR_BRIDGES:
            return [];
        case ActionTypes.ADD_BRIDGE_EVENT:
            events = action.payload.bridge.events ? [...action.payload.bridge.events] : []
            events.push(action.payload.event)
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, events }]
        case ActionTypes.DEL_BRIDGE_EVENT:
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, events: removeItem(action.payload.bridge.events, action.payload.event) }]
        case ActionTypes.ADD_BRIDGE_STATUS_THRESHOLD:
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, statusThreshold: action.payload.statusThreshold }]
        default:
            return state;
    }
};


function removeItem(array, action) {
    return array.filter((item) => item.id !== action.id)
}

