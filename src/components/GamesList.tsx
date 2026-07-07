import { ArrowLeft } from 'lucide-react';
import { GAMES, Game } from '../data/content';

type Props = {
  onSelectGame: (gameId: string) => void;
  onBack: () => void;
  isCompleted: (type: string, id: string) => boolean;
};

function GameCard({ game, completed, onClick }: { game: Game; completed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden active:scale-[0.98] transition-transform duration-150 relative"
      style={{ backgroundColor: game.color }}
    >
      <div className="p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0 text-2xl select-none">
          {game.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/50" style={{ color: game.textColor }}>
              {game.category}
            </span>
            {completed && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white">
                ✓ Fait
              </span>
            )}
          </div>
          <p className="font-bold text-base leading-tight" style={{ color: game.textColor }}>
            {game.title}
          </p>
          <p className="text-xs mt-0.5 opacity-70 leading-snug" style={{ color: game.textColor }}>
            {game.description}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold" style={{ color: game.textColor }}>→</span>
        </div>
      </div>
    </button>
  );
}

export default function GamesList({ onSelectGame, onBack, isCompleted }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tous les jeux</h1>
          <p className="text-sm text-gray-500">{GAMES.length} jeux pour renforcer votre lien</p>
        </div>
      </div>

      {/* Games */}
      <div className="px-5 flex flex-col gap-3">
        {GAMES.map(game => (
          <GameCard
            key={game.id}
            game={game}
            completed={isCompleted('game', game.id)}
            onClick={() => onSelectGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
