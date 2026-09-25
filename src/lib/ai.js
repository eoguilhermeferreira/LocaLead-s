/**
 * Geração de mensagens via Claude API (server-side via Edge Function)
 * ou fallback para geração local quando sem API key.
 */

export async function generateAIMessage({ lead, type, tone, objective, seed, serviceLabel }) {
  const service = serviceLabel || 'site profissional'

  const systemPrompt = `Você é um especialista em vendas e prospecção comercial para agências digitais brasileiras.
Seu objetivo é gerar mensagens altamente persuasivas que fecham contratos de ${service}.
Tom: ${tone}. Objetivo: ${objective}.
${seed ? `Instrução extra: ${seed}` : ''}
Regras:
- Seja direto, natural e comercialmente inteligente
- Use dados reais do negócio (nota, avaliações, cidade, nicho) para personalizar
- Foque no benefício concreto para o cliente, não só na venda
- Mensagem pronta para enviar — sem introduções ou explicações extras
- Use formatação WhatsApp (*negrito*, emojis moderados) quando for mensagem de WhatsApp
Responda APENAS com a mensagem final.`

  const userPrompt = `Gere uma mensagem do tipo "${type}" para o seguinte negócio local:
- Nome: ${lead.name}
- Segmento: ${lead.nicho}
- Cidade: ${lead.cidade}, ${lead.estado}
- Google: ${lead.rating}⭐ (${lead.reviews} avaliações)
- Presença digital: ${lead.hasSite ? 'Possui site' : 'Sem site — grande oportunidade'}
- Score de oportunidade: ${lead.score}/100
- Serviço sendo vendido: ${service}
- WhatsApp: ${lead.phone}`

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return generateFallback(lead, type, tone, objective, seed)
  }

  try {
    const resp = await fetch(`${supabaseUrl}/functions/v1/generate-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
      body: JSON.stringify({ systemPrompt, userPrompt }),
    })
    if (!resp.ok) throw new Error('Edge function error')
    const data = await resp.json()
    return data.content || generateFallback(lead, type, tone, objective, seed)
  } catch {
    return generateFallback(lead, type, tone, objective, seed)
  }
}

function generateFallback(lead, type, tone, objective, seed) {
  const callToAction = tone === 'Mais agressivo'
    ? 'Tenho uma oferta especial ESTA SEMANA. Posso te mostrar em 2 min?'
    : tone === 'Urgência leve'
    ? 'Ainda tenho vagas disponíveis esta semana. Posso te enviar a proposta?'
    : 'Posso te mandar uma proposta rápida?'

  const msgs = {
    'WhatsApp inicial': `Olá, tudo bem? Somos a NODEX, uma Agência de Marketing Digital. Trabalhamos com presença digital para negócios locais como ${lead.name}.

Vi que vocês têm ${lead.reviews} avaliações no Google com nota ${lead.rating} — incrível! ${lead.hasSite ? 'Acredito que podemos potencializar ainda mais a sua presença digital.' : `Percebi que o negócio ainda não tem um site profissional, o que pode estar limitando o alcance de vocês em ${lead.cidade}.`}

${callToAction}`,
    'Follow-up 1': `Oi, tudo bem?

Passei aqui para verificar se você recebeu minha mensagem anterior sobre ${lead.name}. ${tone === 'Urgência leve' ? 'Ainda tenho algumas vagas disponíveis.' : 'Seria um prazer mostrar o que preparei.'}

Quando seria um bom momento para conversarmos?`,
    'Follow-up 2': `Olá! Este é meu último contato sobre a proposta para ${lead.name}.

Se não for o momento certo, sem problema! Quando precisar de apoio com presença digital em ${lead.cidade}, pode contar comigo.

Um abraço e bons negócios! 🙂`,
    'Proposta curta': `📋 Proposta — ${lead.name}

Serviço: ${lead.hasSite ? 'Otimização do site atual' : 'Criação de site profissional'}
Investimento: R$ 997,00
Prazo: 5 dias úteis
Condição: 50% início + 50% na entrega

✅ Landing page responsiva
✅ Integração WhatsApp + Google Maps
✅ SEO local para ${lead.cidade}
✅ 30 dias de suporte

Gostaria de avançar?`,
    'Diagnóstico': `📊 Diagnóstico Digital — ${lead.name}

Score: ${lead.score}/100
Presença: ${lead.hasSite ? '✅ Possui site' : '❌ Sem site detectado'}
Reputação: ${lead.rating}⭐ (${lead.reviews} avaliações)
Localização: ${lead.cidade}, ${lead.estado}

${lead.score >= 85 ? '🔥 Alta oportunidade — prioridade máxima de abordagem.' : lead.score >= 70 ? '✅ Boa oportunidade — negócio ativo com gap digital claro.' : '📌 Oportunidade padrão — avaliar melhor o momento.'}`,
  }

  return msgs[type] || `[${type}] gerado para ${lead.name} (${tone})\nObjetivo: ${objective}${seed ? `\nBase: ${seed}` : ''}`
}
