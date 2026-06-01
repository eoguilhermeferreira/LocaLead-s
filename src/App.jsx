import { AppProvider, useApp } from './context/AppContext'
import AuthPage from './pages/auth/AuthPage'
import AppLayout from './components/layout/AppLayout'
import { MapPin } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center gap-2 justify-center mb-4">
          <MapPin className="text-brand-green" size={28} />
          <span className="text-2xl font-black">
            <span className="text-white">local</span>
            <span className="text-brand-green">lead's</span>
          </span>
        </div>
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  )
}

function Root() {
  const { isAuthenticated, authLoading } = useApp()
  if (authLoading) return <LoadingScreen />
  return isAuthenticated ? <AppLayout /> : <AuthPage />
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}
