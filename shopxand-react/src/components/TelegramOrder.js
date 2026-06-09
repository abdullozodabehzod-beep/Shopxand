// Отправка заказа в Telegram
const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
const CHAT_ID = '5282056467';
const CHANNEL_ID = '-1002854630161';

export function sendOrderToTelegram(order) {
  const itemsList = order.items.map((item, i) => 
    `${i + 1}. ${item.name} ×${item.quantity} — ${(item.price * item.quantity).toLocaleString()} с.`
  ).join('\n');

  const message = 
    `🛍 НОВЫЙ ЗАКАЗ!\n\n` +
    `📦 Заказ: ${order.id}\n` +
    `📅 Дата: ${new Date(order.date).toLocaleString('ru-RU')}\n\n` +
    `👤 Клиент: ${order.customer.name}\n` +
    `📞 Телефон: ${order.customer.phone}\n` +
    `📍 Город: ${order.customer.city}\n` +
    `🏠 Адрес: ${order.customer.address}\n\n` +
    `📋 Товары:\n${itemsList}\n\n` +
    `💰 Итого: ${order.total.toLocaleString()} сомони`;

  // Кнопки
  const inlineKeyboard = {
    inline_keyboard: [[
      { text: '✅ Доставлен', callback_data: 'delivered_' + order.id },
      { text: '❌ Отменить', callback_data: 'cancel_' + order.id }
    ]]
  };

  // Тебе в ЛС
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      reply_markup: JSON.stringify(inlineKeyboard)
    })
  });

  // В канал через 15 сек
  setTimeout(() => {
    const channelMsg = 
      `🛍 *Принять заказ:*\n\n` +
      `📦 Заказ: ${order.id}\n` +
      `👤 *Имя:* ${order.customer.name}\n` +
      `📞 *Телефон:* ${order.customer.phone}\n` +
      `📋 *Товары:*\n${itemsList}\n\n` +
      `💰 *Итого:* ${order.total.toLocaleString()} с.\n\n` +
      `✅ *Ваш заказ принят!*\n` +
      `🚚 Доставка из Китая в Душанбе\n` +
      `📦 12-18 дней\n` +
      `🙏 Спасибо за заказ!`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: channelMsg
      })
    });
  }, 15000);
}