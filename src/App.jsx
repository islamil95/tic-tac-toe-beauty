import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import WinModal from './components/WinModal'
import LoseModal from './components/LoseModal'
import axios from 'axios'

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [isComputerThinking, setIsComputerThinking] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  // Проверка победителя
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    if (squares.every(cell => cell !== null)) {
      return 'draw'
    }

    return null
  }

  // Генерация промокода
  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    return `GLOW-${code}`
  }

  // Логика компьютера (умная, но можно победить)
  const getComputerMove = (squares) => {
    // Проверка: можем ли выиграть
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const newSquares = [...squares]
        newSquares[i] = 'O'
        if (calculateWinner(newSquares) === 'O') {
          return i
        }
      }
    }

    // Проверка: нужно ли блокировать игрока
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const newSquares = [...squares]
        newSquares[i] = 'X'
        if (calculateWinner(newSquares) === 'X') {
          return i
        }
      }
    }

    // Приоритет центра
    if (!squares[4]) return 4

    // Приоритет углы
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(i => !squares[i])
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Любое свободное место
    const available = squares.map((cell, index) => cell === null ? index : null).filter(val => val !== null)
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)]
    }

    return null
  }

  // Обработка клика игрока
  const handleClick = async (index) => {
    if (board[index] || winner || isComputerThinking || !isXNext) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setIsXNext(false)

    const currentWinner = calculateWinner(newBoard)
    if (currentWinner === 'X') {
      const code = generatePromoCode()
      setPromoCode(code)
      setWinner('X')
      setShowWinModal(true)
      try {
        console.log('📤 Отправка запроса на /api/game-end:', { result: 'win', promoCode: code })
        // Используем прокси Vite (более надежно для разработки)
        const response = await axios.post('/api/game-end', { result: 'win', promoCode: code })
        console.log('✅ Ответ от сервера:', response.data)
        
        if (response.data.success) {
          console.log('✅ Промокод успешно отправлен в Telegram!')
        } else {
          console.warn('⚠️ Промокод сгенерирован, но Telegram недоступен:', response.data.message)
          // Можно показать уведомление пользователю
          setTimeout(() => {
            alert(`Промокод: ${code}\n\n⚠️ Уведомление в Telegram не отправлено. Проверьте настройки сервера или посмотрите логи в консоли.`)
          }, 1000)
        }
      } catch (error) {
        console.error('❌ Ошибка при отправке запроса на сервер:')
        if (error.response) {
          console.error('  Статус:', error.response.status)
          console.error('  Данные:', error.response.data)
          alert(`Промокод: ${code}\n\n❌ Ошибка отправки: ${error.response.data.message || 'Неизвестная ошибка'}`)
        } else if (error.request) {
          console.error('  Запрос не отправлен. Возможно, сервер не запущен')
          console.error('  URL:', error.config?.url)
          alert(`Промокод: ${code}\n\n❌ Сервер недоступен! Убедитесь, что сервер запущен на порту 5000.`)
        } else {
          console.error('  Ошибка:', error.message)
          alert(`Промокод: ${code}\n\n❌ Ошибка: ${error.message}`)
        }
      }
      return
    }

    // Ход компьютера
    setIsComputerThinking(true)
    setTimeout(async () => {
      const computerMove = getComputerMove(newBoard)
      if (computerMove !== null) {
        const updatedBoard = [...newBoard]
        updatedBoard[computerMove] = 'O'
        setBoard(updatedBoard)
        setIsXNext(true)

        const finalWinner = calculateWinner(updatedBoard)
        if (finalWinner) {
          setWinner(finalWinner)
          if (finalWinner === 'O') {
            setShowLoseModal(true)
            try {
              await axios.post('/api/game-end', { result: 'lose' })
            } catch (error) {
              console.error('Error sending Telegram notification:', error)
            }
          } else if (finalWinner === 'draw') {
            setShowLoseModal(true)
            try {
              await axios.post('/api/game-end', { result: 'lose' })
            } catch (error) {
              console.error('Error sending Telegram notification:', error)
            }
          }
        }
      }
      setIsComputerThinking(false)
    }, 800) // Небольшая задержка для эффекта "размышления"
  }

  // Сброс игры
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setIsComputerThinking(false)
    setShowWinModal(false)
    setShowLoseModal(false)
    setPromoCode('')
  }

  // Проверка победителя при изменении доски
  useEffect(() => {
    const result = calculateWinner(board)
    if (result && !winner) {
      setWinner(result)
    }
  }, [board])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 mb-2 bg-gradient-to-r from-dusty-rose via-lavender to-champagne bg-clip-text text-transparent">
            Крестики-Нолики
          </h1>
          <p className="text-lg text-gray-600 font-light">Премиум игра для истинных ценителей</p>
        </div>

        {/* Индикатор хода */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-2xl font-serif text-gray-700">
              {winner === 'X' ? '🎉 Вы победили!' : winner === 'O' ? '😔 Компьютер победил' : '🤝 Ничья'}
            </div>
          ) : isComputerThinking ? (
            <div className="text-xl font-medium text-gray-600 animate-pulse">
              Компьютер думает...
            </div>
          ) : (
            <div className="text-xl font-medium text-gray-700">
              Ваш ход ✨
            </div>
          )}
        </div>

        {/* Игровая доска */}
        <GameBoard 
          board={board} 
          handleClick={handleClick}
          isDisabled={isComputerThinking || !isXNext || winner}
        />

        {/* Кнопка сброса */}
        <div className="text-center mt-8">
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-gradient-to-r from-dusty-rose to-lavender text-white font-medium rounded-full shadow-soft hover:shadow-gentle transition-all duration-300 transform hover:scale-105"
          >
            Новая игра
          </button>
        </div>
      </div>

      {/* Модальные окна */}
      {showWinModal && (
        <WinModal promoCode={promoCode} onClose={() => setShowWinModal(false)} onNewGame={resetGame} />
      )}
      {showLoseModal && (
        <LoseModal onClose={() => setShowLoseModal(false)} onNewGame={resetGame} />
      )}
    </div>
  )
}

export default App

