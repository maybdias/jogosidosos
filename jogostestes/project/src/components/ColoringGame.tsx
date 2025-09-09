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
  const [drawnPaths, setDrawnPaths] = useState<{x: number, y: number, color: string, size?: number}[]>([]);
  const [brushSize, setBrushSize] = useState(6);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  const drawings = [
    {
      name: 'Vaso de Flor',
      paths: [
        // Vaso
        'M150,200 L250,200 L240,280 L160,280 Z',
        // Base do vaso
        'M140,280 L260,280',
        // Flores grandes
        'M200,120 C180,100 160,120 160,140 C160,160 180,180 200,160 C220,180 240,160 240,140 C240,120 220,100 200,120 Z',
        'M160,100 C140,80 120,100 120,120 C120,140 140,160 160,140 C180,160 200,140 200,120 C200,100 180,80 160,100 Z',
        'M240,100 C220,80 200,100 200,120 C200,140 220,160 240,140 C260,160 280,140 280,120 C280,100 260,80 240,100 Z',
        // Centros das flores
        'M200,140 C195,135 195,145 200,140 C205,135 205,145 200,140',
        'M160,120 C155,115 155,125 160,120 C165,115 165,125 160,120',
        'M240,120 C235,115 235,125 240,120 C245,115 245,125 240,120',
        // Caules
        'M200,160 L200,200',
        'M160,140 L170,200',
        'M240,140 L230,200',
        // Folhas
        'M180,180 C170,170 160,180 170,190 C180,185 180,180 180,180',
        'M220,180 C230,170 240,180 230,190 C220,185 220,180 220,180',
        'M190,170 C185,160 195,160 200,170 C195,165 190,170 190,170'
      ]
    },
    {
      name: 'Casal Feliz',
      paths: [
        // Rosto da senhora (esquerda)
        'M120,120 C100,100 100,140 120,160 C140,180 160,160 160,140 C160,100 140,100 120,120',
        // Cabelo da senhora
        'M110,110 C90,90 90,120 110,130 C130,140 150,130 150,110 C150,90 130,90 110,110',
        // Óculos da senhora
        'M110,125 C105,120 105,130 110,125 C115,120 115,130 110,125',
        'M130,125 C125,120 125,130 130,125 C135,120 135,130 130,125',
        'M115,125 L125,125',
        // Rosto do senhor (direita)
        'M240,120 C220,100 220,140 240,160 C260,180 280,160 280,140 C280,100 260,100 240,120',
        // Cabelo do senhor
        'M230,110 C210,90 210,120 230,130 C250,140 270,130 270,110 C270,90 250,90 230,110',
        // Óculos do senhor
        'M230,125 C225,120 225,130 230,125 C235,120 235,130 230,125',
        'M250,125 C245,120 245,130 250,125 C255,120 255,130 250,125',
        'M235,125 L245,125',
        // Corpos
        'M120,160 L120,220 L160,220 L160,160',
        'M240,160 L240,220 L280,220 L280,160',
        // Flores ao redor
        'M80,180 C75,175 75,185 80,180 C85,175 85,185 80,180',
        'M320,180 C315,175 315,185 320,180 C325,175 325,185 320,180',
        'M200,80 C195,75 195,85 200,80 C205,75 205,85 200,80',
        'M200,240 C195,235 195,245 200,240 C205,235 205,245 200,240'
      ]
    },
    {
      name: 'Pássaros',
      paths: [
        // Beija-flor principal (centro)
        'M200,150 C180,140 160,150 160,170 C160,190 180,200 200,190 C220,200 240,190 240,170 C240,150 220,140 200,150',
        // Bico do beija-flor
        'M160,170 L140,175',
        // Olho do beija-flor
        'M175,165 C170,160 170,170 175,165',
        // Asa superior do beija-flor
        'M200,150 C220,130 240,140 230,160 C220,150 200,150 200,150',
        // Asa inferior do beija-flor
        'M200,170 C215,180 225,190 210,200 C200,185 200,170 200,170',
        // Cauda do beija-flor
        'M240,170 C260,165 270,175 250,180 C240,175 240,170 240,170',
        // Flores grandes ao redor
        'M100,100 C80,80 60,100 60,120 C60,140 80,160 100,140 C120,160 140,140 140,120 C140,100 120,80 100,100',
        'M300,100 C280,80 260,100 260,120 C260,140 280,160 300,140 C320,160 340,140 340,120 C340,100 320,80 300,100',
        'M100,220 C80,200 60,220 60,240 C60,260 80,280 100,260 C120,280 140,260 140,240 C140,220 120,200 100,220',
        'M300,220 C280,200 260,220 260,240 C260,260 280,280 300,260 C320,280 340,260 340,240 C340,220 320,200 300,220',
        // Centros das flores
        'M100,120 C95,115 95,125 100,120 C105,115 105,125 100,120',
        'M300,120 C295,115 295,125 300,120 C305,115 305,125 300,120',
        'M100,240 C95,235 95,245 100,240 C105,235 105,245 100,240',
        'M300,240 C295,235 295,245 300,240 C305,235 305,245 300,240',
        // Folhas
        'M150,80 C140,70 130,80 140,90 C150,85 150,80 150,80',
        'M250,80 C240,70 230,80 240,90 C250,85 250,80 250,80'
      ]
    },
    {
      name: 'Fazenda Feliz',
      paths: [
        // Celeiro/estábulo
        'M120,120 L120,180 L280,180 L280,120 L200,80 Z',
        // Porta do celeiro
        'M180,180 L180,140 L220,140 L220,180',
        // Janela do celeiro
        'M140,140 L140,120 L160,120 L160,140',
        'M150,140 L150,120 M140,130 L160,130',
        // Cerca
        'M80,200 L320,200',
        'M100,200 L100,220',
        'M130,200 L130,220',
        'M160,200 L160,220',
        'M190,200 L190,220',
        'M220,200 L220,220',
        'M250,200 L250,220',
        'M280,200 L280,220',
        // Vaca 1 (esquerda)
        'M90,160 C80,150 70,160 70,170 C70,180 80,190 90,180 C100,190 110,180 110,170 C110,160 100,150 90,160',
        // Cabeça da vaca 1
        'M90,150 C85,145 85,155 90,150 C95,145 95,155 90,150',
        // Vaca 2 (centro)
        'M200,160 C190,150 180,160 180,170 C180,180 190,190 200,180 C210,190 220,180 220,170 C220,160 210,150 200,160',
        // Cabeça da vaca 2
        'M200,150 C195,145 195,155 200,150 C205,145 205,155 200,150',
        // Vaca 3 (direita)
        'M310,160 C300,150 290,160 290,170 C290,180 300,190 310,180 C320,190 330,180 330,170 C330,160 320,150 310,160',
        // Cabeça da vaca 3
        'M310,150 C305,145 305,155 310,150 C315,145 315,155 310,150',
        // Baldes de leite
        'M150,220 L150,240 L170,240 L170,220',
        'M230,220 L230,240 L250,240 L250,220',
        // Flores no chão
        'M60,240 C55,235 55,245 60,240 C65,235 65,245 60,240',
        'M340,240 C335,235 335,245 340,240 C345,235 345,245 340,240',
        'M120,260 C115,255 115,265 120,260 C125,255 125,265 120,260',
        'M280,260 C275,255 275,265 280,260 C285,255 285,265 280,260'
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

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw user's coloring first (behind the lines)
    drawnPaths.forEach(point => {
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size || 6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw template lines on top
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
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

    // Add point to drawn paths with current brush size
    setDrawnPaths(prev => [...prev, { x, y, color: selectedColor, size: brushSize }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setDrawnPaths([]);
    drawTemplate();
  };

  const eraseAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Remove points within eraser radius
    setDrawnPaths(prev => prev.filter(point => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      return distance > 15; // Eraser radius
    }));
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `colorir-${drawings[currentDrawing].name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedColor === 'eraser') {
      eraseAt(e);
    } else {
      if (e.type === 'mousedown') startDrawing(e);
      else if (e.type === 'mousemove') draw(e);
    }
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
            className={`border-2 border-gray-300 rounded-lg ${selectedColor === 'eraser' ? 'cursor-grab' : 'cursor-crosshair'}`}
            onMouseDown={handleCanvasInteraction}
            onMouseMove={handleCanvasInteraction}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-800">Escolha sua Cor ou Ferramenta:</h3>
        </div>
        
        <div className="grid grid-cols-5 gap-3 mb-4">
          <button
            onClick={() => setSelectedColor('eraser')}
            className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 bg-gray-200 flex items-center justify-center ${
              selectedColor === 'eraser' ? 'border-gray-800 scale-110' : 'border-gray-300'
            }`}
          >
            <span className="text-xs font-bold">🧽</span>
          </button>
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
        
        <div className="flex items-center space-x-4">
          <label className="text-blue-800 font-medium">Tamanho do Pincel:</label>
          <input
            type="range"
            min="2"
            max="12"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-blue-600 font-medium">{brushSize}px</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Escolha uma cor clicando nos círculos coloridos</li>
          <li>• Use a borracha (🧽) para apagar partes do desenho</li>
          <li>• Ajuste o tamanho do pincel com o controle deslizante</li>
          <li>• Clique e arraste no desenho para pintar</li>
          <li>• Salve sua obra de arte com o botão "Salvar"</li>
        </ul>
      </div>
    </div>
  );
};

export default ColoringGame;