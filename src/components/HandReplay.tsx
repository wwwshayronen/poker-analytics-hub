
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HandReplayProps {
  hand: Hand;
}

const HandReplay = ({ hand }: HandReplayProps) => {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const actions = hand?.actions || [];

  const handleNext = () => {
    if (currentActionIndex < actions.length - 1) {
      setCurrentActionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentActionIndex > 0) {
      setCurrentActionIndex(prev => prev - 1);
    }
  };

  // Calculate Hero's result in this hand
  const calculateHeroResult = () => {
    let heroInvested = 0;
    let heroCollected = 0;
    
    hand.actions.forEach(action => {
      if (action.player === 'Hero') {
        if (action.action === 'calls' || action.action === 'raises' || action.action === 'bets') {
          heroInvested += action.amount || 0;
        } else if (action.action === 'collected') {
          heroCollected += action.amount || 0;
        }
      }
    });
    
    const profit = heroCollected - heroInvested;
    const isShowdown = !!hand.board && hand.board.length > 0;
    
    return {
      profit,
      isShowdown,
      heroInvested,
      heroCollected
    };
  };
  
  const heroResult = calculateHeroResult();
  
  if (!hand) return null;

  return (
    <Card className="bg-poker-burgundy/20 p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">Hand #{hand.id} Replay</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-poker-navy/50 p-4 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Players:</p>
          <div className="flex flex-wrap gap-2">
            {hand.players.map((player, index) => (
              <span 
                key={index}
                className={`px-2 py-1 rounded ${
                  player.name === 'Hero' 
                    ? 'bg-poker-gold text-poker-navy' 
                    : 'bg-poker-burgundy/40'
                }`}
              >
                {player.name}
              </span>
            ))}
          </div>
        </div>

        {hand.heroCards && (
          <div className="bg-poker-navy/50 p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Hero's Cards:</p>
            <div className="flex gap-2 font-mono">
              {hand.heroCards.map((card, index) => (
                <span key={index} className="px-2 py-1 bg-poker-gold/20 rounded">
                  {card}
                </span>
              ))}
            </div>
          </div>
        )}

        {hand.board && (
          <div className="bg-poker-navy/50 p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Board:</p>
            <div className="flex gap-2 font-mono">
              {hand.board.map((card, index) => (
                <span key={index} className="px-2 py-1 bg-poker-burgundy/40 rounded">
                  {card}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-poker-navy/50 p-4 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Action:</p>
          <div className="min-h-[60px] font-mono">
            {actions[currentActionIndex] && (
              <div className="animate-fade-in">
                <span className="text-poker-gold">{actions[currentActionIndex].player}</span>
                {' '}
                <span>{actions[currentActionIndex].action}</span>
                {actions[currentActionIndex].amount && (
                  <span className="text-green-400"> ${actions[currentActionIndex].amount}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentActionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-400">
              {currentActionIndex + 1} / {actions.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentActionIndex === actions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-poker-navy/50 p-4 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Hand Result:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400">Result Type:</p>
              <p className="font-mono">
                {heroResult.isShowdown ? "Showdown" : "Non-Showdown"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Profit/Loss:</p>
              <p className={`font-mono ${heroResult.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${heroResult.profit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Hero Invested:</p>
              <p className="font-mono text-red-400">${heroResult.heroInvested.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Hero Collected:</p>
              <p className="font-mono text-green-400">${heroResult.heroCollected.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HandReplay;
