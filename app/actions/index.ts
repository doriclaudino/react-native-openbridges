import firebase from 'react-native-firebase'
import ActionTypes from './ActionTypes'
import { Bridge, IEvent, IStatus } from 'store/bridge'
import { GeolocationReturnType } from 'store/user'
export default ActionTypes

const fetchUISuccess = (payload: any) => ({
  payload,
  type: ActionTypes.FETCH_UI_SUCCESS,
})

const fetchBridgesSuccess = (payload: any) => ({
  payload,
  type: ActionTypes.FETCH_BRIDGES_SUCCESS,
})

export const setCurrentUserLocation = (currentUserLocation: GeolocationReturnType) => async () => {
  try {
    const { currentUser } = firebase.auth()

    if (currentUser && currentUserLocation) {
      firebase.database()
        .ref(`ui/${currentUser.uid}/currentUserLocation`)
        .set(currentUserLocation)
    }
  } catch (error) {
    console.error(error)
  }
}

export const addBridgeStatusThreshold = (bridge: Bridge, statusThreshold: number) => async () => {
  try {
    firebase.database()
      .ref(`bridges/${bridge.id}/statusThreshold`)
      .set(statusThreshold)
  } catch (error) {
    console.error(error)
  }
}

export const delBridgeEvent = (bridge: Bridge, event: IEvent) => async () => {
  try {
    firebase.database().ref(`bridges/${bridge.id}/events/${event.id}`).remove()
  } catch (error) {
    console.error(error)
  }
}

export const addBridgeEvent = (bridge: Bridge, event: IStatus) => async () => {
  try {
    firebase.database().ref(`bridges/${bridge.id}/events`).push(event)
  } catch (error) {
    console.error(error)
  }
}

export const fetchbridges = () => async (dispatch: any) => {
  try {
    const bridgeRef = firebase.database().ref('bridges')
    bridgeRef.off('value')
    bridgeRef.on('value', (snapshot) => {
      try {
        dispatch(fetchBridgesSuccess(snapshot.val()))
      } catch (error) {
        console.log(error.message)
      }
    })
  } catch (error) {
    console.error(error)
    dispatch(clearBridges())
  }
}

export const clearBridges = () => ({
  type: ActionTypes.CLEAR_BRIDGES,
})

export const fetchOrCreateUI = () => async (dispatch: any) => {
  try {
    const { currentUser } = firebase.auth()
    if (currentUser) {
      const userUiRef = firebase.database().ref(`ui/${currentUser.uid}`)
      userUiRef.off('value')
      userUiRef.on('value', (snapshot) => {
        if (firebase.auth().currentUser) {
          if (!snapshot.exists()) {
            userUiRef.set(defaultUISchema)
          } else {
            dispatch(fetchUISuccess(snapshot.val()))
          }
        } else {
          firebase.database().ref(`ui/${snapshot.key}`).off('value')
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

const defaultUISchema = {
  currentUserLocation: {
    coords: {
      latitude: 42.4115301,
      longitude: -71.0649686,
    },
    mocked: true,
    timestamp: 1551398273503,
  },
  selectedDistance: 10,
  isSearchBarVisible: false,
  isSliderLocationVisible: false,
  searchBarValue: '',
}

export const updatedSelectDistance = (selectedDistance: number) => async () => {
  try {
    const { currentUser } = firebase.auth()
    if (currentUser) {
      const distanceRef = firebase.database().ref(`ui/${currentUser.uid}/selectedDistance`)
      distanceRef.set(selectedDistance)
    }
  } catch (error) {
    console.error(error)
  }
}

export const updateSearchBarValue = (text: string) => async () => {
  try {
    const { currentUser } = firebase.auth()
    if (currentUser) {
      const distanceRef = firebase.database().ref(`ui/${currentUser.uid}/searchBarValue`)
      distanceRef.set(text)
    }
  } catch (error) {
    console.error(error)
  }
}
