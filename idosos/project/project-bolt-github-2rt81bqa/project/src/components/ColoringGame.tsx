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
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [coloringData, setColoringData] = useState<ImageData | null>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FFFFFF' // Branco para "apagar"
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
      
      // Draw the image as line art (high contrast black and white)
      ctx.filter = 'grayscale(100%) contrast(200%) brightness(150%)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
      
      // Store the original image data for eraser functionality
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setColoringData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      
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
      setColoringData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      
      setImageLoaded(true);
    };
    
    img.src = drawings[currentDrawing].url;
  };

  // Função para verificar se um pixel é uma linha preta (contorno)
  const isBlackLine = (data: Uint8ClampedArray, index: number): boolean => {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    // Considera como linha preta se a cor for muito escura
    return r < 100 && g < 100 && b < 100;
  };

  // Função para converter cor hex para RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Algoritmo de flood fill (balde de tinta)
  const floodFill = (startX: number, startY: number, newColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !coloringData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const startIndex = (startY * width + startX) * 4;
    
    // Não pinta se clicou em uma linha preta
    if (isBlackLine(data, startIndex)) {
      return;
    }

    // Cor original do pixel clicado
    const originalR = data[startIndex];
    const originalG = data[startIndex + 1];
    const originalB = data[startIndex + 2];

    // Nova cor
    const newRgb = hexToRgb(newColor);

    // Se a cor já é a mesma, não faz nada
    if (originalR === newRgb.r && originalG === newRgb.g && originalB === newRgb.b) {
      return;
    }

    // Stack para o flood fill
    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
        continue;
      }

      const index = (y * width + x) * 4;
      
      // Verifica se é uma linha preta (não pinta)
      if (isBlackLine(data, index)) {
        continue;
      }

      // Verifica se a cor é a mesma da original
      if (data[index] !== originalR || data[index + 1] !== originalG || data[index + 2] !== originalB) {
        continue;
      }

      visited.add(key);

      // Pinta o pixel
      data[index] = newRgb.r;
      data[index + 1] = newRgb.g;
      data[index + 2] = newRgb.b;
      data[index + 3] = 255; // Alpha

      // Adiciona pixels vizinhos à stack
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    // Atualiza o canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Atualiza os dados de coloração
    setColoringData(imageData);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Converte para coordenadas do canvas
    const canvasX = Math.floor(x * (canvas.width / rect.width));
    const canvasY = Math.floor(y * (canvas.height / rect.height));
    
    floodFill(canvasX, canvasY, selectedColor);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
          
          <h1 className="text-3xl font-bold text-blue-800 flex items-center space-x-2">
            <Palette size={32} />
            <span>Livro de Colorir</span>
          </h1>
          
          <div className="flex space-x-2">
            <button
              onClick={clearCanvas}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RotateCcw size={20} />
              <span>Limpar</span>
            </button>
            <button
              onClick={downloadImage}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download size={20} />
              <span>Salvar</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Escolha um Desenho:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {drawings.map((drawing, index) => (
              <button
                key={index}
                onClick={() => setCurrentDrawing(index)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentDrawing === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-medium text-blue-800">{drawing.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Área de Colorir:</h3>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className={`border-2 border-gray-300 rounded-lg ${
                !imageLoaded ? 'opacity-50 cursor-wait' : 'cursor-pointer'
              }`}
              onClick={handleCanvasClick}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Paleta de Cores:</h3>
          <div className="grid grid-cols-8 gap-3">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  selectedColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
              >
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
          <ul className="text-blue-700 space-y-2 text-lg">
            <li>• Escolha uma cor clicando nos círculos coloridos</li>
            <li>• Clique em uma área do desenho para pintá-la completamente</li>
            <li>• O balde de tinta pinta toda a área da mesma cor</li>
            <li>• As linhas pretas não serão pintadas (contornos preservados)</li>
            <li>• Salve sua obra de arte com o botão "Salvar"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}