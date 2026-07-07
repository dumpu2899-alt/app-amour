import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  Heart, Settings, Calendar, BarChart3, User, Camera, Mail,
  ChevronRight, X, Check, Plus, Trash2, Sparkles, Clock,
  LogOut, AlertTriangle, Loader2
} from 'lucide-react';

type Profile = {
  id: string;
  name: string;
  photo_url: string | null;
  birthday: string | null;
  bio: string | null;
};

type CoupleEvent = {
  id: string;
  title: string;
  date: string;
  event_type: string;
  description: string | null;
  reminder: boolean;
};

type RelationshipSettings = {
  id: string;
  partner1_name: string;
  partner2_name: string;
  relationship_start_date: string | null;
  language: string;
  theme: string;
};

type AnalysisData = {
  date: string;
  questions_answered: number;
  quizzes_completed: number;
  games_played: number;
  connection_score: number;
};

type View = 'main' | 'profile1' | 'profile2' | 'events' | 'analysis' | 'settings';

type NousTabProps = {
  coupleId: string | null;
  onLogout: () => void;
  onAccountDeleted: () => void;
};

export function NousTab({ coupleId, onLogout, onAccountDeleted }: NousTabProps) {
  const [view, setView] = useState<View>('main');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<CoupleEvent[]>([]);
  const [settings, setSettings] = useState<RelationshipSettings | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData[]>([]);
  const [selectedAnalysisDate, setSelectedAnalysisDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [profilesRes, eventsRes, settingsRes, analysisRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: true }),
      supabase.from('couple_events').select('*').order('date', { ascending: true }),
      supabase.from('relationship_settings').select('*').maybeSingle(),
      supabase.from('couple_analysis').select('*').order('date', { ascending: false }).limit(30),
    ]);

    if (profilesRes.data) setProfiles(profilesRes.data as Profile[]);
    if (eventsRes.data) setEvents(eventsRes.data as CoupleEvent[]);
    if (settingsRes.data) setSettings(settingsRes.data as RelationshipSettings);
    if (analysisRes.data) setAnalysis(analysisRes.data as AnalysisData[]);
  };

  const daysTogether = settings?.relationship_start_date
    ? Math.floor((Date.now() - new Date(settings.relationship_start_date).getTime()) / 86400000)
    : null;

  if (view === 'profile1' || view === 'profile2') {
    const profileIndex = view === 'profile1' ? 0 : 1;
    return (
      <ProfileEdit
        profile={profiles[profileIndex]}
        onSave={async (updates) => {
          const base = profiles[profileIndex] ?? {};
          await supabase.from('profiles').upsert({ ...base, ...updates, couple_id: coupleId });
          loadData();
          setView('main');
        }}
        onBack={() => setView('main')}
      />
    );
  }

  if (view === 'events') {
    return (
      <EventsManager
        events={events}
        onAdd={async (event) => {
          await supabase.from('couple_events').insert({ ...event, couple_id: coupleId });
          loadData();
        }}
        onDelete={async (id) => {
          await supabase.from('couple_events').delete().eq('id', id);
          loadData();
        }}
        onBack={() => setView('main')}
      />
    );
  }

  if (view === 'analysis') {
    return (
      <CoupleAnalysis
        analysis={analysis}
        selectedDate={selectedAnalysisDate}
        onDateChange={setSelectedAnalysisDate}
        onBack={() => setView('main')}
      />
    );
  }

  if (view === 'settings') {
    return (
      <SettingsView
        settings={settings}
        onSave={async (updates) => {
          if (settings) {
            await supabase.from('relationship_settings').update(updates).eq('id', settings.id);
          } else {
            await supabase
              .from('relationship_settings')
              .insert({ ...updates, couple_id: coupleId });
          }
          loadData();
        }}
        onBack={() => setView('main')}
        onSignOut={async () => {
          onLogout();
        }}
        onDeleteAccount={async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error('Non authentifié');
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const json = await res.json();
          if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la suppression');
          onAccountDeleted();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-50 to-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nous</h1>
            <p className="text-sm text-gray-500">Votre espace en couple</p>
          </div>
          <button
            onClick={() => setView('settings')}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Couple Card */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="flex justify-center items-center gap-4 mb-4 relative z-10">
            <button
              onClick={() => setView('profile1')}
              className="group relative"
            >
              {profiles[0]?.photo_url ? (
                <img
                  src={profiles[0].photo_url}
                  alt={profiles[0].name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white/40 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl border-3 border-white/40">
                  {profiles[0]?.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={12} className="text-violet-600" />
              </div>
            </button>

            <div className="flex flex-col items-center">
              <Heart size={28} className="text-pink-300 fill-pink-300 animate-pulse" />
              <span className="text-xs text-white/70 mt-1">
                {daysTogether !== null ? `${daysTogether} jours` : ''}
              </span>
            </div>

            <button
              onClick={() => setView('profile2')}
              className="group relative"
            >
              {profiles[1]?.photo_url ? (
                <img
                  src={profiles[1].photo_url}
                  alt={profiles[1].name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white/40 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl border-3 border-white/40">
                  {profiles[1]?.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={12} className="text-violet-600" />
              </div>
            </button>
          </div>

          <div className="text-center relative z-10">
            <p className="font-bold text-lg">
              {settings?.partner1_name || profiles[0]?.name || 'Vous'} & {settings?.partner2_name || profiles[1]?.name || 'Votre amour'}
            </p>
            {settings?.relationship_start_date && (
              <p className="text-sm text-white/80 mt-1 flex items-center justify-center gap-1">
                <Heart size={12} className="fill-pink-300 text-pink-300" />
                Ensemble depuis le {new Date(settings.relationship_start_date).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setView('analysis')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <BarChart3 size={20} className="text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Analyse</span>
          </button>

          <button
            onClick={() => setView('events')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Calendar size={20} className="text-rose-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Evenements</span>
          </button>

          <button
            onClick={() => setView('settings')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <Settings size={20} className="text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Parametres</span>
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Prochains evenements</h2>
          <button
            onClick={() => setView('events')}
            className="text-sm text-violet-600 font-semibold"
          >
            Voir tout
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {events.slice(0, 3).length > 0 ? events.slice(0, 3).map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-rose-600">
                  {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                </span>
                <span className="text-lg font-black text-rose-700">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{event.title}</p>
                <p className="text-xs text-gray-500 capitalize">{event.event_type}</p>
              </div>
              {event.reminder && <Clock size={16} className="text-gray-400" />}
            </div>
          )) : (
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">Aucun evenement</p>
              <button
                onClick={() => setView('events')}
                className="text-sm text-violet-600 font-semibold mt-1"
              >
                Ajouter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connection Score */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Score de connexion</h2>
            <div className="flex items-center gap-1">
              <Sparkles size={16} className="text-amber-500" />
              <span className="font-black text-lg text-violet-600">
                {analysis[0]?.connection_score || 0}
              </span>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
              style={{ width: `${Math.min((analysis[0]?.connection_score || 0), 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Base sur vos activites ensemble cette semaine
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Statistiques</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Questions', value: analysis.reduce((a, d) => a + d.questions_answered, 0), emoji: '💬', color: 'bg-violet-100' },
            { label: 'Quiz', value: analysis.reduce((a, d) => a + d.quizzes_completed, 0), emoji: '🧠', color: 'bg-amber-100' },
            { label: 'Jeux', value: analysis.reduce((a, d) => a + d.games_played, 0), emoji: '🎮', color: 'bg-emerald-100' },
            { label: 'Jours actifs', value: analysis.length, emoji: '🔥', color: 'bg-rose-100' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-lg">{stat.emoji}</span>
              </div>
              <div className="text-xl font-black text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Profile Edit Component
function ProfileEdit({
  profile,
  onSave,
  onBack,
}: {
  profile: Profile | undefined;
  onSave: (updates: Partial<Profile>) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [birthday, setBirthday] = useState(profile?.birthday || '');
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <X size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Modifier le profil</h1>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        {/* Photo */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative group"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-violet-100 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center border-4 border-violet-50 shadow-lg">
                <User size={40} className="text-violet-400" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Camera size={16} className="text-white" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setPhotoUrl(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">Appuyez pour changer la photo</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre prenom"
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date de naissance</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio || ''}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Quelques mots sur vous..."
            rows={3}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 pb-6">
        <button
          onClick={() => onSave({ name, photo_url: photoUrl, birthday, bio })}
          className="w-full bg-violet-600 text-white font-semibold py-4 rounded-2xl shadow-lg active:scale-98 transition-transform flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// Events Manager Component
function EventsManager({
  events,
  onAdd,
  onDelete,
  onBack,
}: {
  events: CoupleEvent[];
  onAdd: (event: Omit<CoupleEvent, 'id'>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('anniversary');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState(false);

  const eventTypes = [
    { id: 'anniversary', label: 'Anniversaire de couple', emoji: '💕' },
    { id: 'birthday', label: 'Anniversaire', emoji: '🎂' },
    { id: 'first-date', label: 'Premier rendez-vous', emoji: '☕' },
    { id: 'trip', label: 'Voyage', emoji: '✈️' },
    { id: 'other', label: 'Autre', emoji: '🎉' },
  ];

  const handleAdd = () => {
    if (!title || !date) return;
    onAdd({ title, date, event_type: eventType, description, reminder });
    setTitle('');
    setDate('');
    setDescription('');
    setReminder(false);
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <X size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Evenements</h1>
      </div>

      {/* Add Form */}
      {showAdd ? (
        <div className="px-5 py-4 bg-white border-b border-gray-100">
          <div className="flex flex-col gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'evenement"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setEventType(type.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    eventType === type.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optionnel)"
              rows={2}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none resize-none"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reminder}
                onChange={(e) => setReminder(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-600">Rappel</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-semibold"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mx-5 mt-4 mb-2 py-3 rounded-xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Ajouter un evenement
        </button>
      )}

      {/* Events List */}
      <div className="px-5 pt-4 flex flex-col gap-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {eventTypes.find((t) => t.id === event.event_type)?.emoji || '🎉'}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">
                    {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="p-2 text-gray-400 hover:text-rose-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucun evenement enregistre</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Couple Analysis Component
function CoupleAnalysis({
  analysis,
  selectedDate,
  onDateChange,
  onBack,
}: {
  analysis: AnalysisData[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onBack: () => void;
}) {
  const selectedData = analysis.find((a) => a.date === selectedDate);
  const weekData = analysis.slice(0, 7);
  const avgScore = weekData.length > 0
    ? Math.round(weekData.reduce((a, d) => a + d.connection_score, 0) / weekData.length)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <X size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Analyse du couple</h1>
      </div>

      {/* Date Picker */}
      <div className="px-5 py-4 bg-white border-b border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Selectionner une date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none"
        />
      </div>

      {/* Overall Score */}
      <div className="px-5 py-4">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/70">Score de connexion moyen</p>
              <p className="text-3xl font-black">{avgScore}%</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles size={32} className="text-white" />
            </div>
          </div>
          <div className="flex gap-1">
            {weekData.map((d, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${d.connection_score}%` }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-2">7 derniers jours</p>
        </div>
      </div>

      {/* Selected Date Stats */}
      {selectedData && (
        <div className="px-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">
            {new Date(selectedDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mb-2">
                <span className="text-lg">💬</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{selectedData.questions_answered}</p>
              <p className="text-xs text-gray-500">Questions repondues</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <span className="text-lg">🧠</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{selectedData.quizzes_completed}</p>
              <p className="text-xs text-gray-500">Quiz termines</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <span className="text-lg">🎮</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{selectedData.games_played}</p>
              <p className="text-xs text-gray-500">Jeux joues</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-2">
                <span className="text-lg">❤️</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{selectedData.connection_score}%</p>
              <p className="text-xs text-gray-500">Score connexion</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="px-5">
        <h2 className="font-bold text-gray-900 mb-3">Historique</h2>
        <div className="flex flex-col gap-2">
          {analysis.slice(0, 14).map((data) => (
            <button
              key={data.date}
              onClick={() => onDateChange(data.date)}
              className={`bg-white rounded-xl p-3 border ${
                selectedDate === data.date
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-gray-100'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-medium text-gray-500">
                    {new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {data.questions_answered + data.quizzes_completed + data.games_played} activites
                  </p>
                  <p className="text-xs text-gray-500">{data.connection_score}% connexion</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings Component
function SettingsView({
  settings,
  onSave,
  onBack,
  onSignOut,
  onDeleteAccount,
}: {
  settings: RelationshipSettings | null;
  onSave: (updates: Partial<RelationshipSettings>) => void;
  onBack: () => void;
  onSignOut: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}) {
  const [partner1Name, setPartner1Name] = useState(settings?.partner1_name || '');
  const [partner2Name, setPartner2Name] = useState(settings?.partner2_name || '');
  const [startDate, setStartDate] = useState(settings?.relationship_start_date || '');
  const [language, setLanguage] = useState(settings?.language || 'fr');
  const [theme, setTheme] = useState(settings?.theme || 'violet');
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const languages = [
    { code: 'fr', label: 'Francais', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Espanol', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const themes = [
    { id: 'violet', label: 'Violet', color: '#7C3AED' },
    { id: 'rose', label: 'Rose', color: '#EC4899' },
    { id: 'bleu', label: 'Bleu', color: '#3B82F6' },
    { id: 'vert', label: 'Vert', color: '#10B981' },
  ];

  const handleSave = () => {
    onSave({ partner1_name: partner1Name, partner2_name: partner2Name, relationship_start_date: startDate, language, theme });
    onBack();
  };

  const handleInvite = () => {
    if (email) {
      alert(`Invitation envoyee a ${email}`);
      setShowInvite(false);
      setEmail('');
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await onSignOut();
    } finally {
      setBusy(false);
      setConfirmSignOut(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    setDeleteError(null);
    try {
      await onDeleteAccount();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2">
          <X size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Parametres</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Invite Friend */}
        <div className="px-5 py-4">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-bold">Inviter votre partenaire</p>
                <p className="text-sm text-white/70">Partagez l'app avec lui/elle</p>
              </div>
            </div>
            {showInvite ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="flex-1 bg-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm outline-none"
                />
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-white rounded-lg text-violet-600 font-semibold text-sm"
                >
                  Envoyer
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowInvite(true)}
                className="w-full py-2 bg-white/20 rounded-lg text-white font-semibold text-sm"
              >
                Envoyer une invitation
              </button>
            )}
          </div>
        </div>

        {/* Relationship Details */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 mb-4">Details de la relation</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Votre prenom</label>
              <input
                value={partner1Name}
                onChange={(e) => setPartner1Name(e.target.value)}
                placeholder="Comment vous appellez-vous ?"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Prenom de votre partenaire</label>
              <input
                value={partner2Name}
                onChange={(e) => setPartner2Name(e.target.value)}
                placeholder="Comment s'appelle-t-il/elle ?"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date de debut de relation</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-800 border border-gray-200 focus:border-violet-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 mb-4">Langue</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  language === lang.code
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 mb-4">Theme</h2>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
                  theme === t.id
                    ? 'ring-2 ring-offset-2'
                    : 'bg-gray-100 text-gray-600'
                }`}
                style={theme === t.id ? { backgroundColor: t.color, color: 'white', borderColor: t.color } : undefined}
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 mb-4">Details du compte</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">ID Appareil</span>
              <span className="text-sm text-gray-900 font-mono">DEMO-XXXX</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-5 py-4">
          <button
            onClick={handleSave}
            className="w-full bg-violet-600 text-white font-semibold py-4 rounded-2xl shadow-lg active:scale-98 transition-transform flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Enregistrer les modifications
          </button>
        </div>

        {/* Account Actions */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 mb-4">Session et compte</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setConfirmSignOut(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 active:scale-98 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <LogOut size={18} className="text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 text-sm">Se deconnecter</p>
                <p className="text-xs text-gray-500">Verrouille l'app et efface la session</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              onClick={() => { setConfirmDelete(true); setDeleteError(null); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-rose-50 border border-rose-200 active:scale-98 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 size={18} className="text-rose-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-rose-700 text-sm">Supprimer le compte</p>
                <p className="text-xs text-rose-500/80">Efface definitivement toutes vos donnees</p>
              </div>
              <ChevronRight size={18} className="text-rose-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {confirmSignOut && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <LogOut size={26} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Se deconnecter ?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Vous serez renvoye vers l'ecran de deverrouillage. Vos donnees restent intactes et seront accessibles apres avoir entre votre code.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmSignOut(false)}
                  disabled={busy}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={busy}
                  className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                  Deconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <AlertTriangle size={26} className="text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer le compte ?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Cette action est <span className="font-semibold text-rose-600">irreversible</span>. Toutes vos donnees (profils, evenements, souvenirs, reponses, statistiques) seront definitivement effacees.
              </p>
              {deleteError && (
                <div className="w-full mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
                  <p className="text-sm text-rose-700 font-medium">{deleteError}</p>
                </div>
              )}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setConfirmDelete(false); setDeleteError(null); }}
                  disabled={busy}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={busy}
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
