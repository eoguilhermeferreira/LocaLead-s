import { useState } from 'react'
import { ExternalLink, Wrench, Lightbulb, Check, Building2, Megaphone, ShoppingBag } from 'lucide-react'
import { useApp } from '../context/AppContext'

const LOVABLE_URL = 'https://lovable.dev'

const TIPOS = [
  { key: 'institucional', label: 'Site Institucional', icon: Building2, desc: 'Para empresas, clínicas, escritórios e prestadores de serviço' },
  { key: 'landing', label: 'Landing Page', icon: Megaphone, desc: 'Para captura de leads, vendas e promoções' },
  { key: 'loja', label: 'Loja Virtual', icon: ShoppingBag, desc: 'Para e-commerce e venda de produtos online' },
]

const PROMPTS = {
  institucional: [
    {
      label: 'Restaurante',
      prompt: 'Crie um site institucional profissional para um restaurante brasileiro com cardápio, galeria de fotos, localização, horário de funcionamento, botão de reserva pelo WhatsApp e depoimentos de clientes. Use cores quentes e design moderno.',
    },
    {
      label: 'Salão de beleza',
      prompt: 'Crie um site institucional elegante para um salão de beleza com lista de serviços e preços, galeria antes/depois, agendamento pelo WhatsApp, mapa de localização e depoimentos. Use cores rosê e design feminino sofisticado.',
    },
    {
      label: 'Clínica / consultório',
      prompt: 'Crie um site institucional profissional para uma clínica médica/consultório com apresentação do profissional, especialidades, agendamento online pelo WhatsApp, convênios aceitos e localização. Design limpo e confiável.',
    },
    {
      label: 'Academia / personal',
      prompt: 'Crie um site institucional moderno para uma academia ou personal trainer com planos e preços, modalidades oferecidas, galeria da estrutura, depoimentos de alunos e formulário de contato. Design energético com tons escuros.',
    },
    {
      label: 'Prestador de serviços',
      prompt: 'Crie um site institucional para um prestador de serviços autônomo (ex: eletricista, encanador, pintor) com serviços oferecidos, área de atendimento, fotos de trabalhos realizados, depoimentos e botão WhatsApp para orçamento.',
    },
    {
      label: 'Escritório / empresa',
      prompt: 'Crie um site institucional corporativo para um escritório ou empresa com página inicial impactante, sobre a empresa, serviços/soluções, cases ou portfólio, equipe, e formulário de contato. Design profissional e moderno.',
    },
  ],
  landing: [
    {
      label: 'Captação de leads',
      prompt: 'Crie uma landing page de captação de leads para um negócio local com headline impactante, proposta de valor clara, lista de benefícios, prova social com depoimentos, formulário de contato simples (nome, telefone, email) e CTA forte. Design limpo e focado em conversão.',
    },
    {
      label: 'Promoção / oferta especial',
      prompt: 'Crie uma landing page de oferta especial com countdown timer, destaque da promoção, benefícios do produto/serviço, depoimentos, garantia e botão de CTA para WhatsApp. Design urgente com cores vibrantes que transmitam escassez.',
    },
    {
      label: 'Agendamento online',
      prompt: 'Crie uma landing page focada em agendamento online para um negócio de serviços com headline que destaque rapidez, como funciona (passo a passo), benefícios de agendar online, depoimentos e formulário de agendamento. Design simples e funcional.',
    },
    {
      label: 'Lançamento de produto',
      prompt: 'Crie uma landing page de lançamento de produto/serviço com seção hero chamativa, problema que resolve, como funciona, benefícios, depoimentos antecipados, FAQ e formulário de pré-cadastro. Design moderno com animações suaves.',
    },
    {
      label: 'Orçamento rápido',
      prompt: 'Crie uma landing page para captação de orçamentos com headline "Solicite seu orçamento grátis em 1 minuto", diferenciais do serviço, formulário simples, depoimentos de clientes satisfeitos e garantia. CTA direto para WhatsApp.',
    },
    {
      label: 'Evento / workshop',
      prompt: 'Crie uma landing page para divulgação de evento ou workshop com data/local em destaque, sobre o evento, programação, palestrantes, depoimentos de edições anteriores, FAQ e botão de inscrição. Design dinâmico e moderno.',
    },
  ],
  loja: [
    {
      label: 'Loja de roupas / moda',
      prompt: 'Crie uma loja virtual para uma loja de roupas e moda com banner principal, categorias em destaque, produtos em grid com foto, preço e botão de compra, seção de novidades, carrinho e checkout via WhatsApp. Design fashion e moderno.',
    },
    {
      label: 'Loja de produtos artesanais',
      prompt: 'Crie uma loja virtual para produtos artesanais/handmade com história da marca, catálogo de produtos com fotos detalhadas, preços, personalização disponível, depoimentos e pedido pelo WhatsApp. Design aconchegante e autêntico.',
    },
    {
      label: 'Pet shop / acessórios pet',
      prompt: 'Crie uma loja virtual para pet shop com categorias por tipo de animal (cão, gato, etc.), produtos em destaque, promoções, seção de rações, brinquedos e acessórios, carrinho e pedido pelo WhatsApp. Design colorido e divertido.',
    },
    {
      label: 'Confeitaria / doces',
      prompt: 'Crie uma loja virtual para uma confeitaria com catálogo de bolos, doces e tortas com fotos profissionais, preços, personalização de pedidos, como encomendar pelo WhatsApp, depoimentos e galeria de criações. Design delicado e apetitoso.',
    },
    {
      label: 'Eletrônicos / informática',
      prompt: 'Crie uma loja virtual para eletrônicos e informática com busca de produtos, categorias, comparação de produtos, especificações técnicas, garantia, parcelamento e pedido via WhatsApp. Design tecnológico e clean.',
    },
    {
      label: 'Loja de presentes',
      prompt: 'Crie uma loja virtual para uma loja de presentes com produtos organizados por ocasião (aniversário, casamento, etc.), opção de embrulho especial, mensagem personalizada, kits prontos e pedido pelo WhatsApp. Design elegante e festivo.',
    },
  ],
}

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
  const [tipoAtivo, setTipoAtivo] = useState('institucional')

  const openLovable = () => {
    window.open(LOVABLE_URL, '_blank', 'noopener,noreferrer')
  }

  const usePrompt = (prompt) => {
    copyToClipboard(prompt)
    window.open(LOVABLE_URL, '_blank', 'noopener,noreferrer')
  }

  const tipoInfo = TIPOS.find(t => t.key === tipoAtivo)

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

      {/* Seletor de tipo de site */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-brand-wine" />
          <h2 className="font-bold text-white">Prompts prontos por tipo de site</h2>
        </div>

        {/* Tabs de tipo */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {TIPOS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTipoAtivo(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tipoAtivo === key
                  ? 'bg-brand-wine text-white'
                  : 'bg-brand-surface border border-brand-border text-gray-400 hover:text-white hover:border-brand-wine/50'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-xs mb-4">{tipoInfo?.desc} — clique em "Usar prompt" para copiar e abrir o Lovable.</p>

        <div className="grid gap-3 md:grid-cols-2">
          {PROMPTS[tipoAtivo].map(({ label, prompt }) => (
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
