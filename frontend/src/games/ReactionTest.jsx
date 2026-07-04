import { useState, useRef, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function ReactionTest() {
  const [status, setStatus] = useState('idle'); // idle, waiting, ready, tooSoon, result
  const [reactionTime, setReactionTime] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  const { updateUser } = useContext(AuthContext);

  const startTest = () => {
    setStatus('waiting');
    setReactionTime(null);
    setMessage('');

    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds

    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setStatus('ready');
    }, delay);
  };

  const handleClick = () => {
    if (status === 'idle' || status === 'result' || status === 'tooSoon') {
      startTest();
      return;
    }

    if (status === 'waiting') {
      clearTimeout(timeoutRef.current);
      setStatus('tooSoon');
      return;
    }

    if (status === 'ready') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setStatus('result');

      // Score logic: faster reaction = higher score
      const score = Math.max(10, 500 - time);
      submitScore(Math.floor(score));
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

  const getBoxColor = () => {
    if (status === 'waiting') return '#dc3545'; // red
    if (status === 'ready') return '#198754'; // green
    if (status === 'tooSoon') return '#ffc107'; // yellow
    return '#003876'; // navy default
  };

  const getBoxText = () => {
    if (status === 'idle') return 'Click to Start';
    if (status === 'waiting') return 'Wait for Green...';
    if (status === 'ready') return 'Click Now!';
    if (status === 'tooSoon') return 'Too Soon! Click to Retry';
    if (status === 'result') return `${reactionTime} ms — Click to Retry`;
    return '';
  };

  return (
    <div className="text-center">
      <h3>Reaction Test</h3>
      <p className="text-muted">Click the box when it turns green. Faster = more coins!</p>

      <div
        onClick={handleClick}
        style={{
          backgroundColor: getBoxColor(),
          color: 'white',
          width: '300px',
          height: '200px',
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          borderRadius: '10px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {getBoxText()}
      </div>

      {submitting && <p>Saving score...</p>}
      {message && <p className="text-primary">{message}</p>}
    </div>
  );
}

export default ReactionTest;