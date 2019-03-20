import ActionTypes from '../actions'
import { parseToArrayWithId } from '../helpers'

export const bridgeReducer = (state: any = [], action: any) => {
  console.log('bridgeReducer', action)
  switch (action.type) {
    case ActionTypes.FETCH_BRIDGES_SUCCESS:
      const keys = Object.keys(action.payload)
      const bridges = keys.map((key) => {
        const bridge = action.payload[key]
        bridge.id = key
        bridge.events = parseToArrayWithId(bridge.events)
        return { ...bridge }
      })
      return bridges
    case ActionTypes.CLEAR_BRIDGES:
      return []
    case ActionTypes.ADD_BRIDGE_STATUS_THRESHOLD:
      return [...removeItem(state, action.payload.bridge),
      { ...action.payload.bridge, statusThreshold: action.payload.statusThreshold }]
    default:
      return state
  }
}

function removeItem(array: [], action: any) {
  return array.filter((item: any) => item.id !== action.id)
}
