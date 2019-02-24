
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