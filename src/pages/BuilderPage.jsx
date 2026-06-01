import { Lock, Check, Wrench } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function BuilderPage() {
  const { navigate } = useApp()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Wrench size={24} className="text-brand-wine" /> Construção
        </h1>
        <p className="text-gray-400 text-sm">Gere sites profissionais para os seus clientes a partir dos leads salvos.</p>
      </div>

      {/* Construtor bloqueado */}
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-brand-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border">
          <Lock size={28} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Construtor de sites — recurso dos planos pagos</h2>
        <p className="text-gray-400 text-sm mb-6">
          Crie sites completos e bonitos para os seus clientes em minutos — com a sua logo, fotos do nicho, galeria, vídeo e tudo pronto para entregar e cobrar.
        </p>

        <div className="grid md:grid-cols-2 gap-2 max-w-lg mx-auto mb-6 text-left">
          {[
            '9 templates + 32 paletas + 17 fontes + 8 acabamentos visuais',
            'Seções avançadas: planos, diferenciais, depoimentos e equipe',
            'Upload da logo e fotos do cliente (ou imagem automática do nicho)',
            'Site pronto para hospedar, entregar e cobrar',
          ].map(item => (
            <div key={item} className="flex items-start gap-2 text-sm text-gray-300">
              <Check size={14} className="text-brand-wine flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('billing')} className="btn-primary mx-auto mb-3">
          Ver planos e assinar
        </button>
        <p className="text-xs text-gray-500">Disponível no mensal ou no anual — escolha o plano que fizer mais sentido pra você.</p>
      </div>

      {/* Campanhas em breve */}
      <div className="card p-6">
        <h2 className="font-bold text-white mb-1">Campanhas</h2>
        <p className="text-gray-400 text-sm mb-4">Planeje listas de prospecção por cidade, nicho e oferta.</p>
        <h3 className="font-semibold text-white mb-1">Campanhas por nicho</h3>
        <div className="flex items-center gap-2">
          <span className="badge-yellow">Em breve</span>
          <span className="text-xs text-gray-500">Salve uma busca como campanha, acompanhe abordagens e gere follow-ups automáticos.</span>
        </div>
      </div>
    </div>
  )
}
