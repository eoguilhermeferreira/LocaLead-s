import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qkroxfioobhoaezoxwom.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcm94Zmlvb2Job2Flem94d29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODg2NDYsImV4cCI6MjA5Mzg2NDY0Nn0.zEXVt_mnHsVC3pK9_oI9Hw1KJo-BG7NC41qGssvUgWk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
