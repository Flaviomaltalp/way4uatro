-- ============================================================
--  Way4uatro — Tabela de Leads
--  Execute no Supabase: SQL Editor → New Query → Run
-- ============================================================

create table if not exists leads (
  id          bigserial primary key,
  criado_em   timestamptz default now(),
  servico     text not null,
  nome        text not null,
  telefone    text not null,
  respostas   jsonb default '{}'::jsonb
);

-- Índices para facilitar filtragem no painel
create index if not exists leads_servico_idx   on leads (servico);
create index if not exists leads_criado_em_idx on leads (criado_em desc);

-- Habilitar RLS (Row Level Security)
alter table leads enable row level security;

-- Permitir inserção pública (o formulário insere sem autenticação)
create policy "Inserção pública"
  on leads for insert
  to anon
  with check (true);

-- Somente usuários autenticados (você) podem ler os leads
create policy "Leitura autenticada"
  on leads for select
  to authenticated
  using (true);
