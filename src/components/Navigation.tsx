import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, PiggyBank, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'calendar' | 'savings' | 'analytics';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
  { id: 'savings' as const, label: 'Savings', icon: PiggyBank },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:mb-0">
      <div className="bg-card/95 backdrop-blur-xl border-t md:border-t-0 md:border-b border-border shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around md:justify-start md:gap-2 py-3 md:py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'relative flex flex-col md:flex-row items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2.5 rounded-xl transition-colors',
                    isActive 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/15 rounded-xl border border-primary/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-xs md:text-sm font-medium relative z-10">
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
