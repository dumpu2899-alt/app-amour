import { ArrowLeft } from 'lucide-react';
import { QUIZZES, Quiz } from '../data/content';

type Props = {
  onSelectQuiz: (quizId: string) => void;
  onBack: () => void;
  isCompleted: (type: string, id: string) => boolean;
};

function QuizCard({ quiz, completed, onClick }: { quiz: Quiz; completed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden active:scale-[0.98] transition-transform duration-150"
      style={{ backgroundColor: quiz.color }}
    >
      <div className="p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0 text-2xl select-none">
          {quiz.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/50" style={{ color: quiz.textColor }}>
              Quiz • {quiz.questions.length} questions
            </span>
            {completed && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white">
                ✓ Fait
              </span>
            )}
          </div>
          <p className="font-bold text-base leading-tight" style={{ color: quiz.textColor }}>
            {quiz.title}
          </p>
          <p className="text-xs mt-0.5 opacity-70 leading-snug" style={{ color: quiz.textColor }}>
            {quiz.description}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold" style={{ color: quiz.textColor }}>→</span>
        </div>
      </div>
    </button>
  );
}

export default function QuizList({ onSelectQuiz, onBack, isCompleted }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tous les quiz</h1>
          <p className="text-sm text-gray-500">{QUIZZES.length} quiz pour mieux vous connaître</p>
        </div>
      </div>

      {/* Quizzes */}
      <div className="px-5 flex flex-col gap-3">
        {QUIZZES.map(quiz => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            completed={isCompleted('quiz', quiz.id)}
            onClick={() => onSelectQuiz(quiz.id)}
          />
        ))}
      </div>
    </div>
  );
}
