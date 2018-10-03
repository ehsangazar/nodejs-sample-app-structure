const AdsModel = require('../Models/AdsModel')
const ClientModel = require('../Models/ClientModel')
const DiscountModel = require('../Models/DiscountModel')
const CheckoutModel = require('../Models/CheckoutModel')
const ClientDiscountModel = require('../Models/ClientDiscountModel')

class Checkout {
  constructor(){
    this.AdsObject = new AdsModel()
    this.ClientObject = new ClientModel()
    this.DiscountObject = new DiscountModel()    
    this.CheckoutObject = new CheckoutModel()    
    this.ClientDiscountObject = new ClientDiscountModel()    
  }

  new = (pricingRule = {}) => {
    let res = { status: 'ok'}
    res = this._createAds(pricingRule.ads)
    
    if (res.status !== 'error')
      res = this._createClients(pricingRule.clients)

    if (res.status !== 'error')  
      res = this._createDiscounts(pricingRule.discounts)

    if (res.status !== 'error')  
      res = this._createClientDiscount(pricingRule.clientDiscount)

    return res
  }

  _createAds = (ads = []) => {
    this.AdsObject.flush()
    let status = 'ok'
    for ( let i = 0 ; i < ads.length ; i +=1 ){
      let res = this.AdsObject.create(ads[i])
      if (res.status != 'ok')
        return {
          status: 'error',
          error: 'an error happend in creating one of the ads',
          additionalError: res.error
        }
    }
    return {
      status: 'ok'  
    }
  }

  _createClients = (clients = []) => {
    this.ClientObject.flush()
    let status = 'ok'
    for ( let i = 0 ; i < clients.length ; i +=1 ){
      let res = this.ClientObject.create({name:clients[i]})
      if (res.status != 'ok')
        return {
          status: 'error',
          error: 'an error happend in creating one of the clients',
          additionalError: res.error
        }
    }
    return {
      status: 'ok'  
    }
  }
  
  _createDiscounts = (discounts = []) => {    
    let status = 'ok'
    for ( let i = 0 ; i < discounts.length ; i +=1 ){
      let res = this.DiscountObject.create(discounts[i])
      if (res.status != 'ok')
        return {
          status: 'error',
          error: 'an error happend in creating one of the discounts',
          additionalError: res.error
        }
    }
    return {
      status: 'ok'  
    }
  }

  _createClientDiscount = (clientDiscount = []) => {
    this.ClientDiscountObject.flush()
    let status = 'ok'
    for ( let i = 0 ; i < clientDiscount.length ; i +=1 ){
      let res = this.ClientDiscountObject.create(clientDiscount[i])
      if (res.status != 'ok')
        return {
          status: 'error',
          error: 'an error happend in creating one of the clientDiscount',
          additionalError: res.error
        }
    }
    return {
      status: 'ok'  
    }
  }

  addItem = (data = {}) => {
    if (!data.clientName) return 'clientName is not defined'
    if (!data.item) return 'item is not defined'
    
    const res = this.CheckoutObject.create({
      clientName: data.clientName,
      item: data.item
    })
    if (res.status === 'error')
      return res

    return {
      status: 'ok'  
    }
  }

  getTotal = (data = {}) => {
    if (!data.clientName) return {
      status: 'error',
      error: 'client does not exist'
    }

    const resClientObject = this.ClientObject.find({name:data.clientName})
    if (resClientObject.status === 'error') 
      return {
        status: 'error',
        error: 'this client does not exist'
      }
    const checkouts = this.CheckoutObject.list({clientName:data.clientName})
    const resOfClientDiscount = this.ClientDiscountObject.find({
      clientName: data.clientName
    })

    let discountNames = []
    if (resOfClientDiscount.status === 'ok')
      if (resOfClientDiscount.clientDiscount && resOfClientDiscount.clientDiscount.discountNames.length > 0){
        discountNames = resOfClientDiscount.clientDiscount.discountNames
      }
    
    let discountDetails = []
    if (discountNames.length > 0) {
      for (let i = 0; i < discountNames.length; i += 1) {
        const disResponse = this.DiscountObject.find({name: discountNames[i]})
        if (disResponse.status === 'ok') {
          discountDetails.push(disResponse.discount)
        }
      }
    }
    let realCheckoutItems = []

    for (let i = 0 ; i < checkouts.items.length ; i += 1){
      let adsRes = this.AdsObject.find({name: checkouts.items[i].item})
      if (adsRes.status === 'ok'){
        let realPrice = adsRes.ads.price
        let type = []
        // check for discounts
        for (let j = 0; j < discountDetails.length; j += 1) {
          if (discountDetails[j].adsName === checkouts.items[i].item){
            if (discountDetails[j].type === 'reduce'){
              realPrice = discountDetails[j].newPrice
              type.push('reduce')
            }else if (discountDetails[j].type === 'more'){
              if (!discountDetails[j].currentBought)
                discountDetails[j].currentBought = 0
                
              discountDetails[j].currentBought += 1
              
              if ( discountDetails[j].currentBought === discountDetails[j].bought){
                discountDetails[j].currentBought = 0
                for (let k = 0; k < discountDetails[j].willget - discountDetails[j].bought; k += 1) {
                  realCheckoutItems.push({
                    name: checkouts.items[i].item,
                    type: type.push('more'),
                    price: 0
                  })
                }
              }
            }
          }
        }
        realCheckoutItems.push({
          name: checkouts.items[i].item,
          type: type,
          price: realPrice
        })
      }
    }
    
    let total = 0
    total = realCheckoutItems.reduce((oldResult = 0, newItem) => {
      return Number(oldResult) + Number(newItem.price)
    }, 0)

    return {
      status: 'ok',
      total: total
    }

  }

}

module.exports = Checkout