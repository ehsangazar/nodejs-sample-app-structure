const database = require('../Configs/database')

const ClientsCollection = database.addCollection('Clients');

class ClientModel {
  _validating = (data = {}) => {
    if (
      typeof data.name === "undefined"
    ) 
      return 'name is not valid'

    if (data.name === '' || data.name.length >= 20) 
      return 'name is not valid'

    const checkForExistence = ClientsCollection.find({ name: data.name });
    if (checkForExistence && checkForExistence.length > 0) 
      return 'name exists in the db'

    return false
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


  find = (data = {}) => {
    if (!data.name) 
      return {
        status: 'error',
        error: 'no entry found'
      }
      
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

  flush = () => {
    ClientsCollection.chain().remove()
  }
}

module.exports = ClientModel