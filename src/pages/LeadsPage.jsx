import { useState } from 'react'
import { Search, Download, RotateCcw, Star, MapPin, Phone, Lock, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'

function UnlockModal({ onClose, navigate }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="card p-6 w-full max-w-md shadow-2xl">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle size={24} className="text-yellow-400" />
          </div>
          <h3 className="font-bold text-white text-lg">Desbloqueie seus leads</h3>
          <p className="text-gray-400 text-sm mt-2">
            Para acessar telefone, WhatsApp, score ajustável, mensagens com IA, pipeline e lista completa de oportunidades, escolha um plano.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">Continuar vendo teste</button>
          <button onClick={() => { onClose(); navigate('billing') }} className="btn-primary flex-1 text-sm">Liberar meus leads agora</button>
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const { leads, navigate } = useApp()
  const [showUnlock, setShowUnlock] = useState(false)
  const [filter, setFilter] = useState('todos')

  const filtered = leads.filter(l => {
    if (filter === 'score') return l.score >= 70
    if (filter === 'telefone') return !!l.phone
    if (filter === 'sem-site') return !l.hasSite
    return true
  })

  return (
    <div className="space-y-5">
      {showUnlock && <UnlockModal onClose={() => setShowUnlock(false)} navigate={navigate} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Meus Leads</h1>
          <p className="text-gray-400 text-sm">Gerencie as oportunidades salvas e avance os melhores leads.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate('search')} className="btn-secondary text-sm flex items-center gap-1.5">
            <Search size={14} /> Buscar mais
          </button>
          <button onClick={() => setShowUnlock(true)} className="btn-secondary text-sm flex items-center gap-1.5">
            <Download size={14} /> Baixar Excel
          </button>
          <button className="btn-secondary text-sm flex items-center gap-1.5">
            <RotateCcw size={14} /> Resetar
          </button>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todos', label: `Leads salvos (${leads.length})` },
          { id: 'score', label: `Score alto (${leads.filter(l => l.score >= 70).length})` },
          { id: 'telefone', label: `Com telefone (${leads.filter(l => l.phone).length})` },
          { id: 'sem-site', label: `Sem site (${leads.filter(l => !l.hasSite).length})` },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`text-sm px-3 py-1.5 rounded-xl border transition-colors ${filter === id ? 'bg-brand-green/10 border-brand-green/40 text-brand-green' : 'border-brand-border text-gray-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-brand-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border">
            <Lock size={24} className="text-gray-500" />
          </div>
          <h3 className="font-bold text-white mb-2">Nenhum lead salvo ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Busque oportunidades e salve os melhores leads para montar sua lista.</p>
          <button onClick={() => navigate('search')} className="btn-primary mx-auto">Buscar oportunidades</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  {['Nome', 'Nicho', 'Cidade', 'Score', 'Avaliação', 'Site', 'Contato'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-brand-border/50 hover:bg-brand-card transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.priority} prioridade</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{lead.nicho}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin size={11} /> {lead.cidade}, {lead.estado}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${lead.score >= 85 ? 'text-brand-green' : lead.score >= 70 ? 'text-blue-400' : 'text-gray-400'}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-brand-yellow fill-brand-yellow" />
                        <span className="text-gray-300">{lead.rating}</span>
                        <span className="text-gray-500">({lead.reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${lead.hasSite ? 'text-blue-400' : 'text-orange-400'}`}>
                        {lead.hasSite ? 'Tem site' : 'Sem site'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setShowUnlock(true)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        <Lock size={12} /> <Phone size={12} /> Ver contato
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
