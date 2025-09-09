import React, { useState } from 'react';
import { Home, Users, Brain, PlayCircle, Trophy } from 'lucide-react';
import GameMenu from './components/GameMenu';
import SolitaireGame from './components/SolitaireGame';
import SudokuGame from './components/SudokuGame';
import MemoryGame from './components/MemoryGame';
import ColoringGame from './components/ColoringGame';
import MusicGame from './components/MusicGame';
import JigsawGame from './components/JigsawGame';
import CrosswordGame from './components/CrosswordGame'; 


type GameType = 'menu' | 'solitaire' | 'sudoku' | 'memory' | 'coloring' | 'music' | 'jigsaw';

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  const renderGame = () => {
    switch (currentGame) {
      case 'solitaire':
        return <SolitaireGame onBack={() => setCurrentGame('menu')} />;
      case 'sudoku':
        return <SudokuGame onBack={() => setCurrentGame('menu')} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame('menu')} />;
      case 'coloring':
        return <ColoringGame onBack={() => setCurrentGame('menu')} />;
      case 'music':
        return <MusicGame onBack={() => setCurrentGame('menu')} />;
      case 'jigsaw':
        return <JigsawGame onBack={() => setCurrentGame('menu')} />;
      case 'crossword':
        return <CrosswordGame onBack={() => setCurrentGame('menu')} />;
      default:
        return <GameMenu onGameSelect={setCurrentGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer transition-transform hover:scale-105"
              onClick={() => setCurrentGame('menu')}
            >
              <div className="bg-blue-500 text-white p-2 rounded-xl">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-800">ElizIA</h1>
                <p className="text-sm text-blue-600">Sala de Jogos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-blue-600 text-lg">
                <Users className="w-6 h-6 inline mr-2" />
                Bem-vindos!
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderGame()}
      </main>

      <footer className="bg-white mt-16 border-t border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-blue-600">
            <p className="text-lg">© 2025 ElizIA - Jogos para o bem-estar e diversão</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;