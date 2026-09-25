import { RefreshCw, Pin } from 'lucide-react'

const NOTICES = [
  {
    id: 1,
    category: 'Novidade',
    fixed: true,
    isNew: true,
    date: '28 de maio de 2026',
    title: 'Disparo em massa no WhatsApp chega ao plano Pro',
    excerpt: 'Agora você pode selecionar vários leads e disparar mensagens personalizadas em sequência diretamente pelo WhatsApp, com modelos de IA ou texto próprio.',
    action: { label: 'Abrir Mensagens IA', page: 'messages' },
  },
  {
    id: 2,
    category: 'Novidade',
    fixed: true,
    isNew: false,
    date: '27 de maio de 2026',
    title: 'Bem-vindo ao Canal de Avisos da LocaLead\'s',
    excerpt: 'Este canal centraliza todas as atualizações, novidades e comunicados oficiais da plataforma. Acompanhe aqui tudo o que muda.',
    action: null,
  },
  {
    id: 3,
    category: 'Atualização',
    fixed: false,
    isNew: false,
    date: '25 de maio de 2026',
    title: 'Construtor de Sites: crie sites a partir dos seus leads',
    excerpt: 'O novo construtor de sites permite gerar páginas profissionais em minutos usando os dados do lead como base — nicho, cidade, avaliações e mais.',
    action: { label: 'Abrir o Construtor', page: 'builder' },
  },
  {
    id: 4,
    category: 'Novidade',
    fixed: false,
    isNew: false,
    date: '23 de maio de 2026',
    title: 'Planos anuais com até 2 meses grátis',
    excerpt: 'Assine qualquer plano no modo anual e economize o equivalente a 2 mensalidades. Ideal para quem quer consistência na prospecção.',
    action: { label: 'Ver planos', page: 'billing' },
  },
  {
    id: 5,
    category: 'Atualização',
    fixed: false,
    isNew: false,
    date: '19 de maio de 2026',
    title: 'Mensagens IA mais persuasivas',
    excerpt: 'Ajustamos os modelos de IA para gerar abordagens mais naturais, personalizadas e com melhor taxa de resposta nos nichos de maior demanda.',
    action: { label: 'Abrir Mensagens IA', page: 'messages' },
  },
]

export default function NoticesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Canal de Avisos</h1>
          <p className="text-gray-400 text-sm">Novidades, atualizações e comunicados oficiais da LocaLead's.</p>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2">
          <RefreshCw size={14} /> Atualizar avisos
        </button>
      </div>

      <div className="space-y-4">
        {NOTICES.map(notice => (
          <div key={notice.id} className={`card p-5 ${notice.fixed ? 'border-brand-wine/20 bg-brand-wine/5' : ''}`}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${notice.category === 'Novidade' ? 'badge-green' : 'badge-gray'}`}>
                {notice.category}
              </span>
              {notice.fixed && (
                <span className="flex items-center gap-1 text-xs text-brand-yellow bg-yellow-500/10 px-2.5 py-1 rounded-full">
                  <Pin size={10} /> Fixado
                </span>
              )}
              {notice.isNew && (
                <span className="badge-red">NOVO</span>
              )}
              <span className="text-xs text-gray-500 ml-auto">{notice.date}</span>
            </div>

            <h3 className="font-bold text-white mb-2">{notice.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">{notice.excerpt}</p>

            {notice.action && (
              <a
                href={`?page=${notice.action.page}`}
                className="text-brand-wine text-sm hover:underline font-medium"
                onClick={e => { e.preventDefault(); window.history.pushState({}, '', `?page=${notice.action.page}`); window.location.reload() }}
              >
                {notice.action.label} →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
