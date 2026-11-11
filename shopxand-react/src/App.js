import React, { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Quickview from './components/Quickview';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import Favorites from './components/Favorites';
import Marketplace from './components/Marketplace';
import { pick, matchesItem } from './data/categories';
import { sendOrderToTelegram } from './components/TelegramOrder';
import PhotoSearch from './components/PhotoSearch';
import { initGA, initYM } from './utils/analytics';
import Delivery from './pages/Delivery';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import TelegramButton from './components/TelegramButton';
import PwaInstall from './components/PwaInstall';
import { initPixel, trackEvent } from './utils/pixel';
import { ThemeProvider } from './context/ThemeContext';
import Wishlist from './components/Wishlist';
import Profile from './components/Profile';

const API_URL = '/api';

// Внутренний компонент (имеет доступ к контекстам)
function AppContent() {
  const { formatPrice } = useCurrency();
  const { tr, lang } = useLanguage();
  const [filterLabel, setFilterLabel] = useState(null);
  
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
  const [toast, setToast] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
   const currencyContext = useCurrency();
const [visibleCount, setVisibleCount] = useState(10);
const [showProfile, setShowProfile] = useState(false);

  useEffect(() => { initGA(); initYM(); }, []);
  useEffect(() => { initPixel(); }, []);

  const deleteOrder = (orderId) => {
    if (window.confirm(tr('Удалить заказ?'))) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      fetch(API_URL + '/orders/' + orderId, { method: 'DELETE' });
    }
  };

  const cancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    fetch(API_URL + '/orders/' + orderId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) })
      .then(() => {
        setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'cancelled'} : o));
        if (order) {
          const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
          const CHAT_ID = '5282056467';
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `❌ КЛИЕНТ ОТМЕНИЛ ЗАКАЗ\n📦 ${order.id}\n👤 ${order.customer?.name}\n📞 ${order.customer?.phone}\n💰 ${order.total?.toLocaleString()} с.` })
          });
        }
      });
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty <= 0) { setCart(prev => prev.filter(i => i._id !== id)); return; }
    setCart(prev => prev.map(i => i._id === id ? {...i, quantity: newQty} : i));
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:30px;z-index:9999;font-weight:600;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const scrollToProducts = () => setTimeout(() => document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' }), 60);
  const handleViewAll = () => { setActiveCategory(null); setFilterLabel(null); setFilteredProducts(products); setVisibleCount(10);};
  const handleSelectCategory = (cat) => { setActiveCategory(cat); setFilterLabel(tr(cat)); setFilteredProducts(products.filter(p => p.cat === cat)); setVisibleCount(10); scrollToProducts();};
  const handleSelectBlock = (block) => {
    setActiveCategory(block.key); setFilterLabel(pick(block.title, lang));
    setFilteredProducts(products.filter(p => block.cats.includes(p.cat)));
    setVisibleCount(10); scrollToProducts();
  };
  const handleSelectItem = (block, item) => {
    setActiveCategory(block.key); setFilterLabel(pick(item, lang));
    setFilteredProducts(products.filter(p => matchesItem(p, item[0])));
    setVisibleCount(10); scrollToProducts();
  };

  const showMore = () => {
  setVisibleCount(prev => Math.min(prev + 10, filteredProducts.length));
};

const handleLogout = () => {
  localStorage.removeItem('shopxand_token');
  localStorage.removeItem('shopxand_user');
  setUser(null);
  setShowProfile(false);
  setCart([]);
  setOrders([]);
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
    if (user) fetch(API_URL + '/orders').then(r => r.json()).then(data => setOrders(data.orders || []));
  }, [user]);

  useEffect(() => {
    fetch(API_URL + '/products').then(r => r.json()).then(data => {
      if (data.products) {
        const fixed = data.products.map(p => ({ ...p, img: p.img && !p.img.startsWith('http') && !p.img.startsWith('/') ? '/' + p.img : p.img }));
        setProducts(fixed); setFilteredProducts(fixed);
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('shopxand_token');
    if (token) {
      fetch(API_URL + '/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => { if (!r.ok) { localStorage.removeItem('shopxand_token'); setUser(null); return; } return r.json(); })
        .then(data => { if (data && data.user) setUser(data.user); })
        .catch(() => { localStorage.removeItem('shopxand_token'); setUser(null); });
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') setTimeout(() => { Notification.requestPermission(); }, 5000);
  }, []);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem('shopxand_address');
      if (saved) setSavedAddress(JSON.parse(saved));
    }
  }, [user]);

  useEffect(() => {
    try {
        const subs = JSON.parse(localStorage.getItem('shopxand_subscriptions') || '[]');
        // Можно показать активные подписки
    } catch (err) {
        console.log('Подписки недоступны');
    }
}, []);

  const addToCart = (product) => {
    if (!user) { setShowAuth(true); return; }
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    trackEvent('AddToCart', { content_name: product.name, content_ids: [product._id], content_type: 'product', value: product.price, currency: 'TJS' });
    showToast('✅ ' + product.name + ' ' + tr('добавлен!'));
    if (window._cartTimer) clearTimeout(window._cartTimer);
    window._cartTimer = setTimeout(() => {
      if (cart.length > 0 && !showCheckout) sendPush('🛒 Вы забыли товары в корзине!', `У вас ${cart.length} товаров. Завершите заказ!`);
    }, 30 * 60 * 1000);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const sendPush = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, icon: '/img/icons/icon-192x192.png' });
  };

  const placeOrder = (orderData) => {
    if (window._cartTimer) clearTimeout(window._cartTimer);
    const order = { id: 'SX-' + Date.now().toString().slice(-8), customer: orderData, items: cart, total: cart.reduce((s, i) => s + i.price * i.quantity, 0) + 30, status: 'processing', date: new Date().toISOString() };
    fetch(API_URL + '/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    sendOrderToTelegram(order);
    sendPush('📦 Заказ принят!', `Заказ ${order.id} на сумму ${order.total.toLocaleString()} с.`);
    trackEvent('Purchase', { value: order.total, currency: 'TJS', content_ids: cart.map(i => i._id) });
    setOrders(prev => [order, ...prev]); setCart([]); setShowCheckout(false);
  };

  const handleSearch = (query) => {
    if (!query) { setFilteredProducts(products); return; }
    setFilteredProducts(products.filter(p => (p.name || '').toLowerCase().includes(query.toLowerCase()) || (p.cat || '').toLowerCase().includes(query.toLowerCase())));
    setVisibleCount(10);
  };

  const handleSearchSelect = (query) => {
    const similar = products.filter(p => (p.name || '').toLowerCase().includes(query.toLowerCase()) || (p.cat || '').toLowerCase().includes(query.toLowerCase()));
    setFilteredProducts(similar.length > 0 ? similar : products);
    document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const path = window.location.pathname;
  if (path === '/delivery') return <Delivery />;
  if (path === '/about') return <About />;
  if (path === '/contact') return <Contact />;

  return (
    <ThemeProvider>
      <div className="App">
        <Header onOpenWishlist={() => setShowWishlist(true)} user={user} onOpenAuth={() => setShowAuth(true)} onOpenCart={() => { if (!user) { setShowAuth(true); return; } setShowCart(true); }} onSearch={handleSearch} products={products} onProductSelect={setSelectedProduct} onOpenFavorites={() => setShowFavorites(true)} onOpenOrders={() => { if (!user) { setShowAuth(true); return; } setShowOrders(true); }} setShowPhotoSearch={setShowPhotoSearch} onSelectCategory={handleSelectCategory} onSelectBlock={handleSelectBlock} onSelectItem={handleSelectItem} setShowLogout={setShowLogout} onOpenMobileMenu={() => setShowMobileMenu(true)} onSearchSelect={handleSearchSelect} onOpenProfile={() => setShowProfile(true)}/>
        <Hero />
        <Marketplace onSelectBlock={handleSelectBlock} onSelectItem={handleSelectItem} />
        <section className="products"><div className="container"><div className="products__header"><h2 className="products__title">{filterLabel || tr('Популярные товары')}</h2><a href="#" className="products__all" onClick={(e) => { e.preventDefault(); handleViewAll(); }}>{tr('Смотреть все')} <i className="fas fa-arrow-right"></i></a></div>{filteredProducts.length === 0 && products.length > 0 && (<div className="products__empty"><span>🛍️</span><h3>{tr('Пока нет товаров в этом разделе')}</h3><p>{tr('Скоро здесь появятся новые товары')}</p><button onClick={handleViewAll}>{tr('Показать все товары')}</button></div>)}
<div className="products__grid">{filteredProducts.slice(0, visibleCount).map(product => (<div key={product._id || product.id} className="product-card" onClick={() => setSelectedProduct(product)}><div className="product-card__img"><img src={product.img} alt={product.name} /><button className="product-card__fav" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}><i className={`${favorites.some(f => f._id === product._id) ? 'fas' : 'far'} fa-heart`}></i></button>{product.oldPrice && (<span className="product-card__badge">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>)}</div><div className="product-card__body"><span className="product-card__cat">{tr(product.cat)}</span><h3 className="product-card__name">{product.name}</h3><div className="product-card__rating"><i className="fas fa-star"></i><span>{product.rating || '0'}</span><span className="product-card__reviews">({product.reviews || 0} {tr('отзывов')})</span></div><div className="product-card__price">
          {product.oldPrice && <span className="product-card__price-old">{formatPrice(product.oldPrice)}</span>}
          <span className="product-card__price-current">{formatPrice(product.price)}</span>
        </div><button className="product-card__cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}><i className="fas fa-shopping-cart"></i> {tr('В корзину')}</button></div></div>))}</div>
  {visibleCount < filteredProducts.length && (
              <div style={{textAlign:'center', marginTop:'20px'}}>
                <button 
                  onClick={showMore}
                  style={{
                    padding: '14px 40px',
                    background: '#0066ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {tr('Показать ещё')} ({filteredProducts.length - visibleCount} {tr('товаров')})
                </button>
              </div>
            )}</div></section>
        {selectedProduct && <Quickview product={selectedProduct} products={products} user={user} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
        {showFavorites && <Favorites favorites={favorites} onRemove={(id) => setFavorites(prev => prev.filter(i => i._id !== id))} onAddToCart={addToCart} onClose={() => setShowFavorites(false)} />}
        {showCart && <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => { setShowCart(false); setShowCheckout(true); }} onClose={() => setShowCart(false)} onUpdateQuantity={updateCartQuantity} />}
        {showCheckout && <Checkout cart={cart} user={user} onPlaceOrder={placeOrder} onClose={() => setShowCheckout(false)} />}
        {showAuth && <Auth onLogin={(user) => { setUser(user); showToast('✅ ' + tr('Добро пожаловать') + ', ' + user.name + '!'); }} onClose={() => setShowAuth(false)} />}
        {showOrders && <Orders orders={orders} onClose={() => setShowOrders(false)} onDelete={deleteOrder} onCancel={cancelOrder} />}
        {showPhotoSearch && <PhotoSearch products={products} onProductSelect={(p) => setSelectedProduct(p)} onClose={() => setShowPhotoSearch(false)} />}
        {showProfile && <Profile user={user} onClose={() => setShowProfile(false)} onLogout={handleLogout} onUpdateUser={setUser} />}
        <PwaInstall /><ChatWidget /><TelegramButton /><Footer />
        <BottomNav onOpenWishlist={() => setShowWishlist(true)} onOpenCart={() => { if (!user) { setShowAuth(true); return; } setShowCart(true); }} onOpenFavorites={() => setShowFavorites(true)} onOpenOrders={() => { if (!user) { setShowAuth(true); return; } setShowOrders(true); }} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenMenu={() => setShowMobileMenu(true)} user={user} setShowAuth={setShowAuth} />
        {showLogout && (
          <div className="logout-modal active">
            <div className="logout-modal__overlay" onClick={() => setShowLogout(false)}></div>
            <div className="logout-modal__content"><div className="logout-modal__icon"><i className="fas fa-sign-out-alt"></i></div><h3>{tr('Вы точно хотите выйти?')}</h3><p>{tr('Ваши корзина и избранное сохранятся')}</p>
              <div className="logout-modal__actions"><button className="logout-modal__btn logout-modal__btn--cancel" onClick={() => setShowLogout(false)}>{tr('Отмена')}</button><button className="logout-modal__btn logout-modal__btn--confirm" onClick={() => { localStorage.removeItem('shopxand_token'); localStorage.removeItem('shopxand_user'); setUser(null); setCart([]); setFavorites([]); setOrders([]); setShowLogout(false); setToast('👋 ' + tr('Вы вышли из аккаунта')); setTimeout(() => setToast(null), 2000); }}><i className="fas fa-check"></i> {tr('Выйти')}</button></div>
            </div>
          </div>
        )}
        {showWishlist && <Wishlist onClose={() => setShowWishlist(false)} onAddToCart={addToCart} />}
      </div>
    </ThemeProvider>
  );
}

// Внешний компонент с провайдерами
function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;