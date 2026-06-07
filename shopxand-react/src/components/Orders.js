import React from 'react';

function Orders({ orders }) {
  return (
    <div className="orders-panel active">
      <div className="orders-panel__overlay"></div>
      <div className="orders-panel__content">
        <div className="orders-panel__header">
          <h3 className="orders-panel__title">
            <i className="fas fa-box"></i> Мои заказы
            <span className="orders-panel__count">{orders.length} заказов</span>
          </h3>
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
                <div className="order-card__total">{order.total.toLocaleString()} с.</div>
                <div className="order-card__date">{new Date(order.date).toLocaleDateString('ru-RU')}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;