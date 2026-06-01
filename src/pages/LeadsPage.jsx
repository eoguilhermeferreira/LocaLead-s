import { useState } from 'react'
import { Search, Download, RotateCcw, Star, MapPin, Phone } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function LeadsPage() {
  const { leads, navigate } = useApp()
  const [filter, setFilter] = useState('todos')

  const filtered = leads.filter(l => {
    if (filter === 'score') return l.score >= 70
    if (filter === 'telefone') return !!l.phone
    if (filter === 'sem-site') return !l.hasSite
    return true
  })

  const downloadCSV = () => {
    const headers = ['Nome', 'Nicho', 'Cidade', 'Estado', 'Score', 'Avaliação', 'Reviews', 'Site', 'Telefone', 'WhatsApp', 'Endereço', 'Prioridade']
    const rows = filtered.map(l => [
      `"${l.name || ''}"`,
      `"${l.nicho || ''}"`,
      `"${l.cidade || ''}"`,
      `"${l.estado || ''}"`,
      l.score || '',
      l.rating || '',
      l.reviews || '',
      l.hasSite ? 'Tem site' : 'Sem site',
      `"${l.phone || ''}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.address || ''}"`,
      `"${l.priority || ''}"`,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Meus Leads</h1>
          <p className="text-gray-400 text-sm">Gerencie as oportunidades salvas e avance os melhores leads.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate('search')} className="btn-secondary text-sm flex items-center gap-1.5">
            <Search size={14} /> Buscar mais
          </button>
          <button onClick={downloadCSV} className="btn-secondary text-sm flex items-center gap-1.5">
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
            className={`text-sm px-3 py-1.5 rounded-xl border transition-colors ${filter === id ? 'bg-brand-wine/10 border-brand-wine/40 text-brand-wine' : 'border-brand-border text-gray-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-brand-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border">
            <Phone size={24} className="text-gray-500" />
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
                      <span className={`font-bold text-sm ${lead.score >= 85 ? 'text-brand-wine' : lead.score >= 70 ? 'text-blue-400' : 'text-gray-400'}`}>
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
                      <div className="flex items-center gap-1 text-xs text-gray-300">
                        <Phone size={12} /> {lead.phone || '—'}
                      </div>
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
