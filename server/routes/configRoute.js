const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET current site configuration (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching config:', error);
      return res.status(500).json({ error: 'Failed to fetch configuration' });
    }

    res.json(data || {});
  } catch (error) {
    console.error('Config fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE site configuration (admin only)
router.put('/', async (req, res) => {
  try {
    // In a real app, you'd verify the admin token here
    // For now, we rely on database policies
    
    const configData = req.body;
    
    // Add timestamp
    configData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('site_config')
      .update(configData)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Error updating config:', error);
      return res.status(500).json({ error: 'Failed to update configuration' });
    }

    res.json(data);
  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
