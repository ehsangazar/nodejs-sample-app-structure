const database = require('../Configs/database')

const ClientsCollection = database.addCollection('Clients');

class ClientModel {
  _validating = (data = {}) => {
    if (data.name && data.name != '' && data.name.length < 20){
      const checkForExistence = ClientsCollection.find({ name: data.name });
      if (!checkForExistence || checkForExistence.length === 0) {
        return false
      }else {
        return 'Name exists in the db'
      }
    }else {
      return 'Name is not valid'
    }
  }

  create = (data) => {
    const error = this._validating(data)
    if (!error){
      ClientsCollection.insert({
        name: data.name
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
    const foundItem = ClientsCollection.find({ name: data.name });
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

module.exports = ClientModel