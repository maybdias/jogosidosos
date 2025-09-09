import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Eye, EyeOff } from 'lucide-react';

interface SudokuGameProps {
  onBack: () => void;
}

const SudokuGame: React.FC<SudokuGameProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<number[][]>(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [initialGrid, setInitialGrid] = useState<number[][]>(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  // Easy Sudoku puzzle
  const easyPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGrid = easyPuzzle.map(row => [...row]);
    setGrid(newGrid);
    setInitialGrid(easyPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setGameWon(false);
    setMistakes(0);
  };

  const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num && x !== col) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num && x !== row) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = startRow + i;
        const currentCol = startCol + j;
        if (grid[currentRow][currentCol] === num && 
            (currentRow !== row || currentCol !== col)) {
          return false;
        }
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] === 0) { // Only allow editing empty cells
      setSelectedCell({ row, col });
    }
  };

  const handleNumberClick = (num: number) => {
    if (selectedCell && initialGrid[selectedCell.row][selectedCell.col] === 0) {
      const newGrid = [...grid];
      
      if (num === 0 || isValid(newGrid, selectedCell.row, selectedCell.col, num)) {
        newGrid[selectedCell.row][selectedCell.col] = num;
        setGrid(newGrid);
        
        if (num !== 0 && newGrid[selectedCell.row][selectedCell.col] !== solution[selectedCell.row][selectedCell.col]) {
          setMistakes(mistakes + 1);
        }
        
        // Check if game is won
        if (newGrid.every((row, rowIndex) => 
          row.every((cell, colIndex) => cell === solution[rowIndex][colIndex])
        )) {
          setGameWon(true);
        }
      } else if (num !== 0) {
        setMistakes(mistakes + 1);
      }
    }
  };

  const getPossibleNumbers = (row: number, col: number): number[] => {
    if (initialGrid[row][col] !== 0) return [];
    
    const possible: number[] = [];
    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        possible.push(num);
      }
    }
    return possible;
  };

  const getCellClass = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isFixed = initialGrid[row][col] !== 0;
    const isInvalid = grid[row][col] !== 0 && grid[row][col] !== solution[row][col];
    
    let className = "w-12 h-12 border border-gray-300 flex items-center justify-center text-xl font-bold cursor-pointer transition-all ";
    
    // Box borders
    if (row % 3 === 0) className += "border-t-2 border-t-gray-600 ";
    if (col % 3 === 0) className += "border-l-2 border-l-gray-600 ";
    if (row === 8) className += "border-b-2 border-b-gray-600 ";
    if (col === 8) className += "border-r-2 border-r-gray-600 ";
    
    if (isSelected) {
      className += "bg-blue-200 border-blue-500 ";
    } else if (isFixed) {
      className += "bg-blue-50 text-blue-800 ";
    } else if (isInvalid) {
      className += "bg-red-100 text-red-600 ";
    } else {
      className += "bg-white hover:bg-blue-50 ";
    }
    
    return className;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg border border-blue-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800">Sudoku</h2>
          <p className="text-blue-600">Erros: {mistakes}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showHints ? 'Ocultar' : 'Mostrar'} Dicas</span>
          </button>
          <button
            onClick={initializeGame}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      {gameWon && (
        <div className="bg-green-100 border border-green-400 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Parabéns!</h3>
          <p className="text-green-700">Você completou o Sudoku com {mistakes} erros!</p>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="grid grid-cols-9 gap-0 mb-6 border-2 border-gray-600">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                  {showHints && cell === 0 && selectedCell?.row === rowIndex && selectedCell?.col === colIndex && (
                    <div className="absolute text-xs text-gray-400 mt-8">
                      {getPossibleNumbers(rowIndex, colIndex).slice(0, 3).join('')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => handleNumberClick(0)}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-bold text-lg transition-colors"
            >
              Apagar
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-xl transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Clique em uma célula vazia para selecioná-la</li>
          <li>• Use os botões numéricos para inserir números</li>
          <li>• Cada linha, coluna e quadrado 3x3 deve conter os números de 1 a 9</li>
          <li>• Use as dicas para ver números possíveis na célula selecionada</li>
        </ul>
      </div>
    </div>
  );
};

export default SudokuGame;