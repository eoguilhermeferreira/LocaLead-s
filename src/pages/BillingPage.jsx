import { useState, useEffect } from 'react'
import { Check, Zap, CreditCard, MessageSquare } from 'lucide-react'
import { useApp } from '../context/AppContext'

function useCountdown(target) {
  const [time, setTime] = useState({ h: '02', m: '47', s: '33' })
  useEffect(() => {
    const end = Date.now() + (2 * 3600 + 47 * 60 + 33) * 1000
    const tick = () => {
      const diff = Math.max(0, end - Date.now())
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setTime({ h, m, s })
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

const BASE_FEATURES = [
  'Busca real por cidade, nicho e região',
  'Filtro de score liberado (Todos, 40+, 70+, 85+)',
  'Telefones, WhatsApp e dados completos visíveis',
  'Nicho de consórcio e outros mercados de alto ticket',
  'Filtro de empresas sem site para vender criação de sites',
  'Pipeline Comercial completo',
  'Construtor de sites com templates, logo e paletas',
]
const PRO_FEATURES = [
  'Tudo do Base, com 4× mais leads',
  'Mensagens IA pra WhatsApp ilimitadas',
  'Propostas comerciais prontas',
  'Exportação em CSV pro seu CRM',
  'Busca em massa por várias cidades',
  'Disparo em massa com seleção inteligente de leads',
  'Prioridade nos leads mais quentes e sem site',
  'Suporte prioritário para acelerar sua primeira venda',
]
const AGENCY_FEATURES = [
  'Tudo do Pro, com 4× mais leads',
  'Acesso multi-usuário (até 5 assentos)',
  'Templates e campanhas por nicho',
  'Relatórios comerciais da operação',
  'Processo completo para prospectar, abordar e acompanhar',
  'Suporte direto via WhatsApp',
  'Treinamento de vendas para o time',
]

function PlanCard({ name, price, priceAnnual, yearTotal, tagline, features, isFeatured, discount, monthly, onSelect, badge, timer }) {
  return (
    <div className={`card p-6 relative ${isFeatured ? 'border-brand-green/40 bg-brand-green/5 ring-1 ring-brand-green/20' : ''}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-brand-yellow text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap size={12} /> {badge}
          </span>
        </div>
      )}

      <h3 className="font-black text-white text-lg mb-1">{name}</h3>
      <p className="text-gray-500 text-xs mb-3">{tagline}</p>

      {timer && (
        <div className="flex items-center gap-2 mb-3">
          <span className="line-through text-gray-500 text-sm">De R$ 127/mês</span>
          <span className="badge-red text-xs">Promoção Relâmpago ⚡</span>
        </div>
      )}

      {monthly ? (
        <div className="mb-3">
          <span className="text-3xl font-black text-white">R$ {price}</span>
          <span className="text-gray-500 text-sm">/mês</span>
          {timer && (
            <div className="mt-1 font-mono text-brand-yellow text-sm font-bold">
              ⏱ {timer.h}:{timer.m}:{timer.s}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-3">
          <span className="text-3xl font-black text-white">R$ {priceAnnual}</span>
          <span className="text-gray-500 text-sm">/mês</span>
          <p className="text-xs text-brand-green mt-0.5">R$ {yearTotal}/ano · {discount}</p>
        </div>
      )}

      <button onClick={onSelect} className={`w-full py-2.5 rounded-xl font-semibold text-sm mb-4 transition-colors ${isFeatured ? 'btn-primary' : 'btn-secondary'}`}>
        Escolher plano
      </button>

      <ul className="space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <Check size={14} className="text-brand-green flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BillingPage() {
  const [period, setPeriod] = useState('monthly')
  const [showCheckout, setShowCheckout] = useState(false)
  const timer = useCountdown()

  return (
    <div className="space-y-6">
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md">
            <h3 className="font-bold text-white text-lg mb-2">Checkout LocaLead's</h3>
            <p className="text-gray-400 text-sm mb-4">Escolha a forma de pagamento e finalize a assinatura sem sair do site.</p>
            <div className="bg-[#0d1117] rounded-xl p-6 text-center text-gray-500 text-sm mb-4 border border-brand-border">
              [Widget de checkout será integrado aqui]
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="btn-secondary flex-1">Fechar</button>
              <button onClick={() => setShowCheckout(false)} className="btn-secondary flex-1">Ver planos</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-white">Assinatura</h1>
        <p className="text-gray-400 text-sm">Escolha o volume ideal para sua operação de prospecção.</p>
      </div>

      {/* CTA block */}
      <div className="card p-6 bg-gradient-to-r from-brand-green/10 to-transparent border-brand-green/20">
        <h2 className="font-bold text-white text-lg mb-1">Finalize sua assinatura</h2>
        <p className="text-gray-400 text-sm mb-4">
          Sua conta foi criada com sucesso. Você pode fazer uma busca teste gratuita; o plano pago libera telefones, WhatsApp, score ajustável, pipeline, IA e volume mensal para vender de verdade.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={() => setShowCheckout(true)} className="btn-primary flex items-center gap-2">
            <CreditCard size={16} /> Finalizar pagamento
          </button>
          <button className="btn-secondary text-sm">Ver planos</button>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <MessageSquare size={14} /> Falar com suporte
          </button>
          <span className="badge-green text-sm">A partir de R$ 57/mês</span>
        </div>
      </div>

      {/* Period toggle */}
      <div className="flex items-center gap-3">
        <div className="flex bg-brand-card border border-brand-border rounded-xl p-1">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'monthly' ? 'bg-brand-green text-black' : 'text-gray-400'}`}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriod('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${period === 'annual' ? 'bg-brand-green text-black' : 'text-gray-400'}`}
          >
            Anual <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${period === 'annual' ? 'bg-black/20' : 'badge-green'}`}>2 meses grátis</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-5">
        <PlanCard
          name="BASE"
          price="57"
          priceAnnual="47"
          yearTotal="564"
          tagline="Para validar rápido e fechar o 1º cliente"
          discount="2 meses grátis"
          features={BASE_FEATURES}
          monthly={period === 'monthly'}
          onSelect={() => setShowCheckout(true)}
        />
        <PlanCard
          name="PRO"
          price="99,90"
          priceAnnual="97"
          yearTotal="1.164"
          tagline="Para transformar busca em rotina de vendas"
          discount="economize R$ 360"
          features={PRO_FEATURES}
          isFeatured
          badge="Promoção Relâmpago ⚡"
          timer={period === 'monthly' ? timer : null}
          monthly={period === 'monthly'}
          onSelect={() => setShowCheckout(true)}
        />
        <PlanCard
          name="AGÊNCIA"
          price="397"
          priceAnnual="297"
          yearTotal="3.564"
          tagline="Para escalar prospecção com time e carteira"
          discount="economize R$ 1.200"
          features={AGENCY_FEATURES}
          monthly={period === 'monthly'}
          onSelect={() => setShowCheckout(true)}
        />
      </div>

      {/* Edu sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-white mb-2">O teste mostra valor, o plano libera venda</h3>
          <p className="text-gray-400 text-sm">A busca gratuita mostra como a plataforma funciona. Para acessar contatos reais, pipeline e IA, é necessário um plano. O primeiro fechamento costuma pagar o plano inteiro.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-white mb-2">Anual é para quem quer consistência</h3>
          <p className="text-gray-400 text-sm">O plano anual dá previsibilidade para sua operação e economiza 2 mensalidades. Ideal para quem já validou o modelo e quer escalar a prospecção mês a mês.</p>
        </div>
      </div>
    </div>
  )
}
