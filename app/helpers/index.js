
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

