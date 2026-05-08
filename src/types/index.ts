export type Perfil = 'ADM' | 'VISITANTE';
export type Funcao = 'AUXILIAR' | 'OPERADOR';
export type TipoAvaliacao = 'QUANTITATIVO' | 'QUALITATIVO';
export type Criticidade = 'NORMAL' | 'MEDIO' | 'ALTO';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  tipo_perfil: Perfil;
  foto_perfil_url?: string;
  ativo: boolean;
}

export interface Setor {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface Subsetor {
  id: number;
  setor_id: number;
  nome: string;
  ativo: boolean;
  setor?: Setor;
}

export interface ItemInspecao {
  id: number;
  subsetor_id: number;
  descricao: string;
  funcao: Funcao;
  tipo_avaliacao: TipoAvaliacao;
  nivel_criticidade: Criticidade;
  ativo: boolean;
}

export interface Inspecao {
  id: number;
  subsetor_id: number;
  usuario_id: string;
  mes: number;
  ano: number;
  data_inspecao: string;
  usuario?: Usuario;
  subsetor?: Subsetor;
}

export interface RespostaInspecao {
  id: number;
  inspecao_id: number;
  item_id: number;
  tipo_avaliacao: TipoAvaliacao;
  conforme?: boolean;
  quantidade_nao_conforme?: number;
  observacao?: string;
  item?: ItemInspecao;
}

// Para a view do Dashboard e métricas
export interface MetricasDesvio {
  itemDescricao: string;
  quantidade: number;
  criticidade: Criticidade;
  pontuacao: number;
  conforme?: boolean; // Para analise complementar
}
