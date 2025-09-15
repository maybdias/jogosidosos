import React from 'react';
import { Spade as Spades, Grid3X3, Brain, Trophy, Clock, Star, Palette, Music, Puzzle } from 'lucide-react';

interface GameMenuProps {
  onGameSelect: (game: 'solitaire' | 'sudoku' | 'memory' | 'coloring' | 'music' | 'jigsaw' | 'crossword') => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onGameSelect }) => {
  const games = [
    {
      id: 'solitaire' as const,
      name: 'Paciência',
      description: 'Jogo clássico de cartas para relaxar',
      icon: Spades,
      color: 'bg-blue-500',
      difficulty: 'Fácil'
    },
    {
      id: 'sudoku' as const,
      name: 'Sudoku',
      description: 'Exercite a mente com números',
      icon: Grid3X3,
      color: 'bg-indigo-500',
      difficulty: 'Médio'
    },
    {
      id: 'memory' as const,
      name: 'Jogo da Memória',
      description: 'Encontre os pares e treine a memória',
      icon: Brain,
      color: 'bg-purple-500',
      difficulty: 'Fácil'
    },
    {
      id: 'coloring' as const,
      name: 'Livro de Colorir',
      description: 'Relaxe pintando belos desenhos',
      icon: Palette,
      color: 'bg-pink-500',
      difficulty: 'Relaxante'
    },
    {
      id: 'music' as const,
      name: 'Piano Virtual',
      description: 'Toque melodias simples e relaxantes',
      icon: Music,
      color: 'bg-green-500',
      difficulty: 'Criativo'
    },
    {
      id: 'jigsaw' as const,
      name: 'Quebra-Cabeça',
      description: 'Monte imagens com peças grandes',
      icon: Puzzle,
      color: 'bg-orange-500',
      difficulty: 'Médio'
    },
    {
      id: 'crossword' as const,
      name: 'Palavras-cruzadas',
      description: 'Adivinhe as palavras',
      icon: Puzzle,
      color: 'bg-orange-500',
      difficulty: 'Médio'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">
          Escolha seu Jogo Favorito
        </h2>
        <p className="text-xl text-blue-600 max-w-2xl mx-auto">
          Desafie sua mente com jogos divertidos e relaxantes, especialmente pensados para você
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-blue-100"
              onClick={() => onGameSelect(game.id)}
            >
              <div className="p-8">
                <div className={`${game.color} text-white p-4 rounded-xl w-fit mx-auto mb-6`}>
                  <IconComponent className="w-12 h-12" />
                </div>
                
                <h3 className="text-2xl font-bold text-blue-800 text-center mb-3">
                  {game.name}
                </h3>
                
                <p className="text-blue-600 text-center text-lg mb-4">
                  {game.description}
                </p>
                
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-blue-700 font-medium">{game.difficulty}</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-200">
                  Jogar Agora
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 mt-12 border border-blue-100">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            Benefícios dos Jogos
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4">
              <Brain className="w-12 h-12 text-blue-500 mb-3" />
              <h4 className="font-semibold text-blue-800 mb-2">Exercita a Mente</h4>
              <p className="text-blue-600 text-center">
                Mantém o cérebro ativo e saudável
              </p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Clock className="w-12 h-12 text-blue-500 mb-3" />
              <h4 className="font-semibold text-blue-800 mb-2">Relaxamento</h4>
              <p className="text-blue-600 text-center">
                Momentos de tranquilidade e diversão
              </p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Star className="w-12 h-12 text-blue-500 mb-3" />
              <h4 className="font-semibold text-blue-800 mb-2">Concentração</h4>
              <p className="text-blue-600 text-center">
                Melhora o foco e a atenção
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;