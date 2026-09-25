import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uyhqkdmbzvswrdlujxmp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aHFrZG1ienZzd3JkbHVqeG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODcyOTIsImV4cCI6MjA5ODA2MzI5Mn0.ffC6ARhkP_C6lqTiOeJdtLVvv7KEk1ZBCUY5cEj3Pvw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
