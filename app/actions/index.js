import firebase from 'react-native-firebase';
import { parseToArrayWithId } from '../helpers'

export const addBridges = payload => ({
    type: 'ADD_BRIDGES',
    payload,
});

export const clearBridges = () => ({ type: 'CLEAR_BRIDGES' });

export const fetchbridges = () => async dispatch => {
    try {
        bridgeRef = firebase.database().ref('bridges');
        bridgeRef.on('value', (snapshot) => {
            let bridges = parseToArrayWithId(snapshot.val())
            dispatch(addBridges(bridges));
        });
    } catch (error) {
        console.error(error);
        dispatch(clearBridges());
    }
};