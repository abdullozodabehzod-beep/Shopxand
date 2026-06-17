// Google Analytics 4
export const GA_ID = 'G-M5L51W1ZWT';

export const initGA = () => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_ID);
};

// Яндекс Метрика
export const YM_ID = '15096867321';

export const initYM = () => {
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
  for (var j=0;j<document.scripts.length;j++) {if (document.scripts[j].src===r) return;}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
  (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
  ym(YM_ID, 'init', {clickmap:true, trackLinks:true, accurateTrackBounce:true});
};