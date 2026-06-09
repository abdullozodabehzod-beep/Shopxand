import React, { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Quickview from './components/Quickview';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import Favorites from './components/Favorites';
import CategoriesBar from './components/CategoriesBar';
import { sendOrderToTelegram } from './components/TelegramOrder';
import PhotoSearch from './components/PhotoSearch';

const API_URL = 'http://localhost:3000/api';

function App() {
   console.log('Render App, filteredProducts:', filteredProducts.length);
  const [showPhotoSearch, setShowPhotoSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    setFilteredProducts(
      products.filter(p => p.cat === cat)
    );
  };          
  // Вот сюда — после addToCart и removeFromCart:
  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.filter(i => i._id !== product._id);
      return [...prev, product];
    })
  }

  useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      Notification.requestPermission();
    }, 5000);
  }
}, []);

  useEffect(() => {
    fetch(API_URL + '/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      });

    
    const token = localStorage.getItem('shopxand_token');
    if (token) {
      fetch(API_URL + '/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      .then(r => r.json())
      .then(data => data.user && setUser(data.user));
    }
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i => i._id === product._id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...product, quantity: 1}];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

    const sendPush = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/img/icons/icon-192x192.png' });
  }
};

   const placeOrder = (orderData) => {
    const order = {
      id: 'SX-' + Date.now().toString().slice(-8),
      customer: orderData,
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.quantity, 0) + 30,
      status: 'processing',
      date: new Date().toISOString()
    };

    fetch(API_URL + '/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    sendOrderToTelegram(order);
    
    // ← ВОТ СЮДА
    sendPush('📦 Заказ принят!', `Заказ ${order.id} на сумму ${order.total.toLocaleString()} с.`);

    setOrders(prev => [order, ...prev]);
    setCart([]);
    setShowCheckout(false);
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(p => 
      (p.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.cat || '').toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    console.log('Загружаю товары с:', API_URL + '/products');
    fetch(API_URL + '/products')
      .then(r => {
        console.log('Ответ сервера:', r.status);
        return r.json();
      })
      .then(data => {
        console.log('Данные:', data);
        console.log('Товаров:', data.products?.length);
        if (data.products) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      })
      .catch(err => console.log('Ошибка:', err));
  }, []);

  return (
    <LanguageProvider>
      <div className="App">
        <Header 
          user={user} 
          onOpenAuth={() => setShowAuth(true)} 
          onOpenCart={() => setShowCart(true)}
          onSearch={handleSearch}
          products={products}
          onProductSelect={setSelectedProduct}
          onOpenFavorites={() => setShowFavorites(true)}
          onOpenOrders={() => setShowOrders(true)}
          setShowPhotoSearch={setShowPhotoSearch}
        />
        <Hero />
        <CategoriesBar onSelectCategory={handleSelectCategory} />
        <section className="products">
          <div className="container">
            <div className="products__header">
              <h2 className="products__title">Популярные товары</h2>
            </div>
            <div className="products__grid">
              {filteredProducts.map(product => (
                <div key={product._id || product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                  <div className="product-card__img">
                    <img src={product.img} alt={product.name} />
                    <button className="product-card__fav" onClick={(e) => e.stopPropagation()}>
                      <i className="far fa-heart"></i>
                    </button>
                    {product.oldPrice && (
                      <span className="product-card__badge">
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="product-card__body">
                    <span className="product-card__cat">{product.cat}</span>
                    <h3 className="product-card__name">{product.name}</h3>
                    <div className="product-card__rating">
                      <i className="fas fa-star"></i>
                      <span>{product.rating || '0'}</span>
                      <span className="product-card__reviews">({product.reviews || 0} отзывов)</span>
                    </div>
                    <div className="product-card__price">
                      {product.oldPrice && <span className="product-card__price-old">{product.oldPrice} с.</span>}
                      <span className="product-card__price-current">{product.price} с.</span>
                    </div>
                    <button className="product-card__cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                      <i className="fas fa-shopping-cart"></i> В корзину
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {selectedProduct && (
          <Quickview 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={addToCart} 
          />
        )}

        {showFavorites && (
          <Favorites 
           favorites={favorites}
           onRemove={(id) => setFavorites(prev => prev.filter(i => i._id !== id))}
           onAddToCart={addToCart}
           onClose={() => setShowFavorites(false)}
           />
        )}

        {showCart && (
          <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => { setShowCart(false); setShowCheckout(true); }} onClose={() => setShowCart(false)} />
        )}
        {showCheckout && (
          <Checkout cart={cart} user={user} onPlaceOrder={placeOrder} onClose={() => setShowCheckout(false)} />
        )}
        {showAuth && (
          <Auth onLogin={setUser} onClose={() => setShowAuth(false)} />
        )}
        {showOrders && (
           <Orders orders={orders} onClose={() => setShowOrders(false)} />
        )}

              {showPhotoSearch && (
        <PhotoSearch 
          products={products} 
          onProductSelect={(p) => setSelectedProduct(p)}
          onClose={() => setShowPhotoSearch(false)} 
        />
      )}

        <BottomNav 
          onOpenCart={() => setShowCart(true)} 
          onOpenFavorites={() => setShowFavorites(true)}
          onOpenOrders={() => setShowOrders(true)}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          onOpenMenu={() => setShowMobileMenu(true)}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;