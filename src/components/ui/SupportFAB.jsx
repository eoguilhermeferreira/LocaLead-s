import { useState } from 'react'
import { HelpCircle, X, MessageCircle, Phone } from 'lucide-react'

export default function SupportFAB() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}

      {open && (
        <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-6 z-50 card p-6 w-80 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Central de Suporte</h3>
              <p className="text-gray-400 text-xs mt-0.5">Atendimento humano, dúvidas e chamados.</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
            >
              <MessageCircle size={18} className="text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">WhatsApp</p>
                <p className="text-xs text-gray-400">Atendimento rápido</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-card border border-brand-border">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">E-mail</p>
                <p className="text-xs text-gray-400">suporte@localead.com.br</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-brand-wine text-black font-semibold px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-brand-wine-light transition-colors"
      >
        <HelpCircle size={18} />
        <span className="text-sm">Abrir suporte</span>
      </button>
    </>
  )
}
