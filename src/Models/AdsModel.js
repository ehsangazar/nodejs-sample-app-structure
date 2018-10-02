const database = require('../Configs/database')

const AdsCollection = database.addCollection('Ads');

class AdsModel {
  _validating = (data = {}) => {
    if (
      data.name &&
      data.logo >= 0 &&
      data.standingTime && 
      data.priority >= 0,
      data.price
    ){
      if (data.name && data.name != '' && data.name.length < 20){
        const checkForExistence = AdsCollection.find({ name: data.name });
        if (!checkForExistence || checkForExistence.length === 0) {  
          if (['short','medium','long'].includes(data.standingTime)){  
            if (data.priority === 0 || data.priority === 1) {              
              if (data.logo === 0 || data.logo === 1){

                if (data.price < 0) return 'price is not valid'
                
                return false
              }else {
                return 'logo is not valid'
              }
            }else {
              return 'priority is not valid'
            }
          }else {
            return 'standingTime is not valid'
          }
        }else {
          return 'Name exists in the db'
        }
      }else {
        return 'name is not valid'
      }
    }else {
      return 'data is not valid'
    }
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