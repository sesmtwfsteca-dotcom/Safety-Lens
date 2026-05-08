import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LayoutDashboard, Settings, LogOut, UserCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Layout() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/inspecoes', label: 'Inspeções', icon: ShieldCheck, hide: user.tipo_perfil === 'VISITANTE' },
    { to: '/configuracoes', label: 'Configurações', icon: Settings, hide: user.tipo_perfil !== 'ADM' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-wfs-red text-white shadow-md z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight">WFS Segurança</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.hide) return null;
                const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                      isActive ? "bg-wfs-red-dark text-white" : "text-white/90 hover:bg-white/10"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <UserCircle2 className="w-6 h-6 text-white/80" />
                <div className="flex flex-col">
                  <span className="font-medium leading-none">{user.nome}</span>
                  <span className="text-xs text-white/70">{user.tipo_perfil}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-white/80 hover:bg-white/10 hover:text-white rounded-full transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile nav indicator */}
      <div className="md:hidden bg-white border-b flex overflow-x-auto p-2 gap-2">
         {navLinks.map((link) => {
            if (link.hide) return null;
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium whitespace-nowrap",
                  isActive ? "bg-slate-100 text-wfs-red" : "text-slate-600"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
