import React, { useState } from 'react';

function Orders({ orders, onClose, onDelete, onCancel }) {
  const [confirm, setConfirm] = useState(null);
  const [details, setDetails] = useState(null);

  const getTrackSteps = (orderDate) => {
    const now = new Date();
    const daysPassed = Math.floor((now - new Date(orderDate)) / (1000 * 60 * 60 * 24));
    
    return [
      { label: 'В пути (Китай)', days: '1-3 дня', completed: daysPassed >= 0, current: daysPassed < 3 },
      { label: 'В Таджикистане', days: '3-10 дней', completed: daysPassed >= 3, current: daysPassed >= 3 && daysPassed < 10 },
      { label: 'На досмотре', days: '10-17 дней', completed: daysPassed >= 10, current: daysPassed >= 10 && daysPassed < 17 },
      { label: 'Доставлен', days: '17 дней', completed: daysPassed >= 17, current: daysPassed >= 17 },
    ];
  };

  return (
    <div className="orders-panel active">
      <div className="orders-panel__overlay" onClick={onClose}></div>
      <div className="orders-panel__content">
        <div className="orders-panel__header">
          <h3 className="orders-panel__title">
            <i className="fas fa-box"></i> Мои заказы
            <span className="orders-panel__count">{orders.length} заказов</span>
          </h3>
          <button className="orders-panel__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="orders-panel__body">
          {orders.length === 0 ? (
            <div className="orders-panel__empty">
              <span className="orders-panel__empty-icon">📦</span>
              <h4>У вас пока нет заказов</h4>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card__header">
                  <div>
                    <span className="order-card__number">{order.id}</span>
                    <div className="order-card__date">{new Date(order.date).toLocaleDateString('ru-RU')}</div>
                    <div className="order-card__customer">👤 {order.customer?.name}</div>
                  </div>
                  <span className={`order-card__status order-card__status--${order.status === 'completed' ? 'completed' : order.status === 'cancelled' ? 'cancelled' : 'processing'}`}>
                    {order.status === 'completed' ? 'Доставлен' : order.status === 'cancelled' ? 'Отменён' : 'В обработке'}
                  </span>
                </div>

                <div className="order-card__total">{order.total?.toLocaleString()} с.</div>

                {/* Отслеживание */}
                <div className="order-track">
                  {getTrackSteps(order.date).map((step, i) => (
                    <div key={i} className={`order-track__step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                      <div className="order-track__dot"></div>
                      {i < 3 && <div className="order-track__line"></div>}
                      <div className="order-track__label">{step.label}</div>
                      <div className="order-track__days">{step.days}</div>
                    </div>
                  ))}
                </div>

                {/* Товары */}
                <div className="order-card__items">
                  {order.items?.map((item, i) => (
                    <div key={i} className="order-card__item">
                      <img 
                        src={item.img} 
                        alt="" 
                        style={{width:24,height:24,objectFit:'contain',borderRadius:4}}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="order-card__item-name">{item.name}</span>
                      <span className="order-card__item-qty">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card__footer">
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button className="order-card__cancel-btn" onClick={() => setConfirm({ type: 'cancel', id: order.id })}>
                      <i className="fas fa-times"></i> Отменить
                    </button>
                  )}
                  <button className="order-card__delete-btn" onClick={() => setConfirm({ type: 'delete', id: order.id })}>
                    <i className="fas fa-trash-alt"></i> Удалить
                  </button>
                  <button className="order-card__details-btn" onClick={() => setDetails(order)}>
                    Детали
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Окно подтверждения */}
      {confirm && (
        <div style={{
          position:'fixed',top:0,left:0,width:'100%',height:'100%',
          zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',
          background:'rgba(0,0,0,0.5)'
        }} onClick={() => setConfirm(null)}>
          <div style={{
            background:'#fff',borderRadius:20,padding:'32px 28px 24px',
            textAlign:'center',width:360,maxWidth:'90vw'
          }} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:48,color:confirm.type === 'delete' ? '#ff4757' : '#ff9100',marginBottom:12}}>
              <i className={`fas ${confirm.type === 'delete' ? 'fa-trash-alt' : 'fa-question-circle'}`}></i>
            </div>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:6}}>
              {confirm.type === 'cancel' ? 'Отменить заказ?' : 'Удалить заказ?'}
            </h3>
            <p style={{fontSize:13,color:'#999',marginBottom:20}}>
              {confirm.type === 'cancel' ? 'Заказ будет отменён' : 'Заказ будет удалён навсегда'}
            </p>
            <div style={{display:'flex',gap:10}}>
              <button style={{flex:1,padding:12,borderRadius:10,border:'none',background:'#f0f0f0',fontSize:14,fontWeight:700,cursor:'pointer'}}
                onClick={() => setConfirm(null)}>Отмена</button>
              <button style={{flex:1,padding:12,borderRadius:10,border:'none',background:confirm.type === 'delete' ? '#ff4757' : '#ff9100',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer'}}
                onClick={() => {
                  if (confirm.type === 'cancel') onCancel(confirm.id);
                  else onDelete(confirm.id);
                  setConfirm(null);
                }}>Да</button>
            </div>
          </div>
        </div>
      )}

      {/* Детали заказа */}
      {details && (
        <div style={{
          position:'fixed',top:0,left:0,width:'100%',height:'100%',
          zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',
          background:'rgba(0,0,0,0.5)'
        }} onClick={() => setDetails(null)}>
          <div style={{
            background:'#fff',borderRadius:20,padding:24,width:420,maxWidth:'90vw',maxHeight:'80vh',overflow:'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h3 style={{margin:0}}>Заказ {details.id}</h3>
              <button onClick={() => setDetails(null)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>✕</button>
            </div>
            
            <div style={{background:'#f8f9fb',borderRadius:12,padding:16,marginBottom:12}}>
              <div className="order-detail-row"><span>Дата</span><span>{new Date(details.date).toLocaleString('ru-RU')}</span></div>
              <div className="order-detail-row"><span>Статус</span><span>{details.status}</span></div>
              <div className="order-detail-row"><span>Имя</span><span>{details.customer?.name}</span></div>
              <div className="order-detail-row"><span>Телефон</span><span>{details.customer?.phone}</span></div>
              <div className="order-detail-row"><span>Город</span><span>{details.customer?.city}</span></div>
              <div className="order-detail-row"><span>Адрес</span><span>{details.customer?.address}</span></div>
              <div className="order-detail-row"><span>Сумма</span><span>{details.total?.toLocaleString()} с.</span></div>
            </div>

            <div style={{marginBottom:12}}>
              <strong>Товары:</strong>
              {details.items?.map((item, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:14}}>
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{(item.price * item.quantity)?.toLocaleString()} с.</span>
                </div>
              ))}
            </div>

            <button style={{width:'100%',padding:12,background:'#0066ff',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontSize:14,fontWeight:600}}
              onClick={() => setDetails(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;