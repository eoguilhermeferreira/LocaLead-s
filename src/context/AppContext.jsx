import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

const getPage = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('page') || 'search'
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(getPage)
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)
  const [leads, setLeads] = useState([])
  const [pipeline, setPipeline] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [noticesCount] = useState(5)

  // --- Auth init ---
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email, name: session.user.user_metadata?.name || session.user.email.split('@')[0] })
        setIsAuthenticated(true)
      }
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email, name: session.user.user_metadata?.name || session.user.email.split('@')[0] })
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // --- Load leads from Supabase when authenticated ---
  useEffect(() => {
    if (!supabase || !user?.id) return
    const loadData = async () => {
      const [{ data: leadsData }, { data: pipelineData }] = await Promise.all([
        supabase.from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('pipeline').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      if (leadsData) setLeads(leadsData.map(l => ({ ...l.data, id: l.lead_id, savedAt: l.created_at })))
      if (pipelineData) setPipeline(pipelineData.map(p => ({ ...p.data, id: p.lead_id, stage: p.stage, pipelineAt: p.created_at })))
    }
    loadData()
  }, [user?.id])

  const navigate = useCallback((page) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', page)
    window.history.pushState({}, '', url)
    setCurrentPage(page)
  }, [])

  const login = useCallback(async (email, password) => {
    if (!supabase) {
      setUser({ name: email.split('@')[0], email })
      setIsAuthenticated(true)
      navigate('search')
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) navigate('search')
    return { error }
  }, [navigate])

  const register = useCallback(async (email, password, name) => {
    if (!supabase) {
      setUser({ name, email })
      setIsAuthenticated(true)
      navigate('search')
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if (!error) navigate('search')
    return { error }
  }, [navigate])

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    setLeads([])
    setPipeline([])
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    window.history.pushState({}, '', url)
  }, [])

  const saveLead = useCallback(async (lead) => {
    setLeads(prev => {
      if (prev.find(l => l.id === lead.id)) return prev
      return [{ ...lead, savedAt: new Date() }, ...prev]
    })
    if (!supabase || !user?.id) return
    await supabase.from('leads').upsert({
      user_id: user.id,
      lead_id: lead.id,
      data: lead,
    }, { onConflict: 'user_id,lead_id' })
  }, [user?.id])

  const removeLead = useCallback(async (leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId))
    if (!supabase || !user?.id) return
    await supabase.from('leads').delete().eq('user_id', user.id).eq('lead_id', leadId)
  }, [user?.id])

  const sendToPipeline = useCallback(async (lead) => {
    setPipeline(prev => {
      if (prev.find(l => l.id === lead.id)) return prev
      return [{ ...lead, stage: 'novo', pipelineAt: new Date() }, ...prev]
    })
    saveLead(lead)
    if (!supabase || !user?.id) return
    await supabase.from('pipeline').upsert({
      user_id: user.id,
      lead_id: lead.id,
      stage: 'novo',
      data: lead,
    }, { onConflict: 'user_id,lead_id' })
  }, [user?.id, saveLead])

  const movePipelineStage = useCallback(async (leadId, stage) => {
    setPipeline(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l))
    if (!supabase || !user?.id) return
    await supabase.from('pipeline').update({ stage }).eq('user_id', user.id).eq('lead_id', leadId)
  }, [user?.id])

  return (
    <AppContext.Provider value={{
      isAuthenticated, authLoading, currentPage, theme, user,
      leads, pipeline, searchResults, noticesCount,
      navigate, login, register, logout,
      saveLead, removeLead, sendToPipeline, movePipelineStage,
      setSearchResults, setTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
