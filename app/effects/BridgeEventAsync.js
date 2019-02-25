import { fetchBridgesSuccess } from '../actions';
import firebase from 'react-native-firebase';
import { parseToArrayWithId } from '../helpers'

export async function delBridgeEventAsync({ action, dispatch }) {
    const { bridge, event } = action.payload
    bridgeRef = firebase.database()
        .ref(`bridges/${bridge.id}/events/${event.id}`)
        .remove();
}

export async function addBridgeEventAsync({ action, dispatch }) {
    const { bridge, event } = action.payload
    event.when = event.when.toISOString()
    firebase.database().ref(`bridges/${bridge.id}/events/`).push(event)
}