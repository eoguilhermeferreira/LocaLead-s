import { HelpCircle, Search, Play, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const FAQS = [
  { q: 'Como fazer minha primeira busca?', a: 'Acesse "Buscar Oportunidades", selecione estado, cidade e nicho, depois clique em "Buscar oportunidades".' },
  { q: 'Como salvar um lead?', a: 'Após buscar, clique em "Salvar lead" em qualquer card da lista. O lead vai para "Meus Leads".' },
  { q: 'O que é o Pipeline Comercial?', a: 'É um mini-CRM onde você move os leads por etapas: Novo → Abordado → Respondeu → Proposta → Fechado.' },
  { q: 'Como gerar mensagens com IA?', a: 'Vá em "Mensagens IA", selecione um lead salvo, escolha o tipo e tom, e clique em "Gerar mensagem".' },
  { q: 'Como assinar um plano?', a: 'Acesse "Assinatura", escolha o plano e período (mensal ou anual), depois clique em "Escolher plano".' },
  { q: 'O que é o score do lead?', a: 'O score (0-100) indica o nível de oportunidade: presença digital, avaliações, volume de reviews e outros fatores.' },
]

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card p-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-white">{q}</p>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && <p className="text-sm text-gray-400 mt-2 pt-2 border-t border-brand-border">{a}</p>}
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Ajuda & Tutoriais</h1>
        <p className="text-gray-400 text-sm">Central de suporte e materiais de aprendizado.</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { icon: '🔍', title: 'Como buscar leads', desc: 'Guia de busca' },
          { icon: '💬', title: 'Mensagens IA', desc: 'Gerar abordagens' },
          { icon: '🔗', title: 'Pipeline', desc: 'Usar o mini-CRM' },
          { icon: '💳', title: 'Planos e preços', desc: 'Entender planos' },
          { icon: '🔧', title: 'Construtor', desc: 'Criar sites' },
          { icon: '📢', title: 'Novidades', desc: 'Canal de avisos' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="card p-4 hover:border-brand-wine/30 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-gray-500">{desc}</p>
            <ChevronRight size={14} className="text-brand-wine mt-2" />
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <h2 className="font-bold text-white mb-3">Perguntas frequentes</h2>
        <div className="space-y-2">
          {FAQS.map(faq => <FAQ key={faq.q} {...faq} />)}
        </div>
      </div>

      {/* Contact */}
      <div className="card p-5">
        <h2 className="font-bold text-white mb-1">Ainda com dúvidas?</h2>
        <p className="text-gray-400 text-sm mb-3">Nossa equipe está pronta para ajudar você a extrair o máximo da plataforma.</p>
        <div className="flex gap-3">
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-1.5">
            💬 WhatsApp
          </a>
          <a href="mailto:suporte@localead.com.br" className="btn-secondary text-sm">E-mail</a>
        </div>
      </div>
    </div>
  )
}
