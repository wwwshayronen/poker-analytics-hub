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

interface PlayerStats {
  vpip: number;
  pfr: number;
  af: number;
  hands: number;
}

interface HeroResult {
  handId: string;
  totalProfit: number;
  showdownProfit: number;
  nonShowdownProfit: number;
}