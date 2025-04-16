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

    // Look for Hero collecting money (winning)
    const heroCollected = hand.actions.find(
      action => action.player === 'Hero' && action.action === 'collected'
    );
    
    if (heroCollected) {
      const collectedAmount = heroCollected.amount || 0;
      totalProfit = collectedAmount - heroInvested;
      
      // Check if this was a showdown win (by looking at the hand summary)
      // If there are board cards, it's likely a showdown
      isShowdown = !!hand.board && hand.board.length > 0;
      
      if (isShowdown) {
        showdownProfit = totalProfit;
      } else {
        nonShowdownProfit = totalProfit;
      }
    } else {
      // Hero didn't collect, so it's a loss
      totalProfit = -heroInvested;
      
      // If the hand went to showdown (board is present), it's a showdown loss
      // Otherwise it's a non-showdown loss (Hero folded)
      if (hand.board && hand.board.length > 0) {
        showdownProfit = -heroInvested;
      } else {
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
    });

    return {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit
    };
  });
};
