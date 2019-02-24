export const userReducer = (state = [], action) => {
    console.log(action)
    switch (action.type) {
        case 'FETCH_USER_UI':
            return action.payload;
        case 'CREATE_DEFAULT_USER_UI':
            return action.payload;
        default:
            return {};
    }
};