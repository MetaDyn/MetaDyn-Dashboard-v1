import express from 'express';
import cors from 'cors';
import { supabase } from '../supabase.js';

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint for AI activity
app.post('/api/activity', async (req, res) => {
  const { agent_id, action, details } = req.body;
  
  const { data, error } = await supabase
    .from('ai_activities')
    .insert([{ agent_id, action, details }]);

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ success: true, data });
});

// API endpoint for leaderboard scores
app.post('/api/leaderboard', async (req, res) => {
  const { player_name, score } = req.body;
  
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{ player_name, score }]);

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ success: true, data });
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
