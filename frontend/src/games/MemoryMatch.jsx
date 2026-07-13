import { useState, useEffect, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ICONS = ['⚡', '🔥', '💧', '🌟', '🎯', '🚀', '🏆', '🎨'];

const generateShuffledCards = () => {
  const pairs = [...ICONS, ...ICONS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((icon, index) => ({
    id: index,
    icon,
    flipped: false,
    matched: false,
  }));
};

function MemoryMatch() {
  const [cards, setCards] = useState(generateShuffledCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);

  const timerRef = useRef(null);
  const startedRef = useRef(false);

  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimerIfNeeded = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
  };

  const handleCardClick = (index) => {
    if (locked || cards[index].flipped || cards[index].matched || gameOver) return;

    startTimerIfNeeded();

    const newCards = cards.slice();
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;

      if (newCards[first].icon === newCards[second].icon) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards([...newCards]);
        setFlippedIndices([]);
        setLocked(false);

        if (newCards.every((c) => c.matched)) {
          finishGame();
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    setGameOver(true);

    // Fewer moves and less time = higher score
    const score = Math.max(20, 300 - moves * 8 - seconds * 2);
    submitScore(Math.floor(score));
  };

  const submitScore = async (score) => {
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Memory Match',
        score,
      });
      let msg = `You earned ${response.data.gameScore.coinsEarned} coins! 🪙`;
      if (response.data.newBadges && response.data.newBadges.length > 0) {
        msg += ` New Badge Unlocked: ${response.data.newBadges.join(', ')} 🏅`;
      }
      setMessage(msg);
      updateUser({
        coins: response.data.updatedCoins,
        xp: response.data.updatedXp,
        level: response.data.updatedLevel,
        badges: response.data.updatedBadges,
      });
    } catch (error) {
      setMessage('Error saving score');
    } finally {
      setSubmitting(false);
    }
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    startedRef.current = false;
    setCards(generateShuffledCards());
    setFlippedIndices([]);
    setMoves(0);
    setSeconds(0);
    setGameOver(false);
    setMessage('');
    setLocked(false);
  };

  return (
    <div className="text-center">
      <h3>Memory Match 🧠</h3>
      <p className="text-muted">Find all matching pairs in as few moves as possible!</p>

      <div className="d-flex justify-content-center gap-4 mb-3">
        <span><strong>Moves:</strong> {moves}</span>
        <span><strong>Time:</strong> {seconds}s</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 70px)',
          gap: '10px',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            style={{
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              borderRadius: '8px',
              cursor: card.matched ? 'default' : 'pointer',
              backgroundColor: card.matched ? '#d4edda' : card.flipped ? '#ffffff' : '#003876',
              border: card.matched ? '2px solid #198754' : '2px solid #333',
              transition: 'background-color 0.2s',
              userSelect: 'none',
            }}
          >
            {card.flipped || card.matched ? card.icon : ''}
          </div>
        ))}
      </div>

      {gameOver && (
        <>
          <h4 className="text-success">Completed in {moves} moves and {seconds}s! 🎉</h4>
          {submitting && <p>Saving score...</p>}
          {message && <p className="text-primary">{message}</p>}
          <button className="btn iocl-btn-primary mt-2" onClick={resetGame}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

export default MemoryMatch;