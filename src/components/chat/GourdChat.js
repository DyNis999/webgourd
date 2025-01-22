import React, { useEffect, useState } from 'react';
import { socket } from '../../socket';
import ChatApp from './chatapp';
import Chatbox from './Chatbox';
import './GourdChat.css';
import { getUser } from '../../utils/helpers';

const ChatContainer = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    // // Disconnect existing socket connection if any
    // socket.disconnect();

    // // Connect new socket and join room for selected chat
    // socket.connect();
    // socket.emit("joinRoom", { userId: chat.userId });

    setSelectedChat(chat);
  };

  useEffect(() => {

    socket.on('connect', () => {
      // console.log('Connected to socket server');
    });
    // console.log(context.stateUser?.user?.userId)
    socket.emit('joinRoom', { userId: getUser()?.id});

    return () => {
      socket.disconnect();
      // console.log('Disconnected from socket server');
    };
  },[]);

  return (
    <div className="chat-container">
      <div className="chat-screen-container">
        <ChatApp onChatSelect={handleChatSelect} />
      </div>
      <div className="chatbox-container">
        {selectedChat ? (
          <Chatbox chat={selectedChat} />
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;