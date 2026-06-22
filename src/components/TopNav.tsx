import { useState } from 'react';
import type { ViewType } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface TopNavProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedPersonId: string;
  onPersonChange: (id: string) => void;
  people: { id: string; name: string; role: string }[];
}

const NAV_ITEMS: { view: ViewType; label: string; emoji: string; category: 'personal' | 'family' }[] = [
  { view: 'daily', label: 'Lịch ngày', emoji: '📅', category: 'personal' },
  { view: 'calendar', label: 'Lịch tuần', emoji: '📆', category: 'personal' },
  { view: 'numerology-personal', label: 'Thần số học', emoji: '🔮', category: 'personal' },
  { view: 'numerology-personal-roadmap', label: 'Lộ trình cá nhân', emoji: '🎯', category: 'personal' },
  { view: 'numerology-family', label: 'Gia đình', emoji: '👨‍👩‍👧‍👦', category: 'family' },
  { view: 'numerology-roadmap', label: 'Lộ trình gia đình', emoji: '📊', category: 'family' },
];

export function TopNav({ view, onViewChange, selectedPersonId, onPersonChange, people }: TopNavProps) {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleViewChange = (newView: ViewType) => {
    onViewChange(newView);
    setMobileMenuOpen(false);
  };

  const currentItem = NAV_ITEMS.find(item => item.view === view);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-energy-purple to-energy-orange bg-clip-text text-transparent">
              EnerCal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.view}
                onClick={() => handleViewChange(item.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  view === item.view
                    ? 'bg-energy-purple/10 text-energy-purple'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{item.emoji}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right side: User selector + Menu */}
          <div className="flex items-center gap-2">
            {/* Person selector (Admin only) */}
            {isAdmin && (
              <select
                value={selectedPersonId}
                onChange={(e) => onPersonChange(e.target.value)}
                className="hidden sm:block rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-slate-50 cursor-pointer outline-none"
              >
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                    {isAdmin && (
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Đang xem:</p>
                        <select
                          value={selectedPersonId}
                          onChange={(e) => {
                            onPersonChange(e.target.value);
                            setUserMenuOpen(false);
                          }}
                          className="w-full mt-1 rounded border border-slate-200 px-2 py-1 text-sm"
                        >
                          {people.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-slate-100">
            {/* Person selector for Admin on mobile */}
            {isAdmin && (
              <div className="px-2 py-2 mb-2 border-b border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Đang xem:</p>
                <select
                  value={selectedPersonId}
                  onChange={(e) => onPersonChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase">Cá nhân</p>
              {NAV_ITEMS.filter(i => i.category === 'personal').map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleViewChange(item.view)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    view === item.view
                      ? 'bg-energy-purple/10 text-energy-purple'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase mt-2">Gia đình</p>
              {NAV_ITEMS.filter(i => i.category === 'family').map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleViewChange(item.view)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    view === item.view
                      ? 'bg-energy-purple/10 text-energy-purple'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current view indicator on mobile */}
      <div className="md:hidden bg-slate-50 px-4 py-2 flex items-center gap-2 border-t border-slate-100">
        <span>{currentItem?.emoji}</span>
        <span className="text-sm font-medium text-slate-700">{currentItem?.label}</span>
      </div>
    </nav>
  );
}
