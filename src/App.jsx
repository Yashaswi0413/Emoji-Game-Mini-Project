import React, { useState, useEffect } from 'react';

const EMOJIS = ['🐶', '🐱', '🐭', '🦊', '🐻', '🐼', '🐸', '🦁'];

const shuffledEmojis = () => {
  const cards = [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((emoji, idx) => ({
      id: idx,
      emoji,
      flipped: false,
      matched: false,
    }));
  return cards;
};

function App() {
  const [cards, setCards] = useState(shuffledEmojis());
  const [flippedCards, setFlippedCards] = useState([]);

  const handleCardClick = (id) => {
    const clickedCard = cards.find(card => card.id === id);
    if (flippedCards.length === 2 || clickedCard.flipped || clickedCard.matched) return;

    const newCards = cards.map(card =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(cards =>
            cards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, matched: true }
                : card
            )
          );
          setFlippedCards([]);
        }, 500);
      } else {
        // Not matched - flip back
        setTimeout(() => {
          setCards(cards =>
            cards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const resetGame = () => {
    setCards(shuffledEmojis());
    setFlippedCards([]);
  };

return (
  <div style={{ textAlign: 'center' }}>
    <h1> Emoji Memory Game</h1>
    {cards.every(card => card.matched) ? (
      <>
        <h2 style={{ color: 'green' }}>🎉 You Won! 🎉</h2>
        <button onClick={resetGame}>🔄 Play Again</button>
      </>
    ) : (
      <>
        <button onClick={resetGame} style={{ marginBottom: 20 }}>
          🔄 Reset Game
        </button>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 60px)',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                width: 60,
                height: 60,
                fontSize: 32,
                background: card.flipped || card.matched ? '#fff' : '#ddd',
                border: '1px solid #ccc',
                cursor: card.matched ? 'default' : 'pointer',
              }}
              disabled={card.flipped || card.matched}
            >
              {card.flipped || card.matched ? card.emoji : '❓'}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

}

export default App;
