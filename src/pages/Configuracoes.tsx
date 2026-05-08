import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

export default function Configuracoes() {
  const { user } = useAuth();
  
  if (user?.tipo_perfil !== 'ADM') {
    return <Navigate to="/" replace />;
  }

  const sections = [
    { title: 'Gestão de Usuários', description: 'Adicione, edite ou remova acessos ao sistema.', icon: Users },
    { title: 'Itens de Inspeção', description: 'Configure o checklist, defina o tipo de avaliação e criticidade.', icon: SettingsIcon },
    { title: 'Setores e Subsetores', description: 'Gerencie os locais e a estrutura operacional do terminal.', icon: LayoutGrid },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h1>
        <p className="text-slate-500">Área exclusiva para administradores da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-wfs-red transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-wfs-red/10 group-hover:text-wfs-red transition-colors">
                <sec.icon className="w-6 h-6 text-slate-600 group-hover:text-wfs-red transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-wfs-red">{sec.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{sec.description}</p>
                <div className="mt-4 text-wfs-red text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Acessar módulo &rarr;
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
