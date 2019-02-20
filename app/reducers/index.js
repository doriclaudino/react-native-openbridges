import { combineReducers } from 'redux';
import { bridgeReducer } from './bridgeReducer';
export default combineReducers({
    bridges: bridgeReducer
});