import { useState, useEffect } from 'react';
import GateScreen from './components/GateScreen';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import PairingPage from './components/PairingPage';
import UnlockScreen from './components/UnlockScreen';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import GamePlay from './components/GamePlay';
import GamesList from './components/GamesList';
import QuizPlay from './components/QuizPlay';
import QuizList from './components/QuizList';
import QuestionView from './components/QuestionView';
import QuestionsList from './components/QuestionsList';
import DiscoverTab from './components/DiscoverTab';
import { DiscussTab, TimelineTab } from './components/SimpleScreens';
import { NousTab } from './components/NousTab';
import { useProgress } from './hooks/useProgress';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  joinPartnerCouple,
  signOutUser,
  type AuthUser,
} from './lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

type AppFlowState =
  | 'gate'
  | 'loading'
  | 'landing'
  | 'register'
  | 'login'
  | 'pairing'
  | 'locked'
  | 'app';

type Tab = 'home' | 'discover' | 'discuss' | 'timeline' | 'nous';

type Screen =
  | { type: 'home' }
  | { type: 'quiz'; id: string }
  | { type: 'question'; id: string }
  | { type: 'game'; id: string }
  | { type: 'games-list' }
  | { type: 'quiz-list' }
  | { type: 'questions-list' };

const UNLOCK_KEY = 'paired_unlocked_session';

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const gateAlreadyPassed = sessionStorage.getItem('alow_gate_ok') === '1';
  const [flowState, setFlowState] = useState<AppFlowState>(gateAlreadyPassed ? 'loading' : 'gate');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>({ type: 'home' });

  const { appState, loading: progressLoading, isCompleted, markCompleted, advanceQuestion } =
    useProgress(authUser?.coupleId ?? null);

  // On mount (after gate): check existing session
  useEffect(() => {
    if (flowState !== 'loading') return;
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        setFlowState('landing');
        return;
      }
      setAuthUser(user);
      if (!user.coupleId) {
        setFlowState('pairing');
        return;
      }
      const unlocked = sessionStorage.getItem(UNLOCK_KEY) === '1';
      setFlowState(unlocked ? 'app' : 'locked');
    })();
  }, [flowState]);

  // ── Auth handlers ──────────────────────────────────────────────────────────

  const handleRegister = async (name: string, email: string, password: string) => {
    const user = await registerUser(name, email, password);
    setAuthUser(user);
    return { userId: user.id, name: user.name, userCode: user.userCode, coupleId: user.coupleId };
  };

  const handleLogin = async (email: string, password: string) => {
    const user = await loginUser(email, password);
    setAuthUser(user);
    return { userId: user.id, name: user.name, userCode: user.userCode, coupleId: user.coupleId };
  };

  const handleAuthSuccess = (
    _userId: string,
    _name: string,
    _userCode: string,
    coupleId: string | null
  ) => {
    if (!coupleId) {
      setFlowState('pairing');
    } else {
      setFlowState('locked');
    }
  };

  const handleJoinCouple = async (partnerCode: string) => {
    if (!authUser) return;
    const { coupleId } = await joinPartnerCouple(authUser.id, partnerCode);
    setAuthUser((prev) => prev ? { ...prev, coupleId } : prev);
    setFlowState('locked');
  };

  const handleSkipPairing = () => {
    setFlowState('locked');
  };

  const handleUnlock = () => {
    sessionStorage.setItem(UNLOCK_KEY, '1');
    setFlowState('app');
  };

  const handleLogout = async () => {
    sessionStorage.removeItem(UNLOCK_KEY);
    await signOutUser();
    setAuthUser(null);
    setFlowState('landing');
  };

  const handleAccountDeleted = () => {
    sessionStorage.removeItem(UNLOCK_KEY);
    setAuthUser(null);
    setFlowState('landing');
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const navigateHome = () => setScreen({ type: 'home' });

  const handleNavigate = (screenType: string, id?: string) => {
    switch (screenType) {
      case 'quiz': setScreen({ type: 'quiz', id: id! }); break;
      case 'question': setScreen({ type: 'question', id: id! }); break;
      case 'game': setScreen({ type: 'game', id: id! }); break;
      case 'games-list': setScreen({ type: 'games-list' }); break;
      case 'quiz-list': setScreen({ type: 'quiz-list' }); break;
      case 'questions-list': setScreen({ type: 'questions-list' }); break;
      default: setScreen({ type: 'home' });
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setScreen({ type: 'home' });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (flowState === 'gate') {
    return (
      <div className="max-w-md mx-auto">
        <GateScreen onPass={() => setFlowState('loading')} />
      </div>
    );
  }

  if (flowState === 'loading') {
    return (
      <div className="min-h-screen bg-[#f7f1e8] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#2d1142]/20 border-t-[#2d1142] animate-spin" />
      </div>
    );
  }

  if (flowState === 'landing') {
    return (
      <LandingPage
        onRegister={() => setFlowState('register')}
        onLogin={() => setFlowState('login')}
      />
    );
  }

  if (flowState === 'register') {
    return (
      <AuthPage
        initialMode="register"
        onSuccess={handleAuthSuccess}
        onBack={() => setFlowState('landing')}
        register={handleRegister}
        login={handleLogin}
      />
    );
  }

  if (flowState === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onSuccess={handleAuthSuccess}
        onBack={() => setFlowState('landing')}
        register={handleRegister}
        login={handleLogin}
      />
    );
  }

  if (flowState === 'pairing' && authUser) {
    return (
      <PairingPage
        userName={authUser.name}
        userCode={authUser.userCode}
        onJoin={handleJoinCouple}
        onSkip={handleSkipPairing}
      />
    );
  }

  if (flowState === 'locked' && authUser) {
    return (
      <div className="max-w-md mx-auto">
        <UnlockScreen
          userName={authUser.name}
          userCode={authUser.userCode}
          onUnlock={handleUnlock}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // ── Main app ───────────────────────────────────────────────────────────────

  if (progressLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#2d1142]/20 border-t-[#2d1142] animate-spin" />
      </div>
    );
  }

  const currentQuestionIndex = appState?.current_question_index ?? 0;

  const renderContent = () => {
    if (screen.type === 'quiz' && screen.id) {
      return (
        <QuizPlay
          quizId={screen.id}
          onComplete={async (score) => {
            await markCompleted('quiz', screen.id, String(score));
            navigateHome();
          }}
          onBack={navigateHome}
        />
      );
    }

    if (screen.type === 'question' && screen.id) {
      return (
        <QuestionView
          questionId={screen.id}
          isCompleted={isCompleted('question', screen.id)}
          onComplete={async (answer) => {
            await markCompleted('question', screen.id, answer);
            await advanceQuestion();
          }}
          onBack={navigateHome}
        />
      );
    }

    if (screen.type === 'game' && screen.id) {
      return (
        <GamePlay
          gameId={screen.id}
          onComplete={async () => {
            await markCompleted('game', screen.id);
          }}
          onBack={navigateHome}
        />
      );
    }

    if (screen.type === 'games-list') {
      return (
        <GamesList
          onSelectGame={(id) => setScreen({ type: 'game', id })}
          onBack={navigateHome}
          isCompleted={isCompleted}
        />
      );
    }

    if (screen.type === 'quiz-list') {
      return (
        <QuizList
          onSelectQuiz={(id) => setScreen({ type: 'quiz', id })}
          onBack={navigateHome}
          isCompleted={isCompleted}
        />
      );
    }

    if (screen.type === 'questions-list') {
      return (
        <QuestionsList
          onSelectQuestion={(id) => setScreen({ type: 'question', id })}
          onBack={navigateHome}
          isCompleted={isCompleted}
          currentIndex={currentQuestionIndex}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home
            streak={appState?.streak_count ?? 0}
            isCompleted={isCompleted}
            questionIndex={currentQuestionIndex}
            onNavigate={handleNavigate}
          />
        );
      case 'discover':
        return (
          <DiscoverTab
            onSelectQuiz={(id) => setScreen({ type: 'quiz', id })}
            onSelectGame={(id) => setScreen({ type: 'game', id })}
          />
        );
      case 'discuss':
        return <DiscussTab />;
      case 'timeline':
        return <TimelineTab />;
      case 'nous':
        return (
          <NousTab
            coupleId={authUser?.coupleId ?? null}
            onLogout={handleLogout}
            onAccountDeleted={handleAccountDeleted}
          />
        );
    }
  };

  const showNav = screen.type === 'home';

  return (
    <div className="max-w-md mx-auto relative min-h-screen overflow-hidden bg-white shadow-xl">
      <div className="min-h-screen">{renderContent()}</div>
      {showNav && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  );
}
