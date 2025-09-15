// Palavras cruzadas bem planejadas para se cruzarem corretamente
  const clues: Clue[] = [
    {
      number: 1,
      clue: "Animal que late",
      answer: "CAO",
      direction: 'across',
      startRow: 2,
      startCol: 1
    },
    {
      number: 2,
      clue: "Cor do céu",
      answer: "AZUL",
      direction: 'down',
      startRow: 1,
      startCol: 2
    },
    {
      number: 3,
      clue: "Astro que ilumina o dia",
      answer: "SOL",
      direction: 'across',
      startRow: 4,
      startCol: 1
    },
    {
      number: 4,
      clue: "Animal que faz miau",
      answer: "GATO",
      direction: 'down',
      startRow: 1,
      startCol: 5
    },
    {
      number: 5,
      clue: "Fruta vermelha pequena",
      answer: "UVA",
      direction: 'across',
      startRow: 6,
      startCol: 2
    },
    {
      number: 6,
      clue: "Líquido da vida",
      answer: "AGUA",
      direction: 'down',
      startRow: 2,
      startCol: 3
    },
    {
      number: 7,
      clue: "Inseto que faz mel",
      answer: "ABELHA",
      direction: 'across',
      startRow: 1,
      startCol: 5
    },
    {
      number: 8,
      clue: "Bebida quente",
      answer: "CHA",
      direction: 'down',
      startRow: 4,
      startCol: 2
    }
  ];

        if (row < gridSize && col < gridSize) {
          // Se a célula já tem uma letra (cruzamento), verifica se é compatível
          if (newGrid[row][col].letter && newGrid[row][col].letter !== answer[i]) {
            console.warn(`Conflito detectado na posição [${row}][${col}]`);
            continue; // Pula esta célula se houver conflito
          }
          
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