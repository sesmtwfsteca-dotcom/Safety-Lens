-- Schema
CREATE SCHEMA IF NOT EXISTS "inspecao-seguranca";

-- Tabela de Usuários (integrada com Supabase Auth)
CREATE TABLE "inspecao-seguranca".usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  tipo_perfil VARCHAR(20) NOT NULL CHECK (tipo_perfil IN ('ADM', 'VISITANTE')),
  foto_perfil_url TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Setores
CREATE TABLE "inspecao-seguranca".setores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) UNIQUE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Subsetores
CREATE TABLE "inspecao-seguranca".subsetores (
  id SERIAL PRIMARY KEY,
  setor_id INTEGER REFERENCES "inspecao-seguranca".setores(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(setor_id, nome)
);

-- Tabela de Itens de Inspeção
CREATE TABLE "inspecao-seguranca".itens_inspecao (
  id SERIAL PRIMARY KEY,
  subsetor_id INTEGER REFERENCES "inspecao-seguranca".subsetores(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  funcao VARCHAR(20) NOT NULL CHECK (funcao IN ('AUXILIAR', 'OPERADOR')),
  tipo_avaliacao VARCHAR(20) NOT NULL CHECK (tipo_avaliacao IN ('QUANTITATIVO', 'QUALITATIVO')),
  nivel_criticidade VARCHAR(20) NOT NULL CHECK (nivel_criticidade IN ('NORMAL', 'MEDIO', 'ALTO')),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Inspeções (cabeçalho)
CREATE TABLE "inspecao-seguranca".inspecoes (
  id SERIAL PRIMARY KEY,
  subsetor_id INTEGER REFERENCES "inspecao-seguranca".subsetores(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES "inspecao-seguranca".usuarios(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  data_inspecao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subsetor_id, usuario_id, mes, ano, data_inspecao)
);

-- Tabela de Respostas da Inspeção
CREATE TABLE "inspecao-seguranca".respostas_inspecao (
  id SERIAL PRIMARY KEY,
  inspecao_id INTEGER REFERENCES "inspecao-seguranca".inspecoes(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES "inspecao-seguranca".itens_inspecao(id) ON DELETE CASCADE,
  tipo_avaliacao VARCHAR(20) NOT NULL,
  -- Para QUANTITATIVO (Conforme/Não Conforme)
  conforme BOOLEAN,
  -- Para QUALITATIVO (Quantidade de não conformidades)
  quantidade_nao_conforme INTEGER,
  observacao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_inspecoes_mes_ano ON "inspecao-seguranca".inspecoes(mes, ano);
CREATE INDEX idx_inspecoes_subsetor ON "inspecao-seguranca".inspecoes(subsetor_id);
CREATE INDEX idx_respostas_inspecao ON "inspecao-seguranca".respostas_inspecao(inspecao_id);
CREATE INDEX idx_itens_subsetor ON "inspecao-seguranca".itens_inspecao(subsetor_id);

-- RLS Policies Examples
-- CREATE POLICY "Usuários podem inserir suas próprias inspeções" ON "inspecao-seguranca".respostas_inspecao FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM "inspecao-seguranca".inspecoes i WHERE i.id = inspecao_id AND i.usuario_id = auth.uid()));
-- CREATE POLICY "Visitantes podem ler dados" ON "inspecao-seguranca".respostas_inspecao FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM "inspecao-seguranca".usuarios u WHERE u.id = auth.uid()));
