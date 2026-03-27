'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Layers, CircleDollarSign, LogOut, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Plans', href: '/admin/plans', icon: Layers },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Expenses', href: '/admin/expenses', icon: CircleDollarSign },
    { name: 'Inventory', href: '/admin/inventory', icon: ShoppingBag },
    { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#0B1120] text-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] shadow-xl shadow-black/20 border-r border-slate-800/50 hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Layers className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
              GymFlow Admin
            </h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                )}
                <item.icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="font-medium tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1120]/30 backdrop-blur-sm">
          <Link href="/" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group border border-transparent hover:border-rose-500/20">
            <LogOut className="h-4 w-4 mr-3 group-hover:text-rose-400 transition-colors" />
            Exit System
          </Link>
        </div>
      </aside>

      {/* Main content backdrop + Container */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900/0 to-slate-900/0 pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 py-8 mt-4 sm:px-6 md:px-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
