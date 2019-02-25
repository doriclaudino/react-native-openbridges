import { createStore, applyMiddleware } from 'redux';
import { effectsMiddleware } from 'redux-effex';
import firebase from 'react-native-firebase';
import reducers from '../reducers';
import Effects from '../effects';

const initialState = {}

const store = createStore(reducers, initialState, applyMiddleware(effectsMiddleware(Effects)));
export { store };