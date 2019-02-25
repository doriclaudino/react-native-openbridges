import { fetchBridgesSuccess } from '../actions';
import firebase from 'react-native-firebase';
import { parseToArrayWithId } from '../helpers'

export default async function fetchBridgesAsync({ action, dispatch }) {
    bridgeRef = firebase.database().ref('bridges');
    bridgeRef.off('value');
    bridgeRef.on('value', (snapshot) => {
        try {
            list = snapshot.val();
            keys = Object.keys(list);
            bridges = keys.map(key => {
                events = parseToArrayWithId(list[key].events)
                return { ...list[key], id: key, events }
            })
            dispatch(fetchBridgesSuccess(bridges));
        } catch (error) {
            console.log(error.message)
        }
    });
}