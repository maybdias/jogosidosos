import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Lightbulb, Check } from 'lucide-react';

interface CrosswordGameProps {
  onBack: () => void;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
}

interface Cell {
  letter: string;
  number?: number;
  isBlack: boolean;
  userInput: string;
}

const CrosswordGame: React.FC<CrosswordGameProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [gameWon, setGameWon] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completedWords, setCompletedWords] = useState<number[]>([]);

  const clues: Clue[] = [
    {
      number: 1,
      clue: "Cor do céu em dia claro",
      answer: "AZUL",
      direction: 'across',
      startRow: 1,
      startCol: 1
    },
    {
      number: 2,
      clue: "Animal doméstico que faz 'miau'",
      answer: "GATO",
      direction: 'down',
      startRow: 0,
      startCol: 4
    },
    {
      number: 3,
      clue: "Astro que ilumina o dia",
      answer: "SOL",
      direction: 'across',
      startRow: 3,
      startCol: 2
    },
    {
      number: 4,
      clue: "Fruta amarela alongada",
      answer: "BANANA",
      direction: 'down',
      startRow: 2,
      startCol: 1
    },
    {
      number: 5,
      clue: "Flor símbolo do amor",
      answer: "ROSA",
      direction: 'across',
      startRow: 5,
      startCol: 1
    },
    {
      number: 6,
      clue: "Bebida quente feita com grãos",
      answer: "CAFE",
      direction: 'down',
      startRow: 4,
      startCol: 3
    },
    {
      number: 7,
      clue: "Meio de transporte aquático",
      answer: "BARCO",
      direction: 'across',
      startRow: 7,
      startCol: 1
    },
    {
      number: 8,
      clue: "Estação do ano mais quente",
      answer: "VERAO",
      direction: 'down',
      startRow: 6,
      startCol: 4
    }
  ];

  const gridSize = 10;

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    checkCompletedWords();
  }, [grid]);

  const initializeGrid = () => {
    const newGrid: Cell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        isBlack: true,
        userInput: ''
      }))
    );

    // Place words in grid
    clues.forEach(clue => {
      const { startRow, startCol, answer, direction, number } = clue;
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        
        if (row < gridSize && col < gridSize) {
          newGrid[row][col] = {
            letter: answer[i],
            number: i === 0 ? number : newGrid[row][col].number,
            isBlack: false,
            userInput: ''
          };
        }
      }
    });

    setGrid(newGrid);
    setGameWon(false);
    setCompletedWords([]);
  };

  const checkCompletedWords = () => {
    // Don't check if grid is not initialized yet
    if (!grid.length || !grid[0] || !grid[0].length) {
      return;
    }
    
    const completed: number[] = [];
    
    clues.forEach(clue => {
      const { startRow, startCol, answer, direction, number } = clue;
      let isComplete = true;
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        
        if (row < gridSize && col < gridSize && grid[row] && grid[row][col]) {
          if (grid[row][col].userInput.toUpperCase() !== answer[i]) {
            isComplete = false;
            break;
          }
        }
      }
      
      if (isComplete) {
        completed.push(number);
      }
    });
    
    setCompletedWords(completed);
    
    // Check if all words are completed
    if (completed.length === clues.length) {
      setGameWon(true);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;
    
    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction if clicking the same cell
      setSelectedDirection(selectedDirection === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (e.key.match(/[a-zA-Z]/)) {
      const newGrid = [...grid];
      newGrid[row][col].userInput = e.key.toUpperCase();
      setGrid(newGrid);
      
      // Move to next cell
      moveToNextCell();
    } else if (e.key === 'Backspace') {
      const newGrid = [...grid];
      newGrid[row][col].userInput = '';
      setGrid(newGrid);
      
      // Move to previous cell
      moveToPreviousCell();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
               e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      handleArrowKey(e.key);
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let nextRow = row;
    let nextCol = col;
    
    if (selectedDirection === 'across') {
      nextCol = col + 1;
    } else {
      nextRow = row + 1;
    }
    
    if (nextRow < gridSize && nextCol < gridSize && !grid[nextRow][nextCol].isBlack) {
      setSelectedCell({ row: nextRow, col: nextCol });
    }
  };

  const moveToPreviousCell = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let prevRow = row;
    let prevCol = col;
    
    if (selectedDirection === 'across') {
      prevCol = col - 1;
    } else {
      prevRow = row - 1;
    }
    
    if (prevRow >= 0 && prevCol >= 0 && !grid[prevRow][prevCol].isBlack) {
      setSelectedCell({ row: prevRow, col: prevCol });
    }
  };

  const handleArrowKey = (key: string) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;
    
    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(gridSize - 1, row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(gridSize - 1, col + 1);
        break;
    }
    
    if (!grid[newRow][newCol].isBlack) {
      setSelectedCell({ row: newRow, col: newCol });
    }
  };

  const getCellClass = (row: number, col: number) => {
    const cell = grid[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    
    if (cell.isBlack) {
      return "w-8 h-8 bg-gray-800 border border-gray-600";
    }
    
    let className = "w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer relative ";
    
    if (isSelected) {
      className += "bg-blue-200 border-blue-500 ";
    } else {
      className += "bg-white hover:bg-blue-50 ";
    }
    
    // Highlight completed words
    const wordNumbers = getWordNumbersForCell(row, col);
    const hasCompletedWord = wordNumbers.some(num => completedWords.includes(num));
    if (hasCompletedWord) {
      className += "bg-green-100 ";
    }
    
    return className;
  };

  const getWordNumbersForCell = (row: number, col: number): number[] => {
    const numbers: number[] = [];
    
    clues.forEach(clue => {
      const { startRow, startCol, answer, direction, number } = clue;
      
      for (let i = 0; i < answer.length; i++) {
        const wordRow = direction === 'across' ? startRow : startRow + i;
        const wordCol = direction === 'across' ? startCol + i : startCol;
        
        if (wordRow === row && wordCol === col) {
          numbers.push(number);
          break;
        }
      }
    });
    
    return numbers;
  };

  const showHint = (clueNumber: number) => {
    const clue = clues.find(c => c.number === clueNumber);
    if (!clue) return;
    
    const { startRow, startCol, answer, direction } = clue;
    const newGrid = [...grid];
    
    // Fill in the first letter as a hint
    const row = startRow;
    const col = startCol;
    newGrid[row][col].userInput = answer[0];
    
    setGrid(newGrid);
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg border border-blue-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800">Palavras-Cruzadas</h2>
          <p className="text-blue-600">Palavras completas: {completedWords.length}/{clues.length}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showHints ? 'Ocultar' : 'Mostrar'} Dicas</span>
          </button>
          <button
            onClick={initializeGrid}
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
          <p className="text-green-700">Você completou todas as palavras-cruzadas!</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grid */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-10 gap-0 border-2 border-gray-600">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.number && (
                      <span className="absolute top-0 left-0 text-xs text-blue-600 font-bold">
                        {cell.number}
                      </span>
                    )}
                    <span className="text-center">
                      {cell.userInput || (showHints ? cell.letter : '')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-blue-600">
            <p>Direção atual: <strong>{selectedDirection === 'across' ? 'Horizontal' : 'Vertical'}</strong></p>
            <p className="mt-1">Use as setas do teclado para navegar • Digite letras para preencher</p>
          </div>
        </div>

        {/* Clues */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Dicas</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Horizontais:</h4>
              <div className="space-y-2">
                {clues.filter(clue => clue.direction === 'across').map(clue => (
                  <div key={clue.number} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completedWords.includes(clue.number) && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-medium text-blue-800">{clue.number}.</span>
                      <span className="text-blue-700">{clue.clue}</span>
                    </div>
                    {showHints && (
                      <button
                        onClick={() => showHint(clue.number)}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
                      >
                        Dica
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Verticais:</h4>
              <div className="space-y-2">
                {clues.filter(clue => clue.direction === 'down').map(clue => (
                  <div key={clue.number} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completedWords.includes(clue.number) && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-medium text-blue-800">{clue.number}.</span>
                      <span className="text-blue-700">{clue.clue}</span>
                    </div>
                    {showHints && (
                      <button
                        onClick={() => showHint(clue.number)}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
                      >
                        Dica
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Clique em uma célula para selecioná-la</li>
          <li>• Digite letras para preencher as palavras</li>
          <li>• Use as setas do teclado para navegar</li>
          <li>• Clique na mesma célula para alternar entre horizontal e vertical</li>
          <li>• Use as dicas para obter a primeira letra de cada palavra</li>
        </ul>
      </div>
    </div>
  );
};

export default CrosswordGame;