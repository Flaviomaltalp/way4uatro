const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_DESTINO = process.env.EMAIL_DESTINO;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'JSON inválido' };
  }

  const { servico, nome, telefone, ...respostas } = data;

  // ── 1. Salvar no Supabase ─────────────────────────────────────────
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        servico,
        nome,
        telefone,
        respostas,
        criado_em: new Date().toISOString()
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase error:', err);
    }
  } catch (err) {
    console.error('Erro ao salvar no Supabase:', err);
  }

  // ── 2. Montar e-mail formatado ────────────────────────────────────
  const servicoLabel = {
    residencial:  '🏠 Projeto Residencial',
    comercial:    '🏢 Projeto Comercial',
    interiores:   '🛋️ Design de Interiores',
    reforma:      '🔨 Reforma e Construção',
    construcao:   '🏗️ Construção',
    levantamento: '📐 Levantamento e Mapeamento'
  }[servico] || servico;

  const linhasRespostas = Object.entries(respostas)
    .filter(([k, v]) => v && k.startsWith('q'))
    .map(([, v]) => `<li style="margin-bottom:8px;">${v}</li>`)
    .join('');

  const htmlEmail = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:12px;overflow:hidden;">
      <div style="background:#111827;padding:28px 32px;text-align:center;">
        <p style="color:#25c057;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Novo Lead Recebido</p>
        <h1 style="color:#eae9e4;font-size:22px;margin:0;">Way4uatro Engenharia &amp; Arquitetura</h1>
      </div>
      <div style="padding:32px;">
        <div style="background:#fff;border-radius:10px;padding:24px;margin-bottom:20px;border:1px solid #e5e7eb;">
          <h2 style="font-size:16px;color:#111827;margin:0 0 16px;">👤 Dados do cliente</h2>
          <p style="margin:0 0 8px;"><strong>Nome:</strong> ${nome}</p>
          <p style="margin:0 0 8px;"><strong>Telefone/WhatsApp:</strong> ${telefone}</p>
          <p style="margin:0;"><strong>Serviço de interesse:</strong> ${servicoLabel}</p>
        </div>
        <div style="background:#fff;border-radius:10px;padding:24px;border:1px solid #e5e7eb;">
          <h2 style="font-size:16px;color:#111827;margin:0 0 16px;">📋 Respostas do diagnóstico</h2>
          <ul style="padding-left:20px;margin:0;color:#374151;">
            ${linhasRespostas}
          </ul>
        </div>
        <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
          <p style="margin:0;font-size:13px;color:#166534;">
            ⏰ <strong>Responda em até 24h</strong> — o lead está quente!<br>
            Entre em contato pelo WhatsApp ou telefone informado acima.
          </p>
        </div>
      </div>
      <div style="padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">Way4uatro · Cuiabá-MT · Atendimento em todo o Brasil</p>
      </div>
    </div>
  `;

  // ── 3. Enviar e-mail via Resend ───────────────────────────────────
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Way4uatro <onboarding@resend.dev>',
        to: [EMAIL_DESTINO],
        subject: `🆕 Novo lead: ${nome} — ${servicoLabel}`,
        html: htmlEmail
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend error:', err);
    }
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true })
  };
};
