import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const questionBank = [
  {
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?',
    options: ['Echo', 'Shadow', 'Ghost', 'Whisper'],
    answer: 'Echo',
  },
  {
    question: 'The more you take, the more you leave behind. What am I?',
    options: ['Time', 'Memories', 'Footsteps', 'Money'],
    answer: 'Footsteps',
  },
  {
    question: 'What has keys but no locks, space but no room, and you can enter but not go inside?',
    options: ['A Piano', 'A Keyboard', 'A Map', 'A Safe'],
    answer: 'A Keyboard',
  },
  {
    question: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
    options: ['The letter M', 'A second', 'A blink', 'A heartbeat'],
    answer: 'The letter M',
  },
  {
    question: 'What has a neck but no head?',
    options: ['A bottle', 'A shirt', 'A guitar', 'A road'],
    answer: 'A bottle',
  },
  {
    question: 'What month of the year has 28 days?',
    options: ['February', 'All of them', 'April', 'None of them'],
    answer: 'All of them',
  },
  {
    question: 'What can travel around the world while staying in a corner?',
    options: ['A stamp', 'A coin', 'A map', 'A shadow'],
    answer: 'A stamp',
  },
  {
    question: 'What has to be broken before you can use it?',
    options: ['An egg', 'A promise', 'A rule', 'A lock'],
    answer: 'An egg',
  },
  {
    question: 'I am tall when I am young, and short when I am old. What am I?',
    options: ['A tree', 'A candle', 'A person', 'A shadow'],
    answer: 'A candle',
  },
  {
    question: 'What gets wetter the more it dries?',
    options: ['A sponge', 'A towel', 'Rain', 'The ocean'],
    answer: 'A towel',
  },
  {
    question: 'What has one eye but cannot see?',
    options: ['A needle', 'A storm', 'A potato', 'A camera'],
    answer: 'A needle',
  },
  {
    question: 'What building has the most stories?',
    options: ['A library', 'A skyscraper', 'A museum', 'A castle'],
    answer: 'A library',
  },
  {
    question: 'Which word becomes shorter when you add two letters to it?',
    options: ['Short', 'Long', 'Tiny', 'Small'],
    answer: 'Short',
  },
  {
    question: 'What is full of holes but still holds water?',
    options: ['A sponge', 'A net', 'A bucket', 'A pipe'],
    answer: 'A sponge',
  },
  {
    question: 'What has hands but cannot clap?',
    options: ['A clock', 'A statue', 'A glove', 'A robot'],
    answer: 'A clock',
  },
  {
    question: 'You see a boat full of people, yet there is not a single person on board. How?',
    options: ["They're all married", "They're all invisible", "It's a toy boat", 'They swam away'],
    answer: "They're all married",
  },
  {
    question: 'What can you catch but not throw?',
    options: ['A cold', 'A ball', 'A fish', 'A thief'],
    answer: 'A cold',
  },
  {
    question: 'If you have three apples and take away two, how many do you have?',
    options: ['Two', 'One', 'Three', 'Zero'],
    answer: 'Two',
  },
  {
    question: 'What is always in front of you but can never be seen?',
    options: ['The future', 'The air', 'Your nose', 'Tomorrow'],
    answer: 'The future',
  },
  {
    question: 'A farmer has 17 sheep, and all but 9 run away. How many are left?',
    options: ['9', '8', '17', '0'],
    answer: '9',
  },
];

// Shuffle helper (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function QuizChallenge() {
  const [questions] = useState(() => shuffleArray(questionBank).slice(0, 5));
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

  const submitScore = async () => {
    const score = correctCount * 20;
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

  if (quizOver) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    let feedback = 'Keep practicing! 🧩';
    if (percentage === 100) feedback = 'Genius! Perfect Score! 🧠🎉';
    else if (percentage >= 60) feedback = 'Great job! 👏';

    return (
      <div className="text-center">
        <h3>Quiz Complete! 🎉</h3>
        <p>
          You got {correctCount} out of {questions.length} correct
        </p>
        <h5 className="text-primary">{feedback}</h5>
        {submitting && <p>Saving score...</p>}
        {message && <p className="text-primary">{message}</p>}
        <button className="btn iocl-btn-primary mt-2" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3>Quiz Challenge — Brain Teasers 🧩</h3>
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
              style={{ width: '320px' }}
              onClick={() => handleOptionClick(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="btn iocl-btn-primary mt-4" onClick={handleNext}>
          {currentQ + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
}

export default QuizChallenge;