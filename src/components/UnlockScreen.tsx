import { useState } from 'react';
import { Heart, Delete } from 'lucide-react';

type Props = {
  userName: string;
  userCode: string; // expected code stored locally
  onUnlock: () => void;
  onLogout: () => void;
};

export default function UnlockScreen({ userName, userCode, onUnlock, onLogout }: Props) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const expectedCode = userCode.toUpperCase();

  const handleChar = (c: string) => {
    if (input.length >= expectedCode.length) return;
    const next = input + c;
    setInput(next);

    if (next.length === expectedCode.length) {
      if (next.toUpperCase() === expectedCode) {
        setTimeout(() => onUnlock(), 250);
      } else {
        setShake(true);
        setAttempts((a) => a + 1);
        setTimeout(() => { setInput(''); setShake(false); }, 600);
      }
    }
  };

  const handleDelete = () => setInput((prev) => prev.slice(0, -1));

  const dots = Array.from({ length: expectedCode.length }, (_, i) => i < input.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1142] to-[#1a0520] flex flex-col items-center justify-between py-14 px-8">
      {/* Top */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shadow-lg">
          <Heart size={32} className="text-white fill-white" />
        </div>
        <h1 className="text-white text-2xl font-black tracking-tight mt-2">ALOWlove</h1>
        <p className="text-white/70 text-sm font-medium">
          Bonjour {userName} — entrez votre code
        </p>
      </div>

      {/* Dots */}
      <div className={`flex gap-3 ${shake ? 'animate-shake' : ''}`}>
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-white/40 transition-all duration-150 ${
              filled ? 'bg-white scale-110' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Keyboard — alphanumeric rows */}
      <div className="w-full max-w-xs">
        {attempts > 2 && (
          <p className="text-red-300 text-xs text-center mb-3 font-medium">
            Code incorrect. Réessayez.
          </p>
        )}

        {/* Use a hidden input + visual display for simplicity */}
        <div className="relative mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (val.length <= expectedCode.length) {
                setInput(val);
                if (val.length === expectedCode.length) {
                  if (val === expectedCode) {
                    setTimeout(() => onUnlock(), 250);
                  } else {
                    setShake(true);
                    setAttempts((a) => a + 1);
                    setTimeout(() => { setInput(''); setShake(false); }, 600);
                  }
                }
              }
            }}
            autoFocus
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-white/15 rounded-2xl px-5 py-4 text-white text-center text-3xl font-black tracking-[0.3em] border-2 border-white/30 focus:border-white/60 outline-none placeholder-white/30 uppercase"
            placeholder="——————"
            maxLength={expectedCode.length}
          />
        </div>

        {/* Numeric shortcut keypad for codes that are all digits */}
        <div className="grid grid-cols-3 gap-3">
          {['1','2','3','4','5','6','7','8','9'].map((d) => (
            <button
              key={d}
              onClick={() => handleChar(d)}
              className="h-14 rounded-2xl bg-white/15 text-white text-xl font-bold active:bg-white/30 active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleChar('0')}
            className="h-14 rounded-2xl bg-white/15 text-white text-xl font-bold active:bg-white/30 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-white/10 text-white/70 active:bg-white/20 active:scale-95 transition-all flex items-center justify-center"
          >
            <Delete size={20} />
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-5 text-white/40 text-xs text-center py-2 hover:text-white/70 transition-colors"
        >
          Utiliser un autre compte
        </button>
      </div>
    </div>
  );
}
