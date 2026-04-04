import { useRef, useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/constants';

const ChatWidget = () => {
  const {
    isOpen, messages, sessionStatus, isTyping,
    unreadCount, toggleChat, sendMessage, sendQuickAction,
    startNewSession, initChat
  } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasGreeted = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Auto-greet on first open
  useEffect(() => {
    if (isOpen && !hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true;
      initChat().then(() => {
        setTimeout(() => sendMessage('hello'), 500);
      });
    }
  }, [isOpen, messages.length]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickAction = (value) => {
    sendQuickAction(value);
  };

  return (
    <>
      {/* Floating Trigger Button — FedEx "ASK FEDEX" style */}
      <motion.button
        className="chat-widget-trigger"
        onClick={toggleChat}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        id="chat-trigger"
      >
        <MessageCircle size={18} />
        {isOpen ? 'CLOSE' : 'ASK VELONEX'}
        {!isOpen && unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-header-avatar">
                  <MessageCircle size={18} color="white" />
                </div>
                <div className="chat-header-text">
                  <h4>Velonex24 Support</h4>
                  <div className="chat-header-status">
                    <span className="dot"></span>
                    <span>{sessionStatus === 'human' ? 'Live Agent' : 'Online'}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={startNewSession}
                  className="chat-close-btn"
                  title="New conversation"
                >
                  <RotateCcw size={14} />
                </button>
                <button onClick={toggleChat} className="chat-close-btn">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.sender === 'system' ? (
                    <div className="chat-notice">{msg.message}</div>
                  ) : (
                    <div className={`chat-bubble ${msg.sender}`}>
                      {msg.sender === 'admin' && (
                        <div className="sender-label">🟢 Support Agent</div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                      <div className="timestamp">{formatTime(msg.timestamp)}</div>

                      {/* Quick Actions */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="quick-actions">
                          {msg.quickActions.map((action, j) => (
                            <button
                              key={j}
                              className="quick-action-btn"
                              onClick={() => handleQuickAction(action.value)}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="chat-bubble bot" style={{ padding: '8px 14px' }}>
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {sessionStatus !== 'closed' && (
              <form className="chat-input-area" onSubmit={handleSend}>
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={sessionStatus === 'human' ? 'Message support agent...' : 'Type a message...'}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!input.trim()}
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
