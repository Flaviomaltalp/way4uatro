# 🚀 Guia de Deploy — Way4uatro Funil de Leads

## PASSO 1 — Criar a tabela no Supabase

1. Acesse https://supabase.com e abra o projeto way4uatro
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole todo o conteúdo do arquivo `supabase_setup.sql`
5. Clique em **Run**
6. Deve aparecer "Success" — a tabela `leads` foi criada

---

## PASSO 2 — Subir o projeto no Netlify

1. Acesse https://netlify.com e faça login
2. Clique em **Add new site → Deploy manually**
3. **Importante:** arraste a PASTA `way4uatro` inteira (não apenas o HTML)
   - A pasta deve conter:
     - `index.html`
     - `netlify.toml`
     - `netlify/functions/salvar-lead.js`
4. Aguarde o deploy finalizar (cerca de 30 segundos)

---

## PASSO 3 — Configurar as variáveis de ambiente

1. No painel do Netlify, vá em **Site configuration → Environment variables**
2. Clique em **Add a variable** e adicione as 4 variáveis abaixo:

| Chave              | Valor                                      |
|--------------------|--------------------------------------------|
| SUPABASE_URL       | https://nwmqlwtssgrdksjxhrfx.supabase.co   |
| SUPABASE_ANON_KEY  | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...   |
| RESEND_API_KEY     | re_XzCZ6BNR_AbkPWLDRuc25vATXpYDujXyR      |
| EMAIL_DESTINO      | arqfernando@hotmail.com                    |

3. Após adicionar todas, clique em **Trigger deploy → Deploy site**
   (necessário para as variáveis entrarem em vigor)

---

## PASSO 4 — Verificar o domínio no Resend

Para enviar e-mails de forma confiável o Resend precisa verificar seu domínio.
Por enquanto o sistema já funciona usando o domínio padrão deles (onboarding@resend.dev).

Quando quiser personalizar para enviar como `noreply@way4uatro.com.br`:
1. Acesse https://resend.com → **Domains → Add Domain**
2. Siga as instruções para adicionar registros DNS

---

## PASSO 5 — Renomear o site (opcional)

1. No Netlify vá em **Site configuration → Site details → Change site name**
2. Defina algo como: `way4uatro` → https://way4uatro.netlify.app

---

## ✅ Como verificar se está funcionando

1. Abra o site publicado
2. Preencha o formulário completo como se fosse um cliente
3. Verifique:
   - ✉️ E-mail chega em arqfernando@hotmail.com
   - 🗄️ Lead aparece no Supabase: Table Editor → leads

---

## 📊 Visualizar leads no Supabase

1. Acesse o projeto no supabase.com
2. Vá em **Table Editor → leads**
3. Todos os leads aparecem com:
   - Data/hora
   - Nome e telefone do cliente
   - Serviço escolhido
   - Respostas completas (coluna `respostas` em JSON)

Para filtrar por serviço, clique no filtro da coluna `servico`.
