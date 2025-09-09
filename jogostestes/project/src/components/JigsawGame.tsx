import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Shuffle } from 'lucide-react';

interface Piece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  image: string;
}

interface JigsawGameProps {
  onBack: () => void;
}

const JigsawGame: React.FC<JigsawGameProps> = ({ onBack }) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);

  const puzzleImages = [
    {
      name: 'Gato Fofo',
      url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    {
      name: 'Cachorro Feliz',
      url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    {
      name: 'Flores Coloridas',
      url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    }
  ];

  const gridSize = 3; // 3x3 puzzle for simplicity

  useEffect(() => {
    initializePuzzle();
  }, [currentPuzzle]);

  const initializePuzzle = () => {
    const newPieces: Piece[] = [];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        image: puzzleImages[currentPuzzle].url
      });
    }

    // Shuffle pieces
    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempPosition = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = tempPosition;
    }

    setPieces(shuffled);
    setSelectedPiece(null);
    setGameWon(false);
    setMoves(0);
  };

  const handlePieceClick = (pieceId: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      // Swap pieces
      const newPieces = [...pieces];
      const piece1 = newPieces.find(p => p.id === selectedPiece);
      const piece2 = newPieces.find(p => p.id === pieceId);

      if (piece1 && piece2) {
        const tempPosition = piece1.currentPosition;
        piece1.currentPosition = piece2.currentPosition;
        piece2.currentPosition = tempPosition;
      }

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);

      // Check if puzzle is solved
      const isSolved = newPieces.every(piece => piece.correctPosition === piece.currentPosition);
      if (isSolved) {
        setGameWon(true);
      }
    }
  };

  const getPieceStyle = (piece: Piece) => {
    const row = Math.floor(piece.correctPosition / gridSize);
    const col = piece.correctPosition % gridSize;
    
    return {
      backgroundImage: `url(${piece.image})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `-${col * 100}% -${row * 100}%`,
    };
  };

  const getPieceByPosition = (position: number) => {
    return pieces.find(piece => piece.currentPosition === position);
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
          <h2 className="text-2xl font-bold text-blue-800">Quebra-Cabeça</h2>
          <p className="text-blue-600">{puzzleImages[currentPuzzle].name} - Movimentos: {moves}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={initializePuzzle}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            <span>Embaralhar</span>
          </button>
          <button
            onClick={initializePuzzle}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {puzzleImages.map((puzzle, index) => (
          <button
            key={index}
            onClick={() => setCurrentPuzzle(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPuzzle === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            {puzzle.name}
          </button>
        ))}
      </div>

      {gameWon && (
        <div className="bg-green-100 border border-green-400 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Parabéns!</h3>
          <p className="text-green-700">Você completou o quebra-cabeça em {moves} movimentos!</p>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="grid grid-cols-3 gap-2 w-96 h-96">
            {Array.from({ length: gridSize * gridSize }, (_, position) => {
              const piece = getPieceByPosition(position);
              if (!piece) return null;

              return (
                <div
                  key={position}
                  className={`w-full h-full border-2 cursor-pointer transition-all hover:scale-105 ${
                    selectedPiece === piece.id
                      ? 'border-yellow-400 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  style={getPieceStyle(piece)}
                  onClick={() => handlePieceClick(piece.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Clique em uma peça para selecioná-la (ficará destacada)</li>
          <li>• Clique em outra peça para trocar as posições</li>
          <li>• Monte a imagem colocando cada peça no lugar correto</li>
          <li>• Use "Embaralhar" para misturar as peças novamente</li>
        </ul>
      </div>
    </div>
  );
};

export default JigsawGame;