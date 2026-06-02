const express = require('express');
const router = express.Router();

const BOT_ORDER = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
const CHANNEL_ID = '-1002854630161';

router.post('/webhook', (req, res) => {
    const update = req.body;
    console.log('Webhook received:', JSON.stringify(update));
    
    if (update.callback_query) {
        const cb = update.callback_query;
        const data_text = cb.data;
        const chatId = cb.message.chat.id;
        const messageId = cb.message.message_id;
        const callbackId = cb.id;
        
        console.log('🔘 Кнопка нажата:', data_text);
        
        // Удаляем сообщение с кнопками
        fetch('https://api.telegram.org/bot' + BOT_ORDER + '/deleteMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, message_id: messageId })
        });
        
        if (data_text.startsWith('delivered_')) {
            var orderId = data_text.replace('delivered_', '');
            
            fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHANNEL_ID, text: '✅ ЗАКАЗ ДОСТАВЛЕН!\n📦 ' + orderId })
            });
            
            fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Доставка подтверждена!' })
            });
        }
        
        if (data_text.startsWith('cancel_') || data_text.startsWith('approve_cancel_')) {
            var orderId = data_text.replace('cancel_', '').replace('approve_cancel_', '');
            
            fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHANNEL_ID, text: '❌ ЗАКАЗ ОТМЕНЁН!\n📦 ' + orderId })
            });
            
            fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Заказ отменён!' })
            });
        }
        
        if (data_text.startsWith('reject_cancel_')) {
            fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Отмена отклонена' })
            });
        }
    }
    
    res.sendStatus(200);
});

module.exports = router;