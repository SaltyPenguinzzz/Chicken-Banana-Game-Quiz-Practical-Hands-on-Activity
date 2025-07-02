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
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState({ banana: 0, chicken: 0 });
  const [matchScore, setMatchScore] = useState({ banana: 0, chicken: 0 });
  const [explodedIndex, setExplodedIndex] = useState(null);

  useEffect(() => {
    setTiles(generateRandomGrid());
  }, []);

  const resetGame = () => {
    setGameOver(false);
    setMessage('');
    setScore({ banana: 0, chicken: 0 });
    setExplodedIndex(null);

    if (currentPlayer === 'chicken') {
      setPlayerChoice('banana');
      setCurrentPlayer('banana');
    } else if (currentPlayer === 'banana') {
      setPlayerChoice('chicken');
      setCurrentPlayer('chicken');
    } else {
      setPlayerChoice(null);
      setCurrentPlayer(null);
    }
  };

  const resetFullGame = () => {
    setTiles(generateRandomGrid());
    setMatchScore({ banana: 0, chicken: 0 });
    setGameOver(false);
    setMessage('');
    setScore({ banana: 0, chicken: 0 });
    setExplodedIndex(null);
    setPlayerChoice(null);
    setCurrentPlayer(null);
  };

  const handlePlayerChoice = (choice) => {
    if (!playerChoice) {
      setPlayerChoice(choice);
      setCurrentPlayer(choice);
    }
  };

  const handleClick = (tileIndex) => {
    if (gameOver || !playerChoice) return;

    const newTiles = [...tiles];
    const clickedTile = newTiles[tileIndex];

    if (clickedTile.revealed) return;

    if (clickedTile.type === playerChoice) {
      newTiles[tileIndex].revealed = true;
      const updatedScore = { ...score };
      updatedScore[playerChoice] += 1;
      setScore(updatedScore);
      setTiles(newTiles);

      const totalToFind = newTiles.filter(t => t.type === playerChoice).length;
      const totalFound = newTiles.filter(t => t.revealed && t.type === playerChoice).length;

      if (totalFound === totalToFind) {
        const finalScore = matchScore[playerChoice] + 5;
        const updatedMatch = {
          ...matchScore,
          [playerChoice]: finalScore,
        };
        setMatchScore(updatedMatch);

        if (finalScore >= 10) {
          setMessage(`🎉 ${playerChoice.toUpperCase()} wins the MATCH with ${finalScore} points! 🏆`);
          setGameOver(true);
          setPlayerChoice(null);
          return;
        }

        setMessage(`🎉 ${playerChoice.toUpperCase()} wins this round! +5 bonus grade`);
        setGameOver(true);
        return;
      }
    } else {
      newTiles[tileIndex].revealed = true;
      setTiles(newTiles);
      setExplodedIndex(tileIndex);

      const opponent = playerChoice === 'banana' ? 'chicken' : 'banana';
      const updatedMatch = {
        ...matchScore,
        [opponent]: matchScore[opponent] + 1,
      };
      setMatchScore(updatedMatch);

      if (updatedMatch[opponent] >= 10) {
        setMessage(`💥 Wrong tile! ${opponent.toUpperCase()} wins the MATCH with ${updatedMatch[opponent]} points! 🏆`);
        setGameOver(true);
        setPlayerChoice(null);
        return;
      }

      setMessage(`💥 Wrong tile! ${opponent.toUpperCase()} wins this round!`);
      setGameOver(true);
    }
  };

  return (
    <div className="game-wrapper">
      <div className="score-panel">
        <h2>Total Score</h2>
        <p>🐔 Chicken: {matchScore.chicken}</p>
        <p>🍌 Banana: {matchScore.banana}</p>
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
              className={`tile-wrapper ${explodedIndex === index ? 'exploded' : ''}`}
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

        {(matchScore.chicken >= 10 || matchScore.banana >= 10) ? (
          <button onClick={resetFullGame} className="reset-btn">🎮 New Game</button>
        ) : (
          playerChoice && <button onClick={resetGame} className="reset-btn">🔁 Next Round</button>
        )}
      </div>
    </div>
  );
}

export default App;
