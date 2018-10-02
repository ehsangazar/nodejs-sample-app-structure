const database = require('../Configs/database')

const ClientDiscountsCollection = database.addCollection('ClientDiscounts');
const DiscountModel = require('./DiscountModel')
const ClientModel = require('./ClientModel')

class ClientDiscount {
  _validating = (data = {}) => {
    if (
      typeof data.clientName === "undefined" ||
      typeof data.discountNames === "undefined"
    ) 
      return 'data is not enough'
    
    if (typeof data.discountNames != 'object' ) 
      return 'discountNames is not array'
    
    for (let i = 0 ; i < data.discountNames.length ; i += 1){
      const DiscountObject = new DiscountModel()
      const checkForExistenceOfDiscounts = DiscountObject.find({ name: data.discountNames[i] });
      if (checkForExistenceOfDiscounts.status === 'error') 
        return 'discountNames does not exist'
    }

    const ClientObject = new ClientModel()
    const checkForExistenceOfClient = ClientObject.find({ name: data.clientName });
    if (checkForExistenceOfClient.status === 'error') 
      return 'client is not valid'

    const checkForExistenceOfClientDiscount = ClientDiscountsCollection.find({ clientName: data.clientName });
    if (checkForExistenceOfClientDiscount && checkForExistenceOfClientDiscount.length > 0) 
      return 'ClientDiscount already exists'

    return false
  }

  create = (data) => {
    const error = this._validating(data)
    if (!error){
      ClientDiscountsCollection.insert({
        clientName: data.clientName,
        discountNames: data.discountNames
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
    const foundItem = ClientDiscountsCollection.find({ clientName: data.clientName });
    if (!foundItem || foundItem.length === 0) {
      return {
        status: 'error',
        error: 'no entry found'
      }
    }else {
      return {
        status: 'ok',
        client: foundItem[0]
      }
    }
  }
}

module.exports = ClientDiscount