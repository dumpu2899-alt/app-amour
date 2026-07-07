import { useState } from 'react';
import { Heart, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

type Mode = 'register' | 'login';

type Props = {
  initialMode: Mode;
  onSuccess: (userId: string, name: string, userCode: string, coupleId: string | null) => void;
  onBack: () => void;
  register: (name: string, email: string, password: string) => Promise<{ userId: string; name: string; userCode: string; coupleId: string | null }>;
  login: (email: string, password: string) => Promise<{ userId: string; name: string; userCode: string; coupleId: string | null }>;
};

export default function AuthPage({ initialMode, onSuccess, onBack, register, login }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!name.trim()) { setError('Veuillez entrer votre prénom.'); return; }
      if (!email.trim()) { setError('Veuillez entrer votre email.'); return; }
      if (password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return; }
    } else {
      if (!email.trim()) { setError('Veuillez entrer votre email.'); return; }
      if (!password) { setError('Veuillez entrer votre mot de passe.'); return; }
    }

    setLoading(true);
    try {
      const result = mode === 'register'
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);
      onSuccess(result.userId, result.name, result.userCode, result.coupleId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Cet email est déjà utilisé. Connectez-vous plutôt.');
      } else if (msg.includes('Invalid login')) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1e8] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-6 py-4">
        <button onClick={onBack} className="p-2 -ml-2 text-[#5a4060] hover:opacity-70">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2 mx-auto pr-8">
          <div className="w-7 h-7 rounded-full bg-[#2d1142] flex items-center justify-center">
            <Heart size={14} className="text-white fill-white" />
          </div>
          <span className="font-bold text-[#2d1142]">ALOWlove</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          {mode === 'register' ? (
            <>
              <h1 className="text-3xl font-black text-[#1a0520] mb-2">Créez votre espace</h1>
              <p className="text-sm text-[#7a6080] mb-8 leading-relaxed">
                Vous recevrez un code personnel à envoyer à votre partenaire juste après.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-black text-[#1a0520] mb-2">Bon retour</h1>
              <p className="text-sm text-[#7a6080] mb-8">
                Connectez-vous à votre espace.
              </p>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-[#1a0520] mb-1.5">
                  Votre prénom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  autoComplete="given-name"
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-[#1a0520] border border-[#d8cfc4] focus:border-[#2d1142] focus:ring-2 focus:ring-[#2d1142]/10 outline-none transition-all placeholder-[#b0a0b8]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#1a0520] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                className="w-full bg-white rounded-xl px-4 py-3.5 text-[#1a0520] border border-[#d8cfc4] focus:border-[#2d1142] focus:ring-2 focus:ring-[#2d1142]/10 outline-none transition-all placeholder-[#b0a0b8]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a0520] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? '8 caractères minimum' : '••••••••'}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  className="w-full bg-white rounded-xl px-4 py-3.5 pr-12 text-[#1a0520] border border-[#d8cfc4] focus:border-[#2d1142] focus:ring-2 focus:ring-[#2d1142]/10 outline-none transition-all placeholder-[#b0a0b8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0a0b8] hover:text-[#5a4060]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d1142] text-white font-semibold py-4 rounded-full mt-2 disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'register' ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7a6080] mt-6">
            {mode === 'register' ? (
              <>
                Déjà un compte ?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-[#2d1142] font-semibold underline underline-offset-2"
                >
                  Connectez-vous
                </button>
              </>
            ) : (
              <>
                Pas encore de compte ?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-[#2d1142] font-semibold underline underline-offset-2"
                >
                  Créez-en un
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
