
const expect = require('chai').expect;
const ClientModel = require('../ClientModel')

describe('ClientModel', () => {
  it('should work to create a new class', () => {
    const ClientObject = new ClientModel()
    expect(ClientObject).to.be.an('object')
  });
  it('should work to create a new entry', () => {
    const ClientObject = new ClientModel()
    const res = ClientObject.create({name:'Test'})
    expect(res.status).to.equal('ok')
  });
  it('should get an error to create a repeated Entry', () => {
    const ClientObject = new ClientModel()
    ClientObject.create({name:'TestRepeated'})
    const resSecond = ClientObject.create({name:'TestRepeated'})
    expect(resSecond.status).to.equal('error')
    expect(resSecond.error).to.equal('Name exists in the db')
  });
  it('should get an error if name is not defiend', () => {
    const ClientObject = new ClientModel()
    const res = ClientObject.create()
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('Name is not valid')
  });
  it('should get an error if name is longer than 20 characters', () => {
    const ClientObject = new ClientModel()
    const res = ClientObject.create({name:'ABCDEFGHIJKLMNOPLMOJK'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('Name is not valid')
  });
  it('should work to find an entry', () => {
    const ClientObject = new ClientModel()
    ClientObject.create({name:'FindingTest'})
    const resSecond = ClientObject.find({name:'FindingTest'})
    expect(resSecond.status).to.equal('ok')
    expect(resSecond.client.name).to.equal('FindingTest')
  });
  it('should work if could not find any', () => {
    const ClientObject = new ClientModel()
    const res = ClientObject.find({name:'NoEntryFound'})
    expect(res.status).to.equal('error')
    expect(res.error).to.equal('no entry found')
  });
});