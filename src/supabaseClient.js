import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pskqgmeymadqgocwbevs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBza3FnbWV5bWFkcWdvY3diZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NDI2NzksImV4cCI6MjA4MjAxODY3OX0.25jALYlJpfgBSr41lGEjNwpyP1cKIkYS4vyT9UVbWSw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
