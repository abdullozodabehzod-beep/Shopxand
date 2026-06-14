import React from 'react';

function Orders({ orders, onClose, onDelete, onCancel }) {
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
                  <span className="order-card__number">{order.id}</span>
                  <span className={`order-card__status order-card__status--${order.status === 'completed' ? 'completed' : 'processing'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-card__total">{order.total?.toLocaleString()} с.</div>
                <div className="order-card__date">{new Date(order.date).toLocaleDateString('ru-RU')}</div>
                <div className="order-card__items">
                  {order.items?.map((item, i) => (
                    <div key={i} className="order-card__item">
                      <span className="order-card__item-name">{item.name}</span>
                      <span className="order-card__item-qty">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-card__footer">
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button className="order-card__cancel-btn" onClick={() => onCancel(order.id)}>
                      <i className="fas fa-times"></i> Отменить
                    </button>
                  )}
                  <button className="order-card__delete-btn" onClick={() => onDelete(order.id)}>
                    <i className="fas fa-trash-alt"></i> Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;