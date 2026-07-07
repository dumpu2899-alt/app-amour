import { ArrowLeft } from 'lucide-react';
import { DAILY_QUESTIONS, DailyQuestion } from '../data/content';

type Props = {
  onSelectQuestion: (questionId: string) => void;
  onBack: () => void;
  isCompleted: (type: string, id: string) => boolean;
  currentIndex: number;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Amour': { bg: '#FFD6E0', text: '#8B1A3A' },
  'Vie': { bg: '#D1E8FF', text: '#0D3A6E' },
  'Futur': { bg: '#D4F5E9', text: '#0B5E3A' },
  'Rêves': { bg: '#FFF3D4', text: '#7A4E00' },
  'Sagesse': { bg: '#E8E0FF', text: '#3D1F80' },
  'Introspection': { bg: '#FFE0CC', text: '#7A3000' },
  'Bien-être': { bg: '#D4F0FF', text: '#0A4A6E' },
};

function defaultColor(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: '#F0F0F0', text: '#333333' };
}

function QuestionItem({
  question,
  index,
  currentIndex,
  completed,
  onClick,
}: {
  question: DailyQuestion;
  index: number;
  currentIndex: number;
  completed: boolean;
  onClick: () => void;
}) {
  const locked = index > currentIndex && !completed;
  const { bg, text } = defaultColor(question.category);

  return (
    <button
      onClick={locked ? undefined : onClick}
      className={`w-full text-left rounded-2xl p-4 flex items-start gap-3 active:scale-[0.98] transition-transform ${locked ? 'opacity-50 cursor-default' : ''}`}
      style={{ backgroundColor: bg }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
        style={{ backgroundColor: completed ? '#4CAF50' : 'rgba(255,255,255,0.6)', color: completed ? 'white' : text }}
      >
        {completed ? '✓' : index + 1}
      </div>
      <div className="flex-1">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block"
          style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: text }}
        >
          {question.category}
        </span>
        <p className="text-sm font-semibold leading-snug" style={{ color: text }}>
          {question.question}
        </p>
      </div>
      {locked && <span className="text-sm">🔒</span>}
    </button>
  );
}

export default function QuestionsList({ onSelectQuestion, onBack, isCompleted, currentIndex }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-sm text-gray-500">Répondez au fil des jours</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-4">
        <div className="bg-violet-50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-violet-800">Progression</span>
            <span className="text-sm font-bold text-violet-800">{currentIndex}/{DAILY_QUESTIONS.length}</span>
          </div>
          <div className="h-2 bg-violet-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all"
              style={{ width: `${(currentIndex / DAILY_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="px-5 flex flex-col gap-2">
        {DAILY_QUESTIONS.map((q, i) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={i}
            currentIndex={currentIndex}
            completed={isCompleted('question', q.id)}
            onClick={() => onSelectQuestion(q.id)}
          />
        ))}
      </div>
    </div>
  );
}
