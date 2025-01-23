interface Player {
  seat: number;
  name: string;
  chips: number;
}

interface Action {
  player: string;
  action: string;
  amount?: number;
}

interface Hand {
  id: string;
  date: string;
  blinds: {
    small: number;
    big: number;
  };
  players: Player[];
  actions: Action[];
  heroCards?: string[];
  board?: string[];
  pot: number;
}

export const parseHand = (handText: string): Hand => {
  const lines = handText.split('\n');
  const hand: Partial<Hand> = {
    players: [],
    actions: [],
  };

  // Parse header
  const headerMatch = lines[0].match(/Hand #(HD\d+): .* \((\$[\d.]+)\/(\$[\d.]+)\) - ([\d/]+ [\d:]+)/);
  if (headerMatch) {
    hand.id = headerMatch[1];
    hand.blinds = {
      small: parseFloat(headerMatch[2].substring(1)),
      big: parseFloat(headerMatch[3].substring(1)),
    };
    hand.date = headerMatch[4];
  }

  // Parse players
  lines.forEach((line) => {
    const seatMatch = line.match(/Seat (\d): ([a-f0-9]+) \(\$([\d.]+) in chips\)/);
    if (seatMatch) {
      hand.players?.push({
        seat: parseInt(seatMatch[1]),
        name: seatMatch[2],
        chips: parseFloat(seatMatch[3]),
      });
    }
  });

  // Parse hero cards
  const heroCardsMatch = lines.find(line => line.includes('Dealt to Hero'))?.match(/\[(.*)\]/);
  if (heroCardsMatch) {
    hand.heroCards = heroCardsMatch[1].split(' ');
  }

  // Parse board
  const summaryIndex = lines.findIndex(line => line.includes('*** SUMMARY ***'));
  if (summaryIndex !== -1) {
    const boardMatch = lines[summaryIndex + 1].match(/Board \[(.*)\]/);
    if (boardMatch) {
      hand.board = boardMatch[1].split(' ');
    }
  }

  // Parse pot
  const potMatch = lines.find(line => line.includes('Total pot'))?.match(/Total pot \$([\d.]+)/);
  if (potMatch) {
    hand.pot = parseFloat(potMatch[1]);
  }

  return hand as Hand;
};