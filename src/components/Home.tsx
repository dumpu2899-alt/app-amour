import { Flame, Plus, Crown, Check } from 'lucide-react';
import { DAILY_QUESTIONS, QUIZZES, GAMES } from '../data/content';

type Screen = 'home' | 'question' | 'quiz' | 'game' | 'games-list' | 'quiz-list' | 'questions-list';

type Props = {
  streak: number;
  isCompleted: (type: string, id: string) => boolean;
  questionIndex: number;
  onNavigate: (screen: Screen, id?: string) => void;
};

const todayQuiz = QUIZZES[0];
const todayGame = GAMES[0];

function ActivityCard({
  label,
  title,
  bgColor,
  textColor,
  illustration,
  locked,
  completed,
  onClick,
}: {
  label: string;
  title: string;
  bgColor: string;
  textColor: string;
  illustration: string;
  locked?: boolean;
  completed?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform duration-150 shadow-sm"
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {locked && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <Crown size={16} className="text-white fill-white" />
          </div>
        </div>
      )}
      <div className="p-5 flex items-end justify-between min-h-[120px]">
        <div className="flex-1 pr-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: textColor }}
          >
            {label}
          </span>
          <p className="text-lg font-bold leading-snug" style={{ color: textColor }}>
            {title}
          </p>
        </div>
        <div className="flex-shrink-0 text-5xl select-none">{illustration}</div>
      </div>
      {completed && (
        <div className="absolute inset-0 bg-black/5 rounded-2xl flex items-center justify-center">
          <div className="bg-white/80 rounded-full p-2">
            <Check size={20} className="text-green-500" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home({ streak, isCompleted, questionIndex, onNavigate }: Props) {
  const currentQuestion = DAILY_QUESTIONS[questionIndex % DAILY_QUESTIONS.length];
  const quizCompleted = isCompleted('quiz', todayQuiz.id);
  const questionCompleted = isCompleted('question', currentQuestion.id);
  const gameCompleted = isCompleted('game', todayGame.id);

  const activities = [
    { type: 'quiz', completed: quizCompleted },
    { type: 'question', completed: questionCompleted },
    { type: 'game', completed: gameCompleted },
  ];

  const firstIncompleteIndex = activities.findIndex(a => !a.completed);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Accueil</h1>
        <button className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 shadow-sm border border-gray-100">
          <Flame size={20} className="text-orange-500 fill-orange-500" />
          <span className="text-lg font-bold text-gray-800">{streak}</span>
        </button>
      </div>

      {/* Partner section */}
      <div className="px-5 py-3">
        <button
          className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => {}}
        >
          <span className="text-3xl">✈️</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shadow-md">
            <Plus size={14} className="text-white" strokeWidth={3} />
          </div>
        </button>
      </div>

      {/* Activités du Jour */}
      <div className="px-5 pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Activités du Jour</h2>

        <div className="flex gap-4">
          {/* Timeline dots & lines */}
          <div className="flex flex-col items-center pt-1 w-6 flex-shrink-0">
            {activities.map((activity, i) => {
              const isActive = i === firstIncompleteIndex;
              return (
                <div key={i} className="flex flex-col items-center">
                  {/* Dot */}
                  {activity.completed ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                        isActive ? 'border-gray-400 bg-white' : 'border-gray-200 bg-white'
                      }`}
                    />
                  )}
                  {/* Connector line (not after last) */}
                  {i < activities.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${
                        activity.completed ? 'bg-green-400' : 'border-l-2 border-dashed border-gray-200 bg-transparent w-px'
                      }`}
                      style={{ minHeight: '120px' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Cards */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Quiz card */}
            <ActivityCard
              label="Quiz"
              title={todayQuiz.title}
              bgColor="#F5D5A8"
              textColor="#7A4010"
              illustration="📅"
              completed={quizCompleted}
              onClick={() => onNavigate('quiz', todayQuiz.id)}
            />

            {/* Question card */}
            <ActivityCard
              label="Question"
              title={currentQuestion.question}
              bgColor="#D8CCFF"
              textColor="#3D1F80"
              illustration="💬"
              locked={!quizCompleted && !questionCompleted}
              completed={questionCompleted}
              onClick={() => onNavigate('question', currentQuestion.id)}
            />

            {/* Game card */}
            <ActivityCard
              label="Jeu"
              title={todayGame.title}
              bgColor="#E0DCBA"
              textColor="#4A4010"
              illustration="🎮"
              locked={!questionCompleted && !gameCompleted}
              completed={gameCompleted}
              onClick={() => onNavigate('game', todayGame.id)}
            />
          </div>
        </div>
      </div>

      {/* Quick access section */}
      <div className="px-5 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Explorer plus</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('quiz-list')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-100 active:scale-95 transition-transform"
          >
            <span className="text-2xl">🧠</span>
            <span className="text-xs font-semibold text-amber-800 text-center">Tous les quiz</span>
          </button>
          <button
            onClick={() => onNavigate('questions-list')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-violet-50 border border-violet-100 active:scale-95 transition-transform"
          >
            <span className="text-2xl">💬</span>
            <span className="text-xs font-semibold text-violet-800 text-center">Questions</span>
          </button>
          <button
            onClick={() => onNavigate('games-list')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-50 border border-green-100 active:scale-95 transition-transform"
          >
            <span className="text-2xl">🎮</span>
            <span className="text-xs font-semibold text-green-800 text-center">Tous les jeux</span>
          </button>
        </div>
      </div>

      {/* Daily tip */}
      <div className="px-5 pt-6">
        <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Conseil du jour</p>
          <p className="text-sm font-medium leading-relaxed">
            Prenez 10 minutes ce soir pour vous regarder dans les yeux et vous dire 3 choses que vous appréciez chez l'autre. 💜
          </p>
        </div>
      </div>
    </div>
  );
}
