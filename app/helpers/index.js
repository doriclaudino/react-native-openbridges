
/**
 * 
 * @param {*} obj 
 * @description parse a object list to an array, create id property with list-key
 * @example turns
 * {"XlH_NcT9Jl2K": ...obj }
 * ["id": "XlH_NcT9Jl2K", ...obj]
 *  
 */
export const parseToArrayWithId = (obj) => {
  if (obj)
    return Object.keys(obj)
      .map(key => {
        return { ...obj[key], id: key }
      })
  else
    return []
}

export const capitalizeSentence = (sentence) => {
  return sentence.toLowerCase().split(' ').map((a) => a.charAt(0).toUpperCase() + a.substr(1)).join(' ')
}

const distance = (loc1, loc2, unit) => {
  let lat1 = loc1.lat, lon1 = loc1.lng, lat2 = loc2.coords.latitude, lon2 = loc2.coords.longitude
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist;
  }
}

const isNearby = (loc1, loc2, definedDistance, unit) => {
  let distanceBetween = distance(loc1, loc2, unit)
  return distanceBetween <= definedDistance
}

export const filterNameAndLocation = (bridge, nameContains: string, fromLocation, nearbyDistance, unit) => {
  if (nameContains && bridge.name.toUpperCase().indexOf(nameContains.toUpperCase()) === -1)
    return false
  if (fromLocation && nearbyDistance && !isNearby(bridge.geo, fromLocation, nearbyDistance, unit))
    return false
  return true
}