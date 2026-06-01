import {
  Search, LayoutDashboard, Users, GitBranch, Bell,
  MessageSquare, Wrench, CreditCard, Settings, HelpCircle,
  MapPin, Sun, Moon, LogOut
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { id: 'search', icon: Search, label: 'Buscar Oportunidades' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Painel Geral' },
  { id: 'leads', icon: Users, label: 'Meus Leads' },
  { id: 'pipeline', icon: GitBranch, label: 'Pipeline Comercial' },
  { id: 'notices', icon: Bell, label: 'Canal de Avisos', badge: true },
  { id: 'messages', icon: MessageSquare, label: 'Mensagens IA' },
  { id: 'builder', icon: Wrench, label: 'Construção' },
  { id: 'billing', icon: CreditCard, label: 'Assinatura' },
  { id: 'account', icon: Settings, label: 'Conta' },
  { id: 'help', icon: HelpCircle, label: 'Ajuda & Tutoriais' },
]

export default function Sidebar() {
  const { currentPage, navigate, user, logout, theme, setTheme, noticesCount } = useApp()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#100508] border-r border-brand-border fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <MapPin className="text-brand-wine" size={22} />
          <span className="text-lg font-black">
            <span className="text-white">local</span>
            <span className="text-brand-wine">lead's</span>
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="px-5 py-4 border-b border-brand-border">
          <p className="text-sm font-semibold text-white truncate">{user.name || user.email}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`nav-item w-full ${currentPage === id ? 'nav-item-active' : ''}`}
          >
            <Icon size={18} />
            <span className="flex-1 text-left">{label}</span>
            {badge && noticesCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {noticesCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer slogan */}
      <div className="px-5 py-4 border-t border-brand-border">
        <p className="text-xs text-gray-500 leading-relaxed">
          Encontre, aborde e feche oportunidades locais com uma experiência simples e visual.
        </p>
      </div>
    </aside>
  )
}
