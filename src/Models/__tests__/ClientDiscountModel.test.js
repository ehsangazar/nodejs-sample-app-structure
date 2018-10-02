
const expect = require('chai').expect;
const ClientDiscount = require('../ClientDiscountModel')
const AdsModel = require('../AdsModel')
const ClientModel = require('../ClientModel')
const DiscountModel = require('../DiscountModel')

describe('ClientDiscount', () => {
  it('should work to create a new class', () => {
    const ClientDiscountObject = new ClientDiscount()
    expect(ClientDiscountObject).to.be.an('object')
  });
  it('should not work to create a new entry, not enough data', () => {
    const ClientDiscountObject = new ClientDiscount()
    const res = ClientDiscountObject.create()
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not enough')
  });
  it('should not work to create a new entry, discountNames is not an array', () => {
    const ClientObject = new ClientModel()
    ClientObject.create({name:'DefaultClientNoDiscount'})
    
    const ClientDiscountObject = new ClientDiscount()
    const res = ClientDiscountObject.create({clientName:'DefaultClientNoDiscount', discountNames: 'notArray'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('discountNames is not array')
  });
  it('should not work to create a new entry, discountNames does not exist', () => {
    const ClientObject = new ClientModel()
    ClientObject.create({name:'DefaultClientNoDiscount'})
    
    const ClientDiscountObject = new ClientDiscount()
    const res = ClientDiscountObject.create({clientName:'DefaultClientNoDiscount', discountNames: ['discountDoesnotExist']})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('discountNames does not exist')
  });
  it('should work fine', () => {
    const AdsObject = new AdsModel()
    AdsObject.create({name:'classic', standingTime: 'short', logo: 0, priority: 0, price: 1})

    const ClientObject = new ClientModel()
    ClientObject.create({name:'DefaultNewClient'})

    const DiscountObject = new DiscountModel()
    DiscountObject.create({name:'DefaultDiscount', type:'more', adsName: 'classic', bought:2, willget:3})

    const ClientDiscountObject = new ClientDiscount()
    const res = ClientDiscountObject.create({clientName:'DefaultNewClient', discountNames:['DefaultDiscount']})
    expect(res.status).to.equal('ok')
  });
  it('should not work fine because client does not exit', () => {
    const ClientDiscountObject = new ClientDiscount()
    const res = ClientDiscountObject.create({clientName:'notExistedClient', discountNames:['DefaultDiscount']})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('client is not valid')
  });
  it('should not work because it is repeated', () => {
    const AdsObject = new AdsModel()
    AdsObject.create({name:'classic', standingTime: 'short', logo: 0, priority: 0, price: 1})

    const ClientObject = new ClientModel()
    ClientObject.create({name:'ClientRepeated'})

    const DiscountObject = new DiscountModel()
    DiscountObject.create({name:'DiscountRepeated', type:'more', adsName: 'classic', bought:2, willget:3})

    const ClientDiscountObject = new ClientDiscount()
    const temp = ClientDiscountObject.create({clientName:'ClientRepeated', discountNames:['DiscountRepeated']})
    const res = ClientDiscountObject.create({clientName:'ClientRepeated', discountNames:['DiscountRepeated']})

    expect(res.status).to.equal('error')
    expect(res.error).to.equal('ClientDiscount already exists')
  });
  it('should not work if could not find any', () => {
    const ClientDiscountObject = new ClientDiscount()
    const res = ClientDiscountObject.find({clientName:'noClientDiscount'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('no entry found')
  });
  it('should work if could find any', () => {
    const AdsObject = new AdsModel()
    AdsObject.create({name:'classic', standingTime: 'short', logo: 0, priority: 0, price: 1})

    const ClientObject = new ClientModel()
    ClientObject.create({name:'findClient'})

    const DiscountObject = new DiscountModel()
    DiscountObject.create({name:'DefaultDiscount', type:'more', adsName: 'classic', bought:2, willget:3})

    const ClientDiscountObject = new ClientDiscount()
    ClientDiscountObject.create({clientName:'findClient', discountNames:['DefaultDiscount']})

    const res = ClientDiscountObject.find({clientName:'findClient'})
    expect(res.status).to.equal('ok')
  });
});