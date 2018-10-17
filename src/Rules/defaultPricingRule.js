module.exports = {
  ads: [
    {
      name: 'classic',
      standingTime: 'short',
      priority: 0,
      logo: 0,
      price: 269.99,
    },
    {
      name: 'standout',
      standingTime: 'medium',
      priority: 0,
      logo: 1,
      price: 322.99,
    },
    {
      name: 'premium',
      standingTime: 'long',
      priority: 0,
      logo: 1,
      price: 394.99,
    },
  ],
  clients: [
    'base', 'secondBite', 'axilCoffee', 'myer', 'jora',
  ],
  discounts: [
    {
      type: 'more',
      name: 'moreClassicAds',
      bought: 2,
      adsName: 'classic',
      willget: 3,
    },
    {
      name: 'discountOnStandout',
      type: 'reduce',
      adsName: 'standout',
      newPrice: 299.99,
    },
    {
      type: 'more',
      name: 'moreOnPremium',
      bought: 4,
      adsName: 'premium',
      willget: 5,
    },
    {
      name: 'discountOnPremium',
      type: 'reduce',
      adsName: 'premium',
      newPrice: 389.99,
    },
    {
      name: 'discountOnPremiumWithLimit',
      type: 'reduceLimtiedItems',
      adsName: 'premium',
      limitedPurchased: 4,
      newPrice: 379.99,
    },
    {
      name: 'discountOnClassicWithLimit',
      type: 'reduceLimtiedItems',
      adsName: 'premium',
      limitedPurchased: 3,
      newPrice: 249.99,
    },
  ],
  clientDiscount: [
    {
      clientName: 'secondBite',
      discountNames: ['moreClassicAds'],
    },
    {
      clientName: 'axilCoffee',
      discountNames: ['discountOnStandout'],
    },
    {
      clientName: 'myer',
      discountNames: ['moreOnPremium', 'discountOnPremium', 'discountOnClassicWithLimit'],
    },
    {
      clientName: 'jora',
      discountNames: ['discountOnPremiumWithLimit'],
    },
  ],
};
