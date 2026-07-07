import { Heart } from 'lucide-react';

type Props = {
  onRegister: () => void;
  onLogin: () => void;
};

export default function LandingPage({ onRegister, onLogin }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f1e8]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2d1142] flex items-center justify-center">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-[#2d1142] text-lg tracking-tight">ALOWlove</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onLogin}
            className="text-sm font-medium text-[#2d1142] hover:opacity-70 transition-opacity"
          >
            Se connecter
          </button>
          <button
            onClick={onRegister}
            className="bg-[#2d1142] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Commencer gratuitement
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#c4785a] mb-5">
            GRATUIT · SANS PUBLICITÉ · À DEUX
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-[#1a0520] leading-tight mb-6">
            Une question<br />par jour.<br />
            <span className="italic text-[#d4606a] font-black">Deux</span>{' '}
            réponses.
          </h1>
          <p className="text-[#5a4060] leading-relaxed mb-8 max-w-md">
            Chaque matin, vous recevez tous les deux la même question.
            Vous répondez chacun de votre côté, sans voir la réponse
            de l'autre — puis vos deux réponses se révèlent ensemble.
            Une petite conversation, tous les jours, qui vous ressemble.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onRegister}
              className="bg-[#2d1142] text-white font-semibold px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Créer notre espace
            </button>
            <button
              onClick={onLogin}
              className="text-[#2d1142] font-medium text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              J'ai déjà un compte
            </button>
          </div>
        </div>

        {/* Right — stacked cards */}
        <div className="relative h-72 lg:h-96 flex items-center justify-center">
          {/* Back card (dark) */}
          <div
            className="absolute w-64 bg-[#2d1142] rounded-3xl p-5 shadow-2xl"
            style={{ transform: 'rotate(4deg) translate(40px, 20px)', zIndex: 1 }}
          >
            <p className="text-[#c4785a] text-[9px] font-bold tracking-[0.18em] mb-3">
              QUESTION DU JOUR
            </p>
            <p className="text-white font-semibold text-sm leading-snug mb-4">
              Quel petit moment de la semaine t'a fait sourire sans que je le sache ?
            </p>
            <div>
              <p className="text-[#a080b0] text-xs font-semibold mb-1">Ton·a partenaire</p>
              <p className="text-[#c4785a] text-xs flex items-center gap-1">
                <span>✓</span> a déjà répondu
              </p>
            </div>
          </div>

          {/* Front card (white) */}
          <div
            className="absolute w-64 bg-white rounded-3xl p-5 shadow-xl border border-gray-100"
            style={{ transform: 'rotate(-2deg) translate(-20px, -10px)', zIndex: 2 }}
          >
            <p className="text-[#c4785a] text-[9px] font-bold tracking-[0.18em] mb-3">
              QUESTION DU JOUR
            </p>
            <p className="text-[#1a0520] font-semibold text-sm leading-snug mb-5">
              Quel petit moment de la semaine t'a fait sourire sans que je le sache ?
            </p>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 font-medium mb-1">Toi</p>
              <p className="text-xs text-gray-300 italic">en train d'écrire...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div className="border-t border-[#e8dfd0] bg-[#f0e9dc]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: '💬', title: 'Une question par jour', desc: 'Posée chaque matin, différente chaque jour.' },
            { emoji: '🔒', title: 'Vos réponses privées', desc: 'Vous répondez séparément, puis découvrez ensemble.' },
            { emoji: '📅', title: 'Un espace partagé', desc: 'Souvenirs, anniversaires, statistiques du couple.' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <p className="font-semibold text-[#1a0520] text-sm">{f.title}</p>
                <p className="text-sm text-[#7a6080] mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
