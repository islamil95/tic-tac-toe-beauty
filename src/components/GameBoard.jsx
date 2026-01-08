import { useEffect, useState, useRef } from 'react'

const GameBoard = ({ board, handleClick, isDisabled }) => {
  const [confettiElements, setConfettiElements] = useState([])
  const confettiTriggered = useRef(false)

  // Эффект конфетти при победе
  useEffect(() => {
    const winner = calculateWinner(board)
    if (winner === 'X' && !confettiTriggered.current) {
      confettiTriggered.current = true
      createConfetti()
    } else if (!winner) {
      confettiTriggered.current = false
    }
  }, [board])

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const createConfetti = () => {
    const colors = ['#E8B4B8', '#D4C5E8', '#F7E7CE', '#F5F1EB']
    const elements = []
    for (let i = 0; i < 50; i++) {
      elements.push({
        id: i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 0.5 + 's',
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6 + 'px'
      })
    }
    setConfettiElements(elements)
    setTimeout(() => setConfettiElements([]), 3000)
  }

  const renderSquare = (index) => {
    const value = board[index]
    const isWinner = calculateWinner(board) && getWinningLine(board).includes(index)

    return (
      <button
        onClick={() => handleClick(index)}
        disabled={isDisabled || value !== null}
        className={`
          aspect-square w-full
          bg-gradient-to-br from-beige via-soft-pink to-champagne
          rounded-2xl shadow-soft hover:shadow-gentle
          transition-all duration-300 transform
          ${!isDisabled && !value ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
          ${isWinner ? 'ring-4 ring-dusty-rose' : ''}
          flex items-center justify-center
          font-serif text-5xl md:text-6xl
          ${value === 'X' ? 'text-dusty-rose' : value === 'O' ? 'text-lavender' : 'text-transparent'}
        `}
      >
        {value}
      </button>
    )
  }

  const getWinningLine = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return line
      }
    }
    return []
  }

  return (
    <div className="relative">
      {/* Конфетти */}
      {confettiElements.map((confetti) => (
        <div
          key={confetti.id}
          className="confetti"
          style={{
            left: confetti.left,
            backgroundColor: confetti.color,
            width: confetti.size,
            height: confetti.size,
            animationDelay: confetti.delay,
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Игровая сетка */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 bg-white/30 p-4 md:p-6 rounded-3xl shadow-gentle backdrop-blur-sm">
        {Array.from({ length: 9 }).map((_, index) => renderSquare(index))}
      </div>
    </div>
  )
}

export default GameBoard

