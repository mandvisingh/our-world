import { useAgentChat } from '../../hooks/useAgentChat'
import './ChatBubbles.css'

export default function ChatBubbles() {
  const { messages, typing } = useAgentChat()

  return (
    <div className="chat-container">
      <div className="chat-bubbles">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-row ${msg.from}`}>
            <img
              src={msg.from === 'her' ? '/her.svg' : '/him.svg'}
              alt={msg.from}
              className="chat-avatar"
            />
            <div className={`chat-bubble ${msg.from}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className={`chat-row ${typing}`}>
            <img
              src={typing === 'her' ? '/her.svg' : '/him.svg'}
              alt={typing}
              className="chat-avatar"
            />
            <div className={`chat-bubble ${typing} typing-bubble`}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
