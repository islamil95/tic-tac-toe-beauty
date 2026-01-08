import { useEffect, useState } from 'react'

const WinModal = ({ promoCode, onClose, onNewGame }) => {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    createConfetti()
  }, [])

  const createConfetti = () => {
    const colors = ['#E8B4B8', '#D4C5E8', '#F7E7CE', '#F5F1EB']
    const elements = []
    for (let i = 0; i < 80; i++) {
      elements.push({
        id: i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 0.5 + 's',
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 8 + 'px'
      })
    }
    setConfetti(elements)
    setTimeout(() => setConfetti([]), 4000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode)
    alert('Промокод скопирован!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Конфетти */}
      {confetti.map((item) => (
        <div
          key={item.id}
          className="fixed confetti"
          style={{
            left: item.left,
            backgroundColor: item.color,
            width: item.size,
            height: item.size,
            animationDelay: item.delay,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            top: '-10px',
          }}
        />
      ))}

      <div className="relative bg-gradient-to-br from-beige via-soft-pink to-champagne rounded-3xl shadow-gentle p-8 md:p-12 max-w-md w-full transform animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors text-2xl"
        >
          ×
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4">🎉✨</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Поздравляем!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Вы выиграли премиум промокод
          </p>

          {/* Промокод */}
          <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-soft">
            <p className="text-sm text-gray-500 mb-2 text-center">Ваш промокод:</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl md:text-3xl font-serif font-bold text-dusty-rose tracking-wider whitespace-nowrap">
                {promoCode}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                title="Копировать"
              >
                📋
              </button>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNewGame}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-dusty-rose to-lavender text-white font-medium rounded-full shadow-soft hover:shadow-gentle transition-all duration-300 transform hover:scale-105"
            >
              Новая игра
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/80 text-gray-700 font-medium rounded-full shadow-soft hover:shadow-gentle transition-all duration-300"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default WinModal

