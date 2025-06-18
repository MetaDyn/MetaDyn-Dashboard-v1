import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://agjowpwftkkdjnpswhgp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnam93cHdmdGtrZGpucHN3aGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjM2NzEsImV4cCI6MjA1NDUzOTY3MX0.etfkxJg9bhv9kaQMG92GmOmKlQKbKQF1NzQ_jaeHGDQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
