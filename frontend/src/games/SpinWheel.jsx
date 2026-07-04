import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const segments = [
  { label: '10 pts', score: 10, color: '#003876' },
  { label: '50 pts', score: 50, color: '#C81E2C' },
  { label: '20 pts', score: 20, color: '#003876' },
  { label: '100 pts', score: 100, color: '#C81E2C' },
  { label: '30 pts', score: 30, color: '#003876' },
  { label: '70 pts', score: 70, color: '#C81E2C' },
];

const segmentAngle = 360 / segments.length;

function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { updateUser } = useContext(AuthContext);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setMessage('');

    const randomIndex = Math.floor(Math.random() * segments.length);
    const extraSpins = 5 * 360;
    const targetAngle =
      extraSpins + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[randomIndex]);
      submitScore(segments[randomIndex].score);
    }, 4000);
  };

  const submitScore = async (score) => {
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Spin Wheel',
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

  const conicGradient = `conic-gradient(${segments
    .map((seg, i) => {
      const start = i * segmentAngle;
      const end = start + segmentAngle;
      return `${seg.color} ${start}deg ${end}deg`;
    })
    .join(', ')})`;

  return (
    <div className="text-center">
      <h3>Spin Wheel</h3>
      <p className="text-muted">Spin the wheel and earn coins based on your luck!</p>

      <div style={{ position: 'relative', width: '300px', margin: '30px auto' }}>
        {/* Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '25px solid #C81E2C',
            zIndex: 10,
          }}
        ></div>

        {/* Wheel */}
        <div
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: conicGradient,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            border: '5px solid #333',
          }}
        ></div>
      </div>

      <button className="btn iocl-btn-primary" onClick={spin} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {result && (
        <h4 className="text-success mt-3">You landed on: {result.label} 🎉</h4>
      )}
      {submitting && <p>Saving score...</p>}
      {message && <p className="text-primary">{message}</p>}
    </div>
  );
}

export default SpinWheel;