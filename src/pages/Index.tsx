
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { parseHand } from '@/utils/handParser';
import { calculatePlayerStats } from '@/utils/statsCalculator';
import { calculateHeroResults } from '@/utils/heroAnalyzer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HandReplay from '@/components/HandReplay';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FolderUp, FileUp } from "lucide-react";

const Index = () => {
  const [hands, setHands] = useState<Hand[]>([]);
  const [stats, setStats] = useState<Record<string, PlayerStats>>({});
  const [heroResults, setHeroResults] = useState<HeroResult[]>([]);
  const [selectedHand, setSelectedHand] = useState<Hand | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    const allHands: Hand[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        const handTexts = text.split('\n\n\n');
        
        // Filter out empty entries
        const validHandTexts = handTexts.filter(handText => handText.trim().length > 0);
        const parsedHands = validHandTexts.map(parseHand);
        allHands.push(...parsedHands);
      }
      
      setHands(allHands);
      setStats(calculatePlayerStats(allHands));
      setHeroResults(calculateHeroResults(allHands));
      
      toast({
        title: "Success",
        description: `Loaded ${allHands.length} hands from ${files.length} file(s)`,
      });
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error",
        description: "Failed to process hand history files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const totalProfit = cumulativeResults[cumulativeResults.length - 1]?.total || 0;
  const showdownProfit = cumulativeResults[cumulativeResults.length - 1]?.showdown || 0;
  const nonShowdownProfit = cumulativeResults[cumulativeResults.length - 1]?.nonShowdown || 0;

  return (
    <div className="min-h-screen bg-poker-navy text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-poker-gold">Poker Analysis Dashboard</h1>
          <p className="text-gray-400">Upload your poker hand history to analyze your performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-poker-burgundy/20 p-6 md:col-span-3">
            <h2 className="text-2xl font-semibold mb-4">Upload Hands</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer bg-poker-burgundy/10 hover:bg-poker-burgundy/30 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 mb-2 text-poker-gold" />
                    <p className="text-sm text-gray-300">Upload single file</p>
                  </div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    onChange={handleFileUpload} 
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex-1">
                <label 
                  htmlFor="folder-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer bg-poker-burgundy/10 hover:bg-poker-burgundy/30 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FolderUp className="w-8 h-8 mb-2 text-poker-gold" />
                    <p className="text-sm text-gray-300">Upload multiple files</p>
                  </div>
                  <input 
                    id="folder-upload" 
                    type="file" 
                    // Fix TypeScript error by using the attribute as a property instead
                    multiple
                    // @ts-ignore - TypeScript doesn't recognize webkitdirectory attribute
                    webkitdirectory=""
                    directory=""
                    onChange={handleFileUpload} 
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {isLoading && (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-poker-gold"></div>
              </div>
            )}
          </Card>

          <Card className="bg-poker-burgundy/20 p-6">
            <h2 className="text-xl font-semibold mb-4">Total Profit/Loss</h2>
            <p className={`text-3xl font-mono ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </Card>

          <Card className="bg-poker-burgundy/20 p-6">
            <h2 className="text-xl font-semibold mb-4">Showdown Profit</h2>
            <p className={`text-3xl font-mono ${showdownProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${showdownProfit.toFixed(2)}
            </p>
          </Card>

          <Card className="bg-poker-burgundy/20 p-6">
            <h2 className="text-xl font-semibold mb-4">Non-Showdown Profit</h2>
            <p className={`text-3xl font-mono ${nonShowdownProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${nonShowdownProfit.toFixed(2)}
            </p>
          </Card>
        </div>

        {hands.length > 0 && (
          <>
            <Card className="bg-poker-burgundy/20 p-6">
              <h2 className="text-2xl font-semibold mb-4">Profit Graph</h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer>
                  <LineChart data={cumulativeResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="hand" 
                      stroke="#fff"
                      label={{ value: 'Hands Played', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="#fff"
                      label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid #333' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Profit/Loss"
                      stroke="#ffd700"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="showdown"
                      name="Showdown Profit/Loss"
                      stroke="#60a5fa"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="nonShowdown"
                      name="Non-Showdown Profit/Loss"
                      stroke="#ef4444"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <tr key={player} className="border-b border-gray-700/50 hover:bg-poker-burgundy/30">
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

              <div className="space-y-4">
                <Card className="bg-poker-burgundy/20 p-6">
                  <h2 className="text-2xl font-semibold mb-4">Hand History</h2>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {hands.map((hand, index) => (
                      <div
                        key={hand.id}
                        onClick={() => setSelectedHand(hand)}
                        className="p-2 rounded cursor-pointer hover:bg-poker-burgundy/30 transition-colors"
                      >
                        <span className="text-poker-gold">Hand #{hand.id}</span>
                        <span className="text-sm text-gray-400 ml-2">
                          {hand.players.length} players
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedHand && (
                  <HandReplay hand={selectedHand} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
