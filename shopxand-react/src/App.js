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
  const [addedItem, setAddedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const updateCartQuantity = (id, newQty) => {
  if (newQty <= 0) {
    setCart(prev => prev.filter(i => i._id !== id));
    return;
  }
  setCart(prev => prev.map(i => i._id === id ? {...i, quantity: newQty} : i));
};

   const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleViewAll = () => {
    setActiveCategory(null);
    setFilteredProducts(products);
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    setFilteredProducts(products.filter(p => p.cat === cat));
  };

    const toggleFavorite = (product) => {
    if (!user) { setShowAuth(true); return; }
    setFavorites(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.filter(i => i._id !== product._id);
      return [...prev, product];
    });
  };

 useEffect(() => {
    fetch(API_URL + '/products')
      .then(r => r.json())
      .then(data => {
        if (data.products) {
          // Исправляем пути к картинкам
          const fixed = data.products.map(p => ({
            ...p,
            img: p.img && !p.img.startsWith('http') && !p.img.startsWith('/') ? '/' + p.img : p.img
          }));
          setProducts(fixed);
          setFilteredProducts(fixed);
        }
      })
      .catch(err => console.log('Ошибка:', err));
  }, []);

   useEffect(() => {
  const token = localStorage.getItem('shopxand_token');
  if (token) {
    fetch(API_URL + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(r => r.json())
    .then(data => {
      if (data.user) setUser(data.user);
    })
    .catch(() => localStorage.removeItem('shopxand_token'));
  }
}, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => { Notification.requestPermission(); }, 5000);
    }
  }, []);


    const addToCart = (product) => {
    if (!user) { setShowAuth(true); return; }
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i => i._id === product._id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...product, quantity: 1, img: product.img || product.selectedThumb || product.img}];
    });
    showToast('✅ ' + product.name + ' добавлен!');
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
    setFilteredProducts(products.filter(p => 
      (p.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.cat || '').toLowerCase().includes(query.toLowerCase())
    ));
  };

  return (
    <LanguageProvider>
      <div className="App">
        <Header 
          user={user} 
          onOpenAuth={() => setShowAuth(true)} 
          onOpenCart={() => {
          if (!user) { setShowAuth(true); return; }
          setShowCart(true);
        }}
          onSearch={handleSearch}
          products={products}
          onProductSelect={setSelectedProduct}
          onOpenFavorites={() => setShowFavorites(true)}
          onOpenOrders={() => setShowOrders(true)}
          setShowPhotoSearch={setShowPhotoSearch}
          onSelectCategory={handleSelectCategory}
          setShowLogout={setShowLogout}
        />
        <Hero />
        <CategoriesBar onSelectCategory={handleSelectCategory} />
        
  <section className="products">
<div className="container">
<div className="products__header">
  <h2 className="products__title">Популярные товары</h2>
  <a href="#" className="products__all" onClick={(e) => { e.preventDefault(); handleViewAll(); }}>
    Смотреть все <i className="fas fa-arrow-right"></i>
  </a>
</div>
<div className="products__grid">
  {filteredProducts.map(product => (
    <div key={product._id || product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
      <div className="product-card__img">
        <img src={product.img} alt={product.name} />
    <button className="product-card__fav" onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(product);
    }}>
      <i className={`${favorites.some(f => f._id === product._id) ? 'fas' : 'far'} fa-heart`}></i>
    </button>
        {product.oldPrice && (
          <span className="product-card__badge">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
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

        {selectedProduct && <Quickview product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
        {showFavorites && <Favorites favorites={favorites} onRemove={(id) => setFavorites(prev => prev.filter(i => i._id !== id))} onAddToCart={addToCart} onClose={() => setShowFavorites(false)} />}
        {showCart && <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => { setShowCart(false); setShowCheckout(true); }} onClose={() => setShowCart(false)} onUpdateQuantity={updateCartQuantity} />}        {showCheckout && <Checkout cart={cart} user={user} onPlaceOrder={placeOrder} onClose={() => setShowCheckout(false)} />}
        {showAuth && <Auth onLogin={(user) => { 
          setUser(user); 
          showToast('✅ Добро пожаловать, ' + user.name + '!'); 
        }} onClose={() => setShowAuth(false)} />}  
      {showOrders && <Orders orders={orders} onClose={() => setShowOrders(false)} />}
        {showPhotoSearch && <PhotoSearch products={products} onProductSelect={(p) => setSelectedProduct(p)} onClose={() => setShowPhotoSearch(false)} />}

          <BottomNav 
          onOpenCart={() => {
            if (!user) { setShowAuth(true); return; }
            setShowCart(true);
          }}
          onOpenFavorites={() => setShowFavorites(true)}
          onOpenOrders={() => setShowOrders(true)}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          onOpenMenu={() => setShowMobileMenu(true)}
          user={user}
          setShowAuth={setShowAuth}
        />
       {toast && (
      <div style={{
        position: 'fixed', top: '20px', right: '-400px',
        background: '#1a1a2e', color: '#fff', padding: '16px 24px', borderRadius: '14px',
        zIndex: 99999, fontSize: '15px', fontWeight: '600',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        animation: 'slideInRight 0.4s ease forwards, slideOutRight 0.4s ease 1.6s forwards'
      }}>
        {toast}
        </div>
      )}
      </div>
      {showLogout && (
  <div className="logout-modal active">
    <div className="logout-modal__overlay" onClick={() => setShowLogout(false)}></div>
    <div className="logout-modal__content">
      <div className="logout-modal__icon"><i className="fas fa-sign-out-alt"></i></div>
      <h3>Вы точно хотите выйти?</h3>
      <p>Ваши корзина и избранное сохранятся</p>
      <div className="logout-modal__actions">
        <button className="logout-modal__btn logout-modal__btn--cancel" onClick={() => setShowLogout(false)}>Отмена</button>
        <button className="logout-modal__btn logout-modal__btn--confirm" onClick={() => {
          localStorage.removeItem('shopxand_token');
          localStorage.removeItem('shopxand_user');
          setUser(null);
          setShowLogout(false);
          setToast('👋 Вы вышли из аккаунта');
          setTimeout(() => setToast(null), 2000);
        }}>
          <i className="fas fa-check"></i> Выйти
        </button>
      </div>
    </div>
  </div>
)}
    </LanguageProvider>
    
  );
}


export default App;