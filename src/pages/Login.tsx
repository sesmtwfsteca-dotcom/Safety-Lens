import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, LogIn, AlertCircle } from 'lucide-react';

export function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('admin@wfs.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Na vida real faria auth com Supabase
    const success = await login(email);
    if (!success) {
      setError('Credenciais inválidas. Use: admin@wfs.com');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-wfs-red/10 p-4 rounded-full mb-4">
            <ShieldCheck className="w-12 h-12 text-wfs-red" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">WFS TECA</h1>
          <p className="text-slate-500 font-medium text-center mt-2">Sistema de Inspeção de Segurança Comportamental</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-wfs-red focus:border-wfs-red outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
             <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-wfs-red focus:border-wfs-red outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-wfs-red hover:bg-wfs-red-dark text-white font-medium py-2.5 rounded-md flex justify-center items-center gap-2 transition-colors disabled:opacity-70"
          >
            {loading ? 'Entrando...' : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-500 text-center">
          <p className="mb-2 font-medium">Contas de teste:</p>
          <ul className="space-y-1">
            <li><span className="font-semibold text-slate-700">ADM:</span> admin@wfs.com</li>
            <li><span className="font-semibold text-slate-700">Técnico SST:</span> tecnico@wfs.com</li>
            <li><span className="font-semibold text-slate-700">Visitante:</span> gestor@wfs.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
