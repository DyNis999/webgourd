import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatapp.css';  // Import the CSS file
import axios from 'axios';
import { getUser, getToken } from '../../utils/helpers';

const ChatScreen = ({ onChatSelect }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const currentUserId = getUser()?.userId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedToken = getToken();
        if (!storedToken) throw new Error('No token found');

        const usersResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/users`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (usersResponse.status !== 200) throw new Error('Failed to fetch users');
        const usersData = usersResponse.data;
        setUsers(usersData);
        setFilteredUsers(usersData);

        const chatsResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/chat/chats`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (chatsResponse.status !== 200) throw new Error('Failed to fetch chats');
        const chatsData = chatsResponse.data;
        const recentChats = consolidateChats(chatsData.chats || []);
        setChats(recentChats);
  
        // Automatically select the most recent chat if available
        if (recentChats.length > 0) {
          onChatSelect({
            chatId: recentChats[0]._id,
            userId: recentChats[0].otherUser._id,
            userName: recentChats[0].otherUser.name
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId, triggerRefresh]);

  const consolidateChats = (chatsList) => {
    const chatPairMap = new Map();
    chatsList.forEach((chat) => {
      if (!chat.sender || !chat.user) return;
      if (chat.sender._id !== currentUserId && chat.user._id !== currentUserId) return;

      const otherUser = chat.sender._id === currentUserId ? chat.user : chat.sender;
      const chatPairKey = otherUser._id;

      if (!chatPairMap.has(chatPairKey)) {
        chatPairMap.set(chatPairKey, { ...chat, otherUser });
      } else {
        const existingChat = chatPairMap.get(chatPairKey);
        if (new Date(chat.lastMessageTimestamp) > new Date(existingChat.lastMessageTimestamp)) {
          chatPairMap.set(chatPairKey, { ...chat, otherUser });
        }
      }
    });

    return Array.from(chatPairMap.values()).sort(
      (a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
    );
  };

  const handleUserClick = (userId, userName) => {
    const chat = { userId, userName };
    onChatSelect(chat);
  };

  const handleChatClick = (chatId, userId, userName) => {
    const chat = { chatId, userId, userName };
    onChatSelect(chat);

    
  };

  const renderUserItem = (item) => (
    <div onClick={() => handleUserClick(item._id, item.name)} className="user-card">
      <div className="avatar-container">
        <img
          src={item.image || 'https://via.placeholder.com/50'}
          alt={item.name}
          className="user-avatar"
        />
        {item.isOnline && <div className="online-indicator"></div>}
      </div>
      <div className="user-name">{item.name}</div>
    </div>
  );

  const renderChatItem = (item) => (
    <div
      onClick={() => handleChatClick(item._id, item.otherUser._id, item.otherUser.name)}
      className={`chat-card ${item.lastMessageIsRead === false ? 'unread-chat-card' : ''}`}
    >
      <img
        src={item.otherUser.image || 'https://via.placeholder.com/50'}
        alt={item.otherUser.name}
        className="chat-avatar"
      />
      <div className="chat-content">
        <div className="chat-user">{item.otherUser.name}</div>
        <div className="chat-message">{item.lastMessage}</div>
        <div className="chat-timestamp">
          {new Date(item.lastMessageTimestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  const handleRefresh = () => {
    setTriggerRefresh((prev) => !prev);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);

    if (text === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const searchQuery = text.toLowerCase();
        return searchQuery.split('').every(char => userName.includes(char));
      });
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="chat-screen">
      <input
        type="text"
        className="search-input"
        placeholder="Search for users..."
        value={searchText}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          <div className="user-list">
            {filteredUsers.map(renderUserItem)}
          </div>


          <div className="chat-list">
            {chats.map(renderChatItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
