import { useState } from 'react'
import './DrinkCard.css'

const DEFAULT_DRINKS = [
  { name: 'Matcha Latte', detail: 'oat milk, ceremonial grade', emoji: '🍵' },
  { name: 'Pink Drink', detail: 'strawberry acai, coconut milk', emoji: '🩷' },
  { name: 'Latte', detail: 'oat milk, extra hot', emoji: '☕' },
]

export default function DrinkCard({ drinks = DEFAULT_DRINKS, label = 'her usual' }) {
  const [showOrder, setShowOrder] = useState(false)
  const [drinkIndex, setDrinkIndex] = useState(0)

  const current = drinks[drinkIndex]
  const canCycle = drinks.length > 1

  const cycleDrink = () => {
    if (canCycle) setDrinkIndex((i) => (i + 1) % drinks.length)
  }

  return (
    <div className="drink-card">
      <button
        className="drink-machine-btn"
        onClick={() => setShowOrder(!showOrder)}
        title="Click to see the order"
      >
        <img src="/coffee-machine.svg" alt="Coffee machine" className="coffee-machine-svg" />
      </button>

      <div className={`drink-order ${showOrder ? 'visible' : ''}`}>
        <div className="drink-order-inner">
          <span className="drink-label">{label}</span>
          <button
            className="drink-name-btn"
            onClick={cycleDrink}
            title={canCycle ? 'Click to change drink' : undefined}
            style={canCycle ? undefined : { cursor: 'default' }}
          >
            <span className="drink-emoji">{current.emoji}</span>
            <span className="drink-name">{current.name}</span>
          </button>
          <span className="drink-detail">{current.detail}</span>
          {canCycle && <span className="drink-cycle-hint">tap drink to rotate</span>}
        </div>
      </div>

      {!showOrder && (
        <p className="drink-hint">tap for the order</p>
      )}
    </div>
  )
}
