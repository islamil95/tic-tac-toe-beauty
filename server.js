import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Настройка путей для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// На Render порт выдается автоматически через переменную, или 5001
const PORT = process.env.PORT || 5001;

// Проверка телеграма
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

// Простая CORS - разрешаем всё
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// --- API ROUTES ---
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Сервер работает!' });
});

app.post('/api/game-end', async (req, res) => {
  try {
    const { result, promoCode } = req.body;
    console.log('📨 Получен запрос:', { result, promoCode });

    if (result === 'win' && promoCode) {
      // ТОЧНО ТАКОЙ ЖЕ КОД КАК В check-telegram.js (строки 28-33)
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

// --- ГЛАВНАЯ МАГИЯ: ОТДАЕМ REACT ---
// 1. Говорим Express'у, где лежат статические файлы (сборка React)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Любой запрос, который не API, отправляем на index.html (чтобы React запустился)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Порт ${PORT} уже занят!`);
    console.error(`💡 Выполните: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`   Или закройте другие процессы, использующие порт ${PORT}\n`);
    process.exit(1);
  }
});
