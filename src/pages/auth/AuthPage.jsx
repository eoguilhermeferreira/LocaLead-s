import { useState } from 'react'
import { MapPin, Eye, EyeOff, RefreshCw, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { supabase } from '../../lib/supabase'

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="text-brand-wine" size={24} />
      <span className="text-xl font-black">
        <span className="text-white">local</span>
        <span className="text-brand-wine">lead's</span>
      </span>
    </div>
  )
}

function AuthHero() {
  return (
    <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-[#09090b] to-[#100508] border-r border-brand-border">
      <Logo className="mb-8" />
      <h1 className="text-4xl font-black leading-tight text-white mb-4">
        Encontre leads locais<br />
        <span className="text-brand-wine">com potencial.</span>
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed">
        Prospecção local com inteligência artificial.<br />
        Encontre, aborde e feche oportunidades.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {[['100+', 'Nichos disponíveis'], ['27', 'Estados + DF'], ['IA', 'Mensagens prontas'], ['0 código', 'Sem programação']].map(([v, l]) => (
          <div key={l} className="bg-brand-wine/10 border border-brand-wine/20 rounded-xl p-3">
            <p className="text-brand-wine font-black text-lg">{v}</p>
            <p className="text-gray-400 text-xs">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const { login } = useApp()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await login(email, password)
    if (error) setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message)
    setLoading(false)
  }

  return (
    <div className="flex flex-col justify-center px-8 lg:px-12 h-full">
      <div className="lg:hidden mb-8"><Logo /></div>
      <h2 className="text-2xl font-bold mb-1">Entrar na sua conta</h2>
      <p className="text-gray-400 text-sm mb-8">Acesse a plataforma LocaLead's</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">E-mail</label>
          <input type="email" className="input" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Senha</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} className="input pr-12" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="button" onClick={() => onSwitch('forgot')} className="text-brand-wine text-sm hover:underline">
          Esqueci minha senha
        </button>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button type="button" onClick={() => onSwitch('forgot')} className="btn-secondary w-full py-3 text-base">
          Redefinir acesso
        </button>
      </form>

      <p className="text-gray-400 text-sm mt-6 text-center">
        Ainda não tem uma conta?{' '}
        <button onClick={() => onSwitch('register')} className="text-brand-wine font-semibold hover:underline">
          Criar conta
        </button>
      </p>
    </div>
  )
}

function ForgotForm({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/?auth=new-password` })
      if (error) { setError(error.message); setLoading(false); return }
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="flex flex-col justify-center px-8 lg:px-12 h-full">
      <div className="lg:hidden mb-8"><Logo /></div>
      <h2 className="text-2xl font-bold mb-1">Recuperar Senha</h2>
      <p className="text-gray-400 text-sm mb-8">Digite seu e-mail e enviaremos um link de recuperação.</p>

      {sent ? (
        <div className="card p-6 text-center border-brand-wine/30">
          <p className="text-brand-wine font-bold text-lg mb-1">Link enviado! ✓</p>
          <p className="text-gray-400 text-sm">Verifique seu e-mail para redefinir a senha.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">E-mail</label>
            <input type="email" className="input" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>
      )}

      <button onClick={() => onSwitch('login')} className="text-brand-wine text-sm mt-4 hover:underline text-center block">
        ← Voltar ao Login
      </button>
    </div>
  )
}

function RegisterForm({ onSwitch }) {
  const { register } = useApp()
  const [captcha] = useState(Math.random().toString(36).slice(2, 8).toUpperCase())
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '', captchaInput: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('As senhas não conferem.'); return }
    if (form.captchaInput.toUpperCase() !== captcha) { setError('Código de verificação incorreto.'); return }
    setLoading(true)
    const { error } = await register(form.email, form.password, form.name)
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center px-8 lg:px-12 h-full text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-white mb-2">Conta criada!</h2>
        <p className="text-gray-400 text-sm mb-4">Verifique seu e-mail para confirmar o cadastro, depois faça login.</p>
        <button onClick={() => onSwitch('login')} className="btn-primary mx-auto">Ir para o login</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center px-8 lg:px-12 py-8 overflow-y-auto">
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
            <span className="bg-[#180a0e] border border-brand-border px-4 py-2 rounded-xl font-mono font-bold text-brand-wine tracking-widest text-lg select-none">
              {captcha}
            </span>
            <RefreshCw size={16} className="text-gray-500" />
          </div>
          <input className="input" placeholder="Digite o código acima" value={form.captchaInput} onChange={set('captchaInput')} required />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {loading ? 'Criando conta...' : 'Cadastrar'}
        </button>
      </form>

      <p className="text-gray-400 text-sm mt-4 text-center">
        Já tem uma conta?{' '}
        <button onClick={() => onSwitch('login')} className="text-brand-wine font-semibold hover:underline">Entrar</button>
      </p>
    </div>
  )
}

export default function AuthPage() {
  const [view, setView] = useState('login')

  return (
    <div className="min-h-screen bg-[#09090b] flex items-stretch">
      <div className="flex w-full max-w-5xl mx-auto shadow-2xl min-h-screen lg:min-h-0 lg:my-auto lg:rounded-2xl overflow-hidden">
        <div className="hidden lg:flex flex-1">
          <AuthHero />
        </div>
        <div className="w-full lg:w-[480px] bg-[#100508] border-l border-brand-border overflow-y-auto flex flex-col">
          <div className="flex-1">
            {view === 'login' && <LoginForm onSwitch={setView} />}
            {view === 'forgot' && <ForgotForm onSwitch={setView} />}
            {view === 'register' && <RegisterForm onSwitch={setView} />}
          </div>
        </div>
      </div>
    </div>
  )
}
