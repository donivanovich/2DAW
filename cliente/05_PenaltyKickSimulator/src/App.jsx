import { useState } from 'react';
import './App.css';

const TURNS = { S: '👟', G: '🧤' };

const INITIAL_KICKS = 5;

const PROBABILITIES = [
  50, 65, 70, 65, 50,
  65, 75, 90, 75, 65,
  60, 65, 80, 65, 60
];

const OUTCOME_DETAILS = {
  '⚽': {
    badge: '¡GOL!',
    title: '¡Balón al fondo de la red!',
    description: 'El disparo superó al guardameta.',
    modifier: 'status-banner--goal'
  },
  '🧤': {
    badge: '¡PARADA!',
    title: '¡Intervención decisiva del portero!',
    description: 'El guardameta adivinó la dirección del lanzamiento.',
    modifier: 'status-banner--save'
  },
  '❌': {
    badge: '¡FALLO!',
    title: '¡El lanzamiento se marcha fuera!',
    description: 'El disparo no encontró portería.',
    modifier: 'status-banner--miss'
  }
};

const checkWinner = (p1History, p2History) => {
  const p1Shots = p1History.length;
  const p2Shots = p2History.length;
  const p1Goals = p1History.filter((res) => res === '🟢').length;
  const p2Goals = p2History.filter((res) => res === '🟢').length;

  // Fase inicial de 5 lanzamientos por jugador: victoria matemática si la ventaja es inalcanzable
  if (p1Shots <= INITIAL_KICKS && p2Shots <= INITIAL_KICKS) {
    const p1Remaining = INITIAL_KICKS - p1Shots;
    const p2Remaining = INITIAL_KICKS - p2Shots;

    if (p1Goals > p2Goals + p2Remaining) return 'P1';
    if (p2Goals > p1Goals + p1Remaining) return 'P2';
    return null;
  }

  // Muerte súbita tras empate en los 5 primeros tiros: a igualdad de intentos, gana quien marque y el rival falle
  if (p1Shots === p2Shots) {
    if (p1Goals > p2Goals) return 'P1';
    if (p2Goals > p1Goals) return 'P2';
  }

  return null;
};

const PencilIcon = () => (
  <svg
    className="pencil-icon"
    viewBox="0 0 16 16"
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5.5 12.5 2 13.5l1-3.5 8.5-7.5z" />
  </svg>
);

const Square = ({ children, isSelected, updateGoal, index, disabled, label }) => {
  const isGoalPosition = typeof index === 'number';

  let resultModifier = '';
  if (isGoalPosition && children === '⚽') resultModifier = 'square--goal';
  else if (isGoalPosition && children === '🧤') resultModifier = 'square--save';
  else if (isGoalPosition && children === '❌') resultModifier = 'square--miss';

  const className = [
    'square',
    isSelected ? 'is-selected' : '',
    disabled ? 'is-disabled' : '',
    resultModifier
  ]
    .filter(Boolean)
    .join(' ');

  if (isGoalPosition) {
    const zoneNumber = String(index + 1).padStart(2, '0');
    const resultName =
      children === '⚽'
        ? 'Gol'
        : children === '🧤'
          ? 'Parada'
          : children === '❌'
            ? 'Fallo'
            : 'Seleccionar zona';

    const handleClick = (event) => {
      event.currentTarget.blur();
      if (updateGoal) {
        updateGoal(index);
      }
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        className={className}
        disabled={disabled}
        aria-label={`Posición ${zoneNumber} (${resultName})`}
      >
        <span className="square-zone" aria-hidden="true">
          {zoneNumber}
        </span>
        {children ? (
          <span className="square-result" aria-hidden="true">
            <span className="square-emoji">{children}</span>
            <span className="square-tag">{resultName}</span>
          </span>
        ) : (
          <span className="square-reticle" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <div className={className} aria-current={isSelected ? 'step' : undefined}>
      <span className="turn-icon" aria-hidden="true">
        {children}
      </span>
      {label && <span className="turn-label">{label}</span>}
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
  const [winner, setWinner] = useState(null);

  const [playerNames, setPlayerNames] = useState({
    player1: 'Jugador 1',
    player2: 'Jugador 2'
  });
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [nameInput, setNameInput] = useState('');

  const startEditingName = (playerKey) => {
    setEditingPlayer(playerKey);
    setNameInput(playerNames[playerKey]);
  };

  const savePlayerName = (playerKey) => {
    const trimmed = nameInput.trim();
    const defaultName = playerKey === 'player1' ? 'Jugador 1' : 'Jugador 2';
    setPlayerNames((prev) => ({
      ...prev,
      [playerKey]: trimmed || defaultName
    }));
    setEditingPlayer(null);
  };

  const handleNameKeyDown = (event, playerKey) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      savePlayerName(playerKey);
    } else if (event.key === 'Escape') {
      setEditingPlayer(null);
    }
  };

  const updateGoal = (index) => {
    if (gameOver || winner || goal[index]) return;

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
      const newHistory = {
        ...history,
        [currentPlayer]: [...history[currentPlayer], isGoal ? '🟢' : '🔴']
      };

      const matchWinner = checkWinner(newHistory.player1, newHistory.player2);

      setHistory(newHistory);
      setGoal(newGoal);
      setGameOver(true);

      if (matchWinner) {
        setWinner(matchWinner);
      }
    }
  };

  const resetMatch = () => {
    setGoal(Array(15).fill(null));
    setTurn(TURNS.G);
    setGoalkeeperChoice(null);
    setGameOver(false);
    setHistory({ player1: [], player2: [] });
    setIsPlayer1Turn(true);
    setWinner(null);
  };

  const resetGame = () => {
    if (winner) {
      resetMatch();
      return;
    }
    setGoal(Array(15).fill(null));
    setTurn(TURNS.G);
    setGoalkeeperChoice(null);
    setGameOver(false);
    setIsPlayer1Turn(!isPlayer1Turn);
  };

  const shotResult = goal.find((cell) => cell !== null);
  const outcomeInfo = shotResult ? OUTCOME_DETAILS[shotResult] : null;
  const activePlayerCode = isPlayer1Turn ? 'P1' : 'P2';
  const activePlayerName = isPlayer1Turn ? playerNames.player1 : playerNames.player2;

  const p1Goals = history.player1.filter((res) => res === '🟢').length;
  const p2Goals = history.player2.filter((res) => res === '🟢').length;

  const currentRound = gameOver
    ? Math.max(1, history.player1.length, history.player2.length)
    : Math.min(history.player1.length, history.player2.length) + 1;

  const isSuddenDeath = currentRound > INITIAL_KICKS;
  const totalSlots = Math.max(INITIAL_KICKS, currentRound);
  const slotIndices = Array.from({ length: totalSlots }, (_, i) => i);

  const winnerName =
    winner === 'P1' ? `${playerNames.player1} (P1)` : `${playerNames.player2} (P2)`;

  return (
    <main className="goal">
      <header className="app-header">
        <div className={`broadcast-pill ${isSuddenDeath ? 'broadcast-pill--sudden' : ''}`}>
          <span className="broadcast-dot" aria-hidden="true" />
          <span>{isSuddenDeath ? 'MUERTE SÚBITA' : 'TANDA DE 5 PENALTIS'}</span>
        </div>
        <h1>Penalty Kick Simulator</h1>
      </header>

      <section className="scoreboard" aria-label="Marcador de la tanda">
        <div
          className={`player-score player-score--p1 ${
            winner === 'P1' ? 'is-winner' : !winner && isPlayer1Turn ? 'active' : ''
          }`}
        >
          <div className="player-header">
            <div className="player-identity">
              <span className="player-badge">P1</span>
              {editingPlayer === 'player1' ? (
                <input
                  type="text"
                  className="player-name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={() => savePlayerName('player1')}
                  onKeyDown={(e) => handleNameKeyDown(e, 'player1')}
                  maxLength={16}
                  autoFocus
                  aria-label="Nombre del Jugador 1"
                />
              ) : (
                <div className="player-name-group">
                  <span className="player-name">{playerNames.player1}</span>
                  <button
                    type="button"
                    className="btn-edit-name"
                    onClick={() => startEditingName('player1')}
                    aria-label={`Cambiar nombre de ${playerNames.player1}`}
                    title="Cambiar nombre"
                  >
                    <PencilIcon />
                  </button>
                </div>
              )}
            </div>
            <div className="player-meta">
              <span className="player-turn-pill">
                {winner === 'P1' ? '🏆 Ganador' : !winner && isPlayer1Turn ? 'En turno' : 'Espera'}
              </span>
              <span className="player-goals" aria-label={`Goles ${playerNames.player1}: ${p1Goals}`}>
                {p1Goals}
              </span>
            </div>
          </div>
          <div className="dots" aria-label={`Resultados ${playerNames.player1}`}>
            {slotIndices.map((i) => {
              const res = history.player1[i];
              const isExtraSlot = i >= INITIAL_KICKS;
              return (
                <span
                  key={i}
                  className={`dot-slot ${
                    res === '🟢' ? 'is-goal' : res === '🔴' ? 'is-miss' : 'is-empty'
                  } ${isExtraSlot ? 'dot-slot--sudden' : ''}`}
                  title={
                    res
                      ? `Tiro ${i + 1}: ${res === '🟢' ? 'Gol' : 'Fallado'}`
                      : `Tiro ${i + 1}: Pendiente`
                  }
                >
                  {res || (isExtraSlot ? '⚡' : '')}
                </span>
              );
            })}
          </div>
        </div>

        <div className="vs-container">
          <span className={`round-label ${isSuddenDeath ? 'round-label--sudden' : ''}`}>
            {isSuddenDeath ? `M. Súbita · T${currentRound}` : `Tiro ${currentRound} / ${INITIAL_KICKS}`}
          </span>
          <div className="vs">VS</div>
        </div>

        <div
          className={`player-score player-score--p2 ${
            winner === 'P2' ? 'is-winner' : !winner && !isPlayer1Turn ? 'active' : ''
          }`}
        >
          <div className="player-header">
            <div className="player-meta">
              <span className="player-goals" aria-label={`Goles ${playerNames.player2}: ${p2Goals}`}>
                {p2Goals}
              </span>
              <span className="player-turn-pill">
                {winner === 'P2' ? '🏆 Ganador' : !winner && !isPlayer1Turn ? 'En turno' : 'Espera'}
              </span>
            </div>
            <div className="player-identity">
              {editingPlayer === 'player2' ? (
                <input
                  type="text"
                  className="player-name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={() => savePlayerName('player2')}
                  onKeyDown={(e) => handleNameKeyDown(e, 'player2')}
                  maxLength={16}
                  autoFocus
                  aria-label="Nombre del Jugador 2"
                />
              ) : (
                <div className="player-name-group">
                  <span className="player-name">{playerNames.player2}</span>
                  <button
                    type="button"
                    className="btn-edit-name"
                    onClick={() => startEditingName('player2')}
                    aria-label={`Cambiar nombre de ${playerNames.player2}`}
                    title="Cambiar nombre"
                  >
                    <PencilIcon />
                  </button>
                </div>
              )}
              <span className="player-badge">P2</span>
            </div>
          </div>
          <div className="dots" aria-label={`Resultados ${playerNames.player2}`}>
            {slotIndices.map((i) => {
              const res = history.player2[i];
              const isExtraSlot = i >= INITIAL_KICKS;
              return (
                <span
                  key={i}
                  className={`dot-slot ${
                    res === '🟢' ? 'is-goal' : res === '🔴' ? 'is-miss' : 'is-empty'
                  } ${isExtraSlot ? 'dot-slot--sudden' : ''}`}
                  title={
                    res
                      ? `Tiro ${i + 1}: ${res === '🟢' ? 'Gol' : 'Fallado'}`
                      : `Tiro ${i + 1}: Pendiente`
                  }
                >
                  {res || (isExtraSlot ? '⚡' : '')}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className={`status-banner ${
          winner
            ? 'status-banner--winner'
            : gameOver && outcomeInfo
              ? outcomeInfo.modifier
              : turn === TURNS.G
                ? 'status-banner--keeper'
                : 'status-banner--shooter'
        }`}
        role="status"
        aria-live="polite"
      >
        {winner ? (
          <>
            <span className="status-badge">🏆 FIN DE PARTIDA</span>
            <div className="status-text">
              <strong>
                ¡{winnerName} gana la tanda por {p1Goals} - {p2Goals}!
              </strong>
              <span>
                {outcomeInfo ? `${outcomeInfo.badge} en el último tiro. ` : ''}
                Pulsa «Nueva partida» para limpiar el marcador y volver a jugar.
              </span>
            </div>
          </>
        ) : gameOver && outcomeInfo ? (
          <>
            <span className="status-badge">{outcomeInfo.badge}</span>
            <div className="status-text">
              <strong>{outcomeInfo.title}</strong>
              <span>{outcomeInfo.description} Pulsa «Continuar» para el siguiente turno.</span>
            </div>
          </>
        ) : turn === TURNS.G ? (
          <>
            <span className="status-badge">PASO 1 · PORTERO {TURNS.G}</span>
            <div className="status-text">
              <strong>
                Defensa en secreto (Lanza {activePlayerName}
                {isSuddenDeath ? ' · Muerte Súbita' : ''})
              </strong>
              <span>Selecciona una posición de la portería para cubrir el disparo.</span>
            </div>
          </>
        ) : (
          <>
            <span className="status-badge">PASO 2 · LANZADOR {TURNS.S}</span>
            <div className="status-text">
              <strong>
                Disparo de {activePlayerName} ({activePlayerCode})
                {isSuddenDeath ? ' · Muerte Súbita' : ''}
              </strong>
              <span>Portero colocado. Elige a qué zona de la portería chutar.</span>
            </div>
          </>
        )}
      </section>

      <div className="goal-stage">
        <div className="goal-frame">
          <section
            className={`game ${turn === TURNS.G ? 'game--keeper' : 'game--shooter'} ${
              gameOver ? 'game--over' : ''
            }`}
            aria-label="Portería de 15 posiciones"
          >
            {goal.map((value, index) => (
              <Square
                key={`${turn}-${index}`}
                index={index}
                updateGoal={updateGoal}
                disabled={gameOver || Boolean(winner)}
              >
                {value}
              </Square>
            ))}
          </section>
        </div>
        <div className="pitch-line" aria-hidden="true">
          <span className="penalty-spot" />
        </div>
      </div>

      {winner && (
        <section className="winner-card" aria-label="Resultado final de la partida">
          <div className="winner-card-info">
            <span className="winner-trophy" aria-hidden="true">
              🏆
            </span>
            <div className="winner-copy">
              <span className="winner-kicker">
                {isSuddenDeath ? 'VICTORIA EN MUERTE SÚBITA' : 'VICTORIA EN LA TANDA'}
              </span>
              <h2>¡Ha ganado {winnerName}!</h2>
              <p>
                Marcador final: <strong>{playerNames.player1} ({p1Goals})</strong> -{' '}
                <strong>({p2Goals}) {playerNames.player2}</strong>
              </p>
            </div>
          </div>
          <button type="button" onClick={resetMatch} className="btn-continue btn-new-match">
            <span>Nueva partida</span>
            <span className="btn-continue-icon" aria-hidden="true">
              ↻
            </span>
          </button>
        </section>
      )}

      <footer className="controls-footer">
        <section className="turn" aria-label="Indicador de fase actual">
          <Square isSelected={!gameOver && !winner && turn === TURNS.G} label="1. Portero">
            {TURNS.G}
          </Square>
          <span className="turn-divider" aria-hidden="true">
            →
          </span>
          <Square isSelected={!gameOver && !winner && turn === TURNS.S} label="2. Lanzador">
            {TURNS.S}
          </Square>
        </section>

        <div className="action-slot">
          {gameOver ? (
            <button type="button" onClick={resetGame} className="btn-continue">
              <span>{winner ? 'Nueva partida' : 'Continuar'}</span>
              <span className="btn-continue-icon" aria-hidden="true">
                {winner ? '↻' : '→'}
              </span>
            </button>
          ) : (
            <div className="legend-bar" aria-label="Leyenda de resultados">
              <span className="legend-item">⚽ Gol</span>
              <span className="legend-item">🧤 Parada</span>
              <span className="legend-item">❌ Fallo</span>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
};

export default App;
