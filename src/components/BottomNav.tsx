import { Home, Search, MessageCircle, Calendar, Heart, LucideIcon } from 'lucide-react';

type Tab = 'home' | 'discover' | 'discuss' | 'timeline' | 'nous';

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'discover', label: 'Découvrir', icon: Search },
  { id: 'discuss', label: 'Discuter', icon: MessageCircle },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'nous', label: 'Nous', icon: Heart },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-pb z-50 max-w-md mx-auto">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-violet-600' : 'text-gray-400'}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${active ? 'text-violet-600' : 'text-gray-400'}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
