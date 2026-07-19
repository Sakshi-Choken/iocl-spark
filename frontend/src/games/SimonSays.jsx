import { useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const COLORS = [
  { id: 0, name: 'green', bg: '#198754', active: '#4ade80' },
  { id: 1, name: 'red', bg: '#dc3545', active: '#f87171' },
  { id: 2, name: 'yellow', bg: '#ffc107', active: '#fde047' },
  { id: 3, name: 'blue', bg: '#0d6efd', active: '#60a5fa' },
];

function SimonSays() {
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, showing, playerTurn, over
  const [activeColor, setActiveColor] = useState(null);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const scoredRef = useRef(false);
  const { updateUser } = useContext(AuthContext);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const playSequence = async (seq) => {
    setStatus('showing');
    await sleep(600);
    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await sleep(450);
      setActiveColor(null);
      await sleep(200);
    }
    setStatus('playerTurn');
    setPlayerStep(0);
  };

  const startGame = () => {
    scoredRef.current = false;
    setRound(0);
    setMessage('');
    const firstColor = Math.floor(Math.random() * 4);
    const newSeq = [firstColor];
    setSequence(newSeq);
    setRound(1);
    playSequence(newSeq);
  };

  const nextRound = (currentSeq) => {
    const newColor = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, newColor];
    setSequence(newSeq);
    setRound(newSeq.length);
    playSequence(newSeq);
  };

  const handleColorClick = (colorId) => {
    if (status !== 'playerTurn') return;

    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);

    if (colorId === sequence[playerStep]) {
      if (playerStep + 1 === sequence.length) {
        // Completed this round correctly — move to next round
        setTimeout(() => nextRound(sequence), 500);
      } else {
        setPlayerStep(playerStep + 1);
      }
    } else {
      // Wrong! Game over
      setStatus('over');
      if (!scoredRef.current) {
        scoredRef.current = true;
        submitScore(round);
      }
    }
  };

  const submitScore = async (roundsReached) => {
    const score = Math.max(10, (roundsReached - 1) * 20);
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Simon Says',
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

  return (
    <div className="text-center">
      <h3>Simon Says 🎨</h3>
      <p className="text-muted">Watch the sequence, then repeat it. Each round adds one more color!</p>

      {status !== 'idle' && (
        <p className="fw-bold">
          Round: {round} {status === 'showing' && '— Watch carefully...'}
          {status === 'playerTurn' && '— Your turn!'}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 120px)',
          gridTemplateRows: 'repeat(2, 120px)',
          gap: '8px',
          justifyContent: 'center',
          margin: '20px auto',
          width: 'fit-content',
        }}
      >
        {COLORS.map((color) => (
          <div
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: activeColor === color.id ? color.active : color.bg,
              borderRadius: '12px',
              cursor: status === 'playerTurn' ? 'pointer' : 'default',
              opacity: status === 'playerTurn' || activeColor === color.id ? 1 : 0.85,
              transform: activeColor === color.id ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.15s',
              boxShadow: activeColor === color.id ? '0 0 20px rgba(255,255,255,0.8)' : 'none',
            }}
          ></div>
        ))}
      </div>

      {status === 'idle' && (
        <button className="btn iocl-btn-primary" onClick={startGame}>
          Start Game
        </button>
      )}

      {status === 'over' && (
        <div className="mt-3">
          <h4 className="text-danger">Game Over! You reached Round {round}</h4>
          {submitting && <p>Saving score...</p>}
          {message && <p className="text-primary">{message}</p>}
          <button className="btn iocl-btn-primary mt-2" onClick={startGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SimonSays;