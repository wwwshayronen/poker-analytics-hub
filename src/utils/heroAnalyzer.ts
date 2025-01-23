export const calculateHeroResults = (hands: Hand[]): HeroResult[] => {
  return hands.map(hand => {
    let totalProfit = 0;
    let showdownProfit = 0;
    let nonShowdownProfit = 0;
    let heroInvested = 0;

    // Calculate Hero's investments
    hand.actions.forEach(action => {
      if (action.player === 'Hero') {
        if (action.action === 'calls' || action.action === 'raises' || action.action === 'bets') {
          heroInvested += action.amount || 0;
          totalProfit -= action.amount || 0;
        } else if (action.action === 'collected') {
          const collectedAmount = action.amount || 0;
          totalProfit += collectedAmount;
          
          // If Hero collected money, it's a showdown win
          // (since non-showdown wins happen when others fold)
          showdownProfit = collectedAmount - heroInvested;
        }
      }
    });

    // If Hero invested but didn't collect, it's a loss
    // If there was no collection action but we have a profit/loss, it's non-showdown
    if (totalProfit !== 0 && !hand.actions.some(action => 
      action.player === 'Hero' && action.action === 'collected'
    )) {
      nonShowdownProfit = totalProfit;
    }

    console.log('Hand result:', {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit,
      heroInvested
    });

    return {
      handId: hand.id,
      totalProfit,
      showdownProfit,
      nonShowdownProfit
    };
  });
};