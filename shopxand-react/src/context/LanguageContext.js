import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  ru: {
    catalog: 'Каталог',
    search: 'Я ищу...',
    login: 'Войти',
    orders: 'Заказы',
    favorites: 'Избранное',
    cart: 'Корзина',
    clothing: 'Одежда',
    electronics: 'Электроника',
    home: 'Дом и сад',
    computers: 'Компьютеры',
    cosmetics: 'Косметика',
    sales: 'Акции',
    popularProducts: 'Популярные товары',
    viewAll: 'Смотреть все',
    addToCart: 'В корзину',
  },
  tg: {
    catalog: 'Каталог',
    search: 'Ҷустуҷӯ...',
    login: 'Ворид',
    orders: 'Фармоишҳо',
    favorites: 'Интихобшуда',
    cart: 'Сабад',
    clothing: 'Либос',
    electronics: 'Электроника',
    home: 'Хона ва боғ',
    computers: 'Компютерҳо',
    cosmetics: 'Косметика',
    sales: 'Тафхҳо',
    popularProducts: 'Молҳои машҳур',
    viewAll: 'Ҳамаашро дидан',
    addToCart: 'Ба сабад',
  },
  en: {
    catalog: 'Catalog',
    search: 'Search...',
    login: 'Sign In',
    orders: 'Orders',
    favorites: 'Favorites',
    cart: 'Cart',
    clothing: 'Clothing',
    electronics: 'Electronics',
    home: 'Home & Garden',
    computers: 'Computers',
    cosmetics: 'Cosmetics',
    sales: 'Sales',
    popularProducts: 'Popular Products',
    viewAll: 'View All',
    addToCart: 'Add to Cart',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('shopxand_lang') || 'ru');

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('shopxand_lang', newLang);
  };

  const t = (key) => translations[lang]?.[key] || translations['ru'][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}