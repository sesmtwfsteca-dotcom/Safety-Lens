import { mockUsers, mockSetores, mockSubsetores, mockItens, mockInspecoes, mockRespostas, addInspecaoMock, addRespostasMock } from './mockData';
import { Inspecao, RespostaInspecao } from '../types';

// Simula a latência de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  async getSetoresList() {
    await delay(100);
    return mockSetores.filter(s => s.ativo);
  },
  
  async getSubsetoresList(setorId: number) {
    await delay(100);
    return mockSubsetores.filter(s => s.setor_id === setorId && s.ativo);
  },

  async getSetoresComProgresso(mes: number, ano: number) {
    await delay(300);
    return mockSetores.map(setor => {
      const subsetores = mockSubsetores.filter(s => s.setor_id === setor.id);
      
      const subsetoresComStatus = subsetores.map(sub => {
        const inspecao = mockInspecoes.find(i => i.subsetor_id === sub.id && i.mes === mes && i.ano === ano);
        const usuarioDesc = inspecao ? mockUsers.find(u => u.id === inspecao.usuario_id)?.nome : null;
        
        return {
          ...sub,
          inspecionado: !!inspecao,
          inspetorNome: usuarioDesc
        };
      });

      const total = subsetoresComStatus.length;
      const realizados = subsetoresComStatus.filter(s => s.inspecionado).length;
      const progresso = total > 0 ? Math.round((realizados / total) * 100) : 0;

      return {
        ...setor,
        progresso,
        subsetores: subsetoresComStatus
      };
    });
  },

  async getItensForInspecao(subsetorId: number, funcao: string) {
    await delay(200);
    return mockItens.filter(i => i.subsetor_id === subsetorId && i.funcao === funcao && i.ativo);
  },

  async salvarInspecao(usuarioId: string, subsetorId: number, mes: number, ano: number, respostas: any[]) {
    await delay(500);
    const inspecao = addInspecaoMock({
      usuario_id: usuarioId,
      subsetor_id: subsetorId,
      mes,
      ano
    });

    const formatRespostas = respostas.map(r => ({
      inspecao_id: inspecao.id,
      item_id: r.item_id,
      tipo_avaliacao: r.tipo_avaliacao,
      conforme: r.conforme,
      quantidade_nao_conforme: r.quantidade_nao_conforme,
      observacao: r.observacao
    }));

    addRespostasMock(formatRespostas);
    return inspecao;
  },

  async getDashboardData(mes?: number, ano?: number) {
    await delay(400);
    
    // Filtrar inspeções do período se fornecido, senão pegar todas (para KPI geral)
    let inspecoesFiltradas = mockInspecoes;
    if (mes && ano) {
      inspecoesFiltradas = mockInspecoes.filter(i => i.mes === mes && i.ano === ano);
    }
    
    const inspecaoIds = inspecoesFiltradas.map(i => i.id);
    const respostas = mockRespostas.filter(r => inspecaoIds.includes(r.inspecao_id));
    
    let totalAvaliacoes = 0;
    let totalDesvios = 0;
    let listDesvios: any[] = [];
    
    respostas.forEach(r => {
      totalAvaliacoes++;
      const item = mockItens.find(i => i.id === r.item_id);
      
      let isDesvio = false;
      let qtd = 1;
      
      if (r.tipo_avaliacao === 'QUANTITATIVO') {
        if (r.conforme === false) {
           isDesvio = true;
        }
      } else if (r.tipo_avaliacao === 'QUALITATIVO') {
        if (r.quantidade_nao_conforme && r.quantidade_nao_conforme > 0) {
           isDesvio = true;
           qtd = r.quantidade_nao_conforme;
        }
      }

      if (isDesvio && item) {
        totalDesvios += qtd;
        listDesvios.push({
          itemDescricao: item.descricao,
          quantidade: qtd,
          criticidade: item.nivel_criticidade,
          setorId: mockSubsetores.find(s => s.id === item.subsetor_id)?.setor_id
        });
      }
    });

    // Agrupar desvios para Pareto
    const agrupado: Record<string, any> = {};
    listDesvios.forEach(d => {
      if (!agrupado[d.itemDescricao]) {
        agrupado[d.itemDescricao] = {
           itemDescricao: d.itemDescricao,
           quantidade: 0,
           criticidade: d.criticidade,
        };
      }
      agrupado[d.itemDescricao].quantidade += d.quantidade;
    });

    const desviosArray = Object.values(agrupado);
    desviosArray.forEach((d: any) => {
      d.pontuacao = d.quantidade * (d.criticidade === 'ALTO' ? 3 : d.criticidade === 'MEDIO' ? 2 : 1);
    });

    desviosArray.sort((a, b) => b.pontuacao - a.pontuacao);

    let acum = 0;
    const totalPontuacao = desviosArray.reduce((acc, curr) => acc + curr.quantidade, 0); // Pareto costuma ser sob total de desvios

    desviosArray.forEach((d: any) => {
       acum += d.quantidade;
       d.percentualAcumulado = totalPontuacao > 0 ? Math.round((acum / totalPontuacao) * 100) : 0;
    });

    // Gráfico Conformidade Mensal
    const conformidadeMensal = [];
    for (let m = 1; m <= 12; m++) {
       const inspMes = mockInspecoes.filter(i => i.mes === m && i.ano === (ano || new Date().getFullYear()));
       const respMes = mockRespostas.filter(r => inspMes.map(i => i.id).includes(r.inspecao_id));
       let tAvaliacoes = 0;
       let tConformes = 0;
       respMes.forEach(rm => {
           tAvaliacoes++;
           if (rm.tipo_avaliacao === 'QUANTITATIVO') {
               if (rm.conforme) tConformes++;
           } else {
               if (!rm.quantidade_nao_conforme || rm.quantidade_nao_conforme === 0) tConformes++;
           }
       });
       conformidadeMensal.push({
          mes: m,
          nome: new Date(2000, m-1, 1).toLocaleString('pt-BR', { month: 'short' }),
          conformidade: tAvaliacoes > 0 ? Math.round((tConformes / tAvaliacoes) * 100) : 0,
       });
    }

    return {
      totalInspecoes: inspecoesFiltradas.length,
      totalDesvios,
      percConformidade: totalAvaliacoes > 0 ? Math.round(((totalAvaliacoes - totalDesvios) / totalAvaliacoes) * 100) : 100,
      paretoDesvios: desviosArray,
      conformidadeMensal
    };
  }
};
