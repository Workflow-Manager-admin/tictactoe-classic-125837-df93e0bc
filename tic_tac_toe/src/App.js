import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Represents a single square on the Tic Tac Toe board.
 * @param {object} props - The properties passed to the component.
 * @param {string} props.value - The value of the square ('X', 'O', or null).
 * @param {function} props.onClick - Function to call when the square is clicked.
 * @param {number} props.index - The index of the square.
 * @returns {JSX.Element} A button element representing a square.
 */
function Square({ value, onClick, index }) {
  return (
    <button className={`square ${value ? value : ''}`} onClick={() => onClick(index)}>
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
/**
 * Represents the Tic Tac Toe game board.
 * @param {object} props - The properties passed to the component.
 * @param {Array<string|null>} props.squares - Array representing the state of each square.
 * @param {function} props.onClick - Function to handle clicks on squares.
 * @returns {JSX.Element} The game board.
 */
function Board({ squares, onClick }) {
  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={onClick} index={i} />;
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Main application component for the Tic Tac Toe game.
 * Manages game state, logic, and renders the game UI.
 * @returns {JSX.Element} The main application component.
 */
function App() {
  const initialSquares = Array(9).fill(null);
  const [squares, setSquares] = useState(initialSquares);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // PUBLIC_INTERFACE
  /**
   * Calculates the winner of the game or if it's a draw.
   * Updates the winner and isDraw states.
   * @param {Array<string|null>} currentSquares - The current state of the board.
   */
  const calculateWinnerAndDraw = (currentSquares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6],           // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentSquares[a] && currentSquares[a] === currentSquares[b] && currentSquares[a] === currentSquares[c]) {
        setWinner(currentSquares[a]);
        setIsDraw(false); // Explicitly set isDraw to false if there's a winner
        return;
      }
    }
    // Check for draw only if no winner
    if (currentSquares.every(square => square !== null)) {
      setWinner(null); // Ensure winner is null in case of a draw
      setIsDraw(true);
      return;
    }
    // If no winner and not a draw, reset both
    setWinner(null);
    setIsDraw(false);
  };
  
  useEffect(() => {
    calculateWinnerAndDraw(squares);
  }, [squares]);

  // PUBLIC_INTERFACE
  /**
   * Handles a click on a square.
   * Updates the square's value, switches the player, and checks for a winner.
   * @param {number} i - The index of the clicked square.
   */
  const handleClick = (i) => {
    // If there's a winner or the square is already filled, do nothing
    if (winner || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  /**
   * Resets the game to its initial state.
   */
  const restartGame = () => {
    setSquares(initialSquares);
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
  };

  let playerTurnDisplay;
  let gameResultDisplay = null; // Initialize as null

  if (winner) {
    gameResultDisplay = `Winner: ${winner}`;
    playerTurnDisplay = `Game Over`; 
  } else if (isDraw) {
    gameResultDisplay = 'Draw!';
    playerTurnDisplay = `Game Over`;
  } else {
    playerTurnDisplay = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="logo">
              KAVIA TicTacToe
            </div>
          </div>
        </div>
      </nav>

      <main className="game-container">
        <div className="player-turn-display">{playerTurnDisplay}</div>
        <Board squares={squares} onClick={handleClick} />
        {gameResultDisplay && <div className="game-result-display">{gameResultDisplay}</div>}
        <button className="btn restart-button" onClick={restartGame}>
          Restart Game
        </button>
      </main>
    </div>
  );
}

export default App;
