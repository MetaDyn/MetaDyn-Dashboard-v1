import { supabase } from './supabase'

async function createTables() {
  // First, check if tables exist
  const { data: tables, error: checkError } = await supabase
    .from('ai_activities')
    .select('count')
    .limit(1)
    .catch(() => ({ data: null }))

  if (!tables) {
    console.log('Creating tables...')
    
    // Create ai_activities table
    const { error: activitiesError } = await supabase.rpc('create_ai_activities_table', {})
    if (activitiesError) {
      console.error('Error creating ai_activities table:', activitiesError)
    }

    // Create leaderboard table
    const { error: leaderboardError } = await supabase.rpc('create_leaderboard_table', {})
    if (leaderboardError) {
      console.error('Error creating leaderboard table:', leaderboardError)
    }
  }
}

createTables()
