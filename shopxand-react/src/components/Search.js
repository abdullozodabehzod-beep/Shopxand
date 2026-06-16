import React, { useState, useRef, useEffect } from 'react';

function Search({ products, onProductSelect, onSearchSelect }) {
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
    // Вместо открытия Quickview — фильтруем товары
    if (onSearchSelect) {
      onSearchSelect(product.name);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      const fixedQuery = fixTypos(query.toLowerCase());
      const results = products.filter(p => 
        (p.name || '').toLowerCase().includes(fixedQuery) || 
        (p.cat || '').toLowerCase().includes(fixedQuery)
      );
      setSuggestions(results);
      setShowSuggestions(true);
    }
  };

  const highlightMatch = (text, q) => {
    if (!q) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span>$1</span>');
  };

  return (
    <div className="header__search" ref={searchRef}>
      <input 
        type="text" 
        className="header__search-input" 
        placeholder="Я ищу..." 
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <button className="header__search-by-photo" title="Поиск по фото">
        <i className="fas fa-camera"></i>
      </button>
      <button className="header__search-btn" onClick={handleSearch}>
        <i className="fas fa-search"></i>
      </button>

      {showSuggestions && (
        <div className="search-suggestions active">
          {suggestions.length > 0 && (
            <div className="search-suggestions__group">
              <div className="search-suggestions__group-title">Товары</div>
              {suggestions.map((product, i) => (
                <div 
                  key={product._id || i}
                  className={`search-suggestions__item ${i === selectedIndex ? 'search-suggestions__item--active' : ''}`}
                  onClick={() => handleSelect(product)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div className="search-suggestions__item-img">
                    {product.img ? <img src={product.img} alt="" /> : '📦'}
                  </div>
                  <div className="search-suggestions__item-info">
                    <div 
                      className="search-suggestions__item-name"
                      dangerouslySetInnerHTML={{ __html: highlightMatch(product.name, query) }}
                    />
                    <div className="search-suggestions__item-cat">{product.cat}</div>
                  </div>
                  <div className="search-suggestions__item-price">{product.price} с.</div>
                </div>
              ))}
            </div>
          )}
          <div className="search-suggestions__footer">
            <button onClick={handleSearch}>Показать все результаты</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;