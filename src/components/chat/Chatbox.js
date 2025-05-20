import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../socket/index';
import { getUser, getToken } from '../../utils/helpers';
import './chatbox.css'; // Separate the styles into a CSS file
import { filterBadWords } from '../Layout/filteredwords';

const Chatbox = ({ chat }) => {
  const receiverId = chat?.userId;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef(null); // Ref for the message list
  const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if the user scrolled up

  // Fetch messages from the server
  const fetchMessages = async () => {
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const senderId = getUser()?.id;
      if (!senderId || !token) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/chat/messages/${senderId}/${receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(response.data.messages || []);
      markMessagesAsRead(response.data.messages); // Mark all fetched messages as read
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messages) => {
    const token = getToken();
    const senderId = getUser()?.id;

    if (!senderId || !token) {
      console.error('Authentication failed');
      return;
    }

    try {
      const messageIds = messages
        .filter((msg) => msg.user !== senderId && !msg.read)
        .map((msg) => msg._id);

      if (messageIds.length > 0) {
        await axios.put(
          `${process.env.REACT_APP_API}/api/v1/chat/messages/read`,
          { messages: messageIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );

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
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Socket event listener for new messages
  useEffect(() => {
    let unsubsribe = socket.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      fetchMessages();
      markMessagesAsRead([message]);
      scrollToBottom(); // Scroll to bottom for new messages
    });
    return () => {
      unsubsribe = null;
    };
  }, []);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    });
    setIsScrolledUp(false);
  };

  // Handle user scrolling
  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      setIsScrolledUp(scrollTop + clientHeight < scrollHeight - 50);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Filter bad words before sending
    const filteredMessage = filterBadWords(newMessage.trim());

    const tempMessage = {
      _id: new Date().toISOString(),
      sender: { _id: getUser()?.id },
      message: filteredMessage,
      createdAt: new Date(),
      timestamp: new Date()
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
        message: filteredMessage,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/chat/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      const socketdata = {
        recipientId: response.data.chat.user,
        message: response.data.chat.message,
        senderId: response.data.chat.sender._id,
      };

      console.log('Message sent:', response.data);
      socket.emit('sendMessage', socketdata);
      markMessagesAsRead([response.data.chat]);
    } catch (err) {
      console.error('Error sending message:', err.message);
    }
  };

  // Render a single message
  const renderMessage = (message) => {
    const senderId = message.sender?._id || message.sender?.id;
    const currentUserId = getUser()?.id;
    const isMyMessage = senderId === currentUserId;

    const messageTime = message.timestamp || message.createdAt;

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