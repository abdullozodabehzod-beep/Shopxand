import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

const rates = {
  TJS: { symbol: 'с.', rate: 1, name: 'Сомони' },
  USD: { symbol: '$', rate: 0.09, name: 'Доллар' },
  RUB: { symbol: '₽', rate: 8.5, name: 'Рубль' },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(localStorage.getItem('shopxand_currency') || 'TJS');

  const switchCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem('shopxand_currency', code);
  };

  const formatPrice = (price) => {
    const rate = rates[currency]?.rate || 1;
    const converted = (price * rate).toFixed(currency === 'USD' ? 2 : 0);
    return `${parseFloat(converted).toLocaleString()} ${rates[currency]?.symbol || 'с.'}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, switchCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}