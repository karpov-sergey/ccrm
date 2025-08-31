import { createClient } from '@supabase/supabase-js';

// эти ключи возьми в настройках проекта → Project Settings → API
const supabaseUrl = 'https://copkyzodrnjhuimpwipl.supabase.co';
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvcGt5em9kcm5qaHVpbXB3aXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzExMDAsImV4cCI6MjA3MjIwNzEwMH0.ZMUuLLvwUogNTwi5YSUzoK4uCEcek902ASasdc9j8Zc';

export const supabase = createClient(supabaseUrl, supabaseKey);
