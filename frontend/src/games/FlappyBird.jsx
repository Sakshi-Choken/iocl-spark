import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const WIDTH = 360;
const HEIGHT = 480;
const BIRD_SIZE = 22;
const GRAVITY = 0.45;
const FLAP_STRENGTH = -7.5;
const PIPE_WIDTH = 55;
const PIPE_GAP = 140;
const PIPE_SPEED = 2.6;
const PIPE_SPACING = 200;

function FlappyBird() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const birdRef = useRef({ y: HEIGHT / 2, velocity: 0 });
  const pipesRef = useRef([]);
  const scoreRef = useRef(0);
  const frameCountRef = useRef(0);
  const gameOverRef = useRef(false);
  const startedRef = useRef(false);

  const [displayScore, setDisplayScore] = useState(0);
  const [status, setStatus] = useState('ready'); // ready, playing, over
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scoredRef = useRef(false);

  const { updateUser } = useContext(AuthContext);

  const resetGame = () => {
    birdRef.current = { y: HEIGHT / 2, velocity: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    frameCountRef.current = 0;
    gameOverRef.current = false;
    startedRef.current = false;
    scoredRef.current = false;
    setDisplayScore(0);
    setMessage('');
    setStatus('ready');
  };

  const flap = useCallback(() => {
    if (gameOverRef.current) return;
    startedRef.current = true;
    setStatus('playing');
    birdRef.current.velocity = FLAP_STRENGTH;
  }, []);

  const submitScore = async (pipesPassed) => {
    const score = Math.max(10, pipesPassed * 25);
    setSubmitting(true);
    try {
      const response = await api.post('/games/submit-score', {
        gameName: 'Flappy Bird',
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Sky background
      ctx.fillStyle = '#cfe8ff';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (startedRef.current && !gameOverRef.current) {
        // Physics
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;

        frameCountRef.current++;
        if (frameCountRef.current % Math.round(PIPE_SPACING / PIPE_SPEED) === 0) {
          const gapY = 60 + Math.random() * (HEIGHT - 180 - PIPE_GAP);
          pipesRef.current.push({ x: WIDTH, gapY, passed: false });
        }

        pipesRef.current.forEach((pipe) => {
          pipe.x -= PIPE_SPEED;
        });
        pipesRef.current = pipesRef.current.filter((pipe) => pipe.x > -PIPE_WIDTH);

        // Scoring
        pipesRef.current.forEach((pipe) => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < WIDTH / 2 - BIRD_SIZE / 2) {
            pipe.passed = true;
            scoreRef.current += 1;
            setDisplayScore(scoreRef.current);
          }
        });

        // Collision: ground / ceiling
        if (birdRef.current.y + BIRD_SIZE / 2 > HEIGHT || birdRef.current.y - BIRD_SIZE / 2 < 0) {
          gameOverRef.current = true;
        }

        // Collision: pipes
        const birdX = WIDTH / 2;
        pipesRef.current.forEach((pipe) => {
          const withinX = birdX + BIRD_SIZE / 2 > pipe.x && birdX - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH;
          const hitsGap = birdRef.current.y - BIRD_SIZE / 2 < pipe.gapY || birdRef.current.y + BIRD_SIZE / 2 > pipe.gapY + PIPE_GAP;
          if (withinX && hitsGap) {
            gameOverRef.current = true;
          }
        });

        if (gameOverRef.current) {
          setStatus('over');
          if (!scoredRef.current) {
            scoredRef.current = true;
            submitScore(scoreRef.current);
          }
        }
      }

      // Draw pipes
      ctx.fillStyle = '#198754';
      pipesRef.current.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, HEIGHT - pipe.gapY - PIPE_GAP);
      });

      // Draw bird
      ctx.fillStyle = '#C81E2C';
      ctx.beginPath();
      ctx.arc(WIDTH / 2, birdRef.current.y, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#003876';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ground line
      ctx.strokeStyle = '#003876';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, HEIGHT - 1);
      ctx.lineTo(WIDTH, HEIGHT - 1);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'over') {
          resetGame();
        } else {
          flap();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, flap]);

  const handleCanvasClick = () => {
    if (status === 'over') {
      resetGame();
    } else {
      flap();
    }
  };

  return (
    <div className="text-center">
      <h3>Flappy Bird 🐦</h3>
      <p className="text-muted">Click / tap / press Space to flap. Avoid the pipes!</p>
      <p className="fw-bold">Score: {displayScore}</p>

      <div style={{ position: 'relative', width: WIDTH, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onClick={handleCanvasClick}
          style={{ border: '3px solid #003876', borderRadius: '8px', cursor: 'pointer' }}
        />

        {status === 'ready' && (
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: WIDTH, height: HEIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.35)', color: 'white', fontSize: '18px',
              fontWeight: 'bold', borderRadius: '8px', pointerEvents: 'none',
            }}
          >
            Click or Press Space to Start
          </div>
        )}

        {status === 'over' && (
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: WIDTH, height: HEIGHT,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.55)', color: 'white', borderRadius: '8px',
            }}
          >
            <h4>Game Over!</h4>
            <p>Final Score: {displayScore}</p>
            <button className="btn iocl-btn-primary mt-2" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>

      {submitting && <p className="mt-3">Saving score...</p>}
      {message && <p className="text-primary mt-2">{message}</p>}
    </div>
  );
}

export default FlappyBird;