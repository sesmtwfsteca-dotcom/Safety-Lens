import { Usuario, Setor, Subsetor, ItemInspecao, Inspecao, RespostaInspecao } from '../types';

export const mockUsers: Usuario[] = [
  { id: 'u1', email: 'admin@wfs.com', nome: 'Administrador WFS', tipo_perfil: 'ADM', ativo: true },
  { id: 'u2', email: 'tecnico@wfs.com', nome: 'Max (Técnico SST)', tipo_perfil: 'ADM', ativo: true },
  { id: 'u3', email: 'gestor@wfs.com', nome: 'Gestor (Visitante)', tipo_perfil: 'VISITANTE', ativo: true },
];

export const mockSetores: Setor[] = [
  { id: 1, nome: 'INTERNAÇÃO', ativo: true },
  { id: 2, nome: 'CARGA NACIONAL/PALETIZADA', ativo: true },
  { id: 3, nome: 'IMPORTAÇÃO', ativo: true },
];

export const mockSubsetores: Subsetor[] = [
  { id: 1, setor_id: 1, nome: 'Doca', ativo: true },
  { id: 2, setor_id: 1, nome: 'Raio X da internação e Exportação', ativo: true },
  { id: 3, setor_id: 1, nome: 'Armazém', ativo: true },
  { id: 4, setor_id: 1, nome: 'Expedição', ativo: true },
  { id: 5, setor_id: 2, nome: 'Carga Nacional/Paletizada', ativo: true },
  { id: 6, setor_id: 3, nome: 'Ponto Zero', ativo: true },
  { id: 7, setor_id: 3, nome: 'Despaletização', ativo: true },
  { id: 8, setor_id: 3, nome: 'Atracação', ativo: true },
  { id: 9, setor_id: 3, nome: 'Armazenagem', ativo: true },
  { id: 10, setor_id: 3, nome: 'Sala de Bateria', ativo: true },
  { id: 11, setor_id: 3, nome: 'Portão 1 e 4', ativo: true },
  { id: 12, setor_id: 3, nome: 'Geladeira', ativo: true },
];

export const mockItens: ItemInspecao[] = [
  // Doca (id: 1)
  { id: 1, subsetor_id: 1, descricao: 'Postura ergonomicamente inadequada', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'NORMAL', ativo: true },
  { id: 2, subsetor_id: 1, descricao: 'Os colaboradores tem conhecimento da instrução operacional', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'NORMAL', ativo: true },
  { id: 3, subsetor_id: 1, descricao: 'Uso inadequado da bota', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'NORMAL', ativo: true },
  { id: 4, subsetor_id: 1, descricao: 'Uso de luvas', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'NORMAL', ativo: true },
  
  // Raio X (id: 2)
  { id: 5, subsetor_id: 2, descricao: 'Levantamento de carga acima de 25kg sozinho.', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'ALTO', ativo: true },
  { id: 6, subsetor_id: 2, descricao: 'Postura ergonomica inadequada.', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'NORMAL', ativo: true },
  
  // Armazém (id: 3)
  { id: 7, subsetor_id: 3, descricao: 'Puxar ou empurrar matrim com cargas <400kg', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'NORMAL', ativo: true },
  { id: 8, subsetor_id: 3, descricao: 'Colaborador andando sobre o matrim', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'ALTO', ativo: true },
  { id: 9, subsetor_id: 3, descricao: 'Dividir espaço com a transpaleteira', funcao: 'AUXILIAR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'MEDIO', ativo: true },
  { id: 10, subsetor_id: 3, descricao: 'Conduzir transpaleteira com carga acima da visão', funcao: 'OPERADOR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'ALTO', ativo: true },
  { id: 11, subsetor_id: 3, descricao: 'Dividir espaço com pedestre', funcao: 'OPERADOR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'ALTO', ativo: true },
  
  // Expedição (id: 4)
  { id: 12, subsetor_id: 4, descricao: 'Transportar carga acima da capacidade do equipamento', funcao: 'OPERADOR', tipo_avaliacao: 'QUANTITATIVO', nivel_criticidade: 'ALTO', ativo: true },
];

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

export let mockInspecoes: Inspecao[] = [
  { id: 1, subsetor_id: 1, usuario_id: 'u2', mes: currentMonth, ano: currentYear, data_inspecao: new Date().toISOString() },
  { id: 2, subsetor_id: 2, usuario_id: 'u2', mes: currentMonth, ano: currentYear, data_inspecao: new Date().toISOString() },
  { id: 3, subsetor_id: 4, usuario_id: 'u2', mes: currentMonth, ano: currentYear, data_inspecao: new Date().toISOString() },
  // Historical data for charts
  { id: 4, subsetor_id: 1, usuario_id: 'u2', mes: currentMonth - 1 > 0 ? currentMonth - 1 : 12, ano: currentMonth - 1 > 0 ? currentYear : currentYear - 1, data_inspecao: new Date().toISOString() },
];

export let mockRespostas: RespostaInspecao[] = [
  // Inspecao 1 (Doca)
  { id: 1, inspecao_id: 1, item_id: 1, tipo_avaliacao: 'QUANTITATIVO', conforme: true },
  { id: 2, inspecao_id: 1, item_id: 2, tipo_avaliacao: 'QUANTITATIVO', conforme: true },
  { id: 3, inspecao_id: 1, item_id: 3, tipo_avaliacao: 'QUANTITATIVO', conforme: false, observacao: 'Colaborador com bota desamarrada' },
  { id: 4, inspecao_id: 1, item_id: 4, tipo_avaliacao: 'QUANTITATIVO', conforme: true },
  
  // Inspecao 2 (Raio X)
  { id: 5, inspecao_id: 2, item_id: 5, tipo_avaliacao: 'QUANTITATIVO', conforme: false, observacao: 'Carga de 35kg sendo levantada por apenas um auxiliar' },
  { id: 6, inspecao_id: 2, item_id: 6, tipo_avaliacao: 'QUANTITATIVO', conforme: true },
  
  // Inspecao 3 (Expedição)
  { id: 7, inspecao_id: 3, item_id: 12, tipo_avaliacao: 'QUANTITATIVO', conforme: false, observacao: 'Palete mal condicionado e acima do limite' },
];

export const addInspecaoMock = (inspecao: Omit<Inspecao, 'id' | 'data_inspecao'>) => {
  const newId = mockInspecoes.length > 0 ? Math.max(...mockInspecoes.map(i => i.id)) + 1 : 1;
  const nova = { ...inspecao, id: newId, data_inspecao: new Date().toISOString() };
  mockInspecoes.push(nova);
  return nova;
};

export const addRespostasMock = (respostas: Omit<RespostaInspecao, 'id'>[]) => {
  let nextId = mockRespostas.length > 0 ? Math.max(...mockRespostas.map(r => r.id)) + 1 : 1;
  const novas = respostas.map(r => ({ ...r, id: nextId++ }));
  mockRespostas.push(...novas);
  return novas;
};
