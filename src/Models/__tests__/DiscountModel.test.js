
const expect = require('chai').expect;
const DiscountModel = require('../DiscountModel')
const AdsModel = require('../AdsModel')

const _creatingDefaultAds = () => {
  const AdsObject = new AdsModel()
  AdsObject.create({name:'classic', standingTime: 'short', logo: 0, priority: 0})
}

describe('DiscountModel', () => {
  it('should work to create a new class', () => {
    const DiscountObject = new DiscountModel()
    expect(DiscountObject).to.be.an('object')
  });
  it('should not work because data is not enough', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'Test'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should not work because data does not have a name', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({type:'reduce', adsName: 'classic', newPrice: 10000})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should not work because data for type reduce is not enough', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'ReduceIsNotEnough', type:'reduce', adsName: 'classic'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should not work because data for type more is not enough', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'MoreIsNotEnough', type:'more', adsName: 'classic', willget:3})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should work because data is enough for reduce', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'ReduceIsEnough', type:'reduce', adsName: 'classic', newPrice: 10000})
    expect(res.status).to.equal('ok')
  });
  it('should work because data is enough for more', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'MoreIsEnough', type:'more', adsName: 'classic', bought:2, willget:3})
    expect(res.status).to.equal('ok')
  });
  it('should get an error to create a repeated Entry', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    DiscountObject.create({name:'RepeatedTesting', type:'more', adsName: 'classic', bought:2, willget:3})
    const resSecond = DiscountObject.create({name:'RepeatedTesting', type:'more', adsName: 'classic', bought:2, willget:3})
    expect(resSecond.status).to.equal('error')
    expect(resSecond.error).to.equal('name exists in the db')
  });
  it('should get an error if name is longer than 20 characters', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'ABCDEFGHIJKLMNOPLMOJK', type:'more', adsName: 'classic', bought:2, willget:3})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('name is not valid')
  });
  it('should get an error if type is not valid', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'TypeNotValid', type:'less', adsName: 'classic', bought:2, willget:3})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should get an error if adsName is not valid', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'AdsNameNotValid', type:'more', adsName: 'classicThatDoesntExist', bought:2, willget:3})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('adsName is not valid')
  });
  it('should get an error if bought is not valid', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'boughtNotValid', type:'more', adsName: 'classic', bought:'S', willget:3})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('bought is not valid')
  });
  it('should get an error if willget is not valid', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'WillgetNotValid', type:'more', adsName: 'classic', bought:2, willget:'S'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('willget is not valid')
  });
  it('should get an error if willget is not bigger than bought', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.create({name:'willGetBigger', type:'more', adsName: 'classic', bought:2, willget:1})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('willget should be bigger than bought')
  });
  it('should work if could not find any', () => {
    const DiscountObject = new DiscountModel()
    const res = DiscountObject.find({name:'NoEntryFound'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('no entry found')
  });
  it('should work if could find the entry', () => {
    _creatingDefaultAds()
    const DiscountObject = new DiscountModel()
    DiscountObject.create({name:'findQuery', type:'more', adsName: 'classic', bought:2, willget:3})
    const res = DiscountObject.find({name:'findQuery'})
    expect(res.status).to.equal('ok')
    expect(res.discount.name).to.equal('findQuery')
  });
});