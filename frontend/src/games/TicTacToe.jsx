import { useState, useContext, useEffect, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const calculateWinner = (squares) => {
  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// Minimax algorithm — computer looks ahead and picks the best possible move
const minimax = (squares, depth, isMaximizing) => {
  const winner = calculateWinner(squares);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (squares.every((s) => s !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        best = Math.max(best, minimax(squares, depth + 1, false));
        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'X';
        best = Math.min(best, minimax(squares, depth + 1, true));
        squares[i] = null;
      }
    }
    return best;
  }
};

// Picks the computer's move — mostly smart, occasionally random so it's still beatable
const getComputerMove = (squares) => {
  const empty = squares.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);

  // 25% of the time, play a random move to keep the game fun and beatable
  if (Math.random() < 0.25) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (let i of empty) {
    squares[i] = 'O';
    const score = minimax(squares, 0, false);
    squares[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
};

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const scoredRef = useRef(false);

  const { updateUser } = useContext(AuthContext);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((s) => s !== null);
  const gameOver = winner || isDraw;

  // Computer's turn — runs automatically after the player moves
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        const move = getComputerMove([...squares]);
        const newSquares = squares.slice();
        newSquares[move] = 'O';
        setSquares(newSquares);
        setIsPlayerTurn(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, squares, gameOver]);

  // Submit score once, when the game ends
  useEffect(() => {
    if (gameOver && !scoredRef.current) {
      scoredRef.current = true;
      if (winner === 'X') {
        setResultMsg('You Win! 🎉');
        submitScore(100);
      } else if (winner === 'O') {
        setResultMsg('Computer Wins! 🤖');
        submitScore(15);
      } else {
        setResultMsg("It's a Draw! 🤝");
        submitScore(40);
      }
    }
  }, [gameOver]);

  const handleClick = (index) => {
    if (squares[index] || gameOver || !isPlayerTurn) return;
    const newSquares = squares.slice();
    newSquares[index] = 'X';
    setSquares(newSquares);
    setIsPlayerTurn(false);
  };

  const submitScore = async (score) => {
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Tic Tac Toe',
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
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setMessage('');
    setResultMsg('');
    scoredRef.current = false;
  };

  return (
    <div className="text-center">
      <h3>Tic Tac Toe</h3>
      <p className="text-muted">
        You are <strong>X</strong>. The Computer is <strong>O</strong>.
        {!gameOver && (
          <span> — {isPlayerTurn ? 'Your turn!' : 'Computer is thinking...'}</span>
        )}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 80px)',
          gap: '5px',
          justifyContent: 'center',
          margin: '20px auto',
        }}
      >
        {squares.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: '80px',
              height: '80px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: value === 'X' ? '#003876' : '#C81E2C',
            }}
            className="btn btn-outline-dark"
          >
            {value}
          </button>
        ))}
      </div>

      {resultMsg && <h4 className="text-success">{resultMsg}</h4>}
      {submitting && <p>Saving score...</p>}
      {message && <p className="text-primary">{message}</p>}

      {gameOver && (
        <button className="btn iocl-btn-primary mt-2" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default TicTacToe;