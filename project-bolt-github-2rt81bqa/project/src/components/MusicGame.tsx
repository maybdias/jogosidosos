import React, { useState, useRef } from 'react';
import { ArrowLeft, Music, Play, Pause } from 'lucide-react';

interface MusicGameProps {
  onBack: () => void;
}

const MusicGame: React.FC<MusicGameProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const notes = [
    { note: 'C', frequency: 261.63, color: 'bg-red-400', name: 'Dó' },
    { note: 'D', frequency: 293.66, color: 'bg-orange-400', name: 'Ré' },
    { note: 'E', frequency: 329.63, color: 'bg-yellow-400', name: 'Mi' },
    { note: 'F', frequency: 349.23, color: 'bg-green-400', name: 'Fá' },
    { note: 'G', frequency: 392.00, color: 'bg-blue-400', name: 'Sol' },
    { note: 'A', frequency: 440.00, color: 'bg-indigo-400', name: 'Lá' },
    { note: 'B', frequency: 493.88, color: 'bg-purple-400', name: 'Si' }
  ];

  const simpleSongs = [
    {
      name: 'Parabéns para Você',
      notes: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F']
    },
    {
      name: 'Brilha, Brilha Estrelinha',
      notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C']
    },
    {
      name: 'Asa Branca',
      notes: ['G', 'A', 'B', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C']
    }
  ];

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playNote = (frequency: number, duration: number = 0.3) => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handleNoteClick = (note: typeof notes[0]) => {
    playNote(note.frequency);
    setCurrentSong([...currentSong, note.note]);
  };

  const playSong = async (song: typeof simpleSongs[0]) => {
    setIsPlaying(true);
    setCurrentSong([]);

    for (let i = 0; i < song.notes.length; i++) {
      const noteData = notes.find(n => n.note === song.notes[i]);
      if (noteData) {
        playNote(noteData.frequency, 0.5);
        setCurrentSong(prev => [...prev, noteData.note]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    setIsPlaying(false);
  };

  const clearSong = () => {
    setCurrentSong([]);
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
          <h2 className="text-2xl font-bold text-blue-800">Piano Virtual</h2>
          <p className="text-blue-600">Toque e crie melodias</p>
        </div>

        <button
          onClick={clearSong}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <span>Limpar</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-6">
          <Music className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-800">Piano:</h3>
        </div>
        
        <div className="flex justify-center space-x-2 mb-6">
          {notes.map((note) => (
            <button
              key={note.note}
              onClick={() => handleNoteClick(note)}
              className={`${note.color} hover:opacity-80 text-white font-bold py-8 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95`}
              disabled={isPlaying}
            >
              <div className="text-2xl">{note.name}</div>
              <div className="text-sm opacity-75">{note.note}</div>
            </button>
          ))}
        </div>

        {currentSong.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Sua Melodia:</h4>
            <div className="flex flex-wrap gap-2">
              {currentSong.map((note, index) => {
                const noteData = notes.find(n => n.note === note);
                return (
                  <span
                    key={index}
                    className={`${noteData?.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {noteData?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <Play className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-blue-800">Músicas Conhecidas:</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {simpleSongs.map((song, index) => (
            <button
              key={index}
              onClick={() => playSong(song)}
              disabled={isPlaying}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{song.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Clique nas teclas coloridas para tocar as notas</li>
          <li>• Experimente criar suas próprias melodias</li>
          <li>• Use os botões verdes para ouvir músicas conhecidas</li>
          <li>• Sua melodia aparecerá na área "Sua Melodia"</li>
        </ul>
      </div>
    </div>
  );
};

export default MusicGame;