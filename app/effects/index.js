import ActionTypes from '../actions/ActionTypes';
import fetchBridgesAsync from './FetchBridgesAsync'
import { delBridgeEventAsync, addBridgeEventAsync } from './BridgeEventAsync'


function genericErrorHandler({ action, error }) {
    console.log({ error, action });
}

export default effects = [
    { action: ActionTypes.FETCH_BRIDGES, effect: fetchBridgesAsync, error: genericErrorHandler },
    { action: ActionTypes.DEL_BRIDGE_EVENT, effect: delBridgeEventAsync, error: genericErrorHandler },
    { action: ActionTypes.ADD_BRIDGE_EVENT, effect: addBridgeEventAsync, error: genericErrorHandler },
];
