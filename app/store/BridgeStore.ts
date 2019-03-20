import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from '../reducers'

const initialState = {}

const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware))
export default store
