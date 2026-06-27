import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

function CurrencySwitcher() {
  const { currency, switchCurrency, rates } = useCurrency();
  const [show, setShow] = useState(false);

  const currencies = Object.keys(rates);

  return (
    <div className="currency-switcher" style={{ position: 'relative' }}>
      <button onClick={() => setShow(!show)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontWeight: 700, fontSize: 14, color: '#333',
        display: 'flex', alignItems: 'center', gap: 4
      }}>
        {currency} <i className="fas fa-chevron-down" style={{ fontSize: 10 }} />
      </button>

      {show && (
        <div style={{
          position: 'absolute', top: '100%', right: 0,
          background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          padding: 8, zIndex: 100, minWidth: 100
        }}>
          {currencies.map(code => (
            <button
              key={code}
              onClick={() => { switchCurrency(code); setShow(false); }}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                background: currency === code ? '#e8f2ff' : 'transparent',
                border: 'none', borderRadius: 6, cursor: 'pointer',
                textAlign: 'left', fontSize: 13, fontWeight: currency === code ? 700 : 500,
                color: currency === code ? '#0066ff' : '#333'
              }}
            >
              {rates[code].symbol} {rates[code].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CurrencySwitcher;