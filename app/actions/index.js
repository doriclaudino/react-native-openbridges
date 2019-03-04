import firebase from 'react-native-firebase';
import { parseToArrayWithId } from '../helpers'
import ActionTypes from './ActionTypes'
export default ActionTypes

const fetchUISuccess = payload => ({
    type: ActionTypes.FETCH_UI_SUCCESS,
    payload,
});

const fetchBridgesSuccess = payload => ({
    type: ActionTypes.FETCH_BRIDGES_SUCCESS,
    payload,
});

export const setCurrentUserLocation = (currentUserLocation) => async dispatch => {
    try {
        const { currentUser } = firebase.auth()

        if (currentUser && currentUserLocation)
            firebase.database()
                .ref(`ui/${currentUser.uid}/currentUserLocation`)
                .set(currentUserLocation)
    } catch (error) {
        console.error(error);
    }
};

export const addBridgeStatusThreshold = ({ bridge, statusThreshold }) => async dispatch => {
    try {
        console.log('addBridgeStatusThreshold')
        firebase.database()
            .ref(`bridges/${bridge.id}/statusThreshold`)
            .set(statusThreshold)
    } catch (error) {
        console.error(error);
    }
};

export const delBridgeEvent = ({ bridge, event }) => async dispatch => {
    try {
        console.log('delBridgeEvent')
        firebase.database().ref(`bridges/${bridge.id}/events/${event.id}`).remove()
    } catch (error) {
        console.error(error);
    }
};

export const addBridgeEvent = ({ bridge, event }) => async dispatch => {
    try {
        console.log('addBridgeEvent')
        firebase.database().ref(`bridges/${bridge.id}/events`).push(event)
    } catch (error) {
        console.error(error);
    }
};

export const fetchbridges = () => async dispatch => {
    try {
        console.log('fetchbridges')
        bridgeRef = firebase.database().ref('bridges');
        bridgeRef.off('value')
        bridgeRef.on('value', (snapshot) => {
            try {
                dispatch(fetchBridgesSuccess(snapshot.val()));
            } catch (error) {
                console.log(error.message)
            }
        });
    } catch (error) {
        console.error(error);
        dispatch(clearBridges());
    }
};

export const clearBridges = () => ({
    type: ActionTypes.CLEAR_BRIDGES
});

export const fetchOrCreateUI = () => async dispatch => {
    console.log('fetchUI')
    try {
        if (firebase.auth().currentUser) {
            userUiRef = firebase.database().ref(`ui/${firebase.auth().currentUser.uid}`)
            userUiRef.off('value')
            userUiRef.on('value', (snapshot) => {
                if (!snapshot.exists()) {
                    userUiRef.set(defaultUISchema)
                } else
                    dispatch(fetchUISuccess(snapshot.val()))
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const defaultUISchema = {
    currentUserLocation: {
        coords: {
            latitude: 42.4115301,
            longitude: -71.0649686,
        },
        mocked: true,
        timestamp: 1551398273503
    },
    selectedDistance: 10,
    isSearchBarVisible: false,
    isSliderLocationVisible: false,
    searchBarValue: ''
}

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