const database = require('../Configs/database')
const AdsModel = require('./AdsModel')

const DiscountCollection = database.addCollection('Discount');

class DiscountModel {
  _validating = (data = {}) => {
    if (
      typeof data.name === "undefined" || 
      typeof data.type === "undefined" || 
      typeof data.adsName === "undefined"
    ) 
      return 'data is not valid'

    if (!['more','reduce', 'reduceLimtiedItems'].includes(data.type))
      return 'type is not valid'

    if (data.type === 'more' && (
      typeof data.bought === "undefined" || 
      typeof data.willget === "undefined"
    )) return 'data is not valid'


    if (data.type === 'reduce' && (
      typeof data.newPrice === "undefined"
    )) return 'data is not valid'

    if (data.type === 'reduceLimtiedItems' && (
      typeof data.newPrice === "undefined",
      typeof data.limitedPurchased === "undefined"
    )) return 'data is not valid'

    if (data.name === '' || data.name.length >= 40) 
      return 'name is not valid'
    
    if (data.type === 'more' && typeof data.bought != 'number' ) 
      return 'bought is not valid'
        
    if (data.type === 'more' && typeof data.willget != 'number' ) 
      return 'willget is not valid'
          
    if (data.type === 'more' && data.bought >= data.willget ) 
      return 'willget should be bigger than bought'

    const checkForExistence = DiscountCollection.find({ name: data.name });
    if (checkForExistence && checkForExistence.length > 0)  
      return 'name exists in the db'
    
    
    const AdsObject = new AdsModel()
    const foundResult = AdsObject.find({name:data.adsName})
    if (foundResult.status === 'error')
      return 'adsname is not valid'
          
    return false
  }

  create = (data) => {
    const error = this._validating(data)
    if (!error){
      if (data.type === 'reduce') {
        DiscountCollection.insert({
          name: data.name,
          type: data.type,
          adsName: data.adsName,
          newPrice: data.newPrice
        })
      }else if (data.type === 'more'){
        DiscountCollection.insert({
          name: data.name,
          type: data.type,
          bought: data.bought,
          willget: data.willget,
          adsName: data.adsName
        })
      }else if (data.type === 'reduceLimtiedItems') {
        DiscountCollection.insert({
          name: data.name,
          type: data.type,
          adsName: data.adsName,
          newPrice: data.newPrice,
          limitedPurchased: data.limitedPurchased
        })
      }
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


  find = (data = {}) => {
    if (!data.name) 
      return {
        status: 'error',
        error: 'no entry found'
      }

    const foundItem = DiscountCollection.find({ name: data.name });
    if (!foundItem || foundItem.length === 0) {
      return {
        status: 'error',
        error: 'no entry found'
      }
    }else {
      return {
        status: 'ok',
        discount: foundItem[0]
      }
    }
  }

  flush = () => {
    DiscountCollection.chain().remove()
  }
}

module.exports = DiscountModel