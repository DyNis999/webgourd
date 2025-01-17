import { io } from 'socket.io-client';

// Socket connection configuration
const config = {
    autoConnect: false,
    reconnection: true, // enables auto reconnection
    reconnectionAttempts: 10, // maximum attempts
    reconnectionDelay: 500, // initial delay in ms between attempts
    reconnectionDelayMax: 2000, // max delay in ms between reconnection attempts
    timeout: 5000, // connection timeout before failing
};

// Create socket instance with the server URL
export const socket = io('http://localhost:4000', config);
