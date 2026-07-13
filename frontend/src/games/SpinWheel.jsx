import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const segments = [
  { label: 'Drink a glass of water 💧', score: 30, color: '#003876', big: false },
  { label: 'Dance for 15 seconds 💃', score: 60, color: '#C81E2C', big: true },
  { label: 'Sing a song\'s chorus 🎤', score: 60, color: '#C81E2C', big: true },
  { label: 'Compliment a colleague 😊', score: 40, color: '#6c757d', big: false },
  { label: 'Do 5 jumping jacks 🤸', score: 50, color: '#003876', big: false },
  { label: 'Tell the team a joke 😂', score: 45, color: '#6c757d', big: false },
  { label: 'Strike a superhero pose 🦸', score: 55, color: '#C81E2C', big: true },
  { label: 'Take 5 deep breaths 😌', score: 25, color: '#003876', big: false },
];

const segmentAngle = 360 / segments.length;

const CONFETTI_COLORS = ['#C81E2C', '#003876', '#FFD700', '#198754', '#fd7e14'];

function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [history, setHistory] = useState([]);

  const { updateUser } = useContext(AuthContext);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setMessage('');
    setHighlight(false);
    setShowConfetti(false);

    const randomIndex = Math.floor(Math.random() * segments.length);
    const extraSpins = 6 * 360;
    const targetAngle =
      extraSpins + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      const landed = segments[randomIndex];
      setResult(landed);
      setHighlight(true);
      setHistory((prev) => [landed, ...prev].slice(0, 5));
      if (landed.big) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      submitScore(landed.score);
    }, 4500);
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
    <div className="text-center" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
        @keyframes pointer-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(4px); }
        }
      `}</style>

      <h3>Fun Dare Wheel 🎡</h3>
      <p className="text-muted">Spin the wheel — complete your fun dare and earn coins!</p>

      <div style={{ position: 'relative', width: '300px', margin: '30px auto' }}>
        {showConfetti &&
          Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '40%',
                left: `${Math.random() * 100}%`,
                width: '8px',
                height: '8px',
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `confetti-fall ${0.8 + Math.random()}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.3}s`,
                zIndex: 20,
              }}
            ></div>
          ))}

        <div
          style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '25px solid #C81E2C',
            zIndex: 10,
            animation: spinning ? 'pointer-bounce 0.15s infinite' : 'none',
          }}
        ></div>

        <div
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: conicGradient,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 4.5s cubic-bezier(0.17, 0.89, 0.32, 1.1)',
            border: highlight ? '6px solid #FFD700' : '5px solid #333',
            boxShadow: highlight ? '0 0 25px 8px rgba(255, 215, 0, 0.6)' : 'none',
          }}
        ></div>
      </div>

      <button className="btn iocl-btn-primary" onClick={spin} disabled={spinning}>
        {spinning ? 'Spinning...' : result ? 'Spin Again' : 'Spin the Wheel'}
      </button>

      {result && (
        <div className="card p-3 mt-3 mx-auto" style={{ maxWidth: '350px', border: '2px solid #FFD700' }}>
          <h5 className="text-danger mb-0">Your Dare:</h5>
          <h4 className="mt-2">{result.label}</h4>
        </div>
      )}
      {submitting && <p className="mt-3">Saving score...</p>}
      {message && <p className="text-primary">{message}</p>}

      {history.length > 0 && (
        <div className="mt-4">
          <p className="text-muted small mb-2">Recent Dares:</p>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {history.map((h, i) => (
              <span
                key={i}
                className="badge"
                style={{ backgroundColor: h.color, fontSize: '12px', padding: '6px 10px' }}
              >
                {h.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SpinWheel;