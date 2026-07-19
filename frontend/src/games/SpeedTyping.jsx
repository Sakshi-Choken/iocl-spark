import { useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PARAGRAPHS = [
  'Efficiency and safety go hand in hand in every industrial operation. Continuous improvement is the foundation of a strong engineering culture. Teamwork transforms individual effort into collective achievement, and every small contribution adds up to something meaningful over time.',
  'Innovation thrives when curiosity meets disciplined execution. A well maintained system prevents problems long before they occur, saving both time and resources. Clear communication remains the backbone of successful project delivery, connecting people across every level of an organization.',
  'Quality is never an accident, it is always the result of careful planning and consistent effort. Great leaders build confidence in the people around them by listening first and acting with clarity. Consistency and patience often outperform short bursts of intense but unsustainable effort.',
  'Every challenge is an opportunity to learn something valuable about yourself and your work. Precision and attention to detail define excellent engineering, whether in code, design, or process. A positive workplace culture drives long term organizational success far beyond individual achievements.',
  'Technology continues to reshape the way modern industries operate and grow. Automation reduces repetitive work, allowing skilled employees to focus on problems that truly require human judgment. As systems become more complex, the value of clear documentation and thoughtful design only increases.',
  'Strong teams are built on trust, shared goals, and honest feedback. When people feel safe to share ideas, creativity and problem solving naturally improve across the entire organization. Celebrating small wins along the way keeps motivation high during long and demanding projects.',
];

function SpeedTyping() {
  const [target] = useState(() => PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef(null);
  const { updateUser } = useContext(AuthContext);

  const handleChange = (e) => {
    if (finished) return;
    const value = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (value.length > target.length) return;
    setTyped(value);

    // Finish once the typed length reaches the target length,
    // even if there are mistakes (accuracy will reflect them)
    if (value.length === target.length) {
      finishTest(value, startTime || Date.now());
    }
  };

  const finishTest = (finalTyped, start) => {
    const timeTakenMs = Date.now() - start;
    const timeTakenMin = timeTakenMs / 60000;
    const wordCount = target.trim().split(/\s+/).length;
    const wpm = Math.round(wordCount / timeTakenMin);

    let correctChars = 0;
    for (let i = 0; i < target.length; i++) {
      if (finalTyped[i] === target[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / target.length) * 100);

    setStats({ wpm, accuracy, timeTakenSec: Math.round(timeTakenMs / 1000) });
    setFinished(true);

    const score = Math.max(15, Math.round(wpm * (accuracy / 100) * 1.2));
    submitScore(score);
  };

  const submitScore = async (score) => {
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Speed Typing',
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

  const renderTarget = () => {
    return target.split('').map((char, index) => {
      let color = '#888';
      if (index < typed.length) {
        color = typed[index] === char ? '#198754' : '#dc3545';
      }
      const isCurrent = index === typed.length;
      return (
        <span
          key={index}
          style={{
            color,
            backgroundColor: isCurrent ? '#fff3cd' : 'transparent',
            borderBottom: isCurrent ? '2px solid #003876' : 'none',
          }}
        >
          {char}
        </span>
      );
    });
  };

  const resetGame = () => {
    window.location.reload();
  };

  const wordsTypedCount = typed.trim().length > 0 ? typed.trim().split(/\s+/).length : 0;
  const totalWords = target.trim().split(/\s+/).length;

  return (
    <div className="text-center">
      <h3>Speed Typing Test ⌨️</h3>
      <p className="text-muted">Type the paragraph below as fast and accurately as you can.</p>

      {!finished && (
        <p className="text-muted small">
          Progress: {wordsTypedCount} / {totalWords} words
        </p>
      )}

      <div
        className="mx-auto p-3 mb-3 text-start"
        style={{
          maxWidth: '650px',
          fontSize: '18px',
          lineHeight: '1.9',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontFamily: 'monospace',
        }}
      >
        {renderTarget()}
      </div>

      <textarea
        ref={inputRef}
        className="form-control mx-auto"
        style={{ maxWidth: '650px', fontFamily: 'monospace', fontSize: '16px' }}
        rows="5"
        value={typed}
        onChange={handleChange}
        disabled={finished}
        placeholder="Start typing here..."
        autoFocus
      />

      {finished && stats && (
        <div className="mt-4">
          <h4 className="text-success">Completed! 🎉</h4>
          <p>
            <strong>{stats.wpm}</strong> WPM &nbsp;|&nbsp; <strong>{stats.accuracy}%</strong> Accuracy &nbsp;|&nbsp; {stats.timeTakenSec}s
          </p>
          {submitting && <p>Saving score...</p>}
          {message && <p className="text-primary">{message}</p>}
          <button className="btn iocl-btn-primary mt-2" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SpeedTyping;