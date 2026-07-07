import { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, Trophy, RotateCcw } from 'lucide-react';
import { GAMES } from '../data/content';

type Props = {
  gameId: string;
  onComplete: () => void;
  onBack: () => void;
};

export default function GamePlay({ gameId, onComplete, onBack }: Props) {
  const game = GAMES.find(g => g.id === gameId) ?? GAMES[0];
  const [cardIndex, setCardIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const total = game.content.length;
  const card = game.content[cardIndex];

  const next = () => {
    if (cardIndex < total - 1) {
      setCardIndex(i => i + 1);
    } else {
      setFinished(true);
      onComplete();
    }
  };

  const prev = () => {
    if (cardIndex > 0) setCardIndex(i => i - 1);
  };

  const reset = () => {
    setCardIndex(0);
    setFinished(false);
    setScore1(0);
    setScore2(0);
  };

  if (finished) {
    return (
      <div className="flex flex-col min-h-screen pb-safe" style={{ backgroundColor: game.color }}>
        <div className="px-5 pt-12 pb-6 flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
            <ArrowLeft size={20} style={{ color: game.textColor }} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
          <div className="text-6xl mb-4 select-none">{game.emoji}</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: game.textColor }}>Jeu terminé !</h2>
          <p className="text-base font-medium mb-8 opacity-70" style={{ color: game.textColor }}>
            Vous avez parcouru toutes les cartes ensemble 🎉
          </p>

          {(game.type === 'jamais' || game.type === 'rapid-fire') && (
            <div className="w-full bg-white/60 rounded-2xl p-5 mb-6">
              <p className="text-sm font-bold mb-4" style={{ color: game.textColor }}>Score</p>
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-xs opacity-60 mb-1" style={{ color: game.textColor }}>Joueur 1</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setScore1(s => Math.max(0, s - 1))} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-lg font-bold">-</button>
                    <span className="text-3xl font-black" style={{ color: game.textColor }}>{score1}</span>
                    <button onClick={() => setScore1(s => s + 1)} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-60 mb-1" style={{ color: game.textColor }}>Joueur 2</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setScore2(s => Math.max(0, s - 1))} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-lg font-bold">-</button>
                    <span className="text-3xl font-black" style={{ color: game.textColor }}>{score2}</span>
                    <button onClick={() => setScore2(s => s + 1)} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={reset}
              className="flex-1 bg-white/60 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ color: game.textColor }}
            >
              <RotateCcw size={18} />
              Rejouer
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
              style={{ color: game.textColor }}
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-safe" style={{ backgroundColor: game.color }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
          <ArrowLeft size={20} style={{ color: game.textColor }} />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold opacity-60 leading-none" style={{ color: game.textColor }}>
            {game.category}
          </p>
          <p className="text-sm font-bold" style={{ color: game.textColor }}>{game.title}</p>
        </div>
        <span className="text-sm font-bold opacity-60" style={{ color: game.textColor }}>
          {cardIndex + 1}/{total}
        </span>
      </div>

      {/* Progress */}
      <div className="px-5 mb-6">
        <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-400"
            style={{ width: `${((cardIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Instructions (only on first card) */}
      {cardIndex === 0 && (
        <div className="mx-5 mb-4 bg-white/40 rounded-xl p-3">
          <p className="text-xs font-medium" style={{ color: game.textColor }}>{game.instructions}</p>
        </div>
      )}

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="text-5xl mb-6 select-none text-center">{game.emoji}</div>
        <div
          className="w-full bg-white/70 rounded-3xl p-8 shadow-sm"
        >
          <p className="text-2xl font-bold text-center leading-snug" style={{ color: game.textColor }}>
            {card}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 py-6 flex items-center justify-between gap-4">
        <button
          onClick={prev}
          disabled={cardIndex === 0}
          className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
        >
          <ChevronLeft size={24} style={{ color: game.textColor }} />
        </button>

        <button
          onClick={next}
          className="flex-1 bg-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
          style={{ color: game.textColor }}
        >
          {cardIndex < total - 1 ? (
            <>
              Suivant
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              Terminer
              <Trophy size={18} className="text-amber-500" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
