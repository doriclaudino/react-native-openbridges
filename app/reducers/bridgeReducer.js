export const bridgeReducer = (state = [], action) => {
    console.log(action)
    switch (action.type) {
        case 'ADD_BRIDGES':
            return action.payload;
        case 'CLEAR_BRIDGES':
            return [];
        case 'ADD_BRIDGE_EVENT':
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, events: new Array().concat(action.payload.bridge.events, action.payload.event) }]
        case 'DEL_BRIDGE_EVENT':
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, events: removeItem(action.payload.bridge.events, action.payload.event) }]
        case 'ADD_BRIDGE_STATUS_THRESHOLD':
            return [...removeItem(state, action.payload.bridge), { ...action.payload.bridge, statusThreshold: action.payload.statusThreshold }]
        default:
            return state;
    }
};


function removeItem(array, action) {
    return array.filter((item) => item.id !== action.id)
}

