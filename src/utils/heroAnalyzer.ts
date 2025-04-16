
export const calculateHeroResults = (hands: Hand[]): HeroResult[] => {
  return hands.map(hand => {
    let totalProfit = 0;
    let showdownProfit = 0;
    let nonShowdownProfit = 0;
    let heroInvested = 0;
    let isShowdown = false;

    // Calculate Hero's investments
    hand.actions.forEach(action => {
      if (action.player === 'Hero') {
        if (action.action === 'calls' || action.action === 'raises' || action.action === 'bets') {
          heroInvested += action.amount || 0;
        }
      }
    });

    // Determine if the hand went to showdown
    // A hand is considered a showdown if there was a board with cards AND
    // at least one player showed their cards
    isShowdown = !!hand.board && hand.board.length > 0;
    
    // Look for player showdown actions like "shows" or "mucks"
    if (isShowdown) {
      const showdownActions = hand.actions.filter(
        action => action.action === 'shows' || action.action === 'mucks'
      );
      // If no player showed or mucked cards, it might not be a true showdown
      // but we'll still consider it one if the board is complete (5 cards)
      if (showdownActions.length === 0 && !(hand.board && hand.board.length === 5)) {
        isShowdown = false;
      }
    }

    // Look for Hero collecting money (winning)
    const heroCollected = hand.actions.find(
      action => action.player === 'Hero' && action.action === 'collected'
    );
    
    if (heroCollected) {
      const collectedAmount = heroCollected.amount || 0;
      totalProfit = collectedAmount - heroInvested;
      
      if (isShowdown) {
        showdownProfit = totalProfit;
        nonShowdownProfit = 0;
      } else {
        showdownProfit = 0;
        nonShowdownProfit = totalProfit;
      }
    } else {
      // Hero didn't collect, so it's a loss
      totalProfit = -heroInvested;
      
      if (isShowdown) {
        showdownProfit = -heroInvested;
        nonShowdownProfit = 0;
      } else {
        showdownProfit = 0;
        nonShowdownProfit = -heroInvested;
      }
    }

    console.log('Hand result for #' + hand.id + ':', {
      totalProfit,
      showdownProfit,
      nonShowdownProfit,
      heroInvested,
      isShowdown,
      hasBoard: !!hand.board && hand.board.length > 0,
      heroCollected: !!heroCollected,
      boardLength: hand.board ? hand.board.length : 0,
      hasShowdownActions: hand.actions.some(a => a.action === 'shows' || a.action === 'mucks')
    });

    return {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit
    };
  });
};
