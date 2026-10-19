'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Feed', href: '/', icon: '📜' },
  { label: 'Daily Topics', href: '/topics', icon: '✦' },
  { label: 'Post', href: '/post', icon: '✍️' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#D4AF37]/15">
      <div className="max-w-3xl mx-auto px-4">
        {/* Top row: brand & desktop navigation */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl select-none">🕯️</span>
            <h1 className="text-2xl font-serif font-bold text-[#D4AF37] tracking-wide group-hover:text-[#E8C84A] transition-colors">
              ConfessIT
            </h1>
          </Link>

          {/* Desktop tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-[#1A1512] rounded-full p-1 border border-white/5">
            {tabs.map((tab) => {
              const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#000000] font-semibold shadow-lg shadow-[#D4AF37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex sm:hidden items-center gap-2 pb-2.5 overflow-x-auto scrollbar-none -mx-1 px-1">
          {tabs.map((tab) => {
            const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#000000] font-semibold'
                    : 'bg-[#1A1512] text-gray-400 border border-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
