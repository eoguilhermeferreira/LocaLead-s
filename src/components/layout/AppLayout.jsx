import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { useApp } from '../../context/AppContext'
import SearchPage from '../../pages/SearchPage'
import DashboardPage from '../../pages/DashboardPage'
import LeadsPage from '../../pages/LeadsPage'
import PipelinePage from '../../pages/PipelinePage'
import NoticesPage from '../../pages/NoticesPage'
import MessagesPage from '../../pages/MessagesPage'
import BuilderPage from '../../pages/BuilderPage'
import BillingPage from '../../pages/BillingPage'
import AccountPage from '../../pages/AccountPage'
import HelpPage from '../../pages/HelpPage'
import SupportFAB from '../ui/SupportFAB'

const PAGES = {
  search: SearchPage,
  dashboard: DashboardPage,
  leads: LeadsPage,
  pipeline: PipelinePage,
  notices: NoticesPage,
  messages: MessagesPage,
  builder: BuilderPage,
  billing: BillingPage,
  account: AccountPage,
  help: HelpPage,
}

export default function AppLayout() {
  const { currentPage } = useApp()
  const Page = PAGES[currentPage] || SearchPage

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Page />
        </div>
      </main>
      <BottomNav />
      <SupportFAB />
    </div>
  )
}
