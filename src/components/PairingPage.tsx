import { useState } from 'react';
import { Copy, Check, Loader2, Heart, Lightbulb } from 'lucide-react';

type Props = {
  userName: string;
  userCode: string;
  onJoin: (partnerCode: string) => Promise<void>;
  onSkip?: () => void;
};

export default function PairingPage({ userName, userCode, onJoin, onSkip }: Props) {
  const [partnerCode, setPartnerCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  };

  const handleJoin = async () => {
    const code = partnerCode.trim().toUpperCase();
    if (!code) { setError('Entrez le code de votre partenaire.'); return; }
    if (code === userCode) { setError('Vous ne pouvez pas entrer votre propre code.'); return; }
    if (code.length !== 6) { setError('Le code doit faire 6 caractères.'); return; }

    setLoading(true);
    setError('');
    try {
      await onJoin(code);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Code introuvable';
      if (msg.includes('not found') || msg.includes('introuvable')) {
        setError("Code introuvable. Vérifiez que votre partenaire l'a bien partagé.");
      } else if (msg.includes('already')) {
        setError('Ce partenaire a déjà un espace. Utilisez "Se connecter".');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1e8] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#2d1142] flex items-center justify-center">
            <Heart size={20} className="text-white fill-white" />
          </div>
        </div>

        <p className="text-center text-xs font-bold tracking-[0.18em] text-[#c4785a] mb-3">
          DERNIÈRE ÉTAPE, {userName.toUpperCase()}
        </p>
        <h1 className="text-center text-3xl font-black text-[#1a0520] mb-3">
          Formez votre espace à deux
        </h1>
        <p className="text-center text-sm text-[#7a6080] mb-8 leading-relaxed">
          Partagez votre code avec votre partenaire, ou entrez le sien ci-dessous. Une seule des deux personnes a besoin de le faire.
        </p>

        {/* Your code */}
        <div className="bg-white rounded-2xl p-4 border border-[#d8cfc4] mb-4">
          <p className="text-xs text-[#9a8a9a] font-medium mb-2">Votre code personnel</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black tracking-[0.15em] text-[#1a0520]">
              {userCode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#f0e9dc] hover:bg-[#e8dfd0] text-[#2d1142] text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copié
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3">
          <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Astuce :</span> partagez votre code à votre partenaire par message. Il/elle entre le code dans son app pour vous rejoindre.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#d8cfc4]" />
          <span className="text-xs text-[#9a8a9a] font-medium">ou</span>
          <div className="flex-1 h-px bg-[#d8cfc4]" />
        </div>

        {/* Partner code input */}
        <div className="mb-3">
          <label className="block text-sm font-semibold text-[#1a0520] mb-2">
            Code de votre partenaire
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={partnerCode}
              onChange={(e) => {
                setError('');
                setPartnerCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
              }}
              placeholder="EX. QP9M2L"
              maxLength={6}
              className="flex-1 bg-white rounded-xl px-4 py-3 text-[#1a0520] font-mono tracking-wider text-sm border border-[#d8cfc4] focus:border-[#2d1142] focus:ring-2 focus:ring-[#2d1142]/10 outline-none placeholder-[#b0a0b8] uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={loading || partnerCode.length < 3}
              className="bg-[#2d1142] text-white font-semibold px-5 py-3 rounded-xl disabled:opacity-50 flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Rejoindre
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-rose-700 text-sm">{error}</p>
          </div>
        )}

        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full text-center text-sm text-[#9a8a9a] hover:text-[#5a4060] mt-4 py-2 transition-colors"
          >
            Continuer sans partenaire pour l'instant
          </button>
        )}
      </div>
    </div>
  );
}
