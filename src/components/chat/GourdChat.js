import React, { useState } from 'react';
import ChatApp from './chatapp'; // Importing ChatApp component
import Chatbox from './Chatbox'; // Importing Chatbox component
import './GourdChat.css'; // External CSS for styling

const ChatContainer = () => {
    const [selectedChat, setSelectedChat] = useState(null);
  
    const handleChatSelect = (chat) => {
      console.log('Selected Chat:', chat);
      setSelectedChat(chat); // Set selected chat to display in Chatbox
    };
  
    console.log('ChatContainer re-rendered'); // Debugging log
  
    return (
      <div className="chat-container">
        <div className="chat-screen-container">
          <ChatApp onChatSelect={handleChatSelect} /> {/* Pass handleChatSelect to ChatApp */}
        </div>
        <div className="chatbox-container">
          {selectedChat ? (
            <Chatbox chat={selectedChat} /> // Display selected chat
          ) : (
            <p>Select a chat to start messaging.</p>
          )}
        </div>
      </div>
    );
  };
  

export default ChatContainer;
