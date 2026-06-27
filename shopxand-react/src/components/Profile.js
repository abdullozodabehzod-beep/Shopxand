import React, { useState, useEffect } from 'react';

const API_URL = '/api';

function Profile({ user, onClose, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    fetch(API_URL + '/orders')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []));

    setFavorites(JSON.parse(localStorage.getItem('shopxand_favorites') || '[]'));
  }, []);

  const handleUpdateProfile = () => {
    fetch(API_URL + '/auth/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(r => r.json()).then(data => {
      if (data.success) {
        onUpdateUser({...user, ...form});
        setEditMode(false);
        alert('Профиль обновлён!');
      }
    });
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Пароли не совпадают');
      return;
    }
    fetch(API_URL + '/auth/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordForm)
    }).then(r => r.json()).then(data => {
      if (data.success) {
        alert('Пароль изменён!');
        setPasswordForm({ current: '', new: '', confirm: '' });
      } else {
        alert(data.error || 'Ошибка');
      }
    });
  };

  return (
    <div className="profile-modal active">
      <div className="profile-modal__overlay" onClick={onClose}></div>
      <div className="profile-modal__container">
        <div className="profile-modal__header">
          <h2>👤 Мой профиль</h2>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        {/* Аватар и имя */}
        <div className="profile-avatar">
          <div className="profile-avatar__icon">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="profile-avatar__info">
            <h3>{user?.name || 'Пользователь'}</h3>
            <span>+{user?.phone || ''}</span>
          </div>
        </div>

        {/* Вкладки */}
        <div className="profile-tabs">
          <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>📋 Данные</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 Заказы ({orders.length})</button>
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>❤️ Избранное ({favorites.length})</button>
          <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>🔒 Безопасность</button>
        </div>

        {/* Содержимое вкладок */}
        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="profile-info">
              {!editMode ? (
                <>
                  <div className="profile-row"><span>Имя:</span><span>{user?.name}</span></div>
                  <div className="profile-row"><span>Телефон:</span><span>+{user?.phone}</span></div>
                  <div className="profile-row"><span>Email:</span><span>{user?.email || '—'}</span></div>
                  <div className="profile-row"><span>Заказов:</span><span>{orders.length}</span></div>
                  <button onClick={() => setEditMode(true)}>✏️ Редактировать</button>
                </>
              ) : (
                <>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Имя" />
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" />
                  <button onClick={handleUpdateProfile}>💾 Сохранить</button>
                  <button onClick={() => setEditMode(false)}>Отмена</button>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-orders">
              {orders.length === 0 ? <p>У вас пока нет заказов</p> : orders.map(order => (
                <div key={order.id} className="profile-order-card">
                  <div className="profile-order-card__header">
                    <span>{order.id}</span>
                    <span className={`status status--${order.status}`}>{order.status}</span>
                  </div>
                  <div className="profile-order-card__total">{order.total?.toLocaleString()} с.</div>
                  <div className="profile-order-card__date">{new Date(order.date).toLocaleDateString('ru-RU')}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="profile-favorites">
              {favorites.length === 0 ? <p>Нет избранных товаров</p> : favorites.map(item => (
                <div key={item._id} className="profile-fav-card">
                  <img src={item.img} alt={item.name} />
                  <span>{item.name}</span>
                  <span>{item.price} с.</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-security">
              <h4>Изменить пароль</h4>
              <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} placeholder="Текущий пароль" />
              <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} placeholder="Новый пароль" />
              <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} placeholder="Подтвердите пароль" />
              <button onClick={handleChangePassword}>🔒 Изменить пароль</button>
              <button onClick={onLogout} className="logout-btn">🚪 Выйти из аккаунта</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;