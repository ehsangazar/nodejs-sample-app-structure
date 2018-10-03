require('dotenv').config();

const logger = require('./Handlers/logger');
const CheckoutController = require('./Controllers/CheckoutController');
const defaultPricingRule = require('./Rules/defaultPricingRule');

logger.info('App has started working');


const CheckoutControllerObject = new CheckoutController();
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

console.log('Customer: secondBite');
console.log(`Total: $${res.total}`);
