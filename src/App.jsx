import { AppProvider, useApp } from './context/AppContext'
import AuthPage from './pages/auth/AuthPage'
import AppLayout from './components/layout/AppLayout'

function Root() {
  const { isAuthenticated } = useApp()
  return isAuthenticated ? <AppLayout /> : <AuthPage />
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}
