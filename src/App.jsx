import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "SYSTEM ONLINE. ArcadeBot v1.0 ready for communication! ⚡", sender: 'bot' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const botResponses = [
    "PROCESSING... That's a great question! ⚡",
    "SYSTEM RESPONSE: Excellent thinking pattern detected! 🎯",
    "ARCADE MODE: That reminds me of classic gameplay! 🕹️",
    "HIGH SCORE: You've got the spirit of a true gamer! 🏆",
    "LEVEL UP: That's some next-level thinking! 🚀",
    "GAME ON: I love your arcade energy! 🎮",
    "PLAYER 1: You're speaking my language! 🌟",
    "BOSS BATTLE: That's champion-level thinking! ⚔️",
    "CONTINUE: You've got the heart of a true arcade master! 🎯",
    "EXTRA LIFE: That's what I call high-score thinking! 🎪",
    "POWER-UP: I'm getting energized just thinking about it! ⚡",
    "BONUS POINTS: That's a question worth 1000 points! 🎮",
    "SOUND ON: I can almost hear the classic arcade sounds! 🔊",
    "COIN INSERTED: You're thinking like a true arcade champion! 🪙",
    "GAME OVER: Just kidding! That's some next-level gameplay! 🎲"
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage = { id: Date.now() + 1, text: data.message, sender: 'bot' }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback to random response if server fails
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      const botMessage = { id: Date.now() + 1, text: randomResponse, sender: 'bot' }
      setMessages(prev => [...prev, botMessage])
    }
    
    setIsTyping(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">⚡ ARCADE CHAT ⚡</h1>
        <div className="game-subtitle">Classic Gaming Terminal</div>
      </div>
      
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <span className="typing-dots">●</span>
                <span className="typing-dots">●</span>
                <span className="typing-dots">●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here, player..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            SEND
          </button>
        </div>
      </div>
      
      <div className="game-footer">
        <div className="pixel-border"></div>
        <div className="footer-text">GAME ON! Insert coin to continue! 🪙</div>
      </div>
    </div>
  )
}

export default App
