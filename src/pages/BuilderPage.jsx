import { ExternalLink, Wrench, Lightbulb, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

const LOVABLE_URL = 'https://lovable.dev'

const PROMPTS = [
  {
    label: 'Site para restaurante',
    prompt: 'Crie um site profissional para um restaurante brasileiro com cardápio, galeria de fotos, localização, horário de funcionamento, botão de reserva pelo WhatsApp e depoimentos de clientes. Use cores quentes e design moderno.',
  },
  {
    label: 'Site para salão de beleza',
    prompt: 'Crie um site elegante para um salão de beleza com lista de serviços e preços, galeria antes/depois, agendamento pelo WhatsApp, mapa de localização e depoimentos. Use cores rosê e design feminino sofisticado.',
  },
  {
    label: 'Site para clínica / consultório',
    prompt: 'Crie um site profissional para uma clínica médica/consultório com apresentação do profissional, especialidades, agendamento online pelo WhatsApp, convênios aceitos e localização. Design limpo e confiável.',
  },
  {
    label: 'Site para academia / personal',
    prompt: 'Crie um site moderno para uma academia ou personal trainer com planos e preços, modalidades oferecidas, galeria da estrutura, depoimentos de alunos e formulário de contato. Design energético com tons escuros.',
  },
  {
    label: 'Site para loja / comércio',
    prompt: 'Crie um site para uma loja local com catálogo de produtos em destaque, promoções, localização, horário de atendimento e botão de contato pelo WhatsApp. Design limpo e comercial.',
  },
  {
    label: 'Site para prestador de serviços',
    prompt: 'Crie um site para um prestador de serviços autônomo (ex: eletricista, encanador, pintor) com serviços oferecidos, área de atendimento, fotos de trabalhos realizados, depoimentos e botão WhatsApp para orçamento.',
  },
]

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
}

export default function BuilderPage() {
  const { leads } = useApp()

  const openLovable = () => {
    window.open(LOVABLE_URL, '_blank', 'noopener,noreferrer')
  }

  const usePrompt = (prompt) => {
    copyToClipboard(prompt)
    window.open(LOVABLE_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Wrench size={24} className="text-brand-wine" /> Construção de Sites
        </h1>
        <p className="text-gray-400 text-sm">Crie sites profissionais para seus clientes usando o Lovable — IA que gera sites completos em minutos.</p>
      </div>

      {/* Lovable CTA */}
      <div className="card p-6 border-brand-wine/30">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-black text-white">Lovable</span>
              <span className="badge-green">Recomendado</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Cole um prompt descrevendo o negócio do seu cliente e o Lovable gera um site completo, responsivo e pronto para publicar.
            </p>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {['Site completo em minutos', 'Design profissional', 'Totalmente responsivo', 'Pronto para publicar'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-gray-300">
                  <Check size={12} className="text-brand-wine flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={openLovable} className="btn-primary flex items-center gap-2">
          <ExternalLink size={16} /> Abrir Lovable
        </button>
      </div>

      {/* Prompts prontos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-brand-wine" />
          <h2 className="font-bold text-white">Prompts prontos por nicho</h2>
        </div>
        <p className="text-gray-400 text-sm mb-4">Clique em "Usar prompt" para copiar e abrir o Lovable já com o texto no clipboard.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {PROMPTS.map(({ label, prompt }) => (
            <div key={label} className="card p-4">
              <p className="font-semibold text-white text-sm mb-2">{label}</p>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{prompt}</p>
              <button
                onClick={() => usePrompt(prompt)}
                className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"
              >
                <ExternalLink size={12} /> Usar prompt
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt a partir de lead salvo */}
      {leads.length > 0 && (
        <div className="card p-5">
          <h2 className="font-bold text-white mb-1">Criar site para um lead salvo</h2>
          <p className="text-gray-400 text-sm mb-3">Gere um prompt personalizado com os dados do lead e cole no Lovable.</p>
          <div className="space-y-2">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between gap-3 py-2 border-b border-brand-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.nicho} · {lead.cidade}/{lead.estado}</p>
                </div>
                <button
                  onClick={() => usePrompt(
                    `Crie um site profissional para "${lead.name}", um negócio do segmento de ${lead.nicho} localizado em ${lead.cidade}, ${lead.estado}. O negócio tem nota ${lead.rating} no Google com ${lead.reviews} avaliações. ${lead.hasSite ? 'Modernize o visual para ser mais atrativo.' : 'É a primeira presença digital deles.'} Inclua: apresentação do negócio, serviços, galeria, depoimentos, mapa/localização e botão de contato pelo WhatsApp. Design moderno, responsivo e profissional.`
                  )}
                  className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 whitespace-nowrap"
                >
                  <ExternalLink size={12} /> Gerar site
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
