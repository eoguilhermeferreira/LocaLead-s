import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const getPage = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('page') || 'search'
}

const getAuth = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('auth') || 'login'
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState(getPage)
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)
  const [leads, setLeads] = useState([])
  const [pipeline, setPipeline] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [noticesCount] = useState(5)

  const navigate = useCallback((page) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', page)
    window.history.pushState({}, '', url)
    setCurrentPage(page)
  }, [])

  const login = useCallback((userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    navigate('search')
  }, [navigate])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    const url = new URL(window.location.href)
    url.searchParams.set('auth', 'login')
    url.searchParams.delete('page')
    window.history.pushState({}, '', url)
  }, [])

  const saveLead = useCallback((lead) => {
    setLeads(prev => {
      if (prev.find(l => l.id === lead.id)) return prev
      return [...prev, { ...lead, savedAt: new Date() }]
    })
  }, [])

  const sendToPipeline = useCallback((lead) => {
    setPipeline(prev => {
      if (prev.find(l => l.id === lead.id)) return prev
      return [...prev, { ...lead, stage: 'novo', pipelineAt: new Date() }]
    })
    saveLead(lead)
  }, [saveLead])

  const movePipelineStage = useCallback((leadId, stage) => {
    setPipeline(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l))
  }, [])

  return (
    <AppContext.Provider value={{
      isAuthenticated, currentPage, theme, user,
      leads, pipeline, searchResults, noticesCount,
      navigate, login, logout, saveLead, sendToPipeline,
      movePipelineStage, setSearchResults, setTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
