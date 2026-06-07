import React, { useState, useEffect } from 'react';

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { 
      title: 'Электроника на любую категорию', 
      text: 'Скидки до 15% на популярные модели', 
      bg: 'linear-gradient(135deg, #e8f4fd, #c5e3f6)',
      img: '/img/Електроника.png'
    },
    { 
      title: 'Бытовая техника', 
      text: 'Всё для дома от 500 сомони', 
      bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
      img: '/img/Битовая техника.png'
    },
    { 
      title: 'Национальная одежда', 
      text: 'Традиции и стиль в каждой детали', 
      bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
      img: '/img/Одежда.png'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero"> 
      <div className="container">
        <div className="hero__grid">
          {/* Главный баннер-слайдер */}
          <div className="hero__main">
            <div className="hero__slider" id="heroSlider">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`hero__slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ background: slide.bg }}
                >
                  <div className="hero__slide-info">
                    <h2 className="hero__slide-title">{slide.title}</h2>
                    <p className="hero__slide-text">{slide.text}</p>
                    <a href="#" className="hero__slide-btn">Посмотреть</a>
                  </div>
                  <div className="hero__slide-img">
                    <img src={slide.img} alt={slide.title} />
                  </div>
                </div>
              ))}
            </div>
            {/* Точки */}
            <div className="hero__dots" id="heroDots">
              {slides.map((_, i) => (
                <span 
                  key={i}
                  className={`hero__dot ${i === currentSlide ? 'active' : ''}`}
                  data-index={i}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
          
          {/* Баннеры справа */}
          <div className="hero__banners">
            <div className="hero__banner" style={{background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)'}}>
              <div className="hero__banner-info">
                <h4>Электроника</h4>
                <p>Скидки до 30%</p>
              </div>
              <span className="hero__banner-icon">
                🔌
              </span>
            </div>
            <div className="hero__banner" style={{background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)'}}>
              <div className="hero__banner-info">
                <h4>Детские товары</h4>
                <p>Скоро выйдут</p>
              </div>
              <span className="hero__banner-icon">
                👶
              </span>
            </div>
            <div className="hero__banner" style={{background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)'}}>
              <div className="hero__banner-info">
                <h4>Красота</h4>
                <p>Бесплатная доставка</p>
              </div>
              <span className="hero__banner-icon">
                💖
              </span>
            </div>
            <div className="hero__banner" style={{background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)'}}>
              <div className="hero__banner-info">
                <h4>Для дома</h4>
                <p>Комфорт</p>
              </div>
              <span className="hero__banner-icon">
                🏠
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;