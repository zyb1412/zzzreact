import { useState } from 'react';
import './index.css'; // 引入样式文件

function Square({ value, onSquareClick }) {
  return (
    <button className={`square ${value === 'B' ? 'black' : value === 'R' ? 'red' : ''}`} onClick={onSquareClick}>
      {/* 不显示文本，通过CSS显示黑子和红子 */}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'B' : 'R'; // 使用 'B' 表示黑子，'R' 表示红子
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + (winner === 'B' ? 'Black' : 'Red');
    alert(status); // 弹出胜利提示框
  } else {
    status = 'Next player: ' + (xIsNext ? 'Black' : 'Red');
  }

  // Generate 20x20 board
  const boardRows = [];
  for (let row = 0; row < 30; row++) {
    const rowSquares = [];
    for (let col = 0; col < 30; col++) {
      const index = row * 30 + col;
      rowSquares.push(
        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
      );
    }
    boardRows.push(
      <div className="board-row" key={row}>
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(900).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [];
  // Rows and Columns
  for (let row = 0; row < 26; row++) {
    for (let col = 0; col < 26; col++) {
      lines.push([row * 30 + col, row * 30 + col + 1, row * 30 + col + 2, row * 30 + col + 3, row * 30 + col + 4]);
      lines.push([row * 30 + col, (row + 1) * 30 + col, (row + 2) * 30 + col, (row + 3) * 30 + col, (row + 4) * 30 + col]);
    }
  }
  // Diagonals
  for (let row = 0; row < 26; row++) {
    for (let col = 0; col < 26; col++) {
      lines.push([
        row * 30 + col,
        (row + 1) * 30 + col + 1,
        (row + 2) * 30 + col + 2,
        (row + 3) * 30 + col + 3,
        (row + 4) * 30 + col + 4,
      ]);
      lines.push([
        row * 30 + col + 4,
        (row + 1) * 30 + col + 3,
        (row + 2) * 30 + col + 2,
        (row + 3) * 30 + col + 1,
        (row + 4) * 30 + col,
      ]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}
