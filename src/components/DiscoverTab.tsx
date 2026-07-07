import { useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { QUIZZES, GAMES, DAILY_QUESTIONS } from '../data/content';

type Props = {
  onSelectQuiz: (id: string) => void;
  onSelectGame: (id: string) => void;
};

type Subject = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  content: { title: string; body: string }[];
};

const SUBJECTS: Subject[] = [
  {
    id: 'communication',
    title: 'Communication',
    description: 'Améliore ta façon de communiquer avec ton conjoint',
    emoji: '💬',
    color: '#6B4EFF',
    bgColor: '#F0EDFF',
    content: [
      { title: 'Écoute active', body: 'Pratiquer l\'écoute sans interruption pendant 5 minutes. Laisse ton partenaire terminer chaque phrase avant de répondre.' },
      { title: 'Les 3 mots du jour', body: 'Chaque soir, dites 3 choses positives que vous avez remarquées chez l\'autre dans la journée.' },
      { title: 'Le check-in émotionnel', body: 'Une fois par semaine, demandez-vous : "Comment tu te sens vraiment ?" Pas de jugement, juste de l\'écoute.' },
      { title: 'Éviter les généralisations', body: 'Remplace "Tu fais toujours..." par "Aujourd\'hui j\'ai ressenti...". Parle de toi, pas de l\'autre.' },
      { title: 'Le code secret', body: 'Créez un mot ou signe pour signifier "j\'ai besoin d\'espace" ou "j\'ai besoin de toi" sans discussion.' },
    ],
  },
  {
    id: 'conflit',
    title: 'Conflit',
    description: 'Apprenez nos secrets pour mieux gérer les conflits',
    emoji: '🩹',
    color: '#FF6B9D',
    bgColor: '#FFF0F6',
    content: [
      { title: 'La règle du 24h', body: 'Avant d\'aborder un sujet sensible, attendez 24h. Les émotions se calment et la conversation sera plus constructive.' },
      { title: 'Attaque le problème, pas la personne', body: 'Dis "Ce comportement me blesse" plutôt que "Tu es égoïste". La nuance change tout.' },
      { title: 'Timeout sans fuite', body: 'Si ça chauffe, proposez une pause de 20 minutes. Mais fixez l\'heure où vous reprenez la discussion.' },
      { title: 'Chercher à comprendre', body: 'Avant de vouloir être compris, essaie de comprendre le point de vue de l\'autre. Répète ce que tu as entendu.' },
      { title: 'La réconciliation rituelle', body: 'Créez votre propre façon de faire la paix : un câlin long, une phrase spéciale, ou préparer le plat préféré de l\'autre.' },
    ],
  },
  {
    id: 'sexe-intime',
    title: 'Sexe et vie intime',
    description: 'Rends ta vie sexuelle plus épanouissante',
    emoji: '🌶️',
    color: '#9B59B6',
    bgColor: '#F5F0FF',
    content: [
      { title: 'Parler de ses désirs', body: 'Commencez par écrire chacun vos envies sur un papier, puis comparez. Moins intimidant qu\'en face à face.' },
      { title: 'Redécouvrir le toucher', body: 'Passez 10 minutes à vous masser mutuellement sans objectif. La connexion physique au-delà de la sexualité renforce l\'intimité.' },
      { title: 'Briser la routine', body: 'Changez simplement l\'heure, le lieu ou l\'ambiance. La nouveauté ravive le désir sans bouleversement.' },
      { title: 'Exprimer ce qu\'on aime', body: 'Dire "j\'aime quand tu..." crée un espace sûr pour partager ses préférences sans que l\'autre se sente critiqué.' },
      { title: 'Le date night intime', body: 'Réservez une soirée par semaine pour vous, sans écrans, avec intention de vous rapprocher.' },
    ],
  },
  {
    id: 'lgbtq',
    title: 'LGBTQ+',
    description: 'Explore des conversations LGBT+ avec ton partenaire',
    emoji: '🏳️‍🌈',
    color: '#FF6B35',
    bgColor: '#FFF5F0',
    content: [
      { title: 'Parler de son identité', body: 'Partagez comment vous vous définissez et ce que ça signifie pour vous. Pas de bonne ou mauvaise réponse.' },
      { title: 'Naviguer la famille', body: 'Discutez de votre stratégie commune face aux familles : qui est au courant ? Comment on le gère ensemble ?' },
      { title: 'La fierté en couple', body: 'Qu\'est-ce que la Pride représente pour vous en tant que couple ? Comment la célébrez-vous ?' },
      { title: 'Soutien face à la discrimination', body: 'Comment vous soutenez-vous mutuellement quand vous faites face à des situations difficiles dans le monde extérieur ?' },
      { title: 'Construire sa bulle safe', body: 'Quelles sont les personnes, lieux et espaces qui constituent votre cercle de sécurité et de soutien ?' },
    ],
  },
  {
    id: 'connexion',
    title: 'Connexion',
    description: 'Renforce ta connexion avec ton conjoint',
    emoji: '🤝',
    color: '#2ECC71',
    bgColor: '#F0FFF5',
    content: [
      { title: 'Le regard de 4 minutes', body: 'Regardez-vous dans les yeux pendant 4 minutes en silence. Inconfortable au début, profond ensuite.' },
      { title: 'Questions sans fond', body: 'Chaque semaine, posez-vous une question profonde à laquelle vous n\'avez jamais répondu ensemble.' },
      { title: 'Le rituel du soir', body: 'Avant de dormir, partagez : la meilleure chose de la journée, et quelque chose que vous attendez demain.' },
      { title: 'Rire ensemble intentionnellement', body: 'Regardez un film comique, jouez à un jeu, ou rappelez des souvenirs drôles. Le rire crée de la proximité.' },
      { title: 'Les rêves partagés', body: 'Créez ensemble un tableau de vos rêves et projets. Visualiser l\'avenir ensemble renforce l\'engagement.' },
    ],
  },
];

const CATEGORY_ICONS = [
  { id: 'questions', label: 'Questions', emoji: '❓', color: '#E8E3FF', iconBg: '#7C3AED' },
  { id: 'jeux', label: 'Jeux', emoji: '🏆', color: '#EDF0DC', iconBg: '#7C6B20' },
  { id: 'packs', label: 'Packs', emoji: '🃏', color: '#FFE0EC', iconBg: '#C2185B' },
  { id: 'parcours', label: 'Parcours', emoji: '💞', color: '#F0F0E8', iconBg: '#9B59B6' },
  { id: 'quiz', label: 'Quiz', emoji: '💡', color: '#FFF5E0', iconBg: '#E67E22' },
];

export default function DiscoverTab({ onSelectQuiz, onSelectGame }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Category view
  if (selectedCategory === 'questions') {
    const cats = Array.from(new Set(DAILY_QUESTIONS.map(q => q.category)));
    return (
      <div className="flex flex-col min-h-screen bg-white pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSelectedCategory(null)} className="p-2 -ml-2">
            <X size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Questions</h1>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          {cats.map((cat) => {
            const qs = DAILY_QUESTIONS.filter(q => q.category === cat);
            return (
              <div key={cat} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="font-bold text-gray-800 mb-2">{cat}</p>
                <p className="text-sm text-gray-500">{qs.length} questions</p>
                <div className="mt-3 flex flex-col gap-1">
                  {qs.slice(0, 2).map(q => (
                    <p key={q.id} className="text-sm text-gray-600 truncate">• {q.question}</p>
                  ))}
                  {qs.length > 2 && <p className="text-xs text-violet-600 font-medium">+{qs.length - 2} autres...</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (selectedCategory === 'quiz') {
    return (
      <div className="flex flex-col min-h-screen bg-white pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSelectedCategory(null)} className="p-2 -ml-2">
            <X size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Quiz</h1>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          {QUIZZES.map(quiz => (
            <button
              key={quiz.id}
              onClick={() => onSelectQuiz(quiz.id)}
              className="rounded-2xl p-4 text-left flex items-center gap-4 active:scale-95 transition-transform"
              style={{ backgroundColor: quiz.color }}
            >
              <span className="text-4xl">{quiz.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-base" style={{ color: quiz.textColor }}>{quiz.title}</p>
                <p className="text-sm opacity-70" style={{ color: quiz.textColor }}>{quiz.questions.length} questions</p>
              </div>
              <ChevronRight size={20} style={{ color: quiz.textColor }} className="opacity-50" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCategory === 'jeux') {
    return (
      <div className="flex flex-col min-h-screen bg-white pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSelectedCategory(null)} className="p-2 -ml-2">
            <X size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Jeux</h1>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="rounded-2xl p-4 text-left flex items-center gap-4 active:scale-95 transition-transform"
              style={{ backgroundColor: game.color }}
            >
              <span className="text-4xl">{game.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-base" style={{ color: game.textColor }}>{game.title}</p>
                <p className="text-sm opacity-70" style={{ color: game.textColor }}>{game.description}</p>
              </div>
              <ChevronRight size={20} style={{ color: game.textColor }} className="opacity-50" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCategory === 'packs' || selectedCategory === 'parcours') {
    const isParcours = selectedCategory === 'parcours';
    const items = isParcours
      ? [
          { title: 'Parcours Communication', desc: '7 jours pour mieux vous exprimer', emoji: '💬', questions: 14 },
          { title: 'Parcours Confiance', desc: '5 jours pour renforcer la confiance', emoji: '🤝', questions: 10 },
          { title: 'Parcours Intimité', desc: '10 jours pour vous rapprocher', emoji: '💕', questions: 20 },
          { title: 'Parcours Projets', desc: '3 jours pour aligner vos objectifs', emoji: '🌟', questions: 6 },
        ]
      : [
          { title: 'Pack Débutants', desc: 'Parfait pour débuter votre aventure', emoji: '🌱', questions: 20 },
          { title: 'Pack Romantique', desc: 'Pour les amoureux épanouis', emoji: '💖', questions: 20 },
          { title: 'Pack Profond', desc: 'Des conversations qui marquent', emoji: '🌊', questions: 20 },
          { title: 'Pack Fun', desc: 'Pour rire et s\'amuser ensemble', emoji: '🎉', questions: 20 },
        ];
    return (
      <div className="flex flex-col min-h-screen bg-white pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSelectedCategory(null)} className="p-2 -ml-2">
            <X size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{isParcours ? 'Parcours' : 'Packs'}</h1>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="bg-gradient-to-r from-violet-50 to-white rounded-2xl p-4 border border-violet-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-3xl flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
                <span className="text-xs text-violet-600 font-medium">{item.questions} activités</span>
              </div>
              <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2 py-1 rounded-full">Bientôt</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Subject detail view
  if (selectedSubject) {
    return (
      <div className="flex flex-col min-h-screen pb-24" style={{ backgroundColor: selectedSubject.bgColor }}>
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedSubject(null)}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
          >
            <X size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{selectedSubject.title}</h1>
        </div>

        <div className="px-5 mb-6">
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="text-4xl mb-3">{selectedSubject.emoji}</div>
            <p className="text-gray-600 text-sm leading-relaxed">{selectedSubject.description}</p>
          </div>
        </div>

        <div className="px-5 flex flex-col gap-3">
          {selectedSubject.content.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: selectedSubject.color }}
                >
                  {i + 1}
                </div>
                <p className="font-bold text-gray-900">{item.title}</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-10">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filtered = SUBJECTS.filter(
    s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900">Découvrir</h1>
          <button
            onClick={() => setSearchOpen(s => !s)}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shadow-sm"
          >
            {searchOpen ? <X size={18} className="text-gray-600" /> : <Search size={18} className="text-gray-600" />}
          </button>
        </div>
        {searchOpen && (
          <div className="mt-3">
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-gray-800 text-sm outline-none"
            />
          </div>
        )}
      </div>

      {/* Category icons row */}
      {!searchOpen && (
        <div className="px-5 mb-6">
          <div className="flex items-start justify-between">
            {CATEGORY_ICONS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.emoji}
                </div>
                <span className="text-xs font-medium text-gray-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activités par sujet */}
      <div className="px-5">
        <h2 className="text-xl font-black text-gray-900 mb-4">Activités par sujet</h2>
        <div className="flex flex-col gap-3">
          {filtered.map(subject => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center active:scale-98 transition-transform text-left"
            >
              <div className="flex-1 p-4">
                <p className="font-bold text-lg text-gray-900 mb-1">{subject.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{subject.description}</p>
              </div>
              <div
                className="w-24 h-24 flex-shrink-0 flex items-center justify-center text-5xl"
                style={{ backgroundColor: subject.bgColor }}
              >
                {subject.emoji}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
