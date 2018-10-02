module.exports = {
  ads: [
    {
      name: 'classic',
      standingTime: 'short',
      priority: 0,
      logo: false,
      price: 269.99
    },
    {
      name: 'standout',
      standingTime: 'medium',
      priority: 0,
      logo: false,
      price: 322.99
    },
    {
      name: 'premium',
      standingTime: 'long',
      priority: 0,
      logo: false,
      price: 394.99
    }
  ],
  clients: [
    'default','secondBite', 'axilCoffeeRoasters', 'myer'
  ],
  discounts: [
    {
      type:'more',
      name: 'moreClassicAds',
      bought: 2,
      adsName: 'classic',
      willget: 3
    },
    {
      name: 'discountOnStandOut',
      type:'reduce',
      adsName: 'standout',
      newPrice: 299.99
    },
    {
      type:'more',
      name: 'moreOnPremium',
      bought: 4,
      adsName: 'premium',
      willget: 5
    },
    {
      name: 'discountOnPremium',
      type:'reduce',
      adsName: 'premium',
      newPrice: 389.99
    }
  ],
  clientDiscount: [
    {
      name: 'secondBite',
      discountNames: ['moreClassicAds']
    },
    {
      name: 'axilCoffeeRoasters',
      discountNames: ['discountOnStandOut']
    },
    {
      name: 'myer',
      discountNames: ['moreOnPremium','discountOnPremium']
    }
  ]
}