const database = require('../Configs/database')

const AdsCollection = database.addCollection('Ads');

class AdsModel {
  _validating = (data = {}) => {
    if (
      typeof data.name === "undefined" || 
      typeof data.logo === "undefined" || 
      typeof data.standingTime === "undefined" || 
      typeof data.priority === "undefined" || 
      typeof data.price === "undefined"
    ) 
      return 'data is not valid'

    if (data.name === '' || data.name.length >= 20) 
      return 'name is not valid'

    const checkForExistence = AdsCollection.find({ name: data.name });
    if (checkForExistence && checkForExistence.length > 0) 
      return 'name exists in the db'
      
    if (!['short','medium','long'].includes(data.standingTime)) 
      return 'standingTime is not valid'

    if (data.priority !== 0 && data.priority !== 1)           
      return 'priority is not valid'
    
    if (data.logo !== 0 && data.logo !== 1)
      return 'logo is not valid'

    if (data.price < 0) 
      return 'price is not valid'

    return false
  }

  create = (data) => {
    const error = this._validating(data)
    if (!error){
      AdsCollection.insert({
        name: data.name,
        standingTime: data.standingTime,
        priority: data.priority,
        logo: data.logo,
        price: data.price
      })
      return {
        status: 'ok'
      }
    }else {
      return {
        status: 'error',
        error
      }
    }
  }


  find = (data) => {
    const foundItem = AdsCollection.find({ name: data.name });
    if (!foundItem || foundItem.length === 0) {
      return {
        status: 'error',
        error: 'no entry found'
      }
    }else {
      return {
        status: 'ok',
        ads: foundItem[0]
      }
    }
  }
}

module.exports = AdsModel