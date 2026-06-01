import { useState } from 'react'
import { Search, TrendingUp, Clock, Star, MapPin, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'

function KPI({ label, value, color = 'white' }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${color === 'yellow' ? 'text-brand-yellow' : 'text-white'}`}>{value}</p>
    </div>
  )
}

const FUNNEL_STAGES = ['Novo lead', 'Abordado', 'Respondeu', 'Proposta enviada', 'Fechado', 'Perdido']

export default function DashboardPage() {
  const { leads, pipeline, navigate } = useApp()
  const [followupOpen, setFollowupOpen] = useState(false)
  const [msg1, setMsg1] = useState('Olá {nome}, tudo bem? Vi que o {categoria} de vocês em {cidade} ainda não tem presença digital completa...')
  const [msg2, setMsg2] = useState('Oi {nome}, este é meu último contato. Tenho uma proposta especial para o {categoria} de vocês...')
  const [days1, setDays1] = useState(3)
  const [days2, setDays2] = useState(4)

  const avgScore = leads.length > 0
    ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)
    : 0

  const stageCounts = FUNNEL_STAGES.reduce((acc, s) => {
    acc[s] = pipeline.filter(l => l.stage === s.toLowerCase().replace(/ /g, '-')).length
    return acc
  }, {})

  const topLeads = [...leads].sort((a, b) => b.score - a.score).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Painel</h1>
          <p className="text-gray-400 text-sm">Visão rápida do que precisa de atenção agora.</p>
        </div>
        <button onClick={() => navigate('search')} className="btn-primary flex items-center gap-2">
          <Search size={16} /> Buscar oportunidades
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Leads salvos" value={leads.length} />
        <KPI label="No pipeline" value={pipeline.length} />
        <KPI label="Leads sem ação" value={leads.filter(l => !pipeline.find(p => p.id === l.id)).length} />
        <KPI label="Score médio salvo" value={avgScore || '-'} color="yellow" />
      </div>

      {/* Follow-up automático */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-white">Follow-up automático assistido</h2>
          <span className="badge-gray">Usando mensagens padrão</span>
        </div>
        <p className="text-gray-500 text-xs mb-4">
          Configure <button className="text-brand-green hover:underline">[suas mensagens]</button> e os prazos. O sistema te avisa a hora certa de cada retorno e você confirma o envio.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[['Para enviar hoje', '0'], ['Agendados', '0'], ['Responderam', '0'], ['Concluídos', '0']].map(([l, v]) => (
            <div key={l} className="text-center">
              <p className="text-xl font-black text-white">{v}</p>
              <p className="text-xs text-gray-500">{l}</p>
            </div>
          ))}
        </div>

        {/* Fluxo visual */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 flex-wrap">
          <span className="badge-green">1º contato</span>
          <ChevronRight size={12} />
          <span className="badge-gray">Follow-up 1 em {days1} dias</span>
          <ChevronRight size={12} />
          <span className="badge-gray">Follow-up 2 em ~{days1 + days2} dias</span>
        </div>

        <button
          onClick={() => setFollowupOpen(!followupOpen)}
          className="flex items-center gap-2 text-sm text-brand-green hover:underline mb-2"
        >
          ✏️ Personalizar minhas mensagens e prazos
          <ChevronDown size={14} className={`transition-transform ${followupOpen ? 'rotate-180' : ''}`} />
        </button>

        {followupOpen && (
          <div className="space-y-3 mt-3 p-4 bg-[#0d1117] rounded-xl border border-brand-border">
            <p className="text-xs text-gray-500">Variáveis disponíveis: <span className="text-gray-300 font-mono">{'{nome}, {categoria}, {cidade}, {estado}, {avaliacao}, {avaliacoes}'}</span></p>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Sua mensagem de Follow-up 1</label>
              <textarea className="input text-sm h-20 resize-none" value={msg1} onChange={e => setMsg1(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Sua mensagem de Follow-up 2 (último contato)</label>
              <textarea className="input text-sm h-20 resize-none" value={msg2} onChange={e => setMsg2(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Follow-up 1 após (dias)</label>
                <input type="number" className="input" value={days1} onChange={e => setDays1(Number(e.target.value))} min={1} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Follow-up 2 após (dias)</label>
                <input type="number" className="input" value={days2} onChange={e => setDays2(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary text-sm py-1.5">Salvar minhas mensagens</button>
              <button className="btn-secondary text-sm py-1.5 flex items-center gap-1">
                <RotateCcw size={13} /> Restaurar padrão
              </button>
            </div>
            <p className="text-xs text-gray-600">As novas mensagens valem para os próximos envios agendados.</p>
          </div>
        )}

        <button className="btn-secondary text-sm mt-3">Gerenciar follow-ups</button>
      </div>

      {/* Grid: Próximas ações + Funil */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-bold text-white mb-1">Próximas ações</h2>
          <p className="text-gray-500 text-xs mb-4">Leads salvos que ainda não foram enviados para o pipeline.</p>
          {leads.filter(l => !pipeline.find(p => p.id === l.id)).length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Nenhum lead pendente. Busque ou salve novas oportunidades.</p>
          ) : (
            <div className="space-y-2">
              {leads.filter(l => !pipeline.find(p => p.id === l.id)).slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-white">{l.name}</p>
                    <p className="text-xs text-gray-500">{l.nicho}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-green">Score {l.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-white mb-1">Resumo do funil</h2>
          <p className="text-gray-500 text-xs mb-4">Distribuição dos leads em andamento.</p>
          <div className="space-y-2">
            {FUNNEL_STAGES.map(stage => (
              <div key={stage} className="flex items-center justify-between py-1.5 border-b border-brand-border last:border-0">
                <span className="text-sm text-gray-300">{stage}</span>
                <span className="text-sm font-bold text-white">{stageCounts[stage] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Melhores oportunidades */}
      <div className="card p-5">
        <h2 className="font-bold text-white mb-1">Melhores oportunidades</h2>
        <p className="text-gray-500 text-xs mb-4">Leads salvos com maior prioridade comercial.</p>
        {topLeads.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">Salve leads para montar seu painel.</p>
        ) : (
          <div className="space-y-2">
            {topLeads.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl">
                <span className="text-gray-600 text-xs font-bold w-4">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.nicho} · {l.cidade}</p>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={11} className="text-brand-yellow fill-brand-yellow" />
                  <span className="text-gray-400">{l.rating}</span>
                  <span className="ml-2 text-brand-green font-bold">{l.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hospedagem */}
      <div className="card p-5">
        <h2 className="font-bold text-white mb-1">Hospedagem</h2>
        <p className="text-gray-500 text-xs mb-3">Depois que o lead fecha a criação do site, siga o roteiro de publicação para colocar o projeto no ar.</p>
        <p className="text-xs text-gray-600 mb-3">Use esta etapa no pós-venda: domínio, hospedagem, arquivos, SSL, testes e entrega final ao cliente.</p>
        <button className="btn-secondary text-sm">Ver passo a passo</button>
      </div>
    </div>
  )
}
