import { useState } from 'react'
import { Copy, MessageSquare, GitBranch, Plus, Zap, ChevronDown, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateAIMessage } from '../lib/ai'

const MSG_TYPES = [
  'WhatsApp inicial', 'Follow-up 1', 'Follow-up 2', 'Proposta curta',
  'Diagnóstico', 'E-mail', 'Script de ligação', 'Resposta a objeção',
  'Estrutura do site', 'Copy da landing', 'Catálogo inicial', 'Prompt Site',
]
const TONES = ['Consultivo', 'Direto', 'Premium', 'Mais agressivo', 'Amigável', 'Urgência leve']
const OBJECTIVES = [
  'Vender landing page profissional', 'Vender site institucional', 'Vender catálogo online',
  'Melhorar site atual', 'Converter melhor Google/WhatsApp', 'Marcar conversa e enviar proposta',
]
const PRESETS = [
  { label: 'WhatsApp consultivo', type: 'WhatsApp inicial', tone: 'Consultivo' },
  { label: 'Mais agressiva', type: 'WhatsApp inicial', tone: 'Mais agressivo' },
  { label: 'Follow-up', type: 'Follow-up 1', tone: 'Amigável' },
  { label: 'Proposta premium', type: 'Proposta curta', tone: 'Premium' },
  { label: '✨ Prompt Site', type: 'Prompt Site', tone: 'Consultivo' },
]

const SERVICE_TYPES = ['Landing page', 'Site institucional', 'Catálogo online', 'Melhoria do site atual', 'Página Google/WhatsApp', 'Pacote completo']
const PACKAGES = ['Essencial', 'Profissional', 'Premium']
const DEADLINES = ['3', '5', '7', '10']
const PAYMENT_CONDITIONS = ['50% para iniciar e 50% na entrega', 'À vista com prioridade na agenda', 'Entrada + parcelamento combinado']

function generateMessage(lead, type, tone, objective, seed) {
  if (!lead) return ''
  const base = {
    'WhatsApp inicial': `Olá, tudo bem? Somos a NODEX, uma Agência de Marketing Digital. Trabalhamos com presença digital para negócios locais como ${lead.name}.

Vi que vocês têm ${lead.reviews} avaliações no Google com nota ${lead.rating} — incrível! ${lead.hasSite ? 'Acredito que podemos potencializar ainda mais sua presença digital.' : 'Percebi que ainda não têm um site, o que pode estar limitando o alcance.'}

${tone === 'Mais agressivo' ? `Tenho uma oferta especial ESSA SEMANA para o seu nicho em ${lead.cidade}. Posso mostrar em 2 min?` : `Posso te mandar uma proposta rápida?`}`,
    'Follow-up 1': `Oi ${lead.name}, tudo bem?

Passei aqui para verificar se recebeu minha mensagem. ${tone === 'Urgência leve' ? 'Ainda tenho algumas vagas disponíveis esta semana.' : 'Seria um prazer mostrar o que preparei para vocês.'}

Quando seria um bom momento para conversar?`,
    'Follow-up 2': `Olá! Este é meu último contato sobre a proposta para ${lead.name}.

Se não for o momento certo, tudo bem! Quando precisar de apoio com presença digital em ${lead.cidade}, pode contar comigo.

Bons negócios! 🙂`,
    'Proposta curta': `📋 Proposta para ${lead.name}\n\nServiço: Site profissional personalizado\nInvestimento: R$ 997,00\nPrazo: 5 dias úteis\nCondição: 50% início + 50% entrega\n\nInclui: Landing page responsiva, WhatsApp integrado, galeria, SEO local.\n\nGostaria de avançar?`,
    'Diagnóstico': `📊 Diagnóstico Digital — ${lead.name}\n\nScore: ${lead.score}/100\nPresença: ${lead.hasSite ? '✅ Tem site' : '❌ Sem site'}\nReputação: ${lead.rating}⭐ (${lead.reviews} avaliações)\n\nOportunidade: ${lead.score >= 70 ? 'Alta prioridade' : 'Potencial de crescimento'}`,
  }
  return base[type] || `[${type}] para ${lead.name} — ${tone}\n\nObjetivo: ${objective}\n${seed ? `\nInstrução base: ${seed}` : ''}`
}

function generateProposal(lead, service, pkg, investment, deadline, condition, tone) {
  if (!lead) return ''
  return `📋 PROPOSTA COMERCIAL — ${lead.name}
Data: ${new Date().toLocaleDateString('pt-BR')}
Cidade: ${lead.cidade}, ${lead.estado}

🎯 SERVIÇO: ${service}
📦 PACOTE: ${pkg}

O QUE ESTÁ INCLUÍDO:
• Design profissional e responsivo
• Integração WhatsApp e Google Maps
• Seções: hero, serviços, galeria, depoimentos, contato
• Otimização para buscas locais (SEO)
• ${pkg === 'Premium' ? '+ Blog, animações e integração CRM' : pkg === 'Profissional' ? '+ Formulário avançado e analytics' : '+ Suporte por 30 dias'}

💰 INVESTIMENTO: R$ ${investment}
📅 PRAZO: ${deadline} dias úteis
💳 CONDIÇÃO: ${condition}

${tone === 'Premium' ? '⭐ Inclui certificado SSL, hospedagem 1 mês grátis e revisão pós-entrega.' : ''}

Reputação do negócio: ${lead.rating}⭐ (${lead.reviews} avaliações)
Contato: ${lead.phone}

Aguardo confirmação para iniciar. 🚀`
}

export default function MessagesPage() {
  const { leads, navigate } = useApp()
  const [tab, setTab] = useState('messages')
  const [selectedLead, setSelectedLead] = useState('')
  const [msgType, setMsgType] = useState('WhatsApp inicial')
  const [tone, setTone] = useState('Consultivo')
  const [objective, setObjective] = useState(OBJECTIVES[0])
  const [seed, setSeed] = useState('')
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  // Proposal state
  const [propLead, setPropLead] = useState('')
  const [propService, setPropService] = useState('Landing page')
  const [propPkg, setPropPkg] = useState('Profissional')
  const [propInvest, setPropInvest] = useState('997')
  const [propDeadline, setPropDeadline] = useState('5')
  const [propCondition, setPropCondition] = useState(PAYMENT_CONDITIONS[0])
  const [propTone, setPropTone] = useState('Consultivo')
  const [propGenerated, setPropGenerated] = useState('')

  const lead = leads.find(l => l.id === selectedLead)
  const propLeadObj = leads.find(l => l.id === propLead)

  const applyPreset = (preset) => {
    setMsgType(preset.type)
    setTone(preset.tone)
  }

  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!lead) return
    setGenerating(true)
    const text = await generateAIMessage({ lead, type: msgType, tone, objective, seed })
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
        <p className="text-gray-400 text-sm">Gere abordagens, follow-ups e textos comerciais com padrão de IA personalizado.</p>
      </div>

      {/* Tabs */}
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
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Config */}
          <div className="card p-5">
            <h2 className="font-bold text-white mb-1">Configuração da mensagem</h2>
            <p className="text-gray-500 text-xs mb-4">Escolha o lead, o tipo, o tom e o objetivo comercial.</p>

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
                <label className="text-xs text-gray-400 mb-1 block">Tipo</label>
                <div className="relative">
                  <select className="select" value={msgType} onChange={e => setMsgType(e.target.value)}>
                    {MSG_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Formato / tom</label>
                <div className="relative">
                  <select className="select" value={tone} onChange={e => setTone(e.target.value)}>
                    {TONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Objetivo</label>
                <div className="relative">
                  <select className="select" value={objective} onChange={e => setObjective(e.target.value)}>
                    {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Seed IA / instrução base</label>
                <textarea
                  className="input resize-none h-16 text-sm"
                  placeholder="Instrução customizável para padronizar suas mensagens..."
                  value={seed} onChange={e => setSeed(e.target.value)}
                />
                <p className="text-xs text-gray-600 mt-1">A seed funciona como uma instrução fixa para manter o padrão comercial.</p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-brand-card border border-brand-border hover:border-brand-wine/40 text-gray-300 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="card p-5">
            <h2 className="font-bold text-white mb-1">Mensagem gerada</h2>
            <p className="text-gray-500 text-xs mb-4">Revise antes de copiar ou enviar pelo WhatsApp.</p>

            {!lead ? (
              <div className="text-center py-8 text-gray-500 text-sm">Salve um lead primeiro.</div>
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
                  <button onClick={() => copy(generated, setCopied)} className={`text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors ${copied ? 'bg-brand-wine text-black border-brand-wine' : 'border-brand-border text-gray-300 hover:border-brand-wine/40'}`}>
                    <Copy size={14} /> {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                  {lead && generated && (
                    <a
                      href={`https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(generated)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      <MessageSquare size={14} /> Abrir WhatsApp
                    </a>
                  )}
                  <button onClick={() => navigate('pipeline')} className="btn-secondary text-sm flex items-center gap-1.5">
                    <GitBranch size={14} /> Pipeline
                  </button>
                  <button onClick={() => setMsgType('Follow-up 1')} className="btn-secondary text-sm flex items-center gap-1.5">
                    <Plus size={14} /> + Follow-up
                  </button>
                </div>
              </>
            )}
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
                { label: 'Condição', content: <div className="relative"><select className="select" value={propCondition} onChange={e => setPropCondition(e.target.value)}>{PAYMENT_CONDITIONS.map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
                { label: 'Tom', content: <div className="relative"><select className="select" value={propTone} onChange={e => setPropTone(e.target.value)}>{TONES.map(t => <option key={t}>{t}</option>)}</select><ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div> },
              ].map(({ label, content }) => (
                <div key={label}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  {content}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">A proposta usa automaticamente dados do lead: nicho, cidade, reputação, telefone, site e score.</p>
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
              <button onClick={() => copy(propGenerated, () => {})} className="btn-secondary text-sm flex items-center gap-1.5">
                <Copy size={14} /> Copiar
              </button>
              {propLeadObj && propGenerated && (
                <a href={`https://wa.me/${propLeadObj.whatsapp}?text=${encodeURIComponent(propGenerated)}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
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
          <p className="text-gray-400 text-sm">Selecione vários leads e dispare mensagens personalizadas em sequência pelo WhatsApp — com modelos de IA ou texto próprio.</p>
          <p className="text-gray-600 text-xs mt-3">Em breve disponível nesta instância.</p>
        </div>
      )}
    </div>
  )
}
