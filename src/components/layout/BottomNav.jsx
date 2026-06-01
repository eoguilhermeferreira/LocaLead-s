import {
  Search, LayoutDashboard, Users, GitBranch,
  MessageSquare, Wrench, Settings
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { id: 'search', icon: Search },
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'leads', icon: Users },
  { id: 'pipeline', icon: GitBranch },
  { id: 'messages', icon: MessageSquare },
  { id: 'builder', icon: Wrench },
  { id: 'account', icon: Settings },
]

export default function BottomNav() {
  const { currentPage, navigate, noticesCount } = useApp()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#100508] border-t border-brand-border z-50 flex">
      {NAV_ITEMS.map(({ id, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className={`flex-1 flex flex-col items-center justify-center py-2 relative
            ${currentPage === id ? 'text-brand-wine' : 'text-gray-500'}`}
        >
          <Icon size={20} />
          {badge && noticesCount > 0 && (
            <span className="absolute top-1 right-1/4 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {noticesCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
