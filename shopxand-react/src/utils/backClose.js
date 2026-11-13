import { useEffect, useRef } from 'react';

// Кнопка «Назад» на телефоне закрывает верхнее открытое окно (каталог, корзину, товар...),
// а не выходит из сайта или приложения.
// Каждое окно кладёт в историю браузера свою запись с номером; когда пользователь
// возвращается назад, закрываем все окна, чьи записи остались «впереди».
const stack = [];
let nextId = 1;
let listening = false;

function onPop(event) {
  const current = (event.state && event.state.sx) || 0;
  while (stack.length && stack[stack.length - 1].id > current) {
    const top = stack.pop();
    top.closed = true;
    top.onClose();
  }
}

export function useBackClose(isOpen, onClose) {
  const ref = useRef(onClose);
  ref.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    if (!listening) { window.addEventListener('popstate', onPop); listening = true; }

    const entry = { id: nextId++, closed: false, onClose: () => ref.current() };
    stack.push(entry);
    window.history.pushState({ sx: entry.id }, '');

    return () => {
      if (entry.closed) return;
      const i = stack.indexOf(entry);
      if (i >= 0) stack.splice(i, 1);
      // Окно закрыли кнопкой на экране: убираем его запись из истории,
      // но только если она всё ещё последняя (иначе её уже заменило другое окно).
      setTimeout(() => {
        if (window.history.state && window.history.state.sx === entry.id) window.history.back();
      }, 0);
    };
  }, [isOpen]);
}
