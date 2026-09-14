// The house confetti, as Builder's Risk, GL-BOP and Commercial Auto throw it:
// sixty pieces down the viewport, every third one round.
const COLORS = ['#5C2ED4', '#A614C3', '#ACD697', '#75C9B7', '#FFD700', '#FF6B6B', '#4ECDC4']

const PIECES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 1.5,
  duration: 2 + Math.random() * 2,
  color: COLORS[i % COLORS.length],
  size: 6 + Math.random() * 8,
  rotate: Math.random() * 360,
}))

export default function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden no-print">
      {PIECES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}
