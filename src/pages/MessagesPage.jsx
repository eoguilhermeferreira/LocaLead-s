import { useState } from 'react'
import { Copy, MessageSquare, GitBranch, Plus, Zap, ChevronDown, Loader2, Globe, ShoppingBag, UtensilsCrossed, Megaphone } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateAIMessage } from '../lib/ai'

const SERVICES = [
  { key: 'site_institucional', label: 'Site Institucional', icon: Globe },
  { key: 'landing_page', label: 'Landing Page', icon: Megaphone },
  { key: 'loja_virtual', label: 'Loja Virtual', icon: ShoppingBag },
  { key: 'cardapio_digital', label: 'Cardápio Digital', icon: UtensilsCrossed },
]

const MSG_TYPES_BY_SERVICE = {
  site_institucional: [
    'WhatsApp inicial', 'Follow-up 1', 'Follow-up 2',
    'Proposta curta', 'Diagnóstico', 'Resposta a objeção',
    'Script de ligação', 'E-mail',
  ],
  landing_page: [
    'WhatsApp inicial', 'Follow-up 1', 'Follow-up 2',
    'Proposta curta', 'Diagnóstico', 'Copy da landing',
    'Resposta a objeção', 'Script de ligação',
  ],
  loja_virtual: [
    'WhatsApp inicial', 'Follow-up 1', 'Follow-up 2',
    'Proposta curta', 'Diagnóstico', 'Copy da loja virtual',
    'Resposta a objeção', 'Script de ligação',
  ],
  cardapio_digital: [
    'WhatsApp inicial', 'Follow-up 1', 'Follow-up 2',
    'Proposta curta', 'Diagnóstico', 'Copy do cardápio',
    'Resposta a objeção', 'Script de ligação',
  ],
}

const OBJECTIVES_BY_SERVICE = {
  site_institucional: [
    'Vender site institucional profissional',
    'Substituir site antigo por versão moderna',
    'Primeiro site do negócio',
    'Marcar reunião e enviar proposta',
    'Fechar contrato ainda hoje',
  ],
  landing_page: [
    'Vender landing page de alta conversão',
    'Capturar mais leads pelo Google',
    'Aumentar agendamentos e consultas',
    'Campanhas pagas com destino profissional',
    'Fechar contrato ainda hoje',
  ],
  loja_virtual: [
    'Vender loja virtual completa',
    'Migrar vendas do Instagram para loja própria',
    'Loja com catálogo + pedido pelo WhatsApp',
    'Aumentar faturamento online',
    'Fechar contrato ainda hoje',
  ],
  cardapio_digital: [
    'Vender cardápio digital com link próprio',
    'Substituir cardápio físico por digital',
    'Cardápio com pedido direto pelo WhatsApp',
    'Aumentar ticket médio com fotos profissionais',
    'Fechar contrato ainda hoje',
  ],
}

const TONES = ['Consultivo', 'Direto', 'Premium', 'Mais agressivo', 'Amigável', 'Urgência leve']

const SERVICE_TYPES = ['Landing page', 'Site institucional', 'Loja virtual', 'Cardápio digital', 'Melhoria do site atual', 'Pacote completo']
const PACKAGES = ['Essencial', 'Profissional', 'Premium']
const DEADLINES = ['3', '5', '7', '10']
const PAYMENT_CONDITIONS = ['50% para iniciar e 50% na entrega', 'À vista com 10% de desconto', 'Entrada + parcelamento combinado']

function generateFallback(lead, type, tone, objective, seed, service) {
  if (!lead) return ''

  const serviceLabel = {
    site_institucional: 'site institucional',
    landing_page: 'landing page',
    loja_virtual: 'loja virtual',
    cardapio_digital: 'cardápio digital',
  }[service] || 'site profissional'

  const servicePitch = {
    site_institucional: `um site institucional profissional que vai aparecer nas buscas do Google e passar mais credibilidade para os clientes de ${lead.cidade}`,
    landing_page: `uma landing page de alta conversão que vai capturar mais clientes direto pelo Google e WhatsApp em ${lead.cidade}`,
    loja_virtual: `uma loja virtual completa para vender 24h por dia e parar de depender só do Instagram ou delivery`,
    cardapio_digital: `um cardápio digital com link próprio, fotos profissionais e pedido direto pelo WhatsApp — sem mensalidade de marketplace`,
  }[service] || `uma presença digital profissional para crescer em ${lead.cidade}`

  const cta = {
    'Mais agressivo': `Tenho uma proposta montada para o seu segmento. Posso te mandar agora em 1 minuto?`,
    'Urgência leve': `Ainda tenho agenda aberta essa semana. Posso te enviar a proposta?`,
    'Premium': `Posso agendar uma apresentação rápida para mostrar cases do seu setor?`,
    'Direto': `Te mando a proposta agora. Quando você pode dar uma olhada?`,
  }[tone] || `Posso te mandar uma proposta personalizada?`

  const msgs = {
    'WhatsApp inicial': `Olá, tudo bem? Me chamo [Seu nome], sou da NODEX Agência Digital.

Encontrei o ${lead.name} no Google — ${lead.rating}⭐ e ${lead.reviews} avaliações, ótimo trabalho! ${lead.hasSite ? 'Percebi que o site atual tem espaço para melhorar a conversão de clientes.' : `Só que percebi que ainda não há um ${serviceLabel}, o que pode estar fazendo vocês perderem clientes para a concorrência.`}

Criamos ${servicePitch}.

${cta}`,

    'Follow-up 1': `Oi, tudo bem? Passei aqui pois não vi resposta sobre a proposta para ${lead.name}.

Entendo que a rotina é corrida — mas queria garantir que essa oportunidade não passa batida.

${tone === 'Urgência leve' ? `Tenho agenda disponível só até sexta-feira. Quando seria um bom momento para conversar 5 minutos?` : `Quando tiver um minutinho, me avisa? Posso mandar um resumo rápido antes.`}`,

    'Follow-up 2': `Olá! Esse é meu último contato sobre o ${serviceLabel} para ${lead.name}.

Se não for o momento certo agora, tudo bem — guardo o contato para quando fizer sentido. Só queria deixar registrado que estamos prontos para começar quando quiserem.

Sucesso e bons negócios! 🙂`,

    'Proposta curta': `📋 *Proposta — ${lead.name}*

🎯 Serviço: ${serviceLabel.charAt(0).toUpperCase() + serviceLabel.slice(1)} profissional
💰 Investimento: R$ 997,00
📅 Prazo: 5 dias úteis
💳 Condição: 50% para iniciar + 50% na entrega

✅ Design responsivo (celular e computador)
✅ Integração WhatsApp e Google Maps
✅ SEO local para ${lead.cidade}
✅ ${service === 'loja_virtual' ? 'Catálogo com pedido pelo WhatsApp' : service === 'cardapio_digital' ? 'Cardápio com fotos e link próprio' : 'Galeria, depoimentos e formulário de contato'}
✅ 30 dias de suporte inclusos

Avançamos? É só confirmar que já marco na agenda. 🚀`,

    'Diagnóstico': `📊 *Diagnóstico Digital — ${lead.name}*

Score de oportunidade: ${lead.score}/100
Presença: ${lead.hasSite ? '✅ Possui site' : `❌ Sem ${serviceLabel}`}
Reputação Google: ${lead.rating}⭐ (${lead.reviews} avaliações)
Localização: ${lead.cidade}, ${lead.estado}

${lead.score >= 85 ? `🔥 *Alta oportunidade.* Ótima reputação, mas a presença digital não acompanha. Existe gap claro para fechar.` : lead.score >= 70 ? `✅ *Boa oportunidade.* Negócio ativo com potencial de crescimento digital.` : `📌 *Oportunidade padrão.* Vale qualificar antes de avançar com proposta.`}

Próximo passo: enviar proposta personalizada.`,

    'Resposta a objeção': `Entendo sua preocupação! Deixa eu te explicar rapidinho:

💡 *"Já tenho page no Instagram"* — ótimo! Mas clientes que pesquisam no Google não chegam até o Instagram. Com ${lead.hasSite ? 'um site otimizado' : `um ${serviceLabel}`}, seu negócio aparece quando alguém digita "${lead.nicho} em ${lead.cidade}".

💡 *"Tá caro"* — o investimento se paga com 1 ou 2 clientes novos por mês. Com ${lead.reviews} avaliações e ${lead.rating}⭐, a base já está lá — é só capturar essa demanda.

💡 *"Não é prioridade agora"* — a concorrência não está esperando. Quanto mais rápido você tiver, mais cedo começa a colher.

Quer que eu mostre um exemplo do seu segmento?`,

    'Script de ligação': `📞 *Script de Ligação — ${lead.name}*

[Abertura]
"Oi, posso falar com o responsável pelo ${lead.name}? Meu nome é [Seu nome], sou da NODEX Agência Digital."

[Quebra gelo]
"Vi o negócio no Google, ${lead.rating} estrelas e ${lead.reviews} avaliações — parabéns! Ótima reputação."

[Gancho]
"Entrei em contato porque a gente trabalha com ${serviceLabel} para ${lead.nicho} aqui em ${lead.cidade}, e percebi ${lead.hasSite ? 'que o site atual pode estar perdendo clientes' : `que ainda não há ${serviceLabel}`}."

[Pergunta de qualificação]
"Você recebe clientes principalmente pelo WhatsApp ou pelo Google hoje?"

[CTA]
"Tenho uma proposta pronta para o seu segmento. Consigo te mandar agora pelo WhatsApp para você dar uma olhada?"`,

    'Copy da landing': `🎯 *Copy da Landing Page — ${lead.name}*

[Headline]
"${lead.nicho} profissional em ${lead.cidade} — Agende agora pelo WhatsApp"

[Subtítulo]
"${lead.reviews}+ clientes satisfeitos. ${lead.rating}⭐ no Google. Atendimento personalizado desde [ano]."

[Benefícios]
• ✅ Atendimento rápido e sem burocracia
• ✅ Equipe especializada em ${lead.nicho}
• ✅ Resultados comprovados por clientes reais
• ✅ Localizado em ${lead.cidade} — fácil de chegar

[CTA Principal]
🟢 "Falar no WhatsApp agora →"

[Prova social]
"Veja o que nossos clientes falam sobre nós ↓"`,

    'Copy da loja virtual': `🛒 *Copy para Loja Virtual — ${lead.name}*

[Banner principal]
"Compre direto conosco — Entrega em ${lead.cidade} e região"

[Proposta de valor]
"${lead.nicho} com qualidade garantida. ${lead.reviews} avaliações, ${lead.rating}⭐ no Google. Compra segura e entrega rápida."

[Destaques da loja]
• 🚚 Entrega ou retirada em ${lead.cidade}
• 💬 Pedido fácil pelo WhatsApp
• ✅ Produto com foto real e preço justo
• 🔒 Compra sem surpresas

[CTA]
"Ver catálogo e pedir agora →"`,

    'Copy do cardápio': `🍽️ *Copy para Cardápio Digital — ${lead.name}*

[Cabeçalho]
"Cardápio ${lead.name} — Peça agora pelo WhatsApp 🟢"

[Texto de apresentação]
"Bem-vindo ao cardápio digital do ${lead.name}! Veja nossos pratos, escolha o seu favorito e peça direto pelo WhatsApp — simples, rápido e sem taxa de entrega pelo app."

[Seções sugeridas]
📌 Destaques do dia
📌 Pratos principais
📌 Bebidas
📌 Sobremesas
📌 Combos e promoções

[CTA final]
"👇 Escolha e mande mensagem para pedir:"
🟢 [Botão WhatsApp]`,

    'E-mail': `Assunto: Proposta de ${serviceLabel} para ${lead.name}

Olá, tudo bem?

Meu nome é [Seu nome] e sou da NODEX Agência Digital. Encontrei o ${lead.name} no Google enquanto pesquisava negócios de destaque em ${lead.cidade} — parabéns pela reputação de ${lead.rating}⭐!

Percebemos que ${lead.hasSite ? `o site atual pode estar perdendo conversões` : `ainda não há um ${serviceLabel}`} — o que representa uma oportunidade real de crescimento digital.

Criamos soluções completas de ${serviceLabel} para ${lead.nicho} com foco em aparecer no Google e converter visitantes em clientes.

Poderia me conceder 5 minutos para mostrar o que preparei especificamente para o ${lead.name}?

Atenciosamente,
[Seu nome]
NODEX Agência Digital`,
  }

  return msgs[type] || `[${type}] para ${lead.name} (${tone})\nServiço: ${serviceLabel}\nObjetivo: ${objective}${seed ? `\nBase: ${seed}` : ''}`
}

function generateProposal(lead, service, pkg, investment, deadline, condition, tone) {
  if (!lead) return ''
  const inclusions = {
    'Landing page': ['Landing page responsiva', 'Formulário de captação de leads', 'Integração WhatsApp', 'SEO local', 'Analytics'],
    'Site institucional': ['Site completo responsivo', 'Galeria e depoimentos', 'Google Maps integrado', 'SEO local', 'Painel de edição'],
    'Loja virtual': ['Catálogo completo de produtos', 'Carrinho + pedido pelo WhatsApp', 'Filtros por categoria', 'Banner de promoções', 'SEO local'],
    'Cardápio digital': ['Cardápio com fotos profissionais', 'Link próprio compartilhável', 'Pedido direto pelo WhatsApp', 'Destaque de pratos e promoções', 'QR Code incluso'],
    'Melhoria do site atual': ['Redesign completo', 'Otimização de velocidade', 'SEO e conversão', 'Mobile-first', 'Suporte na transição'],
    'Pacote completo': ['Site + Landing page + SEO', 'Google Meu Negócio otimizado', 'WhatsApp Business configurado', 'Relatório mensal', 'Suporte prioritário'],
  }
  const items = inclusions[service] || ['Design profissional responsivo', 'Integração WhatsApp e Google Maps', 'SEO local', 'Suporte incluso']

  return `📋 *PROPOSTA COMERCIAL — ${lead.name}*
Data: ${new Date().toLocaleDateString('pt-BR')}
Cidade: ${lead.cidade}, ${lead.estado}

🎯 *SERVIÇO:* ${service}
📦 *PACOTE:* ${pkg}
⭐ Reputação Google: ${lead.rating}⭐ (${lead.reviews} avaliações)

*O QUE ESTÁ INCLUÍDO:*
${items.map(i => `• ✅ ${i}`).join('\n')}
${pkg === 'Premium' ? '• ✅ Animações profissionais e integração CRM\n• ✅ Relatório mensal de acessos' : pkg === 'Profissional' ? '• ✅ Formulário avançado e Google Analytics' : '• ✅ Suporte por 30 dias'}

💰 *INVESTIMENTO:* R$ ${investment}
📅 *PRAZO:* ${deadline} dias úteis
💳 *CONDIÇÃO:* ${condition}

${tone === 'Premium' ? '⭐ *Inclui:* SSL gratuito, hospedagem por 1 ano e revisão pós-entrega.' : tone === 'Urgência leve' ? '⚡ *Oferta válida até esta semana.* Agenda limitada.' : ''}

📞 Contato: ${lead.phone}

Aguardo sua confirmação para iniciar. 🚀`
}

export default function MessagesPage() {
  const { leads, navigate } = useApp()
  const [tab, setTab] = useState('messages')
  const [service, setService] = useState('site_institucional')
  const [selectedLead, setSelectedLead] = useState('')
  const [msgType, setMsgType] = useState('WhatsApp inicial')
  const [tone, setTone] = useState('Consultivo')
  const [objective, setObjective] = useState('')
  const [seed, setSeed] = useState('')
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  const [propLead, setPropLead] = useState('')
  const [propService, setPropService] = useState('Landing page')
  const [propPkg, setPropPkg] = useState('Profissional')
  const [propInvest, setPropInvest] = useState('997')
  const [propDeadline, setPropDeadline] = useState('5')
  const [propCondition, setPropCondition] = useState(PAYMENT_CONDITIONS[0])
  const [propTone, setPropTone] = useState('Consultivo')
  const [propGenerated, setPropGenerated] = useState('')
  const [propCopied, setPropCopied] = useState(false)

  const lead = leads.find(l => l.id === selectedLead)
  const propLeadObj = leads.find(l => l.id === propLead)

  const currentMsgTypes = MSG_TYPES_BY_SERVICE[service] || []
  const currentObjectives = OBJECTIVES_BY_SERVICE[service] || []
  const currentObjective = objective || currentObjectives[0] || ''

  const handleServiceChange = (key) => {
    setService(key)
    setMsgType(MSG_TYPES_BY_SERVICE[key][0])
    setObjective('')
    setGenerated('')
  }

  const handleGenerate = async () => {
    if (!lead) return
    setGenerating(true)
    const serviceLabel = SERVICES.find(s => s.key === service)?.label || service
    const text = await generateAIMessage({
      lead,
      type: msgType,
      tone,
      objective: currentObjective,
      seed,
      serviceLabel,
    })
    setGenerated(text)
    setGenerating(false)
  }

  const copy = (text, setCop) => {
    navigator.clipboard.writeText(text)
    setCop(true)
    setTimeout(() => setCop(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Mensagens IA</h1>
        <p className="text-gray-400 text-sm">Gere abordagens, follow-ups e propostas personalizadas para fechar contratos.</p>
      </div>

      <div className="flex gap-1 bg-brand-card rounded-xl p-1 border border-brand-border w-fit">
        {[['messages', 'Mensagens'], ['proposals', 'Propostas'], ['bulk', 'Disparo em massa']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? 'bg-brand-wine text-black' : 'text-gray-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'messages' && (
        <div className="space-y-4">
          {/* Seletor de serviço */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Selecione o serviço que você está vendendo:</p>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleServiceChange(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    service === key
                      ? 'bg-brand-wine text-white'
                      : 'bg-brand-card border border-brand-border text-gray-400 hover:text-white hover:border-brand-wine/50'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="card p-5">
              <h2 className="font-bold text-white mb-1">Configuração da mensagem</h2>
              <p className="text-gray-500 text-xs mb-4">Escolha o lead, o tipo, o tom e o objetivo.</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Lead</label>
                  <div className="relative">
                    <select className="select" value={selectedLead} onChange={e => setSelectedLead(e.target.value)}>
                      <option value="">Selecione um lead</option>
                      {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Tipo de mensagem</label>
                  <div className="relative">
                    <select className="select" value={msgType} onChange={e => setMsgType(e.target.value)}>
                      {currentMsgTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Tom / formato</label>
                  <div className="relative">
                    <select className="select" value={tone} onChange={e => setTone(e.target.value)}>
                      {TONES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Objetivo comercial</label>
                  <div className="relative">
                    <select className="select" value={currentObjective} onChange={e => setObjective(e.target.value)}>
                      {currentObjectives.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Instrução extra (opcional)</label>
                  <textarea
                    className="input resize-none h-16 text-sm"
                    placeholder="Ex: mencionar que temos cases no setor odontológico..."
                    value={seed} onChange={e => setSeed(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-bold text-white mb-1">Mensagem gerada</h2>
              <p className="text-gray-500 text-xs mb-4">Revise antes de copiar ou enviar pelo WhatsApp.</p>

              {!lead ? (
                <div className="text-center py-8 text-gray-500 text-sm">Salve um lead primeiro para gerar mensagens.</div>
              ) : (
                <>
                  <textarea
                    readOnly
                    value={generated}
                    className="w-full bg-[#09090b] border border-brand-border rounded-xl p-3 text-sm text-gray-300 resize-none h-52 focus:outline-none font-mono"
                    placeholder="Clique em 'Gerar mensagem' para criar o conteúdo..."
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={handleGenerate} disabled={generating} className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-60">
                      {generating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                      {generating ? 'Gerando...' : 'Gerar mensagem'}
                    </button>
                    <button
                      onClick={() => copy(generated, setCopied)}
                      className={`text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors ${copied ? 'bg-brand-wine text-black border-brand-wine' : 'border-brand-border text-gray-300 hover:border-brand-wine/40'}`}
                    >
                      <Copy size={14} /> {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                    {lead && generated && (
                      <a
                        href={`https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(generated)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                      >
                        <MessageSquare size={14} /> WhatsApp
                      </a>
                    )}
                    <button onClick={() => navigate('pipeline')} className="btn-secondary text-sm flex items-center gap-1.5">
                      <GitBranch size={14} /> Pipeline
                    </button>
                    <button
                      onClick={() => { setMsgType('Follow-up 1'); setGenerated('') }}
                      className="btn-secondary text-sm flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Follow-up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'proposals' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h2 className="font-bold text-white mb-1">Configuração da proposta</h2>
            <p className="text-gray-500 text-xs mb-4">Gere uma proposta comercial clara para transformar leads em clientes.</p>
            <div className="space-y-3">
              {[
                { label: 'Lead', content: <div className="relative"><select className="select" value={propLead} onChange={e => setPropLead(e.target.value)}><option value="">Selecione um lead</option>{leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
                { label: 'Serviço', content: <div className="relative"><select className="select" value={propService} onChange={e => setPropService(e.target.value)}>{SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
                { label: 'Pacote', content: <div className="relative"><select className="select" value={propPkg} onChange={e => setPropPkg(e.target.value)}>{PACKAGES.map(p => <option key={p}>{p}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
                { label: 'Investimento (R$)', content: <input type="number" className="input" value={propInvest} onChange={e => setPropInvest(e.target.value)} /> },
                { label: 'Prazo', content: <div className="relative"><select className="select" value={propDeadline} onChange={e => setPropDeadline(e.target.value)}>{DEADLINES.map(d => <option key={d} value={d}>{d} dias úteis</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
                { label: 'Condição de pagamento', content: <div className="relative"><select className="select" value={propCondition} onChange={e => setPropCondition(e.target.value)}>{PAYMENT_CONDITIONS.map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
                { label: 'Tom', content: <div className="relative"><select className="select" value={propTone} onChange={e => setPropTone(e.target.value)}>{TONES.map(t => <option key={t}>{t}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
              ].map(({ label, content }) => (
                <div key={label}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  {content}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-bold text-white mb-1">Proposta gerada</h2>
            <textarea
              readOnly
              value={propGenerated}
              className="w-full bg-[#09090b] border border-brand-border rounded-xl p-3 text-sm text-gray-300 resize-none h-64 focus:outline-none font-mono mb-3"
              placeholder="Configure e clique em 'Gerar proposta'..."
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPropGenerated(generateProposal(propLeadObj, propService, propPkg, propInvest, propDeadline, propCondition, propTone))}
                className="btn-primary text-sm flex items-center gap-1.5"
              >
                <Zap size={14} /> Gerar proposta
              </button>
              <button
                onClick={() => copy(propGenerated, setPropCopied)}
                className={`text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors ${propCopied ? 'bg-brand-wine text-black border-brand-wine' : 'border-brand-border text-gray-300 hover:border-brand-wine/40'}`}
              >
                <Copy size={14} /> {propCopied ? 'Copiado!' : 'Copiar'}
              </button>
              {propLeadObj && propGenerated && (
                <a href={`https://wa.me/${propLeadObj.whatsapp}?text=${encodeURIComponent(propGenerated)}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors">
                  <MessageSquare size={14} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'bulk' && (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-brand-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border">
            <MessageSquare size={24} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-white text-lg mb-3">Disparo em massa no WhatsApp</h2>
          <p className="text-gray-400 text-sm">Selecione vários leads e dispare mensagens personalizadas em sequência — com modelos de IA ou texto próprio.</p>
          <p className="text-gray-600 text-xs mt-3">Em breve disponível.</p>
        </div>
      )}
    </div>
  )
}
