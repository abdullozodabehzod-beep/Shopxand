import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function Auth({ onLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', passwordConfirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin 
      ? { phone: form.phone, password: form.password }
      : { name: form.name, phone: form.phone, email: form.email, password: form.password };

    try {
      const res = await fetch(API_URL + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('shopxand_token', data.token);
        onLogin(data.user);
        onClose();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Ошибка сервера');
    }
  };

  return (
    <div className="auth-modal active">
      <div className="auth-modal__overlay" onClick={onClose}></div>
      <div className="auth-modal__container">
        <button className="auth-modal__close" onClick={onClose}><i className="fas fa-times"></i></button>

        <div className="auth-form active">
          <div className="auth-form__header">
            <div className="auth-form__logo">
              <span className="auth-form__logo-icon">SX</span>
              <span>ShopXand</span>
            </div>
            <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
            <p>{isLogin ? 'Войдите для отслеживания заказов' : 'Создайте аккаунт для покупок'}</p>
          </div>

          <div className="auth-form__body">
            {!isLogin && (
              <div className="auth-form__group">
                <label>Имя *</label>
                <input type="text" placeholder="Ваше имя" onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            )}
            <div className="auth-form__group">
              <label>Телефон *</label>
              <input type="tel" placeholder="+992 XXX XXX XXX" onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            {!isLogin && (
              <div className="auth-form__group">
                <label>Email</label>
                <input type="email" placeholder="example@mail.com" onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            )}
            <div className="auth-form__group">
              <label>Пароль *</label>
              <input type="password" placeholder="Введите пароль" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            {!isLogin && (
              <div className="auth-form__group">
                <label>Подтвердите пароль *</label>
                <input type="password" placeholder="Повторите пароль" onChange={e => setForm({...form, passwordConfirm: e.target.value})} />
              </div>
            )}

            <button className="auth-form__submit" onClick={handleSubmit}>
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>

          <div className="auth-form__footer">
            <p>
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;