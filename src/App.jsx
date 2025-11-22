import './App.css'
import EmojiSuggester from './components/EmojiSuggester'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <div className="app">
      <ThemeToggle />
      <header className="app-header">
        <h1>✨ Right Emoji</h1>
        <p className="subtitle">AI-powered emoji suggestions for your phrases</p>
      </header>
      <main className="app-main">
        <EmojiSuggester />
      </main>
      <footer className="app-footer">
        <p>Powered by AI • Choose your provider in settings</p>
      </footer>
    </div>
  )
}

export default App
