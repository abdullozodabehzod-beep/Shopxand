const nodemailer = require('nodemailer');

// Настройка Gmail (замени на свои данные)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ' abdullozodabehzod@gmail.com',  // ← ТВОЙ GMAIL
        pass: 'dfra cdlk eyuc icog'       // ← ПАРОЛЬ ПРИЛОЖЕНИЯ (не обычный пароль!)
    }
});

/**
 * Отправка письма
 * @param {string} to - email получателя
 * @param {string} subject - тема письма
 * @param {string} html - HTML-содержимое письма
 */
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: '"ShopXand" < abdullozodabehzod@gmail.com>',
            to: to,
            subject: subject,
            html: html
        });
        console.log('✅ Письмо отправлено:', info.messageId);
        return true;
    } catch (err) {
        console.error('❌ Ошибка отправки:', err.message);
        return false;
    }
}

/**
 * Уведомление о новом заказе
 */
async function sendOrderConfirmation(email, order) {
    const itemsList = order.items.map(item => 
        `<tr><td>${item.name}</td><td>×${item.quantity}</td><td>${(item.price * item.quantity).toLocaleString()} с.</td></tr>`
    ).join('');

    const html = `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
            <div style="background:#0066ff;color:#fff;padding:20px;text-align:center;border-radius:10px 10px 0 0;">
                <h1 style="margin:0;">ShopXand</h1>
            </div>
            <div style="padding:20px;background:#fff;border:1px solid #eee;">
                <h2>✅ Заказ оформлен!</h2>
                <p><strong>Номер заказа:</strong> ${order.id}</p>
                <p><strong>Дата:</strong> ${new Date(order.date).toLocaleString('ru-RU')}</p>
                <p><strong>Сумма:</strong> ${order.total.toLocaleString()} сомони</p>
                
                <h3>Товары:</h3>
                <table style="width:100%;border-collapse:collapse;">
                    <tr style="background:#f5f5f5;">
                        <th style="padding:10px;text-align:left;">Товар</th>
                        <th style="padding:10px;">Кол-во</th>
                        <th style="padding:10px;text-align:right;">Цена</th>
                    </tr>
                    ${itemsList}
                </table>
                
                <p style="margin-top:20px;">🚚 Доставка: 12-18 дней</p>
                <p>📍 Город: ${order.customer.city}</p>
                <p>🏠 Адрес: ${order.customer.address}</p>
                
                <div style="background:#f0f7ff;padding:15px;border-radius:10px;margin-top:20px;">
                    <p style="margin:0;">Спасибо за заказ! Мы свяжемся с вами для подтверждения.</p>
                </div>
            </div>
        </div>
    `;

    return await sendEmail(email, `ShopXand — Заказ ${order.id} оформлен!`, html);
}

/**
 * Уведомление о смене статуса
 */
async function sendStatusUpdate(email, order) {
    const statusMap = {
        'processing': 'В обработке',
        'delivery': 'В пути',
        'completed': 'Доставлен',
        'cancelled': 'Отменён'
    };

    const html = `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
            <div style="background:#0066ff;color:#fff;padding:20px;text-align:center;border-radius:10px 10px 0 0;">
                <h1 style="margin:0;">ShopXand</h1>
            </div>
            <div style="padding:20px;background:#fff;border:1px solid #eee;">
                <h2>📦 Статус заказа изменён</h2>
                <p><strong>Заказ:</strong> ${order.id}</p>
                <p><strong>Новый статус:</strong> ${statusMap[order.status] || order.status}</p>
                <p><strong>Сумма:</strong> ${order.total.toLocaleString()} сомони</p>
                <p>Следите за статусом в личном кабинете.</p>
            </div>
        </div>
    `;

    return await sendEmail(email, `ShopXand — Статус заказа ${order.id}`, html);
}

module.exports = { sendOrderConfirmation, sendStatusUpdate };