import { useState } from 'react';
import './App.css';

const TURNS = { S: '👟', G: '🧤' };

const PROBABILITIES = [
  50, 65, 70, 65, 50, 
  65, 75, 90, 75, 65, 
  60, 65, 80, 65, 60
];

const Square = ({ children, isSelected, updateGoal, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`;
  return (
    <div onClick={() => updateGoal && updateGoal(index)} className={className}>
      {children}
    </div>
  );
};

const App = () => {
  const [goal, setGoal] = useState(Array(15).fill(null));
  const [turn, setTurn] = useState(TURNS.G);
  const [goalkeeperChoice, setGoalkeeperChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  
  const [history, setHistory] = useState({ player1: [], player2: [] });
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);

  const updateGoal = (index) => {
    if (gameOver || goal[index]) return;

    if (turn === TURNS.G) {
      setGoalkeeperChoice(index);
      setTurn(TURNS.S);
    } else {
      const newGoal = [...goal];
      const randomChance = Math.floor(Math.random() * 100) + 1;
      const successRate = PROBABILITIES[index];
      
      let isGoal = false;

      if (index === goalkeeperChoice) {
        newGoal[index] = '🧤';
      } else if (randomChance <= successRate) {
        newGoal[index] = '⚽';
        isGoal = true;
      } else {
        newGoal[index] = '❌';
      }

      const currentPlayer = isPlayer1Turn ? 'player1' : 'player2';
      setHistory(prev => ({
        ...prev,
        [currentPlayer]: [...prev[currentPlayer], isGoal ? '🟢' : '🔴']
      }));

      setGoal(newGoal);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setGoal(Array(15).fill(null));
    setTurn(TURNS.G);
    setGoalkeeperChoice(null);
    setGameOver(false);
    setIsPlayer1Turn(!isPlayer1Turn);
  };

  return (
    <main className='goal'>
      <h1>Penalty Kick Simulator</h1>

      <section className="scoreboard">
        <div className={`player-score ${isPlayer1Turn ? 'active' : ''}`}>
          <span>P1</span>
          <div className="dots">
            {history.player1.map((res, i) => <span key={i}>{res}</span>)}
          </div>
        </div>
        <div className="vs">VS</div>
        <div className={`player-score ${!isPlayer1Turn ? 'active' : ''}`}>
          <div className="dots">
            {history.player2.map((res, i) => <span key={i}>{res}</span>)}
          </div>
          <span>P2</span>
        </div>
      </section>

      <section className='game'>
        {goal.map((value, index) => (
          <Square key={index} index={index} updateGoal={updateGoal}>
            {value}
          </Square>
        ))}
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.G}>{TURNS.G}</Square>
        <Square isSelected={turn === TURNS.S}>{TURNS.S}</Square>
      </section>

      {gameOver && (
        <button onClick={resetGame} className="btn-continue">
          Continuar
        </button>
      )}
    </main>
  );
};

export default App;