import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { DAILY_QUESTIONS } from '../data/content';

type Props = {
  questionId: string;
  isCompleted: boolean;
  onComplete: (answer: string) => void;
  onBack: () => void;
};

export default function QuestionView({ questionId, isCompleted, onComplete, onBack }: Props) {
  const question = DAILY_QUESTIONS.find(q => q.id === questionId) ?? DAILY_QUESTIONS[0];
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(isCompleted);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onComplete(answer.trim());
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#D8CCFF] pb-safe">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
          <ArrowLeft size={20} className="text-violet-900" />
        </button>
        <span className="text-sm font-semibold text-violet-900 bg-white/40 px-3 py-1 rounded-full">
          Question du jour
        </span>
      </div>

      {/* Category badge */}
      <div className="px-5 mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-700 opacity-70">
          {question.category}
        </span>
      </div>

      {/* Question */}
      <div className="px-5 flex-1">
        <h1 className="text-2xl font-bold text-violet-900 leading-tight mb-4">
          {question.question}
        </h1>

        {question.hint && (
          <p className="text-sm text-violet-700 opacity-70 mb-6 italic">{question.hint}</p>
        )}

        <div className="text-6xl text-center my-8 select-none">💬</div>

        {submitted ? (
          <div className="bg-white/70 rounded-2xl p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} className="text-green-500 fill-green-500" />
              <span className="text-sm font-semibold text-violet-900">Ta réponse</span>
            </div>
            <p className="text-violet-900 font-medium">{answer || 'Réponse enregistrée'}</p>
            <div className="mt-4 pt-4 border-t border-violet-200">
              <p className="text-xs text-violet-700 font-medium">
                Maintenant, posez la même question à votre partenaire et comparez vos réponses ! 💜
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Écris ta réponse ici..."
              className="w-full bg-white/70 rounded-2xl p-4 text-violet-900 placeholder-violet-400 resize-none outline-none border-2 border-transparent focus:border-violet-400 transition-colors text-base font-medium"
              rows={5}
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="w-full mt-3 bg-violet-700 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-40 active:scale-95 transition-all"
            >
              <Send size={18} />
              Partager ma réponse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
