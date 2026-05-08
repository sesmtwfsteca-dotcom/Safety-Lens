import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { getCriticidadeColor } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  ComposedChart, Line
} from 'recharts';
import { ShieldAlert, CheckCircle2, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    carregarDash();
  }, [mes, ano]);

  const carregarDash = async () => {
    setLoading(true);
    const res = await ApiService.getDashboardData(mes, ano);
    setData(res);
    setLoading(false);
  };

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (loading || !data) return <div className="flex justify-center p-12">Carregando métricas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard de Conformidade</h1>
        <div className="flex gap-2">
          <select 
            value={mes} 
            onChange={e => setMes(Number(e.target.value))}
            className="border-slate-300 rounded-md text-sm shadow-sm p-2 bg-white"
          >
            {meses.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select 
            value={ano} 
            onChange={e => setAno(Number(e.target.value))}
            className="border-slate-300 rounded-md text-sm shadow-sm p-2 bg-white"
          >
            {[2025, 2026].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Inspeções Realizadas</p>
          <p className="text-4xl font-bold text-slate-800 mt-1">{data.totalInspecoes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
          <ShieldAlert className="w-10 h-10 text-wfs-red mb-2" />
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Desvios Encontrados</p>
          <p className="text-4xl font-bold text-wfs-red mt-1">{data.totalDesvios}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
          <TrendingDown className="w-10 h-10 text-blue-500 mb-2" />
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Conformidade (%)</p>
          <p className="text-4xl font-bold text-slate-800 mt-1">{data.percConformidade}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Percentual de Conformidade (YTD)</h2>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.conformidadeMensal}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                 <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} axisLine={false} tickLine={false} />
                 <RechartsTooltip formatter={(val) => [`${val}%`, 'Conformidade']} cursor={{ fill: '#f1f5f9' }} />
                 <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Meta (95%)', fill: '#10b981', fontSize: 12 }} />
                 <Bar dataKey="conformidade" fill="#3498DB" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Pareto de Desvios ({meses[mes-1]})</h2>
           <div className="h-72">
           {data.paretoDesvios.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">Nenhum desvio no período.</div>
            ) : (
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={data.paretoDesvios}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="itemDescricao" hide={true} /> {/* Hidden cause descriptions are very long */}
                 <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                 <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(val) => `${val}%`} axisLine={false} tickLine={false} />
                 <RechartsTooltip contentStyle={{ fontSize: '12px', maxWidth: '300px', whiteSpace: 'normal' }} />
                 <Bar yAxisId="left" dataKey="quantidade" name="Desvios" fill="#E74C3C" radius={[4, 4, 0, 0]} />
                 <Line yAxisId="right" type="monotone" dataKey="percentualAcumulado" name="% Acumulado" stroke="#E74C3C" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
               </ComposedChart>
             </ResponsiveContainer>
            )}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <h2 className="text-lg font-semibold text-slate-800 mb-4">Detalhamento dos Desvios (Top Críticos)</h2>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-3 px-4 font-medium">Item de Auditoria</th>
                  <th className="py-3 px-4 font-medium">Criticidade</th>
                  <th className="py-3 px-4 font-medium text-center">Desvios</th>
                  <th className="py-3 px-4 font-medium text-center">Pontuação</th>
                  <th className="py-3 px-4 font-medium text-center">% Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {data.paretoDesvios.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Nenhum dado para exibir</td></tr>
                ) : data.paretoDesvios.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-slate-100 font-medium text-sm text-slate-700 hover:bg-slate-50">
                    <td className="py-3 px-4 truncate max-w-sm" title={item.itemDescricao}>{item.itemDescricao}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getCriticidadeColor(item.criticidade)}`}>
                        {item.criticidade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantidade}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{item.pontuacao}</td>
                    <td className="py-3 px-4 text-center">{item.percentualAcumulado}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
