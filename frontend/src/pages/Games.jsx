import { useState } from 'react';
import Navbar from '../components/Navbar';
import TicTacToe from '../games/TicTacToe';
import QuizChallenge from '../games/QuizChallenge';
import ReactionTest from '../games/ReactionTest';
import SpinWheel from '../games/SpinWheel';
import MemoryMatch from '../games/MemoryMatch';

function Games() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Games</h2>

        {!selectedGame && (
          <div className="row justify-content-center g-4">
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow-sm border-0"
                style={{ borderTop: '4px solid #C81E2C' }}
              >
                <h1 style={{ fontSize: '2.5rem' }}>🎮</h1>
                <h5 className="iocl-heading">Tic Tac Toe</h5>
                <p className="text-muted small">Classic strategy game. Win to earn coins!</p>
                <button
                  className="btn iocl-btn-primary mt-2"
                  onClick={() => setSelectedGame('tictactoe')}
                >
                  Play Now
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow-sm border-0"
                style={{ borderTop: '4px solid #C81E2C' }}
              >
                <h1 style={{ fontSize: '2.5rem' }}>🧠</h1>
                <h5 className="iocl-heading">Memory Match</h5>
                <p className="text-muted small">Test your memory — fewer moves, more coins!</p>
                <button
                  className="btn iocl-btn-primary mt-2"
                  onClick={() => setSelectedGame('memorymatch')}
                >
                  Play Now
                </button>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow-sm border-0"
                style={{ borderTop: '4px solid #C81E2C' }}
              >
                <h1 style={{ fontSize: '2.5rem' }}>🧠</h1>
                <h5 className="iocl-heading">Quiz Challenge</h5>
                <p className="text-muted small">Test your knowledge and earn rewards!</p>
                <button
                  className="btn iocl-btn-primary mt-2"
                  onClick={() => setSelectedGame('quiz')}
                >
                  Play Now
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow-sm border-0"
                style={{ borderTop: '4px solid #C81E2C' }}
              >
                <h1 style={{ fontSize: '2.5rem' }}>🎡</h1>
                <h5 className="iocl-heading">Spin Wheel</h5>
                <p className="text-muted small">Try your luck and win big rewards!</p>
                <button
                  className="btn iocl-btn-primary mt-2"
                  onClick={() => setSelectedGame('spinwheel')}
                >
                  Play Now
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow-sm border-0"
                style={{ borderTop: '4px solid #C81E2C' }}
              >
                <h1 style={{ fontSize: '2.5rem' }}>⚡</h1>
                <h5 className="iocl-heading">Reaction Test</h5>
                <p className="text-muted small">Test your reflexes and earn rewards!</p>
                <button
                  className="btn iocl-btn-primary mt-2"
                  onClick={() => setSelectedGame('reaction')}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedGame && (
          <div className="mt-4">
            <button
              className="btn btn-outline-secondary mb-4"
              onClick={() => setSelectedGame(null)}
            >
              ← Back to Games
            </button>

            {selectedGame === 'tictactoe' && <TicTacToe />}
            {selectedGame === 'quiz' && <QuizChallenge />}
            {selectedGame === 'reaction' && <ReactionTest />}
            {selectedGame === 'spinwheel' && <SpinWheel />}
            {selectedGame === 'memorymatch' && <MemoryMatch />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Games;