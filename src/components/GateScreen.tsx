import { useState } from 'react';
import { Delete } from 'lucide-react';

type Props = {
  onPass: () => void;
};

const SECRET = '43124312';

export default function GateScreen({ onPass }: Props) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleKey = (k: string) => {
    if (status === 'success') return;
    if (input.length >= SECRET.length) return;

    const next = input + k;
    setInput(next);

    if (next.length === SECRET.length) {
      if (next === SECRET) {
        setStatus('success');
        sessionStorage.setItem('alow_gate_ok', '1');
        setTimeout(() => onPass(), 600);
      } else {
        setStatus('error');
        setTimeout(() => {
          setInput('');
          setStatus('idle');
        }, 650);
      }
    }
  };

  const handleDelete = () => {
    if (status === 'success') return;
    if (status === 'error') {
      setInput('');
      setStatus('idle');
      return;
    }
    setInput((p) => p.slice(0, -1));
  };

  const dotColor = (i: number) => {
    if (i >= input.length) return 'bg-transparent border-white/30';
    if (status === 'error') return 'bg-rose-400 border-rose-400';
    if (status === 'success') return 'bg-emerald-400 border-emerald-400 scale-110';
    return 'bg-white border-white scale-110';
  };

  const ROWS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <div className="min-h-screen bg-[#1a0d26] flex flex-col items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#6b21a8]/20 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8 w-full max-w-xs">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' }}
          >
            <span className="text-white text-4xl select-none">♡</span>
          </div>
          <div className="text-center">
            <h1 className="text-white text-2xl font-black tracking-tight">ALOWlove</h1>
            <p className="text-white/50 text-sm mt-1">Entrez votre code d'accès</p>
          </div>
        </div>

        {/* Dots */}
        <div className={`flex gap-3.5 ${status === 'error' ? 'animate-shake' : ''}`}>
          {Array.from({ length: SECRET.length }, (_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${dotColor(i)}`}
            />
          ))}
        </div>

        {/* Error hint */}
        <div className={`h-4 transition-opacity duration-300 ${status === 'error' ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-rose-400 text-xs font-medium text-center">Code incorrect</p>
        </div>

        {/* Keypad */}
        <div className="w-full grid grid-rows-4 gap-3">
          {ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-3">
              {row.map((key, ki) => {
                if (key === '') return <div key={ki} />;

                if (key === 'del') {
                  return (
                    <button
                      key={ki}
                      onClick={handleDelete}
                      disabled={status === 'success'}
                      className="h-16 rounded-2xl bg-white/10 text-white/60 flex items-center justify-center active:scale-95 active:bg-white/20 transition-all duration-100 select-none"
                    >
                      <Delete size={20} />
                    </button>
                  );
                }

                return (
                  <button
                    key={ki}
                    onClick={() => handleKey(key)}
                    disabled={status === 'success'}
                    className={`h-16 rounded-2xl text-white text-2xl font-semibold flex items-center justify-center transition-all duration-100 select-none
                      ${status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/10 active:scale-95 active:bg-white/25 hover:bg-white/15'
                      }`}
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
