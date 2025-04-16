
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

    // Determine if the hand reached showdown
    // Look for explicit SHOWDOWN markers
    const hasShowdownMarker = hand.actions.some(
      action => action.action === '*** SHOWDOWN ***'
    );
    
    // Check if anyone showed or mucked cards
    const hasShows = hand.actions.some(
      action => action.action === 'shows'
    );
    
    const hasMucks = hand.actions.some(
      action => action.action === 'mucks'
    );
    
    // A hand is considered a showdown if:
    // 1. There is an explicit SHOWDOWN marker, OR
    // 2. Any player shows their cards, OR
    // 3. Any player mucks their cards with a complete board (river)
    isShowdown = hasShowdownMarker || 
                hasShows || 
                (hasMucks && !!hand.board && hand.board.length === 5);

    // Find Hero collecting money (winning)
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
      hasShows,
      hasMucks,
      hasShowdownMarker
    });

    return {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit
    };
  });
};
