import firebase from 'react-native-firebase';
import { parseToArrayWithId } from '../helpers'

const createDefaultUserUI = payload => ({
    type: 'CREATE_DEFAULT_USER_UI',
    payload,
});

const fetchUserUI = payload => ({
    type: 'FETCH_USER_UI',
    payload,
});

export const addBridges = payload => ({
    type: 'ADD_BRIDGES',
    payload,
});

export const addBridgeStatusThreshold = payload => ({
    type: 'ADD_BRIDGE_STATUS_THRESHOLD',
    payload,
});

export const delBridgeEvent = (payload) => ({
    type: 'DEL_BRIDGE_EVENT',
    payload,
});

export const addBridgeEvent = (payload) => ({
    type: 'ADD_BRIDGE_EVENT',
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

export const watchUserUpdateUI = () => async dispatch => {
    console.log('watchUserUpdateUI')
    try {
        const { currentUser } = firebase.auth()
        userUiRef = firebase.database().ref(`ui/${currentUser.uid}`)
        userUiRef.on('value', (snapshot) => {
            dispatch(fetchUserUI(snapshot.val()))
        });
    } catch (error) {
        console.error(error);
    }
};


export const createOrUpdateUserUI = () => async dispatch => {
    try {
        const { uid } = firebase.auth().currentUser
        userUiRef = firebase.database().ref(`ui/`)
        const defaultUserUi = {
            selectedDistance: 10,
            currentUserLocation: {
                lat: 42.3863,
                lng: -71.0227
            },
            isSearchBarVisible: false,
            isSliderLocationVisible: false
        }
        userUiRef.child(uid).once('value', function (snapshot) {
            if (!snapshot.exists())
                userUiRef.child(uid).set(defaultUserUi)
        });
    } catch (error) {
        console.error(error);
    }
};


export const updatedSelectDistance = (selectedDistance) => async dispatch => {
    try {
        const { uid } = firebase.auth().currentUser
        distanceRef = firebase.database().ref(`ui/${uid}/selectedDistance`)
        distanceRef.set(selectedDistance)
    } catch (error) {
        console.error(error);
    }
};

export const updateSearchBarValue = (text) => async dispatch => {
    try {
        const { uid } = firebase.auth().currentUser
        distanceRef = firebase.database().ref(`ui/${uid}/searchBarValue`)
        distanceRef.set(text)
    } catch (error) {
        console.error(error);
    }
};