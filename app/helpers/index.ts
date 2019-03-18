import { GeolocationReturnType } from 'store/user'
import { BridgeGeoLocation, Bridge } from 'store/bridge'

/**
 * @param {*} obj
 * @description parse a object list to an array, create id property with list-key
 * @example turns
 * {"XlH_NcT9Jl2K": ...obj }
 * ["id": "XlH_NcT9Jl2K", ...obj]
 */
export const parseToArrayWithId = (obj: any) => {
  if (obj) {
    return Object.keys(obj).map((key) => {
      return { ...obj[key], id: key }
    })
  }
  return []
}

export const capitalizeSentence = (sentence: string) => {
  return sentence.toLowerCase().split(' ').map((a) => { a.charAt(0).toUpperCase().concat(a.substr(1)) }).join(' ')
}

const distance = (loc1: BridgeGeoLocation, loc2: GeolocationReturnType, unit: string) => {
  const lat1 = loc1.lat
  const lon1 = loc1.lng
  const lat2 = loc2.coords.latitude
  const lon2 = loc2.coords.longitude
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0
  }
  const radlat1 = Math.PI * lat1 / 180
  const radlat2 = Math.PI * lat2 / 180
  const theta = lon1 - lon2
  const radtheta = Math.PI * theta / 180
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
  if (dist > 1) {
    dist = 1
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit === 'K') { dist = dist * 1.609344 }
  if (unit === 'N') { dist = dist * 0.8684 }
  return dist
}

const isNearby = (bridge: Bridge, loc2: GeolocationReturnType, definedDistance: number, unit: string) => {
  const distanceBetween = distance(bridge.geo, loc2, unit)
  bridge.distance = distanceBetween
  return distanceBetween <= definedDistance
}

export const filterNameAndLocation = (
  bridge: Bridge,
  nameContains: string,
  fromLocation: GeolocationReturnType,
  nearbyDistance: number,
  unit?: string
) => {
  if (nameContains && bridge.name.toUpperCase().indexOf(nameContains.toUpperCase()) === -1) {
    return false
  }
  if (fromLocation && nearbyDistance && !isNearby(bridge, fromLocation, nearbyDistance, unit)) {
    return false
  }
  return true
}
