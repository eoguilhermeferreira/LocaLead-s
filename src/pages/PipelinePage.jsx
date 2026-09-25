import { useState } from 'react'
import { Plus, RotateCcw, Star, MapPin, MessageSquare, GitBranch } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STAGES = [
  { id: 'novo', label: 'Novo lead', color: 'blue' },
  { id: 'abordado', label: 'Abordado', color: 'yellow' },
  { id: 'respondeu', label: 'Respondeu', color: 'purple' },
  { id: 'proposta', label: 'Proposta enviada', color: 'orange' },
  { id: 'fechado', label: 'Fechado', color: 'green' },
  { id: 'perdido', label: 'Perdido', color: 'red' },
]

const STAGE_COLORS = {
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  green: 'bg-brand-wine/20 text-brand-wine border-brand-wine/20',
  red: 'bg-red-500/20 text-red-400 border-red-500/20',
}

export default function PipelinePage() {
  const { pipeline, movePipelineStage, navigate, leads } = useApp()

  const kpis = {
    total: pipeline.length,
    andamento: pipeline.filter(l => !['fechado', 'perdido'].includes(l.stage)).length,
    proposta: pipeline.filter(l => l.stage === 'proposta').length,
    fechado: pipeline.filter(l => l.stage === 'fechado').length,
    score: pipeline.length > 0 ? Math.round(pipeline.reduce((s, l) => s + l.score, 0) / pipeline.length) : 0,
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Pipeline</h1>
          <p className="text-gray-400 text-sm">Mini CRM para acompanhar cada lead até o fechamento.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('search')} className="btn-primary text-sm flex items-center gap-1.5">
            <Plus size={14} /> Adicionar oportunidades
          </button>
          <button className="btn-secondary text-sm flex items-center gap-1.5">
            <RotateCcw size={14} /> Resetar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: kpis.total },
          { label: 'Em andamento', value: kpis.andamento },
          { label: 'Propostas', value: kpis.proposta },
          { label: 'Fechados', value: kpis.fechado },
          { label: 'Score médio', value: kpis.score || '-', yellow: true },
        ].map(({ label, value, yellow }) => (
          <div key={label} className="card p-3 text-center">
            <p className={`text-xl font-black ${yellow ? 'text-brand-yellow' : 'text-white'}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Instrução */}
      <div className="flex items-start gap-2 p-3 bg-brand-card rounded-xl border border-brand-border text-xs text-gray-400">
        <GitBranch size={14} className="text-brand-wine flex-shrink-0 mt-0.5" />
        <span>Mova cada lead conforme a conversa avança. Use 'Mensagem', 'WhatsApp' e 'Proposta' para agir sem sair do pipeline. <strong className="text-white">Fluxo recomendado:</strong> Novo → Abordado → Respondeu → Proposta → Fechado</span>
      </div>

      {pipeline.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-brand-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border">
            <GitBranch size={24} className="text-gray-500" />
          </div>
          <h3 className="font-bold text-white mb-2">Nenhum lead no pipeline ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Envie um lead salvo para o pipeline ou adicione oportunidades pela busca.</p>
          <button onClick={() => navigate('search')} className="btn-primary mx-auto">Buscar oportunidades</button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGES.map(stage => {
              const stageLeads = pipeline.filter(l => (l.stage || 'novo') === stage.id)
              return (
                <div key={stage.id} className="w-64">
                  <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl border ${STAGE_COLORS[stage.color]} mb-2`}>
                    <span className="text-xs font-semibold">{stage.label}</span>
                    <span className="text-xs font-bold">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <div key={lead.id} className="card p-3">
                        <p className="text-sm font-semibold text-white mb-1 truncate">{lead.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <Star size={10} className="text-brand-yellow fill-brand-yellow" />
                          <span>{lead.rating}</span>
                          <MapPin size={10} />
                          <span>{lead.cidade}</span>
                        </div>
                        <div className="flex gap-1">
                          <a
                            href={`https://wa.me/${lead.whatsapp}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400"
                          >
                            <MessageSquare size={10} /> WhatsApp
                          </a>
                          <div className="relative group">
                            <button className="text-[10px] px-2 py-1 rounded-lg bg-brand-card border border-brand-border text-gray-400">
                              Mover →
                            </button>
                            <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-[#180a0e] border border-brand-border rounded-xl p-1.5 z-10 shadow-xl w-40">
                              {STAGES.filter(s => s.id !== stage.id).map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => movePipelineStage(lead.id, s.id)}
                                  className="block w-full text-left text-xs px-2 py-1.5 hover:bg-brand-card rounded-lg text-gray-300"
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="card p-4 border-dashed text-center">
                        <p className="text-xs text-gray-600">Vazio</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
