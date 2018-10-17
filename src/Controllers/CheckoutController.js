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

    // Calculating the price withoutDiscount
    let checkoutItems = []
    for (let i = 0 ; i < checkouts.items.length ; i += 1){
      let thisAd = this.AdsObject.find({name: checkouts.items[i].item})
      if (thisAd.status === 'ok'){
        checkoutItems.push({
          clientName: checkouts.items[i].clientName,
          item: checkouts.items[i].item,
          ads: thisAd.ads
        })
      }
    }

    discountDetails.forEach(discountItem => {
      if (discountItem.type === 'reduce'){
        checkoutItems.map(checkout => {
          if (checkout.item === discountItem.adsName){
            checkout.ads.price = discountItem.newPrice
            return checkout
          }
        })
      }
      
      let freeCheckout = {}
      if (discountItem.type === 'more'){
        let bought = 0;
        checkoutItems.map(checkout => {
          if (checkout.item === discountItem.adsName){
            bought++
            freeCheckout = checkout           
            return checkout
          }
        })
        const dividedNumber = parseInt(bought / discountItem.bought)
        if (dividedNumber >= 1){
          const differenceNumber = discountItem.willget - discountItem.bought
          for (let d = 0; d < dividedNumber*differenceNumber; d++) {
            checkoutItems.push({
              clientName: freeCheckout.clientName,
              item: freeCheckout.item,
              ads: {
                price: 0
              }
            })
          }
        }
      }


      if (discountItem.type === 'reduceLimtiedItems'){
        let bought = 0;
        checkoutItems.map(checkout => {
          if (checkout.item === discountItem.adsName){
            bought++
            freeCheckout = checkout           
            return checkout
          }
        })
        if (bought >= discountItem.limitedPurchased){
          checkoutItems.map(itemRLI => {
            if (itemRLI.item === discountItem.adsName){
              itemRLI.ads.price = discountItem.newPrice
            }
            return itemRLI
          })
        }
      }
    })

    let total = 0
    total = checkoutItems.reduce((oldResult = 0, newItem) => {
      return Number(oldResult) + Number(newItem.ads.price)
    }, 0)

    return {
      status: 'ok',
      total: total
    }

  }

}

module.exports = Checkout