export const calculateHeroResults = (hands: Hand[]): HeroResult[] => {
  return hands.map(hand => {
    let totalProfit = 0;
    let showdownProfit = 0;
    let nonShowdownProfit = 0;
    let heroInvolved = false;
    let reachedShowdown = false;

    // Check if Hero is in the hand
    const heroPlayer = hand.players.find(p => p.name === 'Hero');
    if (!heroPlayer) {
      return {
        handId: hand.id,
        totalProfit: 0,
        showdownProfit: 0,
        nonShowdownProfit: 0
      };
    }

    // Calculate Hero's investment and returns
    hand.actions.forEach(action => {
      if (action.player === 'Hero') {
        heroInvolved = true;
        if (action.action === 'calls' || action.action === 'raises' || action.action === 'bets') {
          totalProfit -= action.amount || 0;
        } else if (action.action === 'collected') {
          totalProfit += action.amount || 0;
        }
      }
    });

    // Check if hand reached showdown
    reachedShowdown = hand.board?.length === 5;

    // Assign profit to showdown or non-showdown category
    if (heroInvolved) {
      if (reachedShowdown) {
        showdownProfit = totalProfit;
      } else {
        nonShowdownProfit = totalProfit;
      }
    }

    return {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit
    };
  });
};