import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Link, Navigate } from 'react-router-dom';
import { PlusCircle, Search, UserCircle2, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Inspecoes() {
  const { user } = useAuth();
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  if (user?.tipo_perfil === 'VISITANTE') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    carregarSetores();
  }, [mes, ano]);

  const carregarSetores = async () => {
    setLoading(true);
    const data = await ApiService.getSetoresComProgresso(mes, ano);
    setSetores(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Inspeções do Mês</h1>
           <p className="text-slate-500">Acompanhe o progresso do terminal</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={mes} 
            onChange={e => setMes(Number(e.target.value))}
            className="border-slate-300 rounded-md text-sm shadow-sm p-2 bg-white"
          >
            {[
              'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho',
              'Agosto','Setembro','Outubro','Novembro','Dezembro'
            ].map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <Link to="/inspecoes/nova" className="bg-wfs-red hover:bg-wfs-red-dark text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Nova Inspeção
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Atualizando grade...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {setores.map(setor => (
            <div key={setor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 uppercase tracking-tight truncate pr-2">{setor.nome}</h3>
                <span className="text-sm font-semibold bg-white border border-slate-200 px-2 py-1 rounded-full shrink-0">
                  {setor.progresso}%
                </span>
              </div>
              
              <div className="px-4 py-2 bg-slate-100/50">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${setor.progresso === 100 ? 'bg-emerald-500' : 'bg-wfs-red'}`} 
                    style={{ width: `${setor.progresso}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto max-h-80">
                <ul className="space-y-3">
                  {setor.subsetores.map((sub: any) => (
                    <li key={sub.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                         {sub.inspecionado ? 
                           <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : 
                           <Clock className="w-5 h-5 text-slate-300 shrink-0" />
                         }
                         <span className={sub.inspecionado ? 'font-medium text-slate-700' : 'text-slate-500'}>
                           {sub.nome}
                         </span>
                      </div>
                      
                      {sub.inspecionado && sub.inspetorNome && (
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-sm text-xs text-slate-600 font-medium" title={`Inspecionado por: ${sub.inspetorNome}`}>
                          <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[80px]">{sub.inspetorNome.split(' ')[0]}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
