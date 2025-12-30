import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { LogOut, Link as LinkIcon, Download, FileText, Loader2, Search, User, History, Copy, Check, FileJson, FileCode, BookOpen, Clock, Hash, List, Code2 } from 'lucide-react'
import axios from 'axios'

export default function Dashboard() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [username, setUsername] = useState('User')
    const [history, setHistory] = useState([])
    const [copied, setCopied] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.user_metadata?.username) {
                setUsername(user.user_metadata.username)
            }
        }
        fetchUser()
        loadHistory()
    }, [])

    const loadHistory = () => {
        const savedHistory = localStorage.getItem('extractionHistory')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }

    const saveToHistory = (extractionData) => {
        const newHistory = [extractionData, ...history].slice(0, 10)
        setHistory(newHistory)
        localStorage.setItem('extractionHistory', JSON.stringify(newHistory))
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const handleExtract = async (e) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000'
            const response = await axios.post(`${apiUrl}/extract`, { url })
            setResult(response.data)
            saveToHistory(response.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to extract content')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const loadFromHistory = (item) => {
        setResult(item)
        setUrl(item.url)
    }

    const downloadCSV = () => {
        if (!result) return

        const headers = ['URL', 'Title', 'Content', 'Extracted At']
        const safeContent = result.content.replace(/"/g, '""')
        const safeTitle = result.title.replace(/"/g, '""')

        const row = [
            `"${result.url}"`,
            `"${safeTitle}"`,
            `"${safeContent}"`,
            `"${result.extractedAt}"`
        ]

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + row.join(",")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "extraction_result.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const downloadJSON = () => {
        if (!result) return

        const dataStr = JSON.stringify(result, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        const link = document.createElement('a')
        link.setAttribute('href', dataUri)
        link.setAttribute('download', 'extraction_result.json')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const downloadTXT = () => {
        if (!result) return

        const txtContent = `URL: ${result.url}\nTitle: ${result.title}\n\nContent:\n${result.content}\n\nExtracted At: ${result.extractedAt}`
        const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(txtContent)
        const link = document.createElement('a')
        link.setAttribute('href', dataUri)
        link.setAttribute('download', 'extraction_result.txt')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">WebExtractor</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-700 font-medium">{username}</span>
                            </div>
                            <button
                                onClick={() => navigate('/profile')}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Profile"
                            >
                                <User className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Main Extraction */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Hero Section */}
                        <div className="text-center space-y-3 py-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Extract Web Content
                            </h1>
                            <p className="text-gray-600 max-w-xl mx-auto">
                                Extract text, metadata, and content from any website instantly with our powerful scraper
                            </p>
                        </div>

                        {/* Input Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all">
                            <form onSubmit={handleExtract} className="space-y-4">
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Extracting...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            Extract Content
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-start gap-2">
                                    <span className="text-red-500 font-bold">!</span>
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Results Card */}
                        {result && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 animate-fade-in">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            Extraction Complete
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-2">Successfully extracted content from {new URL(result.url).hostname}</p>
                                    </div>

                                    {/* Export Options */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={downloadJSON}
                                            className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all"
                                            title="Download as JSON"
                                        >
                                            <FileJson className="w-4 h-4" />
                                            JSON
                                        </button>
                                        <button
                                            onClick={downloadCSV}
                                            className="flex items-center gap-2 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-all"
                                            title="Download as CSV"
                                        >
                                            <FileCode className="w-4 h-4" />
                                            CSV
                                        </button>
                                        <button
                                            onClick={downloadTXT}
                                            className="flex items-center gap-2 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-all"
                                            title="Download as TXT"
                                        >
                                            <FileText className="w-4 h-4" />
                                            TXT
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Statistics Cards */}
                                    {result.statistics && (
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-medium">Words</span>
                                                </div>
                                                <p className="text-xl font-bold text-blue-900">{result.statistics.wordCount.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs text-green-600 font-medium">Read Time</span>
                                                </div>
                                                <p className="text-xl font-bold text-green-900">{result.statistics.readingTime}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Hash className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs text-purple-600 font-medium">Headings</span>
                                                </div>
                                                <p className="text-xl font-bold text-purple-900">{result.statistics.headings}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl border border-orange-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <List className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs text-orange-600 font-medium">Lists</span>
                                                </div>
                                                <p className="text-xl font-bold text-orange-900">{result.statistics.lists}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-xl border border-pink-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Code2 className="w-4 h-4 text-pink-600" />
                                                    <span className="text-xs text-pink-600 font-medium">Code</span>
                                                </div>
                                                <p className="text-xl font-bold text-pink-900">{result.statistics.codeBlocks}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Page Title
                                            </label>
                                            <button
                                                onClick={() => copyToClipboard(result.title)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Copy title"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl text-gray-900 font-semibold border border-blue-100">
                                            {result.title}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {result.description && (
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                                Description
                                            </label>
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl text-gray-700 text-sm border border-purple-100">
                                                {result.description}
                                            </div>
                                        </div>
                                    )}

                                    {/* Metadata */}
                                    {(result.author || result.keywords) && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {result.author && (
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                                        Author
                                                    </label>
                                                    <div className="bg-gray-50 p-3 rounded-xl text-gray-700 text-sm border border-gray-200">
                                                        {result.author}
                                                    </div>
                                                </div>
                                            )}
                                            {result.keywords && (
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                                        Keywords
                                                    </label>
                                                    <div className="bg-gray-50 p-3 rounded-xl text-gray-700 text-sm border border-gray-200">
                                                        {result.keywords}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Extracted Content
                                            </label>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-400">{result.content.length} chars</span>
                                                <button
                                                    onClick={() => copyToClipboard(result.content)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Copy content"
                                                >
                                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-200 max-h-96 overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                                            {result.content}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">URL</label>
                                            <p className="text-xs text-gray-600 break-all">{result.url}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Extracted At</label>
                                            <p className="text-xs text-gray-600">{new Date(result.extractedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - History Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-4">
                                <History className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-bold text-gray-900">Recent Extractions</h3>
                            </div>

                            {history.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <History className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">No history yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Your recent extractions will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {history.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => loadFromHistory(item)}
                                            className="w-full text-left p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-indigo-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group"
                                        >
                                            <div className="flex items-start gap-2">
                                                <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {new URL(item.url).hostname}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(item.extractedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
