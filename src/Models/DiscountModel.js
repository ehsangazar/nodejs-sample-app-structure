const database = require('../Configs/database')
const AdsModel = require('./AdsModel')

const DiscountCollection = database.addCollection('Discount');

class DiscountModel {
  _validating = (data = {}) => {
    if (
      data.name 
      && data.type 
      && data.adsName
      && (
        (data.type === 'more' && data.bought && data.willget) ||
        (data.type === 'reduce' && data.newPrice)
      )
    ){
      if (data.name && data.name != '' && data.name.length < 20){
        if (data.type === 'more' && typeof data.bought != 'number' ) 
          return 'bought is not valid'
        
        if (data.type === 'more' && typeof data.willget != 'number' ) 
          return 'willget is not valid'
          
        if (data.type === 'more' && data.bought >= data.willget ) 
          return 'willget should be bigger than bought'

        const checkForExistence = DiscountCollection.find({ name: data.name });
        if (!checkForExistence || checkForExistence.length === 0) {  

          const AdsObject = new AdsModel()
          const foundResult = AdsObject.find({name:data.adsName})
          if (foundResult.status === 'error'){
            return 'adsName is not valid'
          }else{
            return false
          }
        }else {
          return 'name exists in the db'
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


  find = (data) => {
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
}

module.exports = DiscountModel