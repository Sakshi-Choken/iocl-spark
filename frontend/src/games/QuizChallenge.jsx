import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const questions = [
  {
    question: 'What does IOCL stand for?',
    options: [
      'Indian Oil Corporation Limited',
      'Indian Overseas Company Limited',
      'International Oil Corporation Limited',
      'Indian Ocean Company Limited',
    ],
    answer: 'Indian Oil Corporation Limited',
  },
  {
    question: 'Which of these is a renewable energy source?',
    options: ['Coal', 'Natural Gas', 'Solar Power', 'Petroleum'],
    answer: 'Solar Power',
  },
  {
    question: 'What is the full form of LPG?',
    options: [
      'Liquid Propane Gas',
      'Liquefied Petroleum Gas',
      'Low Pressure Gas',
      'Light Petroleum Gas',
    ],
    answer: 'Liquefied Petroleum Gas',
  },
  {
    question: 'Which fuel is commonly used in aircraft?',
    options: ['Petrol', 'Diesel', 'Aviation Turbine Fuel', 'Kerosene'],
    answer: 'Aviation Turbine Fuel',
  },
  {
    question: 'Refineries convert crude oil into which of these?',
    options: ['Only Petrol', 'Only Diesel', 'Multiple Products', 'Only Plastic'],
    answer: 'Multiple Products',
  },
];

function QuizChallenge() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { updateUser } = useContext(AuthContext);

  const handleOptionClick = (option) => {
    if (selected) return;
    setSelected(option);

    if (option === questions[currentQ].answer) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setQuizOver(true);
      submitScore();
    }
  };

  const submitScore = async (score) => {
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Quiz Challenge',
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

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setCorrectCount(0);
    setQuizOver(false);
    setMessage('');
  };

  if (quizOver) {
    return (
      <div className="text-center">
        <h3>Quiz Complete! 🎉</h3>
        <p>
          You got {correctCount} out of {questions.length} correct
        </p>
        {submitting && <p>Saving score...</p>}
        {message && <p className="text-primary">{message}</p>}
        <button className="btn btn-primary mt-2" onClick={resetQuiz}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3>Quiz Challenge</h3>
      <p className="text-muted">
        Question {currentQ + 1} of {questions.length}
      </p>

      <h5 className="my-4">{questions[currentQ].question}</h5>

      <div className="d-flex flex-column align-items-center gap-2">
        {questions[currentQ].options.map((option, index) => {
          let btnClass = 'btn btn-outline-dark';
          if (selected) {
            if (option === questions[currentQ].answer) {
              btnClass = 'btn btn-success';
            } else if (option === selected) {
              btnClass = 'btn btn-danger';
            }
          }
          return (
            <button
              key={index}
              className={btnClass}
              style={{ width: '300px' }}
              onClick={() => handleOptionClick(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="btn btn-primary mt-4" onClick={handleNext}>
          {currentQ + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
}

export default QuizChallenge;