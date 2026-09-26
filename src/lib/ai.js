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
    return generateFallback(lead, type, tone, serviceLabel)
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
    return data.content || generateFallback(lead, type, tone, serviceLabel)
  } catch {
    return generateFallback(lead, type, tone, serviceLabel)
  }
}

function generateFallback(lead, type, tone, serviceLabel) {
  if (!lead) return ''

  const svc = (serviceLabel || 'site profissional').toLowerCase()
  const isLoja = svc.includes('loja')
  const isCardapio = svc.includes('cardápio') || svc.includes('cardapio')
  const isLanding = svc.includes('landing')
  const isInstitucional = svc.includes('institucional')

  const cta = {
    'Mais agressivo': 'Tenho uma proposta montada. Posso te mandar agora?',
    'Urgência leve': 'Ainda tenho agenda aberta essa semana. Quando posso te mandar a proposta?',
    'Premium': 'Posso te mostrar alguns cases do seu setor antes de enviar a proposta?',
    'Direto': 'Te mando a proposta agora. Quando você pode dar uma olhada?',
  }[tone] || 'Posso te mandar uma proposta personalizada?'

  const semSiteTexto = lead.hasSite
    ? `percebi que o site atual tem espaço para melhorar a conversão de clientes`
    : isLoja
      ? `vi que ainda não há uma loja virtual, o que faz você depender só do Instagram ou do iFood`
      : isCardapio
        ? `vi que ainda não há um cardápio digital — clientes que buscam no Google não conseguem ver seus produtos`
        : isLanding
          ? `vi que ainda não há uma landing page para capturar clientes pelo Google`
          : `vi que ainda não há um site profissional, o que pode estar limitando o alcance em ${lead.cidade}`

  const beneficio = isLoja
    ? `Uma loja virtual permite vender 24h por dia, aceitar pedidos pelo WhatsApp e parar de pagar comissão pra marketplace`
    : isCardapio
      ? `Com um cardápio digital, seus clientes veem os pratos com foto, escolhem e pedem direto pelo WhatsApp — sem mensalidade de app`
      : isLanding
        ? `Uma landing page de alta conversão faz seu negócio aparecer no Google e transforma visitantes em clientes agendados`
        : `Um site profissional faz ${lead.name} aparecer nas buscas do Google e passa credibilidade para quem ainda não te conhece`

  const msgs = {
    'WhatsApp inicial': `Olá, tudo bem? Me chamo [Seu nome], sou da NODEX Agência Digital.

Encontrei o *${lead.name}* no Google — ${lead.rating}⭐ e ${lead.reviews} avaliações, parabéns! Só que ${semSiteTexto}.

${beneficio}.

${cta}`,

    'Follow-up 1': `Oi, tudo bem? Passei aqui pois não vi resposta sobre ${lead.name}.

Entendo que a rotina é corrida — mas não queria que essa oportunidade passasse.

${tone === 'Urgência leve' ? `Tenho agenda disponível só até sexta. Quando seria um bom momento pra conversar 5 minutos?` : `Quando tiver um minutinho, me avisa? Mando um resumo rápido antes.`}`,

    'Follow-up 2': `Olá! Esse é meu último contato sobre ${lead.hasSite ? 'a melhoria da presença digital' : `a criação ${isCardapio ? 'do cardápio digital' : isLoja ? 'da loja virtual' : isLanding ? 'da landing page' : 'do site'}`} para *${lead.name}*.

Se não for o momento agora, sem problema! Fica o contato para quando fizer sentido.

Bons negócios! 🙂`,

    'Proposta curta': isCardapio
      ? `📋 *Proposta — ${lead.name}*

🎯 Serviço: Cardápio Digital Profissional
💰 Investimento: R$ 497,00
📅 Prazo: 3 dias úteis
💳 Condição: 50% início + 50% na entrega

✅ Cardápio com fotos profissionais de cada prato
✅ Link próprio para compartilhar no WhatsApp e Instagram
✅ QR Code impresso incluso
✅ Pedido direto pelo WhatsApp (sem taxa de marketplace)
✅ Destaque de pratos do dia e promoções
✅ 30 dias de suporte

Avançamos? É só confirmar que já marco na agenda. 🚀`
      : isLoja
        ? `📋 *Proposta — ${lead.name}*

🎯 Serviço: Loja Virtual Completa
💰 Investimento: R$ 997,00
📅 Prazo: 5 dias úteis
💳 Condição: 50% início + 50% na entrega

✅ Catálogo completo com fotos e preços
✅ Filtros por categoria de produto
✅ Carrinho + pedido direto pelo WhatsApp
✅ Banner de promoções e destaques
✅ SEO local para ${lead.cidade}
✅ 30 dias de suporte

Avançamos? É só confirmar. 🚀`
        : isLanding
          ? `📋 *Proposta — ${lead.name}*

🎯 Serviço: Landing Page de Alta Conversão
💰 Investimento: R$ 797,00
📅 Prazo: 3 dias úteis
💳 Condição: 50% início + 50% na entrega

✅ Design focado em converter visitantes em clientes
✅ Formulário de captação de leads
✅ Integração WhatsApp e Google Maps
✅ SEO local para ${lead.cidade}
✅ Otimizada para campanhas pagas (Google/Meta)
✅ 30 dias de suporte

Avançamos? 🚀`
          : `📋 *Proposta — ${lead.name}*

🎯 Serviço: Site Institucional Profissional
💰 Investimento: R$ 997,00
📅 Prazo: 5 dias úteis
💳 Condição: 50% início + 50% na entrega

✅ Design responsivo (celular e computador)
✅ Galeria, depoimentos e formulário de contato
✅ Google Maps e WhatsApp integrados
✅ SEO local para ${lead.cidade}
✅ 30 dias de suporte

Avançamos? 🚀`,

    'Diagnóstico': `📊 *Diagnóstico Digital — ${lead.name}*

Score: ${lead.score}/100
Presença: ${lead.hasSite ? `✅ Possui site` : isCardapio ? `❌ Sem cardápio digital` : isLoja ? `❌ Sem loja virtual` : `❌ Sem site`}
Google: ${lead.rating}⭐ (${lead.reviews} avaliações)
Localização: ${lead.cidade}, ${lead.estado}

${lead.score >= 85
  ? `🔥 *Alta oportunidade.* Ótima reputação, mas sem ${isCardapio ? 'cardápio digital' : isLoja ? 'loja virtual' : 'presença digital adequada'}. Gap claro para fechar.`
  : lead.score >= 70
    ? `✅ *Boa oportunidade.* Negócio ativo com potencial de crescimento digital.`
    : `📌 *Oportunidade padrão.* Vale qualificar antes de enviar proposta.`}`,

    'Resposta a objeção': `Entendo! Deixa eu explicar rapidinho:

💡 *"Já tenho Instagram"* — ótimo, mas quem pesquisa "${lead.nicho} em ${lead.cidade}" no Google não chega até o Instagram. ${isLoja ? 'Com uma loja virtual, você vende 24h sem depender de algoritmo.' : isCardapio ? 'Com um cardápio digital, o cliente vê o menu e já pede.' : 'Com um site, você aparece quando a pessoa está pronta pra comprar.'}

💡 *"Tá caro"* — o investimento se paga com 1 ou 2 clientes novos por mês. Com ${lead.reviews} avaliações e ${lead.rating}⭐, a demanda já existe — é só capturar.

💡 *"Não é prioridade agora"* — a concorrência não está esperando. Quanto antes, mais rápido colhe os frutos.

Posso mostrar um exemplo do seu segmento?`,

    'Script de ligação': `📞 *Script de Ligação — ${lead.name}*

[Abertura]
"Oi, posso falar com o responsável? Meu nome é [Seu nome], sou da NODEX Agência Digital."

[Quebra gelo]
"Vi o ${lead.name} no Google — ${lead.rating} estrelas e ${lead.reviews} avaliações, parabéns!"

[Gancho]
"Entrei em contato porque a gente cria ${isCardapio ? 'cardápios digitais' : isLoja ? 'lojas virtuais' : isLanding ? 'landing pages de alta conversão' : 'sites institucionais'} para ${lead.nicho} em ${lead.cidade}, e ${lead.hasSite ? 'vi que dá pra melhorar bastante a conversão do site de vocês' : `vi que ainda não há ${isCardapio ? 'cardápio digital' : isLoja ? 'loja virtual' : 'site profissional'}`}."

[Qualificação]
"Vocês recebem mais clientes pelo WhatsApp ou pelo Google hoje?"

[CTA]
"Tenho uma proposta pronta pro seu segmento. Consigo te mandar agora pelo WhatsApp?"`,
  }

  return msgs[type] || `Olá! Somos da NODEX Agência Digital e criamos ${svc} para negócios como ${lead.name} em ${lead.cidade}.\n\n${cta}`
}
