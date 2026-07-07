import { useState, useEffect } from 'react';
import { Bookmark, Plus, X, Camera, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── DISCUSS TAB ───────────────────────────────────────────────────────────────

type ActivityItem = {
  id: string;
  type: 'quiz' | 'question';
  title: string;
  subtitle: string;
  date: string;
  answered: boolean;
  partnerAnswered: boolean;
  color: string;
  emoji: string;
};

const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: 'quiz-petites-nouvelles',
    type: 'quiz',
    title: 'Petites nouvelles au quotidien',
    subtitle: 'Tu as répondu à ce quiz',
    date: '05 juil.',
    answered: true,
    partnerAnswered: false,
    color: '#FDDCB5',
    emoji: '📅',
  },
  {
    id: 'q-am4',
    type: 'question',
    title: 'Si tu avais le droit de faire trois vœux, mais ils affectaient aussi ton partenaire...',
    subtitle: 'Vous avez répondu à cette question',
    date: '04 juil.',
    answered: true,
    partnerAnswered: true,
    color: '#EEE6FF',
    emoji: '✨',
  },
  {
    id: 'q-lo5',
    type: 'question',
    title: 'Quel personnage fictif, tiré d\'un film, voudrais-tu rencontrer ?',
    subtitle: 'Toi: Va une fois l\'épouser nor...',
    date: '02 juil.',
    answered: true,
    partnerAnswered: true,
    color: '#FFE8F0',
    emoji: '🎬',
  },
  {
    id: 'q-gr3',
    type: 'question',
    title: 'Si tu ne pouvais manger qu\'un seul plat pour le reste de ta vie, ce serait lequel ?',
    subtitle: 'Toi: C\'est mieux une applicati...',
    date: '01 juil.',
    answered: true,
    partnerAnswered: true,
    color: '#E8F5E0',
    emoji: '🍽️',
  },
  {
    id: 'quiz-connais-tu',
    type: 'quiz',
    title: 'Quiz de juin 2026',
    subtitle: 'Toi: Regarde comment sur m...',
    date: '30 juin',
    answered: true,
    partnerAnswered: false,
    color: '#D8D0F5',
    emoji: '💜',
  },
  {
    id: 'q-am1',
    type: 'question',
    title: 'Quel est ton plus grand regret et qu\'aurais-tu fait différemment ?',
    subtitle: 'À ton tour de répondre',
    date: '28 juin',
    answered: false,
    partnerAnswered: true,
    color: '#FFF3E0',
    emoji: '💭',
  },
  {
    id: 'quiz-reves',
    type: 'quiz',
    title: 'Rêves & Projets',
    subtitle: 'Nouveau quiz disponible',
    date: '25 juin',
    answered: false,
    partnerAnswered: false,
    color: '#B3D9F5',
    emoji: '🌟',
  },
];

type DiscussFilter = 'tout' | 'tour' | 'nonlus' | 'chat';

export function DiscussTab() {
  const [filter, setFilter] = useState<DiscussFilter>('tout');
  const [bookmarks] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
  const [myAnswer, setMyAnswer] = useState('');
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  const filtered = ACTIVITY_ITEMS.filter(item => {
    if (filter === 'tour') return !item.answered;
    if (filter === 'nonlus') return !item.answered && !item.partnerAnswered;
    if (filter === 'chat') return item.type === 'quiz';
    return true;
  });

  const filters: { id: DiscussFilter; label: string }[] = [
    { id: 'tout', label: 'Tout' },
    { id: 'tour', label: 'À ton tour' },
    { id: 'nonlus', label: 'Non lu(s)' },
    { id: 'chat', label: 'Chat' },
  ];

  if (selectedItem) {
    const isAnswered = answered.has(selectedItem.id) || selectedItem.answered;
    return (
      <div className="flex flex-col min-h-screen bg-white pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSelectedItem(null)} className="p-2 -ml-2">
            <X size={24} className="text-gray-600" />
          </button>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            selectedItem.type === 'quiz' ? 'border-violet-300 text-violet-700' : 'border-rose-300 text-rose-700'
          }`}>
            {selectedItem.type === 'quiz' ? 'Quiz' : 'Question'}
          </span>
        </div>

        <div className="flex-1 px-5 py-6">
          <div
            className="rounded-3xl p-6 mb-6 flex items-center justify-center"
            style={{ backgroundColor: selectedItem.color, minHeight: 160 }}
          >
            <span className="text-7xl">{selectedItem.emoji}</span>
          </div>

          <p className="text-xl font-bold text-gray-900 mb-2 leading-snug">{selectedItem.title}</p>
          <p className="text-sm text-gray-500 mb-6">{selectedItem.date}</p>

          {selectedItem.partnerAnswered && (
            <div className="bg-violet-50 rounded-2xl p-4 mb-4 border border-violet-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-sm">💕</div>
                <span className="text-xs font-semibold text-violet-700">Ton partenaire a répondu</span>
              </div>
              <p className="text-sm text-gray-700 italic">
                "J'espère que tu seras surpris(e) par ma réponse..."
              </p>
            </div>
          )}

          {!isAnswered ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ta réponse</label>
              <textarea
                value={myAnswer}
                onChange={e => setMyAnswer(e.target.value)}
                placeholder="Écris ta réponse ici..."
                rows={4}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none resize-none text-sm"
              />
              <button
                onClick={() => {
                  if (myAnswer.trim()) {
                    setAnswered(prev => new Set([...prev, selectedItem.id]));
                    setMyAnswer('');
                  }
                }}
                disabled={!myAnswer.trim()}
                className="mt-3 w-full py-4 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-40 active:scale-98 transition-all"
              >
                Envoyer ma réponse
              </button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
              <p className="text-green-700 font-semibold">Tu as déjà répondu ✓</p>
              <p className="text-sm text-gray-500 mt-1">Votre partenaire verra ta réponse</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900">Discuter</h1>
          <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-2">
            <Bookmark size={16} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">{bookmarks}</span>
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-transparent text-gray-600 border border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="w-full flex items-start gap-3 px-5 py-4 border-b border-gray-50 active:bg-gray-50 text-left"
          >
            {/* Thumbnail */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-4xl"
              style={{ backgroundColor: item.color }}
            >
              {item.emoji}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${
                  item.type === 'quiz'
                    ? 'border-violet-300 text-violet-700 bg-violet-50'
                    : 'border-rose-300 text-rose-700 bg-rose-50'
                }`}>
                  {item.type === 'quiz' ? 'Quiz' : 'Question'}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">{item.date}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 truncate mb-2">{item.subtitle}</p>

              {/* Avatars */}
              <div className="flex items-center justify-end gap-1">
                {item.answered && (
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-xs">
                      🙋
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border border-white flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </div>
                  </div>
                )}
                {item.partnerAnswered && (
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-rose-200 flex items-center justify-center text-xs">
                      💕
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border border-white flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TIMELINE TAB ──────────────────────────────────────────────────────────────

type Memory = {
  id: string;
  title: string;
  date: string;
  content: string | null;
  photo_url: string | null;
  type: string;
};

export function TimelineTab() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showBanner, setShowBanner] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<'text' | 'photo'>('text');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPhoto, setNewPhoto] = useState('');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .order('date', { ascending: false });
    if (data) setMemories(data as Memory[]);
  };

  const handleAdd = async () => {
    if (!newTitle || !newDate) return;
    await supabase.from('memories').insert({
      title: newTitle,
      date: newDate,
      content: newContent || null,
      photo_url: newPhoto || null,
      type: addType,
      couple_id: localStorage.getItem('paired_couple_id'),
    });
    setNewTitle('');
    setNewContent('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewPhoto('');
    setShowAdd(false);
    loadMemories();
  };

  // Group memories by year
  const byYear: Record<string, Memory[]> = {};
  memories.forEach(m => {
    const year = new Date(m.date).getFullYear().toString();
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(m);
  });

  const PINK_COLORS = ['#FFDDE8', '#FFE8D5', '#D5F0FF', '#E8FFD5', '#F5D5FF'];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-3xl font-black text-gray-900">Timeline</h1>
      </div>

      {/* Suggestion banner */}
      {showBanner && (
        <div className="mx-5 mb-5 bg-violet-50 rounded-2xl border border-violet-100 p-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-2xl">
            🌍
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-snug">
              L'endroit que tu préfères visiter avec ton partenaire
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="text-violet-600 font-semibold text-sm mt-1"
            >
              Créer un souvenir
            </button>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-gray-400 p-1">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Years + grid */}
      {Object.keys(byYear).sort((a, b) => Number(b) - Number(a)).map(year => (
        <div key={year} className="px-5 mb-4">
          <p className="text-lg font-bold text-gray-400 mb-3">{year}</p>
          <div className="grid grid-cols-2 gap-2">
            {byYear[year].map((memory, i) => {
              const date = new Date(memory.date);
              const day = date.getDate();
              const month = date.toLocaleDateString('fr-FR', { month: 'short' });
              const bgColor = PINK_COLORS[i % PINK_COLORS.length];

              if (memory.photo_url) {
                return (
                  <div
                    key={memory.id}
                    className="relative rounded-2xl overflow-hidden aspect-square"
                  >
                    <img
                      src={memory.photo_url}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      <div className="bg-white rounded-md px-1.5 py-0.5 flex flex-col items-center leading-none">
                        <span className="text-[10px] font-black text-gray-800">{day}</span>
                        <span className="text-[8px] text-gray-500">{month}</span>
                      </div>
                      <p className="text-white text-xs font-bold truncate max-w-[80px] leading-tight">
                        {memory.title}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={memory.id}
                  className="relative rounded-2xl aspect-square p-4 flex flex-col justify-between"
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="flex-1 flex items-start">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-lg mr-1 float-left">
                        💬
                      </div>
                      <div className="bg-white/80 rounded-xl rounded-tl-none px-3 py-2 max-w-[110px]">
                        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-3">
                          {memory.content || memory.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="bg-white rounded-md px-1.5 py-0.5 flex flex-col items-center leading-none">
                      <span className="text-[10px] font-black text-gray-800">{day}</span>
                      <span className="text-[8px] text-gray-500">{month}</span>
                    </div>
                    <p className="text-gray-600 text-[10px] font-semibold truncate">
                      {memory.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {memories.length === 0 && !showBanner && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-20">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-xl font-bold text-gray-800 mb-2">Votre histoire commence ici</p>
          <p className="text-sm text-gray-500">Ajoutez votre premier souvenir en cliquant sur +</p>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-5 flex justify-end pointer-events-none z-40">
        <button
          onClick={() => setShowAdd(true)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-violet-600 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus size={28} className="text-white" />
        </button>
      </div>

      {/* Add memory modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-md mx-auto">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Nouveau souvenir</h2>
              <button onClick={() => setShowAdd(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAddType('text')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                  addType === 'text' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <FileText size={16} />
                Texte
              </button>
              <button
                onClick={() => setAddType('photo')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                  addType === 'photo' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Camera size={16} />
                Photo
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Titre du souvenir"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none text-sm"
              />
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none text-sm"
              />
              {addType === 'text' ? (
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Décris ce souvenir..."
                  rows={3}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none text-sm resize-none"
                />
              ) : (
                <input
                  value={newPhoto}
                  onChange={e => setNewPhoto(e.target.value)}
                  placeholder="URL de la photo (https://...)"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none text-sm"
                />
              )}
              <button
                onClick={handleAdd}
                disabled={!newTitle || !newDate}
                className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-40"
              >
                Enregistrer le souvenir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
