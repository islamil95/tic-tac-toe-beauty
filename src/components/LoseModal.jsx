const LoseModal = ({ onClose, onNewGame }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-beige via-soft-pink to-champagne rounded-3xl shadow-gentle p-6 md:p-10 max-w-lg w-full mx-4 transform animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors text-2xl"
        >
          ×
        </button>

        <div className="text-center px-2">
          <div className="text-6xl mb-4">💫</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4 leading-tight">
            Не расстраивайтесь
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Попробуйте ещё раз!
          </p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNewGame}
              className="flex-1 px-4 md:px-6 py-3 bg-gradient-to-r from-dusty-rose to-lavender text-white text-sm md:text-base font-medium rounded-full shadow-soft hover:shadow-gentle transition-all duration-300 transform hover:scale-105"
            >
              Попробовать снова
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

export default LoseModal

