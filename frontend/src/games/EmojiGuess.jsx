import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PUZZLES = [
  // Hollywood Movies
  { emojis: '🦁👑', answer: 'Lion King', hint: 'Movie' },
  { emojis: '🕷️👨', answer: 'Spider Man', hint: 'Movie' },
  { emojis: '❄️👸', answer: 'Frozen', hint: 'Movie' },
  { emojis: '🚢💔🌊', answer: 'Titanic', hint: 'Movie' },
  { emojis: '🧙‍♂️💍', answer: 'Lord Of The Rings', hint: 'Movie' },
  { emojis: '🦇👨', answer: 'Batman', hint: 'Movie' },
  { emojis: '🐠🔍', answer: 'Finding Nemo', hint: 'Movie' },
  { emojis: '👻🚫', answer: 'Ghostbusters', hint: 'Movie' },
  { emojis: '🌪️🏠', answer: 'The Wizard Of Oz', hint: 'Movie' },
  { emojis: '🦖🏞️', answer: 'Jurassic Park', hint: 'Movie' },
  { emojis: '🃏🤡', answer: 'Joker', hint: 'Movie' },
  { emojis: '🚀👨‍🚀🔴', answer: 'The Martian', hint: 'Movie' },
  { emojis: '🦸‍♂️💍🧤', answer: 'Avengers Infinity War', hint: 'Movie' },
  { emojis: '🐺🏰👑', answer: 'Game Of Thrones', hint: 'Show' },

  // Bollywood Movies
  { emojis: '3️⃣ 🤪', answer: '3 Idiots', hint: 'Movie' },
  { emojis: '👰💔🏃‍♂️🚂', answer: 'Dilwale Dulhania Le Jayenge', hint: 'Movie' },
  { emojis: '🕺💃🎶', answer: 'Dhoom', hint: 'Movie' },
  { emojis: '🐒🏹', answer: 'Bajrangi Bhaijaan', hint: 'Movie' },
  { emojis: '🚴‍♂️🇮🇳🏆', answer: 'Bhaag Milkha Bhaag', hint: 'Movie' },
  { emojis: '🥊🇮🇳👊', answer: 'Sultan', hint: 'Movie' },
  { emojis: '🎓👨‍👩‍👧', answer: 'Taare Zameen Par', hint: 'Movie' },
  { emojis: '🏏🇮🇳🏆', answer: 'Lagaan', hint: 'Movie' },
  { emojis: '👨‍🚀🌕🇮🇳', answer: 'Mission Mangal', hint: 'Movie' },
  { emojis: '🐘🤴', answer: 'Bahubali', hint: 'Movie' },
  { emojis: '💰🎭😂', answer: 'Golmaal', hint: 'Movie' },
  { emojis: '👑⚔️🔥', answer: 'Padmaavat', hint: 'Movie' },
  { emojis: '🏃‍♂️💨🇮🇳', answer: 'Zindagi Na Milegi Dobara', hint: 'Movie' },
  { emojis: '🚨👮‍♂️🔫', answer: 'Singham', hint: 'Movie' },
  { emojis: '🦁💪🎬', answer: 'Sher Shah', hint: 'Movie' },

  // Common Phrases / Words
  { emojis: '☕⏰', answer: 'Coffee Break', hint: 'Phrase' },
  { emojis: '🌅🦉', answer: 'Early Bird', hint: 'Phrase' },
  { emojis: '🧠💨', answer: 'Brainstorm', hint: 'Word' },
  { emojis: '☔🐱🐶', answer: 'Raining Cats And Dogs', hint: 'Phrase' },
];

const ROUNDS = 6;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const normalize = (str) => str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

function EmojiGuess() {
  const [puzzles] = useState(() => shuffleArray(PUZZLES).slice(0, ROUNDS));
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { updateUser } = useContext(AuthContext);

  const handleSubmitGuess = () => {
    if (revealed || !guess.trim()) return;

    const isCorrect = normalize(guess) === normalize(puzzles[current].answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setRevealed(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (current + 1 < puzzles.length) {
      setCurrent(current + 1);
      setGuess('');
      setFeedback(null);
      setRevealed(false);
    } else {
      setGameOver(true);
      submitScore();
    }
  };

  const submitScore = async () => {
    const score = correctCount * 22;
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Emoji Guess',
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!revealed) handleSubmitGuess();
      else handleNext();
    }
  };

  if (gameOver) {
    return (
      <div className="text-center">
        <h3>Emoji Guess Complete! 🎉</h3>
        <p>
          You got {correctCount} out of {puzzles.length} correct
        </p>
        {submitting && <p>Saving score...</p>}
        {message && <p className="text-primary">{message}</p>}
        <button className="btn iocl-btn-primary mt-2" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  const puzzle = puzzles[current];

  return (
    <div className="text-center">
      <h3>Emoji Guess 🎭</h3>
      <p className="text-muted">
        Round {current + 1} of {puzzles.length} — Guess the {puzzle.hint.toLowerCase()}!
      </p>

      <div
        style={{
          fontSize: '60px',
          margin: '30px auto',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          maxWidth: '350px',
          border: '2px solid #003876',
        }}
      >
        {puzzle.emojis}
      </div>

      {!revealed && (
        <div className="d-flex justify-content-center gap-2">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '300px' }}
            placeholder="Type your guess..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button className="btn iocl-btn-primary" onClick={handleSubmitGuess}>
            Guess
          </button>
        </div>
      )}

      {revealed && (
        <div className="mt-3">
          {feedback === 'correct' ? (
            <h4 className="text-success">Correct! 🎉</h4>
          ) : (
            <h4 className="text-danger">Not quite! The answer was: {puzzle.answer}</h4>
          )}
          <button className="btn iocl-btn-primary mt-2" onClick={handleNext}>
            {current + 1 < puzzles.length ? 'Next Round' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EmojiGuess;