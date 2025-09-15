import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Palette, Download } from 'lucide-react';
import casalIdosos from './components/casal_idosos.jpg';
import fazendaFeliz from './components/fazenda_feliz.jpg';
import flor from './components/flor.jpg';
import passaros from './components/passaros.jpg';


interface ColoringGameProps {
  onBack: () => void;
}

export default function ColoringGame({ onBack }: ColoringGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [brushSize, setBrushSize] = useState(6);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    'eraser'
  ];

  const drawings = [
  {
    name: 'Casal de Idosos',
    url: casalIdosos
  },
  {
    name: 'Fazenda Feliz',
    url: fazendaFeliz
  },
  {
    name: 'Flor Bonita',
    url: flor
  },
  {
    name: 'Pássaros',
    url: passaros
  }
];

  

  useEffect(() => {
    loadImage();
  }, [currentDrawing]);

  const loadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setImageLoaded(false);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image in grayscale for coloring
      ctx.filter = 'grayscale(100%) contrast(150%) brightness(120%)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
      
      // Store the original image data for eraser functionality
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      // Fallback: draw a simple shape if image fails to load
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
      ctx.font = '20px Arial';
      ctx.fillStyle = '#666666';
      ctx.textAlign = 'center';
      ctx.fillText('Imagem não disponível', canvas.width / 2, canvas.height / 2);
      
      // Store the fallback image data
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      
      setImageLoaded(true);
    };
    
    img.src = drawings[currentDrawing].url;
  };

  const drawOnCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (selectedColor === 'eraser') {
      // Restore original image data in the eraser area
      const eraserSize = brushSize * 2;
      const startX = Math.max(0, Math.floor(x - eraserSize));
      const startY = Math.max(0, Math.floor(y - eraserSize));
      const endX = Math.min(canvas.width, Math.ceil(x + eraserSize));
      const endY = Math.min(canvas.height, Math.ceil(y + eraserSize));
      
      const currentImageData = ctx.getImageData(startX, startY, endX - startX, endY - startY);
      const originalData = originalImageData.data;
      const currentData = currentImageData.data;
      
      for (let py = startY; py < endY; py++) {
        for (let px = startX; px < endX; px++) {
          const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
          if (distance <= eraserSize) {
            const originalIndex = (py * canvas.width + px) * 4;
            const currentIndex = ((py - startY) * (endX - startX) + (px - startX)) * 4;
            
            // Copy original pixel data
            currentData[currentIndex] = originalData[originalIndex];     // R
            currentData[currentIndex + 1] = originalData[originalIndex + 1]; // G
            currentData[currentIndex + 2] = originalData[originalIndex + 2]; // B
            currentData[currentIndex + 3] = originalData[originalIndex + 3]; // A
          }
        }
      }
      
      ctx.putImageData(currentImageData, startX, startY);
    } else {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = selectedColor;
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawOnCanvas(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    loadImage();
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
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        
        <h2 className="text-2xl font-bold text-blue-800">Jogo de Colorir</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={clearCanvas}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Limpar</span>
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <Palette className="w-6 h-6 mr-2" />
          Escolha um Desenho:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {drawings.map((drawing, index) => (
            <button
              key={index}
              onClick={() => setCurrentDrawing(index)}
              className={`p-3 rounded-lg border-2 transition-all ${
                currentDrawing === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              {drawing.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="mb-4">
            <span className="text-blue-800 font-medium">Clique e arraste para colorir a imagem</span>
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className={`border-2 border-gray-300 rounded-lg ${
              !imageLoaded ? 'opacity-50 cursor-wait' : selectedColor === 'eraser' ? 'cursor-grab' : 'cursor-crosshair'
            }`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Paleta de Cores:</h3>
        <div className="grid grid-cols-8 gap-3 mb-4">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(color)}
              className={`w-12 h-12 rounded-full border-4 transition-all ${
                selectedColor === color
                  ? 'border-gray-800 scale-110'
                  : 'border-gray-300 hover:border-gray-500'
              } ${color === 'eraser' ? 'bg-gray-200 flex items-center justify-center text-2xl' : ''}`}
              style={color !== 'eraser' ? { backgroundColor: color } : {}}
            >
              {color === 'eraser' ? '🧽' : ''}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-blue-800 font-medium">Tamanho do Pincel:</label>
          <input
            type="range"
            min="2"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-blue-800 font-medium w-8">{brushSize}</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Escolha uma cor clicando nos círculos coloridos</li>
          <li>• Use a borracha (🧽) para remover cores aplicadas</li>
          <li>• Ajuste o tamanho do pincel com o controle deslizante</li>
          <li>• Clique e arraste no desenho para pintar</li>
          <li>• Salve sua obra de arte com o botão "Salvar"</li>
        </ul>
      </div>
    </div>
  );
}