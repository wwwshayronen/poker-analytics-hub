export const parseHand = (handText: string): Hand => {
  const lines = handText.split('\n');
  const hand: Partial<Hand> = {
    players: [],
    actions: [],
  };

  // Parse header
  const headerMatch = lines[0].match(/Hand #([\w\d]+): .* \((\$[\d.]+)\/(\$[\d.]+)\) - ([\d/]+ [\d:]+)/);
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
    const seatMatch = line.match(/Seat (\d): ([\w\d]+) \(\$([\d.]+) in chips\)/);
    if (seatMatch) {
      hand.players?.push({
        seat: parseInt(seatMatch[1]),
        name: seatMatch[2],
        chips: parseFloat(seatMatch[3]),
      });
    }

    // Parse actions
    const actionMatches = [
      { regex: /([\w\d]+): calls \$([\d.]+)/, action: 'calls' },
      { regex: /([\w\d]+): raises \$([\d.]+)/, action: 'raises' },
      { regex: /([\w\d]+): bets \$([\d.]+)/, action: 'bets' },
      { regex: /([\w\d]+): folds/, action: 'folds' },
      { regex: /([\w\d]+): checks/, action: 'checks' },
      { regex: /([\w\d]+) collected \$([\d.]+)/, action: 'collected' },
    ];

    actionMatches.forEach(({ regex, action }) => {
      const match = line.match(regex);
      if (match) {
        hand.actions?.push({
          player: match[1],
          action: action,
          amount: match[2] ? parseFloat(match[2]) : undefined,
        });
      }
    });
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

  // Add console logs for debugging
  console.log('Parsed hand:', {
    id: hand.id,
    actions: hand.actions,
    pot: hand.pot
  });

  return hand as Hand;
};