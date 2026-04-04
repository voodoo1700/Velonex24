import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './SocketContext';
import api from '../services/api';
import { generateSessionId } from '../utils/constants';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('bot');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const initialized = useRef(false);

  // Initialize chat session
  const initChat = useCallback(async () => {
    if (initialized.current) return;
    initialized.current = true;

    let storedSessionId = localStorage.getItem('velonex_chat_session');
    
    if (storedSessionId) {
      try {
        const data = await api.getChatSession(storedSessionId);
        setSessionId(storedSessionId);
        setMessages(data.messages || []);
        setSessionStatus(data.session.status);
        return;
      } catch {
        localStorage.removeItem('velonex_chat_session');
      }
    }

    const newSessionId = generateSessionId();
    try {
      await api.createChatSession(newSessionId, 'Visitor');
      localStorage.setItem('velonex_chat_session', newSessionId);
      setSessionId(newSessionId);
      setMessages([]);
      setSessionStatus('bot');
    } catch (err) {
      console.error('Failed to create chat session:', err);
      initialized.current = false;
    }
  }, []);

  // Join socket room when session is ready
  useEffect(() => {
    if (socket && sessionId && connected) {
      socket.emit('joinSession', { sessionId });
    }
  }, [socket, sessionId, connected]);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    const handleBotReply = (data) => {
      if (data.sessionId === sessionId) {
        setMessages(prev => [...prev, {
          sender: 'bot',
          message: data.message,
          quickActions: data.quickActions || [],
          timestamp: data.timestamp
        }]);
        setIsTyping(false);
        if (!isOpen) setUnreadCount(prev => prev + 1);
      }
    };

    const handleNewMessage = (data) => {
      if (data.sessionId === sessionId && data.sender === 'admin') {
        setMessages(prev => [...prev, {
          sender: 'admin',
          message: data.message,
          timestamp: data.timestamp
        }]);
        if (!isOpen) setUnreadCount(prev => prev + 1);
      }
    };

    const handleAdminJoin = (data) => {
      if (data.sessionId === sessionId) {
        setSessionStatus('human');
        setMessages(prev => [...prev, {
          sender: 'system',
          message: data.message,
          timestamp: data.timestamp
        }]);
      }
    };

    const handleSessionClosed = (data) => {
      if (data.sessionId === sessionId) {
        setSessionStatus('closed');
        setMessages(prev => [...prev, {
          sender: 'system',
          message: 'This conversation has been closed. Thank you for using Velonex24! 👋',
          timestamp: new Date()
        }]);
      }
    };

    const handleTyping = (data) => {
      if (data.sessionId === sessionId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on('botReply', handleBotReply);
    socket.on('newMessage', handleNewMessage);
    socket.on('adminJoin', handleAdminJoin);
    socket.on('sessionClosed', handleSessionClosed);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('botReply', handleBotReply);
      socket.off('newMessage', handleNewMessage);
      socket.off('adminJoin', handleAdminJoin);
      socket.off('sessionClosed', handleSessionClosed);
      socket.off('typing', handleTyping);
    };
  }, [socket, sessionId, isOpen]);

  // Send message
  const sendMessage = useCallback((text) => {
    if (!socket || !sessionId || !text.trim()) return;

    const userMsg = {
      sender: 'user',
      message: text.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    socket.emit('userMessage', {
      sessionId,
      message: text.trim()
    });

    if (sessionStatus === 'bot') setIsTyping(true);
  }, [socket, sessionId, sessionStatus]);

  // Send quick action
  const sendQuickAction = useCallback((value) => {
    sendMessage(value);
  }, [sendMessage]);

  // Toggle chat
  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        setUnreadCount(0);
        if (!initialized.current) initChat();
      }
      return !prev;
    });
  }, [initChat]);

  // Start new session
  const startNewSession = useCallback(async () => {
    initialized.current = false;
    localStorage.removeItem('velonex_chat_session');
    setMessages([]);
    setSessionId(null);
    setSessionStatus('bot');
    await initChat();
  }, [initChat]);

  return (
    <ChatContext.Provider value={{
      isOpen,
      messages,
      sessionId,
      sessionStatus,
      isTyping,
      unreadCount,
      toggleChat,
      sendMessage,
      sendQuickAction,
      startNewSession,
      initChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
