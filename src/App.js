import { useEffect, useState } from 'react';
import './App.css';

const bananaUrl = 'https://stardewvalleywiki.com/mediawiki/images/6/69/Banana.png';
const chickenUrl = 'https://stardewvalleywiki.com/mediawiki/images/6/67/Void_Chicken.png';

function generateRandomGrid(size = 36) {
  const half = size / 2;
  const balancedTypes = [
    ...Array(half).fill('banana'),
    ...Array(half).fill('chicken'),
  ];

  for (let i = balancedTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [balancedTypes[i], balancedTypes[j]] = [balancedTypes[j], balancedTypes[i]];
  }

  return balancedTypes.map((type, index) => ({
    type,
    revealed: false,
    index,
  }));
}

function App() {
  const [tiles, setTiles] = useState([]);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setTiles(generateRandomGrid());
  }, []);

  const resetFullGame = () => {
    setTiles(generateRandomGrid());
    setScore(0);
    setGameOver(false);
    setMessage('');
    setPlayerChoice(null);
  };

  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
    setMessage('');
    setScore(0);
    setGameOver(false);
    setTiles(generateRandomGrid());
  };

  const handleClick = (tileIndex) => {
    if (gameOver || !playerChoice) return;

    const newTiles = [...tiles];
    const clickedTile = newTiles[tileIndex];

    if (clickedTile.revealed) return;

    newTiles[tileIndex].revealed = true;
    setTiles(newTiles);

    if (clickedTile.type === playerChoice) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage(`✅ Correct! Your score is now ${newScore}`);

      if (newScore >= 5) {
        setMessage(`🎉 You won the game with ${newScore} points! 🏆`);
        setGameOver(true);
      }
    } else {
      setMessage(`❌ Wrong tile! Try again.`);
    }
  };

  return (
    <div className="game-wrapper">
      <div className="score-panel">
        <h2>Score</h2>
        <p>{playerChoice ? `${playerChoice.toUpperCase()}: ${score}` : '-'}</p>
      </div>

      <div className="container">
        <h1>Chicken Banana Game Minesweeper!</h1>

        {!playerChoice && (
          <div className="choice">
            <p>Select your player:</p>
            <button onClick={() => handlePlayerChoice('chicken')}>I'm Chicken 🐔</button>
            <button onClick={() => handlePlayerChoice('banana')}>I'm Banana 🍌</button>
          </div>
        )}

        {playerChoice && <p>You are playing as: <strong>{playerChoice.toUpperCase()}</strong></p>}

        <div className="grid grid-6x6">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="tile-wrapper"
              onClick={() => handleClick(index)}
            >
              <div className={`card ${tile.revealed ? 'flipped' : ''}`}>
                <div className="front"></div>
                <div
                  className="back"
                  style={{
                    backgroundImage: `url(${tile.type === 'banana' ? bananaUrl : chickenUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {message && <h2>{message}</h2>}

        {gameOver && (
          <button onClick={resetFullGame} className="reset-btn">🎮 New Game</button>
        )}
      </div>
    </div>
  );
}

export default App;
