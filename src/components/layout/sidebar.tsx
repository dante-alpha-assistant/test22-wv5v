'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/deals', label: 'Deals', icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
          <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center font-bold text-sm">
            C
          </div>
          <span className="text-lg font-semibold tracking-wide">CRM</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
