const currencies = {
  TJS: { symbol: 'смн', rate: 1, flag: '🇹🇯', name: 'Сомони' },
  USD: { symbol: '$', rate: 0.09, flag: '🇺🇸', name: 'Доллар' },
  RUB: { symbol: '₽', rate: 8.5, flag: '🇷🇺', name: 'Рубль' },
};

export const getPrice = (price, currency) => {
  const rate = currencies[currency]?.rate || 1;
  return (price * rate).toFixed(0);
};

export const formatPrice = (price, currency) => {
  const cur = currencies[currency] || currencies['TJS'];
  const converted = (price * cur.rate).toFixed(0);
  return `${converted} ${cur.symbol}`;
};

export const getCurrencies = () => currencies;