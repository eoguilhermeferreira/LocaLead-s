import { useState } from 'react'
import { MapPin, Sun, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="text-brand-green" size={24} />
      <span className="text-xl font-black">
        <span className="text-white">local</span>
        <span className="text-brand-green">lead's</span>
      </span>
    </div>
  )
}

function AuthHero() {
  return (
    <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-[#0d1117] to-[#111827] border-r border-brand-border">
      <Logo className="mb-8" />
      <h1 className="text-4xl font-black leading-tight text-white mb-4">
        Encontre leads locais<br />
        <span className="text-brand-green">com potencial.</span>
      </h1>
      <p className="text-gray-400 text-lg">
        Prospecção local com inteligência artificial.<br />
        Encontre, aborde e feche oportunidades.
      </p>
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const { login } = useApp()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ name: email.split('@')[0], email })
  }

  return (
    <div className="flex flex-col justify-center px-8 lg:px-16">
      <div className="lg:hidden mb-8">
        <Logo />
      </div>
      <h2 className="text-2xl font-bold mb-1">Entrar na sua conta</h2>
      <p className="text-gray-400 text-sm mb-8">Acesse a plataforma LocaLead's</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">E-mail</label>
          <input
            type="email"
            className="input"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Senha</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input pr-12"
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="button" onClick={() => onSwitch('forgot')} className="text-brand-green text-sm hover:underline">
          Esqueci minha senha
        </button>

        <button type="submit" className="btn-primary w-full py-3 text-base">
          Entrar
        </button>
        <button type="button" onClick={() => onSwitch('forgot')} className="btn-secondary w-full py-3 text-base">
          Redefinir acesso
        </button>
      </form>

      <p className="text-gray-400 text-sm mt-6 text-center">
        Ainda não tem uma conta?{' '}
        <button onClick={() => onSwitch('register')} className="text-brand-green font-semibold hover:underline">
          Criar conta
        </button>
      </p>
    </div>
  )
}

function ForgotForm({ onSwitch }) {
  const [sent, setSent] = useState(false)
  return (
    <div className="flex flex-col justify-center px-8 lg:px-16">
      <div className="lg:hidden mb-8"><Logo /></div>
      <h2 className="text-2xl font-bold mb-1">Recuperar Senha</h2>
      <p className="text-gray-400 text-sm mb-8">Digite seu e-mail e enviaremos um link de recuperação.</p>

      {sent ? (
        <div className="card p-6 text-center">
          <p className="text-brand-green font-semibold mb-2">Link enviado!</p>
          <p className="text-gray-400 text-sm">Verifique seu e-mail para redefinir a senha.</p>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">E-mail</label>
            <input type="email" className="input" placeholder="seu@email.com" required />
          </div>
          <button type="submit" className="btn-primary w-full py-3">Enviar link de recuperação</button>
        </form>
      )}

      <button onClick={() => onSwitch('login')} className="text-brand-green text-sm mt-4 hover:underline text-center block">
        ← Voltar ao Login
      </button>
    </div>
  )
}

function RegisterForm({ onSwitch }) {
  const { login } = useApp()
  const [captcha] = useState(Math.random().toString(36).slice(2, 8).toUpperCase())
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '', captchaInput: '' })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return alert('Senhas não conferem')
    login({ name: form.name, email: form.email })
  }

  return (
    <div className="flex flex-col justify-center px-8 lg:px-16 py-8">
      <div className="lg:hidden mb-6"><Logo /></div>
      <h2 className="text-2xl font-bold mb-1">Crie sua conta</h2>
      <p className="text-gray-400 text-sm mb-6">Comece a prospectar grátis hoje</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Nome</label>
          <input className="input" placeholder="Seu nome" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Telefone</label>
          <input className="input" placeholder="(11) 99999-9999" value={form.phone} onChange={set('phone')} />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">E-mail</label>
          <input type="email" className="input" placeholder="seu@email.com" value={form.email} onChange={set('email')} required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Senha (mín. 8 caracteres)</label>
          <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={set('password')} minLength={8} required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Confirmar senha</label>
          <input type="password" className="input" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Verificação de segurança</label>
          <div className="flex gap-2 items-center mb-2">
            <span className="bg-[#1a2332] border border-brand-border px-4 py-2 rounded-xl font-mono font-bold text-brand-green tracking-widest text-lg">
              {captcha}
            </span>
            <button type="button" className="text-gray-400 hover:text-white p-2">
              <RefreshCw size={16} />
            </button>
          </div>
          <input className="input" placeholder="Digite o código acima" value={form.captchaInput} onChange={set('captchaInput')} required />
        </div>
        <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
          Cadastrar
        </button>
      </form>

      <p className="text-gray-400 text-sm mt-4 text-center">
        Já tem uma conta?{' '}
        <button onClick={() => onSwitch('login')} className="text-brand-green font-semibold hover:underline">
          Entrar
        </button>
      </p>
    </div>
  )
}

export default function AuthPage() {
  const [view, setView] = useState('login')

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      <div className="flex w-full max-w-5xl mx-auto shadow-2xl">
        <div className="flex-1">
          <AuthHero />
        </div>
        <div className="w-full lg:w-[480px] bg-[#111827] border-l border-brand-border overflow-y-auto">
          {view === 'login' && <LoginForm onSwitch={setView} />}
          {view === 'forgot' && <ForgotForm onSwitch={setView} />}
          {view === 'register' && <RegisterForm onSwitch={setView} />}
        </div>
      </div>
    </div>
  )
}
