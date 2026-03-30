import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obxzzjhictoljoixuctg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ieHp6amhpY3RvbGpvaXh1Y3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzgyNjEsImV4cCI6MjA5MDQ1NDI2MX0.y1DWckUvx7w14ymuLrXGpAXa9VrquqQFkfKoa7Xv5ig';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
