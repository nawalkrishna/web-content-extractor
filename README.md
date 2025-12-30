# 🌐 Web Content Extractor

A modern, full-stack web application for extracting and analyzing content from any website. Built with React, Node.js, and powered by Supabase authentication.

![Web Content Extractor](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🎯 Core Features
- **Smart Content Extraction** - Extract clean, structured content from any website
- **Structured Data** - Automatically identifies headings, paragraphs, lists, and code blocks
- **Multiple Export Formats** - Download as JSON, CSV, or TXT
- **History Management** - Saves your last 10 extractions locally
- **Copy to Clipboard** - Quick copy for titles and content

### 📊 Content Analysis
- **Word Count** - Total words in extracted content
- **Reading Time** - Estimated time to read
- **Content Statistics** - Headings, paragraphs, lists, and code blocks count
- **Metadata Extraction** - Page title, description, author, and keywords

### 🎨 Modern UI/UX
- **Beautiful Design** - Gradient backgrounds and glass-morphism effects
- **Responsive** - Works perfectly on mobile, tablet, and desktop
- **Dark Mode Ready** - Modern color schemes
- **Smooth Animations** - Delightful user experience

### 🔐 User Management
- **Secure Authentication** - Powered by Supabase
- **User Profiles** - Manage your account and username
- **Session Management** - Secure login/logout

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **React Router** - Navigation
- **Supabase Auth** - Authentication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Cheerio** - Web scraping
- **Axios** - HTTP requests
- **CORS** - Cross-origin support

### Database & Auth
- **Supabase** - Backend as a Service

## 📦 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- Supabase account

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/web-content-extractor.git
cd web-content-extractor
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with Supabase credentials
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (`frontend/.env`)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_API_URL=http://localhost:5000
```

## 🌍 Deployment

This application is ready for deployment! See detailed guides:
- **Quick Start:** `QUICK_DEPLOY.md`
- **Full Guide:** `DEPLOYMENT_GUIDE.md`

### Recommended Hosting
- **Backend:** Render (Free tier)
- **Frontend:** Vercel (Free tier)
- **Database:** Supabase (Free tier)

## 📖 Usage

1. **Sign Up/Login** - Create an account or log in
2. **Enter URL** - Paste any website URL
3. **Extract Content** - Click "Extract Content" button
4. **View Results** - See formatted content with statistics
5. **Export** - Download in your preferred format
6. **Access History** - Click on previous extractions

## 🎯 API Endpoints

### `POST /extract`
Extract content from a URL

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "Page description",
  "content": "Formatted content...",
  "statistics": {
    "wordCount": 150,
    "readingTime": "1 min",
    "headings": 5,
    "paragraphs": 10,
    "lists": 2,
    "codeBlocks": 0
  },
  "extractedAt": "2025-12-30T12:00:00.000Z"
}
```

## 🛠️ Development

### Run Backend in Development
```bash
cd backend
npm run dev
```

### Run Frontend in Development
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Nawal Krishna


## 🙏 Acknowledgments

- Built with guidance from Claude Code
- Icons by Lucide
- Styling by Tailwind CSS
- Authentication by Supabase

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check the deployment guides

---

**Star ⭐ this repository if you found it helpful!**

