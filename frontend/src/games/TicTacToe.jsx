import { useState } from 'react';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const { updateUser } = useContext(AuthContext);
  const [isXNext, setIsXNext] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((s) => s !== null);
  const gameOver = winner || isDraw;

  const handleClick = (index) => {
    if (squares[index] || gameOver) return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);

    const newWinner = calculateWinner(newSquares);
    if (newWinner === 'X') {
      submitScore(100);
    } else if (newSquares.every((s) => s !== null) && !newWinner) {
      submitScore(30);
    }
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
    setIsXNext(true);
    setMessage('');
  };

  return (
    <div className="text-center">
      <h3>Tic Tac Toe</h3>
      <p>You are X. Computer is O (play both sides for now).</p>

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
            }}
            className="btn btn-outline-dark"
          >
            {value}
          </button>
        ))}
      </div>

      {winner && <h4 className="text-success">Winner: {winner} 🎉</h4>}
      {isDraw && <h4 className="text-warning">It's a Draw!</h4>}
      {submitting && <p>Saving score...</p>}
      {message && <p className="text-primary">{message}</p>}

      {gameOver && (
        <button className="btn btn-primary mt-2" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default TicTacToe;