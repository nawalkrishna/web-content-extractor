import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Save, Loader2, Edit2, X } from 'lucide-react'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) throw error

            if (user) {
                setUser(user)
                setEmail(user.email)
                setUsername(user.user_metadata?.username || '')
            }
        } catch (error) {
            setError('Failed to load profile')
            console.error('Error fetching user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    username: username
                }
            })

            if (error) throw error

            setSuccess(true)
            setIsEditing(false)

            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setUsername(user.user_metadata?.username || '')
        setIsEditing(false)
        setError(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">

                    {/* Profile Form */}
                    <div className="p-8">
                        {success && (
                            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 p-4 rounded-xl text-sm border border-green-200 flex items-center gap-3 shadow-sm">
                                <div className="p-1 bg-green-500 rounded-full">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="font-medium">Profile updated successfully!</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-start gap-2">
                                <span className="text-red-500 font-bold text-lg">!</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            {/* Email Field (Read-only) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50/50 text-gray-600 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                                    Email cannot be changed
                                </p>
                            </div>

                            {/* Username Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Username
                                    </label>
                                    {!isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={!isEditing}
                                        required
                                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all ${
                                            isEditing
                                                ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm'
                                                : 'border-gray-200 bg-gray-50/50 text-gray-600 cursor-not-allowed'
                                        } outline-none`}
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Account Info */}
                        <div className="mt-8 pt-8 border-t-2 border-gray-100">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                    <span className="text-xs text-gray-500 font-medium">Account Created</span>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {new Date(user?.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                    <span className="text-xs text-gray-500 font-medium">Last Sign In</span>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {new Date(user?.last_sign_in_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
