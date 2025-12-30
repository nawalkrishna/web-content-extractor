import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

function PrivateRoute({ children }) {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("PrivateRoute: Checking session...")
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("PrivateRoute: Session retrieved", session)
            setSession(session)
        }).catch(err => {
            console.error("PrivateRoute: Session check failed", err)
            setSession(null)
        }).finally(() => {
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/login" />
    }

    return children
}

export default function App() {
    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Missing</h2>
                    <p className="text-gray-600 mb-4">
                        Supabase environment variables are missing.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-6">
                        <code className="text-gray-800">
                            # Create frontend/.env<br />
                            VITE_SUPABASE_URL=...<br />
                            VITE_SUPABASE_ANON_KEY=...
                        </code>
                    </div>
                    <p className="text-sm text-gray-500">
                        Please rename <code className="font-bold">.env.example</code> to <code className="font-bold">.env</code> and add your credentials.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    )
}
