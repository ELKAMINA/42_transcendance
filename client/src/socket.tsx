// socket.js
import io from 'socket.io-client';

const socket = io('http://localhost:4001/friendship');
// socket.connect();
export default socket;
