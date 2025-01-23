interface PlayerStats {
  vpip: number;
  pfr: number;
  af: number;
  hands: number;
}

export const calculatePlayerStats = (hands: Hand[]): Record<string, PlayerStats> => {
  const stats: Record<string, PlayerStats> = {};
  
  hands.forEach(hand => {
    hand.players.forEach(player => {
      if (!stats[player.name]) {
        stats[player.name] = {
          vpip: 0,
          pfr: 0,
          af: 0,
          hands: 0,
        };
      }
      
      stats[player.name].hands++;
      
      // Calculate VPIP (voluntarily put money in pot)
      const voluntaryAction = hand.actions.find(
        action => action.player === player.name && 
        ['raises', 'calls', 'bets'].includes(action.action)
      );
      if (voluntaryAction) {
        stats[player.name].vpip++;
      }
      
      // Calculate PFR (pre-flop raise)
      const preFlopRaise = hand.actions.find(
        action => action.player === player.name && 
        action.action === 'raises'
      );
      if (preFlopRaise) {
        stats[player.name].pfr++;
      }
      
      // Calculate AF (aggression factor)
      const aggressive = hand.actions.filter(
        action => action.player === player.name && 
        ['bet', 'raise'].includes(action.action)
      ).length;
      const passive = hand.actions.filter(
        action => action.player === player.name && 
        action.action === 'call'
      ).length;
      
      if (passive > 0) {
        stats[player.name].af = aggressive / passive;
      }
    });
  });
  
  // Convert counts to percentages
  Object.keys(stats).forEach(player => {
    stats[player].vpip = (stats[player].vpip / stats[player].hands) * 100;
    stats[player].pfr = (stats[player].pfr / stats[player].hands) * 100;
  });
  
  return stats;
};