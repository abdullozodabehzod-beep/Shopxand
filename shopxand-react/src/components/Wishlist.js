import React, { useState } from 'react';

function Wishlist({ onClose, onAddToCart }) {
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem('shopxand_wishlist') || '[]')
  );
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const item = {
      id: Date.now().toString(),
      name: newItemName,
      price: newItemPrice || 'Не указана',
      date: new Date().toISOString()
    };
    
    const updated = [item, ...wishlist];
    setWishlist(updated);
    localStorage.setItem('shopxand_wishlist', JSON.stringify(updated));
    setNewItemName('');
    setNewItemPrice('');
  };

  const removeItem = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('shopxand_wishlist', JSON.stringify(updated));
  };

  const shareWishlist = () => {
    const text = '🎁 Мой список желаний из ShopXand:\n\n' + 
      wishlist.map((item, i) => `${i+1}. ${item.name} — ${item.price} с.`).join('\n');
    
    if (navigator.share) {
      navigator.share({ title: 'Мой список желаний ShopXand', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Список скопирован! Отправьте друзьям.');
    }
  };

  return (
    <div className="wishlist-panel active">
      <div className="wishlist-panel__overlay" onClick={onClose}></div>
      <div className="wishlist-panel__content">
        <div className="wishlist-panel__header">
          <h3>🎁 Список желаний</h3>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="wishlist-panel__add">
          <input 
            type="text" 
            placeholder="Что хотите?" 
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
          />
          <input 
            type="text" 
            placeholder="Цена (необязательно)" 
            value={newItemPrice}
            onChange={e => setNewItemPrice(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem}>Добавить</button>
        </div>

        <div className="wishlist-panel__items">
          {wishlist.length === 0 ? (
            <div className="wishlist-panel__empty">
              <span>🎁</span>
              <p>Ваш список желаний пуст</p>
              <p>Добавьте товары которые хотите купить</p>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item__info">
                  <div className="wishlist-item__name">{item.name}</div>
                  <div className="wishlist-item__price">{item.price} с.</div>
                  <div className="wishlist-item__date">
                    {new Date(item.date).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="wishlist-item__actions">
                  <button onClick={() => removeItem(item.id)} title="Удалить">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <button className="wishlist-panel__share" onClick={shareWishlist}>
            <i className="fas fa-share-alt"></i> Поделиться списком
          </button>
        )}
      </div>
    </div>
  );
}

export default Wishlist;