import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../socket/index';
import { getUser, getToken } from '../../utils/helpers';
import './chatbox.css'; // Separate the styles into a CSS file

const Chatbox = ({ chat }) => {
  const receiverId = chat?.userId;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef(null); // Ref for the message list
  const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if the user scrolled up

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const senderId = getUser()?.id;
      if (!senderId || !token) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/v1/chat/messages/${senderId}/${receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(response.data.messages || []);
      
      // Mark all fetched messages as read
      markMessagesAsRead(response.data.messages);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  const markMessagesAsRead = async (messages) => {
    const token = getToken();
    const senderId = getUser()?.id;
  
    if (!senderId || !token) {
      console.error('Authentication failed');
      return;
    }
  
    try {
      // Make API request to mark messages as read
      const messageIds = messages.filter(msg => msg.user !== senderId && !msg.read).map(msg => msg._id);
  
      if (messageIds.length > 0) {
        await axios.put(
          'http://localhost:4000/api/v1/chat/messages/read',
          { messages: messageIds },  // Update the key to 'messages'
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update message state to mark messages as read
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (err) {
      console.error('Error marking messages as read:', err.message);
    }
  };
  

  useEffect(() => {
    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      markMessagesAsRead([message]); // Mark the newly received message as read
      scrollToBottom(); // Scroll to bottom when a new message is received
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    });
    setIsScrolledUp(false); // Reset scrolled state
  };

  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      setIsScrolledUp(scrollTop + clientHeight < scrollHeight - 50); // Check if user scrolled up
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      _id: new Date().toISOString(),
      sender: { _id: getUser()?.id },
      message: newMessage.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage('');

    try {
      const storedToken = getToken();
      const senderId = getUser()?.id;

      if (!storedToken || !senderId) throw new Error('Authentication failed');

      const messageData = {
        sender: senderId,
        user: receiverId,
        message: newMessage.trim(),
      };

      const response = await axios.post(
        `http://localhost:4000/api/v1/chat/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      socket.emit('sendMessage', { ...response.data.chat, id: response.data.chat.user });
      markMessagesAsRead([response.data.chat]); // Mark the sent message as read
    } catch (err) {
      console.error('Error sending message:', err.message);
    }
  };

  const renderMessage = (message) => {
    const senderId = message.sender?._id || message.sender?.id;
    const currentUserId = getUser()?.id;
    const isMyMessage = senderId === currentUserId;

    return (
      <div
        key={message._id}
        className={`message-wrapper ${isMyMessage ? 'my-message-wrapper' : 'other-message-wrapper'}`}
      >
        {!isMyMessage && (
          <img
            src={message.sender?.image || 'https://via.placeholder.com/50'}
            alt="user-avatar"
            className="user-avatar"
          />
        )}
        <div className={`message-container ${isMyMessage ? 'my-message' : 'other-message'}`}>
          <p className="message-text">{message.message}</p>
          <p className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="chatbox-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div
          className="message-list"
          ref={messageListRef}
          onScroll={handleScroll}
        >
          {messages.map((message) => renderMessage(message))}
        </div>
      )}

      {isScrolledUp && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}>
          ⬇
        </button>
      )}

      <div className="input-container">
        <input
          type="text"
          className="text-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
