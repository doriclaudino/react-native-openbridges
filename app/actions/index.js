import firebase from 'react-native-firebase';
import { parseToArrayWithId } from '../helpers'
import ActionTypes from './ActionTypes'
export default ActionTypes

const createDefaultUserUI = payload => ({
    type: ActionTypes.CREATE_DEFAULT_USER_UI,
    payload,
});

const fetchUserUI = payload => ({
    type: ActionTypes.FETCH_USER_UI,
    payload,
});

export const fetchBridgesSuccess = payload => ({
    type: ActionTypes.FETCH_BRIDGES_SUCCESS,
    payload,
});

export const fetchBridges = () => ({
    type: ActionTypes.FETCH_BRIDGES,
});

export const addBridgeStatusThreshold = payload => ({
    type: ActionTypes.ADD_BRIDGE_STATUS_THRESHOLD,
    payload,
});

export const delBridgeEvent = (payload) => ({
    type: ActionTypes.DEL_BRIDGE_EVENT,
    payload,
});

export const addBridgeEvent = (payload) => ({
    type: ActionTypes.ADD_BRIDGE_EVENT,
    payload,
});

export const addBridgeEventSuccess = (payload) => ({
    type: ActionTypes.ADD_BRIDGE_EVENT_SUCCESS,
    payload,
});

export const clearBridges = () => ({
    type: ActionTypes.CLEAR_BRIDGES
});

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