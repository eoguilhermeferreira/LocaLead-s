import { useState } from 'react'
import { Search, Star, MapPin, Phone, Globe, MessageSquare, Bookmark, GitBranch, Copy, X, Lightbulb, ChevronDown, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { NICHOS, ESTADOS, CIDADES_POR_ESTADO } from '../data/nichos'
import { generateMockLeads } from '../data/mockLeads'

function MetricCard({ label, value, color = 'green' }) {
  const colors = { green: 'text-brand-wine', yellow: 'text-brand-yellow' }
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${colors[color]}`}>{value}</p>
    </div>
  )
}

function ScoreBadge({ score }) {
  const color = score >= 85 ? 'bg-brand-wine/20 text-brand-wine' :
    score >= 70 ? 'bg-blue-500/20 text-blue-400' :
    'bg-gray-700/50 text-gray-400'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  )
}

function LeadCard({ lead, selected, onClick, onSave, onPipeline }) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 cursor-pointer transition-all hover:border-brand-wine/40 ${selected ? 'border-brand-wine/60 bg-brand-wine/5' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white text-sm leading-tight">{lead.name}</h3>
        <ScoreBadge score={lead.score} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${lead.hasSite ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
          {lead.hasSite ? '🌐 Com site' : '⚠️ Sem site detectado'}
        </span>
        <span className="badge-green text-xs">{lead.opportunityLevel}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Star size={11} className="text-brand-yellow fill-brand-yellow" />
          {lead.rating} ({lead.reviews})
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {lead.cidade}, {lead.estado}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={e => { e.stopPropagation(); onSave(lead) }}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border hover:border-brand-wine/40 transition-colors text-gray-300"
        >
          <Bookmark size={12} /> Salvar
        </button>
        <button
          onClick={e => { e.stopPropagation(); onPipeline(lead) }}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-brand-wine/10 border border-brand-wine/20 hover:bg-brand-wine/20 transition-colors text-brand-wine"
        >
          <GitBranch size={12} /> Pipeline
        </button>
      </div>
    </div>
  )
}

const IA_TYPES = ['Diagnóstico', 'Abrir WhatsApp', 'Proposta', 'Estrutura do site', 'Copy da landing', 'Catálogo inicial', '✨ Prompt Site']

const IA_CONTENT = {
  'Diagnóstico': (lead) => `📊 DIAGNÓSTICO DIGITAL — ${lead.name}

Empresa: ${lead.name}
Nicho: ${lead.nicho}
Localização: ${lead.cidade}/${lead.estado}
Score digital: ${lead.score}/100
Avaliação: ${lead.rating}⭐ (${lead.reviews} avaliações)
Presença digital: ${lead.hasSite ? '✅ Possui site' : '❌ Sem site detectado'}

📌 OPORTUNIDADE:
${lead.hasSite
  ? `O negócio possui site mas pode melhorar conversão. Com ${lead.reviews} avaliações e nota ${lead.rating}, há potencial para otimização digital.`
  : `Empresa SEM site identificada com ${lead.reviews} avaliações no Google. Score ${lead.score}/100 indica alta oportunidade para criação de presença digital.`
}

💡 RECOMENDAÇÃO:
${lead.score >= 70 ? 'Alta prioridade de abordagem — negócio ativo com boa reputação e gap digital claro.' : 'Oportunidade de entrada com oferta inicial para validar interesse.'}`,

  'Abrir WhatsApp': (lead) => `Olá, tudo bem? Somos a NODEX, uma Agência de Marketing Digital. Trabalhamos com criação de sites para negócios locais como o ${lead.name}.

Vi que vocês têm ${lead.reviews} avaliações no Google e uma nota ${lead.rating} — isso é ótimo! ${lead.hasSite ? 'Acredito que podemos deixar seu site ainda mais eficiente para converter mais clientes.' : 'Percebi que o negócio ainda não tem um site profissional, o que pode estar limitando o crescimento.'}

Tenho uma proposta rápida que quero te mostrar. Posso te enviar em 2 minutos?`,

  'Proposta': (lead) => `📋 PROPOSTA COMERCIAL

Para: ${lead.name} | ${lead.cidade}/${lead.estado}
Data: ${new Date().toLocaleDateString('pt-BR')}

🎯 OBJETIVO: ${lead.hasSite ? 'Otimização e modernização do site atual' : 'Criação de site profissional'}

📦 O QUE ESTÁ INCLUÍDO:
• Landing page profissional responsiva
• Integração com WhatsApp e Google Maps
• Formulário de contato
• Galeria de fotos do negócio
• Depoimentos de clientes
• Otimização para buscas locais (SEO)

💰 INVESTIMENTO: R$ 997,00
📅 PRAZO: 5 dias úteis
💳 CONDIÇÃO: 50% para iniciar + 50% na entrega

✅ GARANTIA: 30 dias de suporte pós-entrega`,

  'Estrutura do site': (lead) => `🏗️ ESTRUTURA DO SITE — ${lead.name}

1. HERO (Topo)
   - Logo + nome do negócio
   - Headline principal com benefício claro
   - CTA: "Falar pelo WhatsApp"

2. SOBRE NÓS
   - História da empresa
   - Diferenciais (${lead.reviews} avaliações ${lead.rating}⭐)

3. SERVIÇOS
   - Lista de ${lead.nicho} oferecidos
   - Cards com descrição e preço (opcional)

4. GALERIA
   - Fotos do ambiente e trabalhos

5. DEPOIMENTOS
   - 3-5 avaliações reais do Google

6. LOCALIZAÇÃO
   - Google Maps embed
   - Endereço: ${lead.address}
   - Horário de funcionamento

7. CTA FINAL
   - WhatsApp flutuante
   - Botão "Agendar agora"`,

  'Copy da landing': (lead) => `🔥 COPY — ${lead.name}

HEADLINE:
"${lead.nicho} de qualidade em ${lead.cidade} — ${lead.rating}⭐ no Google"

SUBHEADLINE:
"Mais de ${lead.reviews} clientes satisfeitos. Agende agora e receba atendimento prioritário."

BENEFÍCIOS:
✅ Profissionais especializados em ${lead.nicho}
✅ Atendimento rápido e personalizado
✅ Localizado em ${lead.cidade}
✅ Avaliado com ${lead.rating} estrelas no Google

CTA: "AGENDAR PELO WHATSAPP →"

URGÊNCIA: "Vagas limitadas esta semana"`,

  'Catálogo inicial': (lead) => `📱 CATÁLOGO INICIAL — ${lead.name}

Capa: Logo + Nome + Cidade
Cores sugeridas: Verde/Branco ou Azul/Dourado

PÁGINAS:
1. Apresentação do negócio
2. Principais serviços de ${lead.nicho}
3. Diferenciais e prêmios
4. Antes e depois / galeria
5. Avaliações (${lead.reviews} clientes)
6. Tabela de preços (opcional)
7. Localização e contato
8. WhatsApp para agendamento

RODAPÉ: "Siga no Instagram | WhatsApp: ${lead.phone}"`,

  '✨ Prompt Site': (lead) => `[PROMPT PARA IA — GERAÇÃO DE SITE]

Crie um site profissional para o seguinte negócio:

Nome: ${lead.name}
Nicho: ${lead.nicho}
Cidade: ${lead.cidade}, ${lead.estado}
Telefone: ${lead.phone}
Endereço: ${lead.address}
Avaliação Google: ${lead.rating}⭐ (${lead.reviews} avaliações)
${lead.hasSite ? 'Site atual: substituir por versão moderna' : 'Primeiro site: criar do zero'}

REQUISITOS:
- Design moderno e responsivo (mobile-first)
- Cores baseadas no nicho: ${lead.nicho}
- Seções: hero, serviços, galeria, depoimentos, contato
- Integração WhatsApp: wa.me/${lead.whatsapp}
- Google Maps: ${lead.address}
- Fonte: Inter ou Poppins
- CTA principal: WhatsApp no hero e rodapé`,
}

function LeadDetail({ lead, onClose, onSave, onPipeline }) {
  const [iaTab, setIaTab] = useState('Diagnóstico')
  const [copied, setCopied] = useState(false)

  const content = IA_CONTENT[iaTab]?.(lead) || ''

  const copyContent = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card p-5 h-full overflow-y-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold text-white text-lg leading-tight">{lead.name}</h2>
          <p className="text-gray-400 text-sm">{lead.nicho} · {lead.cidade}, {lead.estado}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      {/* Score e badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-brand-wine/20 text-brand-wine font-bold px-3 py-1 rounded-full text-sm">
          Score {lead.score}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${lead.hasSite ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
          {lead.hasSite ? '🌐 Com site' : '⚠️ Sem site'}
        </span>
        <span className="badge-green">{lead.priority} prioridade</span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Star size={14} className="text-brand-yellow fill-brand-yellow flex-shrink-0" />
          <span>{lead.rating}⭐ · {lead.reviews} avaliações</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Phone size={14} className="text-gray-400 flex-shrink-0" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span>{lead.address}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button onClick={() => onSave(lead)} className="btn-secondary text-sm py-2 flex items-center justify-center gap-1.5">
          <Bookmark size={14} /> Salvar lead
        </button>
        <button onClick={() => onPipeline(lead)} className="btn-primary text-sm py-2 flex items-center justify-center gap-1.5">
          <GitBranch size={14} /> Pipeline
        </button>
        <a
          href={lead.mapsUrl} target="_blank" rel="noopener noreferrer"
          className="btn-secondary text-sm py-2 flex items-center justify-center gap-1.5"
        >
          <MapPin size={14} /> Google Maps
        </a>
        <a
          href={`https://wa.me/${lead.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 font-medium transition-colors"
        >
          <MessageSquare size={14} /> WhatsApp
        </a>
      </div>

      {/* Pacote IA */}
      <div className="border border-brand-border rounded-xl p-4 bg-[#09090b]/50">
        <div className="mb-3">
          <h3 className="font-bold text-white text-sm mb-0.5">Pacote IA do Lead</h3>
          <p className="text-gray-500 text-xs">Diagnóstico, abordagem, proposta e copy prontos para copiar.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {IA_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setIaTab(t)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${iaTab === t ? 'bg-brand-wine text-black font-semibold' : 'bg-brand-card border border-brand-border text-gray-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea
          readOnly
          value={content}
          className="w-full bg-[#100508] border border-brand-border rounded-lg p-3 text-xs text-gray-300 font-mono resize-none h-48 focus:outline-none"
        />

        <div className="flex gap-2 mt-2">
          <button onClick={copyContent} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-brand-wine text-black' : 'bg-brand-card border border-brand-border text-gray-300 hover:border-brand-wine/40'}`}>
            <Copy size={12} /> {copied ? 'Copiado!' : 'Copiar conteúdo IA'}
          </button>
          <a
            href={`https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(IA_CONTENT['Abrir WhatsApp'](lead))}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 transition-colors"
          >
            <MessageSquare size={12} /> Gerar WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const { searchResults, setSearchResults, saveLead, sendToPipeline, navigate } = useApp()
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [nicho, setNicho] = useState('')
  const [status, setStatus] = useState('todos')
  const [scoreMin, setScoreMin] = useState('todos')
  const [qty, setQty] = useState('10')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [searchError, setSearchError] = useState(null)

  const cidades = estado ? (CIDADES_POR_ESTADO[estado] || []) : []

  const doSearch = async () => {
    setLoading(true)
    setSelected(null)
    setSearchError(null)

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uyhqkdmbzvswrdlujxmp.supabase.co'
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aHFrZG1ienZzd3JkbHVqeG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODcyOTIsImV4cCI6MjA5ODA2MzI5Mn0.ffC6ARhkP_C6lqTiOeJdtLVvv7KEk1ZBCUY5cEj3Pvw'

    if (supabaseUrl && supabaseKey) {
      try {
        const resp = await fetch(`${supabaseUrl}/functions/v1/search-leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            nicho: nicho || null,
            cidade: cidade || 'São Paulo',
            estado: estado || 'SP',
            qty: parseInt(qty),
            status,
            scoreMin,
          }),
        })
        const data = await resp.json()
        if (data.error) {
          setSearchError(data.error)
          setSearchResults([])
          setLoading(false)
          return
        }
        if (data.leads) {
          setSearchResults(data.leads)
          setLoading(false)
          return
        }
      } catch (e) {
        setSearchError('Erro ao conectar com o servidor. Tente novamente.')
        setSearchResults([])
        setLoading(false)
        return
      }
    }

    setSearchError('Configuração do servidor não encontrada.')
    setSearchResults([])
    setLoading(false)
  }

  const handleSearch = () => {
    doSearch()
  }

  const metrics = searchResults.length > 0 ? {
    found: searchResults.length,
    qualified: searchResults.filter(l => l.score >= 70).length,
    avgScore: Math.round(searchResults.reduce((s, l) => s + l.score, 0) / searchResults.length),
    noSite: searchResults.filter(l => !l.hasSite).length,
  } : null

  return (
    <div>
      {/* Hero Banner */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-brand-wine/5 to-transparent border-brand-wine/20">
        <span className="badge-green mb-3 inline-block">Prospecção local com IA</span>
        <h1 className="text-3xl font-black text-white mb-4">
          Leads locais <span className="text-brand-wine">com potencial.</span>
        </h1>
        {metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Oportunidades encontradas" value={metrics.found} />
            <MetricCard label="Leads qualificados" value={metrics.qualified} />
            <MetricCard label="Score médio" value={metrics.avgScore} color="yellow" />
            <MetricCard label="Sem site detectado" value={metrics.noSite} />
          </div>
        ) : (
          <p className="text-gray-400">Configure os filtros abaixo e encontre seus próximos clientes.</p>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Search form */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-white">Buscar oportunidades</h2>
                <p className="text-gray-500 text-xs mt-0.5">Configure os filtros para uma busca precisa</p>
              </div>
              <div className="flex gap-2">
                {searchResults.length > 0 && (
                  <button onClick={() => { setSearchResults([]); setSelected(null) }} className="btn-secondary text-xs py-1.5 px-3">
                    Limpar busca
                  </button>
                )}
                <button onClick={handleSearch} disabled={loading} className="btn-primary text-sm py-2 px-4 flex items-center gap-2 disabled:opacity-60">
                  <Search size={15} /> {loading ? 'Buscando...' : 'Buscar oportunidades'}
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Estado</label>
                <div className="relative">
                  <select className="select" value={estado} onChange={e => { setEstado(e.target.value); setCidade('') }}>
                    <option value="">Todos os estados</option>
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Cidade</label>
                <div className="relative">
                  <select className="select" value={cidade} onChange={e => setCidade(e.target.value)} disabled={!estado}>
                    <option value="">Selecione a cidade</option>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nicho</label>
                <div className="relative">
                  <select className="select" value={nicho} onChange={e => setNicho(e.target.value)}>
                    <option value="">Todos os nichos</option>
                    {NICHOS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status digital</label>
                <div className="relative">
                  <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="sem-site">Sem site</option>
                    <option value="com-site">Com site</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Score mínimo</label>
                <div className="relative">
                  <select className="select" value={scoreMin} onChange={e => setScoreMin(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="40">40+</option>
                    <option value="70">70+</option>
                    <option value="85">85+ (BASE+)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Quantidade</label>
                <div className="relative">
                  <select className="select" value={qty} onChange={e => setQty(e.target.value)}>
                    {['10','20','30','50'].map(q => <option key={q} value={q}>{q} leads</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dica contextual */}
            {estado && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <Lightbulb size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Em cidades grandes, use filtros de nicho para resultados mais precisos e oportunidades de maior qualidade.
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            <h2 className="font-bold text-white mb-3">
              {loading ? 'Buscando oportunidades reais...' : searchResults.length > 0 ? `${searchResults.length} resultados` : 'Resultados'}
            </h2>

            {loading && (
              <div className="card p-8 text-center">
                <div className="w-8 h-8 border-2 border-brand-wine border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Buscando oportunidades reais...</p>
                <p className="text-gray-500 text-xs mt-1">Varredura por região, nicho e presença digital...</p>
              </div>
            )}

            {!loading && searchError && (
              <div className="card p-8 text-center border-red-500/20">
                <p className="text-red-400 font-semibold mb-1">Erro na busca</p>
                <p className="text-gray-500 text-sm">{searchError}</p>
              </div>
            )}

            {!loading && !searchError && searchResults.length === 0 && (
              <div className="card p-10 text-center">
                <div className="w-16 h-16 bg-brand-wine/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-brand-wine" />
                </div>
                <h3 className="font-bold text-white mb-2">Pronto para buscar oportunidades</h3>
                <p className="text-gray-500 text-sm">Configure os filtros acima e clique em "Buscar oportunidades".</p>
              </div>
            )}

            {!loading && searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selected?.id === lead.id}
                    onClick={() => setSelected(lead)}
                    onSave={saveLead}
                    onPipeline={sendToPipeline}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — lead detail */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selected ? (
            <LeadDetail
              lead={selected}
              onClose={() => setSelected(null)}
              onSave={saveLead}
              onPipeline={sendToPipeline}
            />
          ) : (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-brand-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border">
                <MapPin size={24} className="text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-400 mb-2">Demonstração visual do mapa</h3>
              <p className="text-gray-600 text-xs">Veja como as oportunidades aparecem organizadas por região. Clique em um lead para ver detalhes.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
