import { useState } from 'react';
import { Heart, Loader2, ArrowLeft, Mail } from 'lucide-react';

type Props = {
  initialMode?: 'login';
  onSuccess: (userId: string, name: string, userCode: string, coupleId: string | null) => void;
  onBack: () => void;
  login: (email: string) => Promise<{ userId: string; name: string; userCode: string; coupleId: string | null }>;
};

export default function AuthPage({ onSuccess, onBack, login }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Veuillez entrer votre email.'); return; }

    setLoading(true);
    try {
      await login(email.trim());
      setMagicLinkSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      if (msg === 'UNSENT_MAGIC_LINK') {
        setMagicLinkSent(true);
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
          <h1 className="text-3xl font-black text-[#1a0520] mb-2">Bon retour</h1>
          <p className="text-sm text-[#7a6080] mb-8">
            Connectez-vous à votre espace.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            )}

            {magicLinkSent && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 flex items-start gap-3">
                <Mail size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-700 font-semibold text-sm">Vérifiez votre boîte mail</p>
                  <p className="text-emerald-600 text-xs mt-1">Un lien de connexion a été envoyé à {email}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d1142] text-white font-semibold py-4 rounded-full mt-2 disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Recevoir le lien de connexion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
