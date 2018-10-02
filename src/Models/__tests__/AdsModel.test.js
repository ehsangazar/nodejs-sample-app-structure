
const expect = require('chai').expect;
const AdsModel = require('../AdsModel')

describe('AdsModel', () => {
  it('should work to create a new class', () => {
    const AdsObject = new AdsModel()
    expect(AdsObject).to.be.an('object')
  });
  it('should not work because data is not enough', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'Test'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should work because data is enough', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'Test', standingTime: 'short', logo: 0, priority: 0, price: 1})
    expect(res.status).to.equal('ok')
  });
  it('should get an error to create a repeated Entry', () => {
    const AdsObject = new AdsModel()
    AdsObject.create({name:'TestRepeated', standingTime: 'short', logo: 0, priority: 0, price: 1})
    const resSecond = AdsObject.create({name:'TestRepeated', standingTime: 'short', logo: 0, priority: 0, price: 1})
    expect(resSecond.status).to.equal('error')
    expect(resSecond.error).to.equal('name exists in the db')
  });
  it('should get an error if name is not defiend', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create()
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('data is not valid')
  });
  it('should get an error if name is longer than 20 characters', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'ABCDEFGHIJKLMNOPLMOJK', standingTime: 'short', logo: 0, priority: 0, price: 1})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('name is not valid')
  });
  it('should get an error if standingTime is not valid', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'validName', standingTime: 'notValid', logo: 0, priority: 0, price: 1})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('standingTime is not valid')
  });
  it('should get an error if logo is not valid', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'validName', standingTime: 'short', logo: 2, priority: 0, price: 1})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('logo is not valid')
  });
  it('should get an error if priority is not valid', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'validName', standingTime: 'short', logo: 1, priority: 3, price: 1})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('priority is not valid')
  });
  it('should work to find an entry', () => {
    const AdsObject = new AdsModel()
    AdsObject.create({name:'FindingTest', standingTime: 'short', logo: 1, priority: 1, price: 1})
    const resSecond = AdsObject.find({name:'FindingTest'})
    expect(resSecond.status).to.equal('ok')
    expect(resSecond.ads.name).to.equal('FindingTest')
  });
  it('should work if could not find any', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.find({name:'NoEntryFound'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('no entry found')
  });
  it('should get an error if price is not valid', () => {
    const AdsObject = new AdsModel()
    const res = AdsObject.create({name:'validName', standingTime: 'short', logo: 1, priority: 1, price: -3})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('price is not valid')
  });
});