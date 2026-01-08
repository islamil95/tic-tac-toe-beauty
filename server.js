import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Проверка настроек Telegram при старте
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

console.log('\n🚀 Запуск сервера...\n');
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn('⚠️  ВНИМАНИЕ: Telegram не настроен!');
  console.warn('   TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? '✅ Установлен' : '❌ Отсутствует');
  console.warn('   TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID ? '✅ Установлен' : '❌ Отсутствует');
  console.warn('   Создайте файл .env с этими переменными для работы Telegram\n');
} else {
  console.log('✅ Telegram настроен:');
  console.log('   Бот:', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
  console.log('   Chat ID:', TELEGRAM_CHAT_ID);
  console.log('');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Простая CORS - разрешаем всё
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Сервер работает!' });
});

 
app.post('/api/game-end', async (req, res) => {
  try {
    const { result, promoCode } = req.body;
    console.log('📨 Получен запрос:', { result, promoCode });

    if (result === 'win' && promoCode) {
 
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const message = `Победа! Промокод выдан: ${promoCode}`;
      
      axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
        .then(response => {
          console.log('✅ УСПЕХ! Сообщение отправлено в Telegram!');
          console.log('📨 Ответ от Telegram API:', response.data);
          res.json({ success: true, message: 'Промокод отправлен в Telegram' });
        })
        .catch(error => {
          console.error('❌ ОШИБКА отправки сообщения:');
          if (error.response) {
            console.error('   Код статуса:', error.response.status);
            console.error('   Ответ от API:', error.response.data);
          }
          res.json({ success: false, message: 'Ошибка отправки в Telegram' });
        });
    } else if (result === 'lose') {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: 'Проигрыш'
      })
        .then(response => {
          res.json({ success: true, message: 'Результат отправлен в Telegram' });
        })
        .catch(error => {
          res.json({ success: false, message: 'Ошибка отправки' });
        });
    } else {
      res.status(400).json({ success: false, message: 'Invalid request' });
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Порт ${PORT} уже занят!`);
    console.error('💡 Выполните: lsof -ti:5000 | xargs kill -9');
    console.error('   Или закройте другие процессы, использующие порт 5000\n');
    process.exit(1);
  }
});
