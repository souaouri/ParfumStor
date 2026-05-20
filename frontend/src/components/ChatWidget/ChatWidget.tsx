import React, { useState, useRef, useEffect } from 'react'

type Message = {
  id: number
  text: string
  from: 'user' | 'bot'
}

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const idRef = useRef(1)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: idRef.current++, text, from: 'user' }
    setMessages((m) => [...m, userMsg])
    setInput('')

    // Simple mock bot reply (replace with real API later)
    // setTimeout(() => {
    //   const botMsg: Message = { id: idRef.current++, text: `Echo: ${text}`, from: 'bot' }
    //   setMessages((m) => [...m, botMsg])
    // }, 700)

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from bot');
      }

      const data = await response.json();
      const botMsg: Message = { id: idRef.current++, text: data.text, from: 'bot' };
      setMessages((m) => [...m, botMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      const botMsg: Message = { id: idRef.current++, text: 'Sorry, something went wrong.', from: 'bot' };
      setMessages((m) => [...m, botMsg]);
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label={open ? 'Close chat' : 'Open chat'}
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 rounded-full bg-black text-red-400 shadow-lg flex items-center justify-center hover:opacity-90 focus:outline-none"
        >
          {open ? (
            // close icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // chat icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l1.8-4A7.944 7.944 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-black rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-900">
          <div className="bg-black text-red-400 px-4 py-3 flex items-center justify-between border-b border-gray-900">
            <div className="font-medium text-red-300">Chat</div>
            <button onClick={() => setOpen(false)} className="text-red-300 opacity-90 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {messages.length === 0 && <div className="text-sm text-gray-400">Say hi</div>}
            {messages.map((m) => (
              <div key={m.id} className={`my-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'user' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'} px-3 py-2 rounded-lg max-w-[72%]`}>{m.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-900 px-3 py-3 bg-black">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                className="flex-1 border border-gray-800 bg-black placeholder-gray-500 rounded-md px-2 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              />
              <button onClick={sendMessage} className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWidget
