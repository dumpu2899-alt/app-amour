import { useState, useEffect } from 'react';
import { Heart, Delete } from 'lucide-react';

const PASSWORD = '43124312';
const STORAGE_KEY = 'paired_unlocked';

type Props = {
  onUnlock: () => void;
};

export default function LockScreen({ onUnlock }: Props) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleDigit = (d: string) => {
    if (input.length >= PASSWORD.length) return;
    const next = input + d;
    setInput(next);

    if (next.length === PASSWORD.length) {
      if (next === PASSWORD) {
        localStorage.setItem(STORAGE_KEY, '1');
        setTimeout(() => onUnlock(), 300);
      } else {
        setShake(true);
        setAttempts(a => a + 1);
        setTimeout(() => {
          setInput('');
          setShake(false);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const dots = Array.from({ length: PASSWORD.length }, (_, i) => i < input.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600 to-violet-900 flex flex-col items-center justify-between py-16 px-8">
      {/* Top */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
          <Heart size={32} className="text-white fill-white" />
        </div>
        <h1 className="text-white text-2xl font-black tracking-tight mt-2">Paired</h1>
        <p className="text-white/70 text-sm font-medium">Entrez votre code pour accéder</p>
      </div>

      {/* Dots */}
      <div className={`flex gap-4 ${shake ? 'animate-shake' : ''}`}>
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-white/60 transition-all duration-150 ${
              filled ? 'bg-white scale-110' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs">
        {attempts > 2 && (
          <p className="text-red-300 text-xs text-center mb-4 font-medium">
            Code incorrect. Réessayez.
          </p>
        )}
        <div className="grid grid-cols-3 gap-4">
          {['1','2','3','4','5','6','7','8','9'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-16 rounded-2xl bg-white/15 text-white text-2xl font-bold active:bg-white/30 active:scale-95 transition-all duration-100 flex items-center justify-center"
            >
              {d}
            </button>
          ))}
          {/* Empty, 0, Delete */}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-2xl bg-white/15 text-white text-2xl font-bold active:bg-white/30 active:scale-95 transition-all duration-100 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-white/10 text-white/70 active:bg-white/20 active:scale-95 transition-all duration-100 flex items-center justify-center"
          >
            <Delete size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useAuth() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setUnlocked(stored === '1');
  }, []);

  return { unlocked, unlock: () => setUnlocked(true) };
}
