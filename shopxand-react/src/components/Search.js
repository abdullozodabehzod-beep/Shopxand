import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

function Search({ products, onSearchSelect, onSearch, onPhoto, onVoice }) {
  const { formatPrice } = useCurrency();
  const { t, tr } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  const fixTypos = (q) => {
    const fixes = {
      'телеыон': 'телефон', 'ноутбуук': 'ноутбук', 'рубащка': 'рубашка',
      'красовка': 'кроссовка', 'наушьник': 'наушник', 'смартвон': 'смартфон',
      'тапочьки': 'тапочки', 'электроник': 'электроника'
    };
    return q.split(' ').map(w => fixes[w] || w).join(' ');
  };

  useEffect(() => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fixedQuery = fixTypos(query.toLowerCase());
    const results = products
      .filter(p => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.cat || '').toLowerCase();
        return name.includes(query.toLowerCase()) || 
               name.includes(fixedQuery) || 
               cat.includes(query.toLowerCase());
      })
      .slice(0, 8);

    setSuggestions(results);
    setShowSuggestions(results.length > 0);
    setSelectedIndex(-1);
  }, [query, products]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    if (onSearchSelect) {
      onSearchSelect(product.name);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<span>$1</span>');
  };

  return (
    <div className="sx-search" ref={searchRef}>
      <i className="fas fa-search sx-search__lead"></i>
      <input 
        type="text" 
        className="sx-search__input" 
        placeholder={t('search')} 
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={(e) => { handleKeyDown(e); if (e.key === 'Enter' && selectedIndex < 0) handleSearch(); }}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
      />
      {query && (
        <button type="button" className="sx-search__clear" onClick={() => { setQuery(''); if (onSearch) onSearch(''); }} aria-label="clear">
          <i className="fas fa-times"></i>
        </button>
      )}
      <button type="button" className="sx-search__icon-btn" title={tr('Поиск по фото')} onClick={() => onPhoto && onPhoto()}>
        <i className="fas fa-camera"></i>
      </button>
      {onVoice && (
        <button type="button" className="sx-search__icon-btn" title={tr('Голосовой поиск')} onClick={() => onVoice()}>
          <i className="fas fa-microphone"></i>
        </button>
      )}
      <button type="button" className="sx-search__btn" onClick={handleSearch}>
        <i className="fas fa-search"></i><span>{tr('Найти')}</span>
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions active">
          <div className="search-suggestions__group">
            <div className="search-suggestions__group-title">{tr('Товары')}</div>
            {suggestions.map((product, i) => (
              <div 
                key={product._id || i}
                className={`search-suggestions__item ${i === selectedIndex ? 'search-suggestions__item--active' : ''}`}
                onClick={() => handleSelect(product)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleSelect(product);
                }}
              >
                <div className="search-suggestions__item-img">
                  {product.img ? <img src={product.img} alt="" /> : <span>📦</span>}
                </div>
                <div className="search-suggestions__item-info">
                  <div 
                    className="search-suggestions__item-name"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(product.name, query) }}
                  />
                  <div className="search-suggestions__item-cat">{tr(product.cat)}</div>
                </div>
                <div className="search-suggestions__item-price">{formatPrice(product.price)}</div>
              </div>
            ))}
          </div>
          <div className="search-suggestions__footer">
            <button onClick={handleSearch}>{tr('Показать все результаты')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;