
const { expect } = require('chai');
const CheckoutController = require('../CheckoutController');
const CheckoutModel = require('../../Models/CheckoutModel');
const defaultPricingRule = require('../../Rules/defaultPricingRule');

describe('CheckoutController', () => {
  it('should work to create a new class', () => {
    const CheckoutControllerObject = new CheckoutController();
    expect(CheckoutControllerObject).to.be.an('object');
  });
  it('should new without problem for defaultPricingRule', () => {
    const CheckoutControllerObject = new CheckoutController();
    const res = CheckoutControllerObject.new(defaultPricingRule);
    expect(res.status).to.equal('ok');
  });
  it('should create ads without problem', () => {
    const CheckoutControllerObject = new CheckoutController();
    const res = CheckoutControllerObject._createAds(defaultPricingRule.ads);
    expect(res.status).to.equal('ok');
  });
  it('should create clients without problem', () => {
    const CheckoutControllerObject = new CheckoutController();
    const res = CheckoutControllerObject._createClients(defaultPricingRule.clients);
    expect(res.status).to.equal('ok');
  });
  it('should create discounts without problem', () => {
    const CheckoutControllerObject = new CheckoutController(defaultPricingRule.discounts);
    const res = CheckoutControllerObject._createDiscounts();
    expect(res.status).to.equal('ok');
  });
  it('should create clientDiscount without problem', () => {
    const CheckoutControllerObject = new CheckoutController();
    const res = CheckoutControllerObject._createClientDiscount(defaultPricingRule.clientDiscount);
    expect(res.status).to.equal('ok');
  });
  it('should add an item without problem', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    const res = CheckoutControllerObject.addItem({
      clientName: 'base',
      item: 'classic',
    });
    expect(res.status).to.equal('ok');
  });
  it('should throw and error because item does not exit', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    const res = CheckoutControllerObject.addItem({
      clientName: 'base',
      item: 'nonsense',
    });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('item does not exist');
  });
  it('should throw an error because client does not exist', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    const res = CheckoutControllerObject.addItem({
      clientName: 'noClient',
      item: 'classic',
    });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('clientName does not exist');
  });
  it('should return a right response of 987.97', () => {
    const CheckoutControllerObject = new CheckoutController();
    const CheckoutObject = new CheckoutModel();
    CheckoutObject.flush();
    CheckoutControllerObject.new(defaultPricingRule);
    CheckoutControllerObject.addItem({
      clientName: 'base',
      item: 'classic',
    });
    CheckoutControllerObject.addItem({
      clientName: 'base',
      item: 'standout',
    });
    CheckoutControllerObject.addItem({
      clientName: 'base',
      item: 'premium',
    });
    const res = CheckoutControllerObject.getTotal({ clientName: 'base' });
    expect(res.status).to.equal('ok');
    expect(res.total).to.equal(987.97);
  });
  it('should return a right response of 934.97', () => {
    const CheckoutControllerObject = new CheckoutController();
    const CheckoutObject = new CheckoutModel();
    CheckoutObject.flush();
    CheckoutControllerObject.new(defaultPricingRule);
    CheckoutControllerObject.addItem({
      clientName: 'secondBite',
      item: 'classic',
    });
    CheckoutControllerObject.addItem({
      clientName: 'secondBite',
      item: 'classic',
    });
    CheckoutControllerObject.addItem({
      clientName: 'secondBite',
      item: 'premium',
    });
    const res = CheckoutControllerObject.getTotal({ clientName: 'secondBite' });
    expect(res.status).to.equal('ok');
    expect(res.total).to.equal(934.97);
  });
  it('should return a right response of 1294.96', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    CheckoutControllerObject.addItem({
      clientName: 'axilCoffee',
      item: 'standout',
    });
    CheckoutControllerObject.addItem({
      clientName: 'axilCoffee',
      item: 'standout',
    });
    CheckoutControllerObject.addItem({
      clientName: 'axilCoffee',
      item: 'standout',
    });
    CheckoutControllerObject.addItem({
      clientName: 'axilCoffee',
      item: 'premium',
    });
    const res = CheckoutControllerObject.getTotal({ clientName: 'axilCoffee' });
    expect(res.status).to.equal('ok');
    expect(res.total).to.equal(1294.96);
  });
  it('should return a right response of 1949.95', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    CheckoutControllerObject.addItem({
      clientName: 'myer',
      item: 'premium',
    });
    CheckoutControllerObject.addItem({
      clientName: 'myer',
      item: 'premium',
    });
    CheckoutControllerObject.addItem({
      clientName: 'myer',
      item: 'premium',
    });
    CheckoutControllerObject.addItem({
      clientName: 'myer',
      item: 'premium',
    });
    const res = CheckoutControllerObject.getTotal({ clientName: 'myer' });
    expect(res.status).to.equal('ok');
    expect(res.total).to.equal(1249.95);
  });
  it('should return a right response of 1949.95', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    CheckoutControllerObject.addItem({
      clientName: 'jora',
      item: 'premium',
    });
    CheckoutControllerObject.addItem({
      clientName: 'jora',
      item: 'premium',
    });
    CheckoutControllerObject.addItem({
      clientName: 'jora',
      item: 'premium',
    });
    CheckoutControllerObject.addItem({
      clientName: 'jora',
      item: 'premium',
    });
    const res = CheckoutControllerObject.getTotal({ clientName: 'jora' });
    expect(res.status).to.equal('ok');
    expect(res.total).to.equal(1519.96);
  });
  it('should throw an error because that client does not exist to get the total', () => {
    const CheckoutControllerObject = new CheckoutController();
    CheckoutControllerObject.new(defaultPricingRule);
    const res = CheckoutControllerObject.getTotal({ clientName: 'notClient' });
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('this client does not exist');
  });
  it('should throw an error because that client is not passed to getTotal', () => {
    const CheckoutControllerObject = new CheckoutController();
    const res = CheckoutControllerObject.getTotal();
    expect(res.status).to.equal('error');
    expect(res.error).to.equal('client does not exist');
  });
});
