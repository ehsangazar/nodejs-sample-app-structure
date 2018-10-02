const database = require('../Configs/database')

const CheckoutCollection = database.addCollection('Checkout');
const ClientModel = require('./ClientModel')
const AdsModel = require('./AdsModel')

class CheckoutModel {
  _validating = (data = {}) => {
    if (
      typeof data.clientName === "undefined" ||
      typeof data.item === "undefined"
    ) 
      return 'data is not enough'

    const ClientObject = new ClientModel()
    const checkForExistenceOfClient = ClientObject.find({ name: data.clientName });
    if (checkForExistenceOfClient.status === 'error') 
      return 'clientName does not exist'

    const AdsObject = new AdsModel()
    const checkForExistenceOfAds = AdsObject.find({ name: data.item });
    if (checkForExistenceOfAds.status === 'error') 
      return 'item does not exist'

    return false
  }

  create = (data) => {
    const error = this._validating(data)
    if (!error){
      CheckoutCollection.insert({
        clientName: data.clientName,
        item: data.item
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


  list = (data = {}) => {
    if (!data.clientName) 
      return {
        status: 'error',
        error: 'no entry found'
      }
    
    const ClientObject = new ClientModel()
    const checkForExistenceOfClient = ClientObject.find({ name: data.clientName });
    if (checkForExistenceOfClient.status === 'error') 
      return {
        status: 'error',
        error: 'clientName does not exist'
      }      
      
    const foundItem = CheckoutCollection.find({ clientName: data.clientName });
    if (!foundItem || foundItem.length === 0) {
      return {
        status: 'error',
        error: 'no entry found'
      }
    }else {
      return {
        status: 'ok',
        items: foundItem
      }
    }
  }

  flush = () => {
    CheckoutCollection.chain().remove()
  }
}

module.exports = CheckoutModel