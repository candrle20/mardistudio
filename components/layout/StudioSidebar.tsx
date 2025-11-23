'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Palette, Shapes, PenTool, Settings, Home } from 'lucide-react';
import { useTabStore } from '@/stores/tab-store';

export function StudioSidebar() {
  const pathname = usePathname();
  const { activeTabId } = useTabStore();

  // Determine if we are in a project workspace
  const isWorkspace = pathname?.includes('/studio/') && !pathname?.includes('/inspiration') && !pathname?.includes('/elements');
  const projectId = activeTabId || 'new';

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: PenTool,
      label: 'Editor',
      href: `/studio/${projectId}`,
      active: isWorkspace,
    },
    {
      icon: Palette,
      label: 'Inspiration',
      href: '/studio/inspiration',
      active: pathname === '/studio/inspiration',
    },
    {
      icon: Shapes,
      label: 'Elements',
      href: '/studio/elements',
      active: pathname === '/studio/elements',
    },
  ];

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-4 border-r border-gray-800 z-50">
      {/* Logo / Brand */}
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-primary/20">
        M
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 w-full px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex flex-col items-center justify-center w-full aspect-square rounded-lg transition-all duration-200 ${
              item.active
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title={item.label}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'stroke-2' : 'stroke-[1.5]'}`} />
            <span className="text-[10px] mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute translate-y-8 bg-gray-800 px-2 py-1 rounded text-white pointer-events-none z-50 whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-2 w-full px-2">
        <button
          className="flex items-center justify-center w-full aspect-square rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
}

