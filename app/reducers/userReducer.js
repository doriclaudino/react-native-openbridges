import ActionTypes from '../actions'

export const userReducer = (state = [], action) => {
    console.log('userReducer', action)
    switch (action.type) {
        case ActionTypes.FETCH_UI_SUCCESS:
            return action.payload;
        case ActionTypes.CREATE_DEFAULT_USER_UI:
            return action.payload;
        case ActionTypes.UPDATE_SELECTED_DISTANCE:
            return { ...state, selectedDistance: action.payload };
        default:
            return null;
    }
};