export const bridgeReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_BRIDGES':
            return action.payload;
        case 'CLEAR_BRIDGES':
            return [];
        default:
            return state;
    }
};