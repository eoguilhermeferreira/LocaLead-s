import { useState } from 'react'
import { User, Mail, Phone, Lock, Save } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AccountPage() {
  const { user } = useApp()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h1 className="text-2xl font-black text-white">Conta</h1>
        <p className="text-gray-400 text-sm">Gerencie suas informações de perfil.</p>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-white mb-4">Informações do perfil</h2>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1.5">
              <User size={13} /> Nome
            </label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1.5">
              <Mail size={13} /> E-mail
            </label>
            <input className="input" value={user?.email || ''} readOnly />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1.5">
              <Phone size={13} /> Telefone
            </label>
            <input className="input" placeholder="(11) 99999-9999" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <button type="submit" className={`btn-primary flex items-center gap-2 ${saved ? 'bg-brand-wine-light' : ''}`}>
            <Save size={14} /> {saved ? 'Salvo!' : 'Salvar alterações'}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Lock size={16} /> Alterar senha
        </h2>
        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Senha atual</label>
            <input type="password" className="input" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Nova senha</label>
            <input type="password" className="input" placeholder="••••••••" minLength={8} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Confirmar nova senha</label>
            <input type="password" className="input" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-secondary text-sm">Atualizar senha</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-white mb-2">Plano atual</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Plano Teste</p>
            <p className="text-xs text-gray-500">1 busca gratuita disponível</p>
          </div>
          <span className="badge-yellow">Teste</span>
        </div>
      </div>
    </div>
  )
}
