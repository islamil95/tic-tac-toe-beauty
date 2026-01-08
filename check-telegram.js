// Скрипт для проверки настроек Telegram
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

console.log('🔍 Проверка настроек Telegram...\n');

if (!TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не установлен в .env файле!');
  console.log('💡 Добавьте в .env: TELEGRAM_BOT_TOKEN=ваш_токен\n');
  process.exit(1);
}

if (!TELEGRAM_CHAT_ID) {
  console.error('❌ TELEGRAM_CHAT_ID не установлен в .env файле!');
  console.log('💡 Добавьте в .env: TELEGRAM_CHAT_ID=ваш_chat_id\n');
  process.exit(1);
}

console.log('✅ TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
console.log('✅ TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID);
console.log('\n📤 Отправка тестового сообщения...\n');

const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

axios.post(url, {
  chat_id: TELEGRAM_CHAT_ID,
  text: '🧪 Тестовое сообщение из игры "Крестики-Нолики"\n\nЕсли вы видите это сообщение, значит интеграция работает! ✅'
})
  .then(response => {
    console.log('✅ УСПЕХ! Сообщение отправлено в Telegram!');
    console.log('📨 Ответ от Telegram API:', response.data);
    console.log('\n🎉 Интеграция настроена правильно!');
  })
  .catch(error => {
    console.error('❌ ОШИБКА отправки сообщения:');
    
    if (error.response) {
      console.error('   Код статуса:', error.response.status);
      console.error('   Ответ от API:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('\n💡 Проблема: Неверный токен бота!');
        console.error('   Проверьте TELEGRAM_BOT_TOKEN в файле .env');
        console.error('   Получите новый токен у @BotFather в Telegram');
      } else if (error.response.status === 400) {
        console.error('\n💡 Проблема: Неверный Chat ID!');
        console.error('   Проверьте TELEGRAM_CHAT_ID в файле .env');
        console.error('   Как получить Chat ID:');
        console.error('   1. Отправьте сообщение вашему боту');
        console.error('   2. Откройте: https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates');
        console.error('   3. Найдите "chat":{"id":ЧИСЛО} в ответе');
      } else if (error.response.status === 403) {
        console.error('\n💡 Проблема: Бот заблокирован пользователем!');
        console.error('   Отправьте /start вашему боту в Telegram');
      }
    } else if (error.request) {
      console.error('   Не удалось подключиться к Telegram API');
      console.error('   Проверьте интернет-соединение');
    } else {
      console.error('   Ошибка:', error.message);
    }
    
    process.exit(1);
  });

