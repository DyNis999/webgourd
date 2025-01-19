import { io } from 'socket.io-client';

const config = {
    autoConnect: false,
};

// Use window.location.hostname to dynamically get the current IP/hostname
export const socket = io(`http://${window.location.hostname}:4000`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
    timeout: 5000,
});