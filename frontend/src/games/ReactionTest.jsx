import { useState, useRef, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TOTAL_ROUNDS = 3;
const COLOR_POOL = [
  { name: 'Green', hex: '#198754' },
  { name: 'Red', hex: '#dc3545' },
  { name: 'Blue', hex: '#0d6efd' },
  { name: 'Purple', hex: '#6f42c1' },
  { name: 'Orange', hex: '#fd7e14' },
  { name: 'Pink', hex: '#d63384' },
];

function ReactionTest() {
  const [status, setStatus] = useState('idle'); // idle, preview, waiting, ready, wrongColor, roundResult, finalResult
  const [round, setRound] = useState(1);
  const [times, setTimes] = useState([]);
  const [target, setTarget] = useState(null);
  const [boxColor, setBoxColor] = useState('#003876');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);
  const colorIntervalRef = useRef(null);

  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(colorIntervalRef.current);
    };
  }, []);

  const getRating = (avgTime) => {
    if (avgTime < 250) return { text: 'Lightning Fast! ⚡', color: 'text-success' };
    if (avgTime < 400) return { text: 'Great Reflexes! 🔥', color: 'text-primary' };
    if (avgTime < 550) return { text: 'Pretty Good! 👍', color: 'text-warning' };
    return { text: 'Keep Practicing! 🐢', color: 'text-danger' };
  };

  const startRound = () => {
    const chosenTarget = COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
    setTarget(chosenTarget);
    setStatus('preview');
    setBoxColor(chosenTarget.hex);

    // Show the target color briefly so the player knows what to look for
    timeoutRef.current = setTimeout(() => {
      beginDistraction(chosenTarget);
    }, 1300);
  };

  const beginDistraction = (chosenTarget) => {
    setStatus('waiting');
    const totalDelay = Math.floor(Math.random() * 3000) + 2500; // 2.5-5.5 seconds

    const distractors = COLOR_POOL.filter((c) => c.hex !== chosenTarget.hex);
    setBoxColor(distractors[Math.floor(Math.random() * distractors.length)].hex);

    colorIntervalRef.current = setInterval(() => {
      setBoxColor(distractors[Math.floor(Math.random() * distractors.length)].hex);
    }, 350);

    timeoutRef.current = setTimeout(() => {
      clearInterval(colorIntervalRef.current);
      setBoxColor(chosenTarget.hex);
      startTimeRef.current = Date.now();
      setStatus('ready');
    }, totalDelay);
  };

  const handleClick = () => {
    if (status === 'idle') {
      startRound();
      return;
    }

    if (status === 'roundResult') {
      startRound();
      return;
    }

    if (status === 'finalResult') {
      resetGame();
      return;
    }

    if (status === 'wrongColor') {
      startRound();
      return;
    }

    if (status === 'preview' || status === 'waiting') {
      clearTimeout(timeoutRef.current);
      clearInterval(colorIntervalRef.current);
      setStatus('wrongColor');
      return;
    }

    if (status === 'ready') {
      const time = Date.now() - startTimeRef.current;
      const newTimes = [...times, time];
      setTimes(newTimes);

      if (round < TOTAL_ROUNDS) {
        setStatus('roundResult');
        setRound(round + 1);
      } else {
        setStatus('finalResult');
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        const score = Math.max(10, 600 - avg);
        submitScore(Math.floor(score));
      }
    }
  };

  const submitScore = async (score) => {
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Reaction Test',
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
    setStatus('idle');
    setRound(1);
    setTimes([]);
    setTarget(null);
    setBoxColor('#003876');
    setMessage('');
  };

  const getBoxText = () => {
    if (status === 'idle') return 'Click to Start (3 Rounds)';
    if (status === 'preview') return `Watch for ${target?.name}!`;
    if (status === 'wrongColor') return 'Wrong Color! Click to Retry';
    if (status === 'roundResult') return `Round ${round - 1}: ${times[times.length - 1]} ms — Click for Round ${round}`;
    if (status === 'finalResult') {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      return `Average: ${avg} ms — Click to Play Again`;
    }
    return ''; // waiting & ready show no text — only color matters
  };

  const getDisplayColor = () => {
    if (status === 'preview' || status === 'waiting' || status === 'ready') return boxColor;
    if (status === 'wrongColor') return '#ffc107';
    return '#003876';
  };

  const avgTime = times.length === TOTAL_ROUNDS ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const rating = avgTime ? getRating(avgTime) : null;

  return (
    <div className="text-center">
      <h3>Reaction Test</h3>
      <p className="text-muted">
        Best of {TOTAL_ROUNDS} rounds — a target color is revealed each round. Colors will flash — click <strong>only</strong> when that exact color returns!
      </p>
      {status !== 'idle' && status !== 'finalResult' && (
        <p className="text-muted">Round {round} of {TOTAL_ROUNDS}</p>
      )}

      <div
        onClick={handleClick}
        style={{
          backgroundColor: getDisplayColor(),
          color: 'white',
          width: '320px',
          height: '200px',
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '10px',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '10px',
          textAlign: 'center',
          transition: 'background-color 0.1s',
        }}
      >
        {getBoxText()}
      </div>

      {status === 'finalResult' && rating && (
        <h4 className={rating.color}>{rating.text}</h4>
      )}

      {times.length > 0 && (
        <p className="text-muted small">
          Times so far: {times.map((t) => `${t}ms`).join(', ')}
        </p>
      )}

      {submitting && <p>Saving score...</p>}
      {message && <p className="text-primary">{message}</p>}
    </div>
  );
}

export default ReactionTest;