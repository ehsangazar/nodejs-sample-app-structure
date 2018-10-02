const { expect } = require('chai');
const CheckoutModel = require('../CheckoutModel');
const ClientModel = require('../ClientModel');
const AdsModel = require('../AdsModel');

describe('CheckoutModel', () => {
  it('should work to create a new class', () => {
    const CheckoutObject = new CheckoutModel();
    expect(CheckoutObject).to.be.an('object');
  });
  it('should not because data is not enough', () => {
    const CheckoutObject = new CheckoutModel();
    const res = CheckoutObject.create();
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('data is not enough');
  });
  it('should not because clientName does not exist', () => {
    const CheckoutObject = new CheckoutModel();
    const res = CheckoutObject.create({ clientName: 'randomNotExist', item: 'randomItem' });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('clientName does not exist');
  });
  it('should not because item does not exist', () => {
    const CheckoutObject = new CheckoutModel();

    const ClientObject = new ClientModel();
    ClientObject.create({ name: 'clientTest' });

    const res = CheckoutObject.create({ clientName: 'clientTest', item: 'random' });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('item does not exist');
  });
  it('should work because data is ok', () => {
    const CheckoutObject = new CheckoutModel();

    const ClientObject = new ClientModel();
    ClientObject.create({ name: 'clientTestItem' });

    const AdsObject = new AdsModel();
    AdsObject.create({
      name: 'ItemAds', standingTime: 'short', logo: 1, priority: 1, price: 1,
    });

    const res = CheckoutObject.create({ clientName: 'clientTestItem', item: 'ItemAds' });
    expect(res.status).to.equal('ok');
  });
  it('should not work to get list of ads because clientName does not exist', () => {
    const CheckoutObject = new CheckoutModel();

    const res = CheckoutObject.list({ clientName: 'randomClient' });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('clientName does not exist');
  });
  it('should work to list all items', () => {
    const CheckoutObject = new CheckoutModel();

    const ClientObject = new ClientModel();
    ClientObject.create({ name: 'clientList' });

    const AdsObject = new AdsModel();
    AdsObject.create({
      name: 'classicItem', standingTime: 'short', logo: 1, priority: 1, price: 1,
    });

    CheckoutObject.create({ clientName: 'clientList', item: 'classicItem' });
    CheckoutObject.create({ clientName: 'clientList', item: 'classicItem' });

    const res = CheckoutObject.list({ clientName: 'clientList' });
    expect(res.status).to.equal('ok');
    expect(res.items.length).to.equal(2);
  });
  it('flush should work', () => {
    const CheckoutObject = new CheckoutModel();

    const ClientObject = new ClientModel();
    ClientObject.create({ name: 'clientList' });

    const AdsObject = new AdsModel();
    AdsObject.create({
      name: 'classicItem', standingTime: 'short', logo: 1, priority: 1, price: 1,
    });

    CheckoutObject.create({ clientName: 'clientList', item: 'classicItem' });
    CheckoutObject.flush();

    const res = CheckoutObject.list({ clientName: 'clientList' });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('no entry found');
  });
});
