import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if variables are defined and not default placeholders
const isConfigured = supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_url_here'

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Mock client to prevent crash
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.reject(new Error("Supabase not configured")),
            signUp: () => Promise.reject(new Error("Supabase not configured")),
            getUser: () => Promise.resolve({ data: { user: null } }),
            signOut: () => Promise.resolve(),
            updateUser: () => Promise.reject(new Error("Supabase not configured"))
        }
    }

export const isSupabaseConfigured = isConfigured
