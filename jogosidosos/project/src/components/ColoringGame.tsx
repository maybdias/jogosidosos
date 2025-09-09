import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Palette, Download } from 'lucide-react';

interface ColoringGameProps {
  onBack: () => void;
}

const ColoringGame: React.FC<ColoringGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [drawnPaths, setDrawnPaths] = useState<{x: number, y: number, color: string}[]>([]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  const drawings = [
    {
      name: 'Flor Simples',
      paths: [
        'M200,100 Q170,80 150,110 Q170,140 200,120 Q230,80 250,110 Q230,140 200,120',
        'M200,120 Q170,100 150,130 Q170,160 200,140 Q230,100 250,130 Q230,160 200,140',
        'M200,140 L200,200 M190,170 L210,170 M185,180 L215,180'
      ]
    },
    {
      name: 'Casa Feliz',
      paths: [
        'M80,200 L80,120 L200,60 L320,120 L320,200 Z',
        'M110,200 L110,150 L170,150 L170,200 Z',
        'M230,160 Q230,150 240,150 Q250,150 250,160 Q250,170 240,170 Q230,170 230,160',
        'M270,200 L270,160 L300,160 L300,200 Z'
      ]
    },
    {
      name: 'Borboleta',
      paths: [
        'M200,80 Q160,60 130,100 Q160,140 200,120',
        'M200,80 Q240,60 270,100 Q240,140 200,120',
        'M200,120 Q160,140 130,180 Q160,220 200,200',
        'M200,120 Q240,140 270,180 Q240,220 200,200',
        'M200,80 L200,200 M190,90 L210,90 M190,110 L210,110'
      ]
    },
    {
      name: 'Sol Sorridente',
      paths: [
        'M200,150 Q200,120 230,120 Q260,120 260,150 Q260,180 230,180 Q200,180 200,150',
        'M220,140 Q220,135 225,135 Q230,135 230,140',
        'M240,140 Q240,135 245,135 Q250,135 250,140',
        'M225,165 Q235,170 245,165',
        'M200,100 L200,80 M180,110 L170,95 M320,110 L330,95 M200,200 L200,220 M180,190 L170,205 M320,190 L330,205 M150,150 L130,150 M270,150 L290,150'
      ]
    },
    {
      name: 'Árvore',
      paths: [
        'M200,200 L200,140 M180,200 L220,200',
        'M200,140 Q160,120 140,160 Q160,200 200,180 Q240,200 260,160 Q240,120 200,140',
        'M200,120 Q170,100 150,140 Q170,180 200,160 Q230,180 250,140 Q230,100 200,120',
        'M200,100 Q180,80 160,120 Q180,160 200,140 Q220,160 240,120 Q220,80 200,100'
      ]
    },
    {
      name: 'Peixe',
      paths: [
        'M100,150 Q120,120 180,120 Q240,120 280,150 Q240,180 180,180 Q120,180 100,150',
        'M280,150 L320,130 L320,170 Z',
        'M160,140 Q160,135 165,135 Q170,135 170,140',
        'M140,150 Q150,145 160,150 Q150,155 140,150'
      ]
    }
  ];

  useEffect(() => {
    drawTemplate();
  }, [currentDrawing, drawnPaths]);

  const drawTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw user's coloring first (behind the lines)
    drawnPaths.forEach(point => {
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw template lines on top
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const currentTemplate = drawings[currentDrawing];
    currentTemplate.paths.forEach(path => {
      const pathObj = new Path2D(path);
      ctx.stroke(pathObj);
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;


    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add point to drawn paths instead of drawing directly
    setDrawnPaths(prev => [...prev, { x, y, color: selectedColor }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setDrawnPaths([]);
    drawTemplate();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `colorir-${drawings[currentDrawing].name}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
          <h2 className="text-2xl font-bold text-blue-800">Livro de Colorir</h2>
          <p className="text-blue-600">{drawings[currentDrawing].name}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearCanvas}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {drawings.map((drawing, index) => (
          <button
            key={index}
            onClick={() => setCurrentDrawing(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentDrawing === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            {drawing.name}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border-2 border-gray-300 rounded-lg cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-800">Escolha sua Cor:</h3>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${
                selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Escolha uma cor clicando nos círculos coloridos</li>
          <li>• Clique e arraste no desenho para pintar</li>
          <li>• Use "Limpar" para recomeçar o desenho</li>
          <li>• Salve sua obra de arte com o botão "Salvar"</li>
        </ul>
      </div>
    </div>
  );
};

export default ColoringGame;