import { combineReducers } from 'redux'
import { bridgeReducer } from './bridgeReducer'
import { userReducer } from './userReducer'
export default combineReducers({
  bridges: bridgeReducer,
  ui: userReducer,
})
