import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ItemInspecao, Setor, Subsetor } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, ShieldAlert } from 'lucide-react';
import { getCriticidadeColor } from '../lib/utils';

export default function NovaInspecao() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [setores, setSetores] = useState<Setor[]>([]);
  const [subsetores, setSubsetores] = useState<Subsetor[]>([]);
  const [itens, setItens] = useState<ItemInspecao[]>([]);
  
  const [selectedSetor, setSelectedSetor] = useState<number | ''>('');
  const [selectedSubsetor, setSelectedSubsetor] = useState<number | ''>('');
  const [selectedFuncao, setSelectedFuncao] = useState<string>('AUXILIAR');
  
  const [respostas, setRespostas] = useState<Record<number, any>>({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    ApiService.getSetoresList().then(setSetores);
  }, []);

  useEffect(() => {
    if (selectedSetor) {
      ApiService.getSubsetoresList(Number(selectedSetor)).then(res => {
        setSubsetores(res);
        setSelectedSubsetor('');
        setItens([]);
      });
    } else {
      setSubsetores([]);
      setSelectedSubsetor('');
      setItens([]);
    }
  }, [selectedSetor]);

  useEffect(() => {
    if (selectedSubsetor && selectedFuncao) {
      setLoadingItems(true);
      ApiService.getItensForInspecao(Number(selectedSubsetor), selectedFuncao).then(res => {
        setItens(res);
        
        // Setup initial default values
        const initialMap: Record<number, any> = {};
        res.forEach(item => {
           initialMap[item.id] = {
             item_id: item.id,
             tipo_avaliacao: item.tipo_avaliacao,
             conforme: item.tipo_avaliacao === 'QUANTITATIVO' ? true : undefined,
             quantidade_nao_conforme: item.tipo_avaliacao === 'QUALITATIVO' ? 0 : undefined,
             observacao: ''
           };
        });
        setRespostas(initialMap);
        setLoadingItems(false);
      });
    }
  }, [selectedSubsetor, selectedFuncao]);

  const handleUpdateResposta = (itemId: number, field: string, value: any) => {
    setRespostas(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!user || !selectedSubsetor) return;
    
    // Verify all items are answered
    if (itens.length === 0) {
      alert("Nenhum item na inspeção.");
      return;
    }
    
    const arrayRespostas = Object.values(respostas);
    
    // Validar se dados qualitativos tem número se não estiver conforme
    // Por padrão aceitamos se for 0 como conforme, senão não-conforme
    
    setSaving(true);
    const date = new Date();
    await ApiService.salvarInspecao(
      user.id,
      Number(selectedSubsetor),
      date.getMonth() + 1,
      date.getFullYear(),
      arrayRespostas
    );
    
    alert("Inspeção salva com sucesso!");
    navigate('/inspecoes');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/inspecoes')}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nova Inspeção</h1>
          <p className="text-slate-500 text-sm">Preencha o checklist de segurança comportamental</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 border-b pb-2">1. Local da Inspeção</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
            <select 
              value={selectedSetor} 
              onChange={e => setSelectedSetor(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-wfs-red outline-none"
            >
              <option value="">Selecione o Setor</option>
              {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subsetor / Local</label>
            <select 
              value={selectedSubsetor} 
              onChange={e => setSelectedSubsetor(e.target.value ? Number(e.target.value) : '')}
              disabled={!selectedSetor}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-wfs-red outline-none disabled:bg-slate-100"
            >
              <option value="">Selecione o Local</option>
              {subsetores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Função Inspecionada</label>
            <select 
              value={selectedFuncao} 
              onChange={e => setSelectedFuncao(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-wfs-red outline-none"
            >
              <option value="AUXILIAR">Auxiliar</option>
              <option value="OPERADOR">Operador</option>
            </select>
          </div>
        </div>
      </div>

      {selectedSubsetor && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
             <h2 className="text-lg font-semibold text-slate-700">2. Itens de Avaliação</h2>
             <span className="text-sm font-medium bg-slate-200 px-2 py-1 rounded text-slate-600">
               {itens.length} itens encontrados
             </span>
          </div>

          {loadingItems ? (
            <div className="p-12 text-center text-slate-400">Carregando checklist...</div>
          ) : itens.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <ShieldAlert className="w-10 h-10 text-slate-300 mb-3" />
              Nenhum item de inspeção configurado para esta função neste local.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {itens.map((item, idx) => (
                <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-slate-400 font-bold text-sm w-6">{idx + 1}.</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${getCriticidadeColor(item.nivel_criticidade)}`}>
                          CRITICIDADE {item.nivel_criticidade}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium text-base ml-8">{item.descricao}</p>
                      
                      <div className="ml-8 mt-4">
                         <input 
                           type="text" 
                           placeholder="Observações adicionais (opcional)"
                           value={respostas[item.id]?.observacao || ''}
                           onChange={e => handleUpdateResposta(item.id, 'observacao', e.target.value)}
                           className="w-full text-sm p-2 border border-slate-200 rounded text-slate-600 focus:outline-none focus:border-wfs-red placeholder-slate-400"
                         />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto shrink-0 bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                      {item.tipo_avaliacao === 'QUANTITATIVO' ? (
                        <div className="flex items-center gap-2">
                           <label className={`flex-1 md:w-32 cursor-pointer flex items-center justify-center gap-2 border rounded-md py-2 px-3 transition-colors ${respostas[item.id]?.conforme === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                             <input 
                               type="radio" 
                               name={`item_${item.id}`} 
                               checked={respostas[item.id]?.conforme === true}
                               onChange={() => handleUpdateResposta(item.id, 'conforme', true)}
                               className="sr-only" 
                             />
                             Conforme
                           </label>
                           <label className={`flex-1 md:w-32 cursor-pointer flex items-center justify-center gap-2 border rounded-md py-2 px-3 transition-colors ${respostas[item.id]?.conforme === false ? 'bg-red-50 border-wfs-red text-wfs-red font-medium' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                             <input 
                               type="radio" 
                               name={`item_${item.id}`} 
                               checked={respostas[item.id]?.conforme === false}
                               onChange={() => handleUpdateResposta(item.id, 'conforme', false)}
                               className="sr-only" 
                             />
                             Desvio
                           </label>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-2">
                           <span className="text-sm font-medium text-slate-600">Qtd. Desvios:</span>
                           <input 
                             type="number"
                             min="0"
                             className="w-20 border border-slate-300 rounded p-1.5 text-center font-bold outline-none focus:border-wfs-red"
                             value={respostas[item.id]?.quantidade_nao_conforme || 0}
                             onChange={e => handleUpdateResposta(item.id, 'quantidade_nao_conforme', Number(e.target.value))}
                           />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {itens.length > 0 && (
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-end">
           <div className="max-w-7xl mx-auto w-full flex justify-end gap-4 px-4 sm:px-6 lg:px-8">
              <button 
                onClick={() => navigate('/inspecoes')}
                className="px-6 py-2.5 rounded border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded bg-wfs-red hover:bg-wfs-red-dark text-white font-medium flex items-center gap-2 transition-colors shadow-md disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar Inspeção'}
              </button>
           </div>
         </div>
      )}
    </div>
  );
}
