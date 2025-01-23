import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { parseHand } from '@/utils/handParser';
import { calculatePlayerStats } from '@/utils/statsCalculator';
import { calculateHeroResults } from '@/utils/heroAnalyzer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Index = () => {
  const [hands, setHands] = useState<Hand[]>([]);
  const [stats, setStats] = useState<Record<string, PlayerStats>>({});
  const [heroResults, setHeroResults] = useState<HeroResult[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      const handTexts = text.split('\n\n\n');
      const parsedHands = handTexts.map(parseHand);
      setHands(parsedHands);
      setStats(calculatePlayerStats(parsedHands));
      setHeroResults(calculateHeroResults(parsedHands));
    }
  };

  const cumulativeResults = heroResults.reduce((acc: any[], result: HeroResult, index: number) => {
    const previous = acc[index - 1] || { 
      total: 0, 
      showdown: 0, 
      nonShowdown: 0 
    };
    
    acc.push({
      hand: index + 1,
      total: previous.total + result.totalProfit,
      showdown: previous.showdown + result.showdownProfit,
      nonShowdown: previous.nonShowdown + result.nonShowdownProfit
    });
    
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-poker-navy text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-poker-gold">Poker Analysis Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-poker-burgundy/20 p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Hands</h2>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-poker-gold file:text-poker-navy
                hover:file:bg-poker-gold/80"
            />
          </Card>

          <Card className="bg-poker-burgundy/20 p-6">
            <h2 className="text-2xl font-semibold mb-4">Session Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Total Hands</p>
                <p className="text-2xl font-mono">{hands.length}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Profit</p>
                <p className="text-2xl font-mono text-poker-green">
                  ${hands.reduce((acc, hand) => acc + (hand.pot || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {Object.keys(stats).length > 0 && (
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-poker-burgundy/20 p-6">
              <h2 className="text-2xl font-semibold mb-4">Player Statistics</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="p-2">Player</th>
                      <th className="p-2">VPIP</th>
                      <th className="p-2">PFR</th>
                      <th className="p-2">AF</th>
                      <th className="p-2">Hands</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats).map(([player, stat]) => (
                      <tr key={player} className="border-b border-gray-700/50">
                        <td className="p-2">{player}</td>
                        <td className="p-2 font-mono">{stat.vpip.toFixed(1)}%</td>
                        <td className="p-2 font-mono">{stat.pfr.toFixed(1)}%</td>
                        <td className="p-2 font-mono">{stat.af.toFixed(2)}</td>
                        <td className="p-2 font-mono">{stat.hands}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="bg-poker-burgundy/20 p-6">
              <h2 className="text-2xl font-semibold mb-4">Hero's Profit/Loss Analysis</h2>
              <LineChart
                width={800}
                height={400}
                data={cumulativeResults}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hand" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Profit/Loss"
                  stroke="#4ade80"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="showdown"
                  name="Showdown Profit/Loss"
                  stroke="#60a5fa"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="nonShowdown"
                  name="Non-Showdown Profit/Loss"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;