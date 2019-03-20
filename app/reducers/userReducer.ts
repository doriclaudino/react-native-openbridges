import ActionTypes from '../actions'

export const userReducer = (state = [], action: any) => {
  console.log('userReducer', action)
  switch (action.type) {
    case ActionTypes.FETCH_UI_SUCCESS:
      return action.payload
    case ActionTypes.CREATE_DEFAULT_USER_UI:
      return action.payload
    default:
      return { ...state }
  }
}
