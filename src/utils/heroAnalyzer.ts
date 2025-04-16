
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

    // Check for showdown indicators - SUMMARY section is most reliable
    // First try to find explicit shows in the summary section
    const summaryShows = hand.actions.some(
      action => action.action === 'shows' && action.player === 'Hero'
    );
    
    // Look for explicit SHOWDOWN markers
    const hasShowdownMarker = hand.actions.some(
      action => action.action === '*** SHOWDOWN ***'
    );
    
    // A hand is considered a showdown if:
    // There is an explicit SHOWDOWN marker OR Hero showed cards
    isShowdown = hasShowdownMarker || summaryShows;

    // Find if Hero collected money (winning)
    const heroCollected = hand.actions.find(
      action => action.player === 'Hero' && action.action === 'collected'
    );
    
    const collectedAmount = heroCollected ? (heroCollected.amount || 0) : 0;
    totalProfit = collectedAmount - heroInvested;
    
    // Assign profit to showdown or non-showdown category based on whether it was a showdown
    if (isShowdown) {
      showdownProfit = totalProfit;
      nonShowdownProfit = 0;
    } else {
      showdownProfit = 0;
      nonShowdownProfit = totalProfit;
    }

    console.log('Hand result for #' + hand.id + ':', {
      totalProfit,
      showdownProfit,
      nonShowdownProfit,
      heroInvested,
      collectedAmount,
      isShowdown,
      hasShowdown: hasShowdownMarker,
      summaryShows,
      boardLength: hand.board ? hand.board.length : 0,
      handActions: hand.actions
        .filter(a => ['shows', 'collected', '*** SHOWDOWN ***'].includes(a.action))
        .map(a => `${a.player} ${a.action} ${a.amount || ''}`)
    });

    return {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit
    };
  });
};
