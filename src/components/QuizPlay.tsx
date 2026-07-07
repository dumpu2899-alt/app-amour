import { useState } from 'react';
import { ArrowLeft, Check, X, Trophy } from 'lucide-react';
import { QUIZZES } from '../data/content';

type Props = {
  quizId: string;
  onComplete: (score: number) => void;
  onBack: () => void;
};

export default function QuizPlay({ quizId, onComplete, onBack }: Props) {
  const quiz = QUIZZES.find(q => q.id === quizId) ?? QUIZZES[0];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const progress = ((currentIndex) / total) * 100;

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === question.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
      onComplete(score + (selectedOption === question.correctIndex ? 1 : 0));
    }
  };

  const getScoreMessage = () => {
    const finalScore = score + (selectedOption === question.correctIndex ? 1 : 0);
    const pct = finalScore / total;
    if (pct === 1) return { msg: 'Parfait ! Vous vous connaissez par cœur ! 🌟', color: 'text-green-600' };
    if (pct >= 0.7) return { msg: 'Excellent ! Vous êtes vraiment proches 💜', color: 'text-violet-600' };
    if (pct >= 0.5) return { msg: 'Pas mal ! Continuez à vous découvrir 😊', color: 'text-blue-600' };
    return { msg: 'Il reste encore à apprendre — c\'est ça l\'aventure ! 💪', color: 'text-amber-600' };
  };

  if (finished) {
    const finalScore = score + (selectedOption === question.correctIndex ? 1 : 0);
    const { msg, color } = getScoreMessage();
    return (
      <div className="flex flex-col min-h-screen pb-safe" style={{ backgroundColor: quiz.color }}>
        <div className="px-5 pt-12 pb-6 flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
            <ArrowLeft size={20} style={{ color: quiz.textColor }} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
          <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center mb-6 shadow-lg">
            <Trophy size={44} className="text-amber-500 fill-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: quiz.textColor }}>Quiz terminé !</h2>
          <p className="text-5xl font-black my-4" style={{ color: quiz.textColor }}>
            {finalScore}/{total}
          </p>
          <p className={`text-base font-semibold mb-8 ${color}`}>{msg}</p>
          <div className="w-full bg-white/60 rounded-2xl p-5 text-left">
            <p className="text-sm font-bold mb-3" style={{ color: quiz.textColor }}>Récap des réponses</p>
            {quiz.questions.map((q, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  i < currentIndex + 1 ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
                <p className="text-xs" style={{ color: quiz.textColor }}>
                  {q.question.length > 50 ? q.question.slice(0, 50) + '…' : q.question}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={onBack}
            className="w-full mt-6 bg-white text-violet-700 font-bold py-4 rounded-2xl active:scale-95 transition-transform shadow-sm"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-safe" style={{ backgroundColor: quiz.color }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
          <ArrowLeft size={20} style={{ color: quiz.textColor }} />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold opacity-60" style={{ color: quiz.textColor }}>
            {quiz.title}
          </p>
        </div>
        <span className="text-sm font-bold" style={{ color: quiz.textColor }}>
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="h-2 rounded-full bg-white/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Emoji */}
      <div className="text-5xl text-center mb-6 select-none">{quiz.emoji}</div>

      {/* Question */}
      <div className="px-5 flex-1 flex flex-col">
        <h2 className="text-xl font-bold leading-snug mb-6 text-center" style={{ color: quiz.textColor }}>
          {question.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3 flex-1">
          {question.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === question.correctIndex;
            let bg = 'bg-white/70';
            let border = 'border-transparent';
            let icon = null;

            if (showFeedback) {
              if (isCorrect) {
                bg = 'bg-green-500';
                border = 'border-green-500';
                icon = <Check size={18} className="text-white" strokeWidth={3} />;
              } else if (isSelected && !isCorrect) {
                bg = 'bg-red-400';
                border = 'border-red-400';
                icon = <X size={18} className="text-white" strokeWidth={3} />;
              } else {
                bg = 'bg-white/30';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full p-4 rounded-2xl border-2 ${border} ${bg} flex items-center justify-between transition-all duration-200 active:scale-[0.98]`}
              >
                <span
                  className="text-base font-semibold text-left"
                  style={{ color: showFeedback && (isCorrect || (isSelected && !isCorrect)) ? 'white' : quiz.textColor }}
                >
                  {option}
                </span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Feedback & Next */}
        {showFeedback && (
          <div className="mt-4 mb-6">
            {question.explanation && (
              <div className="bg-white/50 rounded-xl p-3 mb-3">
                <p className="text-xs font-medium" style={{ color: quiz.textColor }}>
                  {question.explanation}
                </p>
              </div>
            )}
            <button
              onClick={handleNext}
              className="w-full bg-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
              style={{ color: quiz.textColor }}
            >
              {currentIndex < total - 1 ? 'Question suivante →' : 'Voir les résultats 🎉'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
