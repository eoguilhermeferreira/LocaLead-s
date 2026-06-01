import { Component } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import AuthPage from './pages/auth/AuthPage'
import AppLayout from './components/layout/AppLayout'
import { MapPin } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#09090b', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'monospace' }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ color: '#00d084', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>⚠ Erro ao carregar</div>
            <div style={{ background: '#100508', border: '1px solid #2a1218', borderRadius: '12px', padding: '1rem', color: '#ef4444', fontSize: '0.85rem', wordBreak: 'break-all' }}>
              {this.state.error.toString()}
            </div>
            <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.75rem' }}>
              {this.state.error.stack?.split('\n').slice(0, 5).join('\n')}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: '1.5rem', background: '#00d084', color: '#000', border: 'none', borderRadius: '12px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center gap-2 justify-center mb-4">
          <MapPin className="text-brand-wine" size={28} />
          <span className="text-2xl font-black">
            <span className="text-white">local</span>
            <span className="text-brand-wine">lead's</span>
          </span>
        </div>
        <div className="w-6 h-6 border-2 border-brand-wine border-t-transparent rounded-full animate-spin mx-auto" />
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
    <ErrorBoundary>
      <AppProvider>
        <Root />
      </AppProvider>
    </ErrorBoundary>
  )
}
