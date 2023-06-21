// socket.js
import io from 'socket.io-client';

let socket: any;

const connectSocket = (namespace : any) => {
    socket = io(`http://localhost:4001/${namespace}`, {
        withCredentials: true,
        transports: ['websocket'],
        upgrade: false,
      })
};
// socket.connect();
export { socket, connectSocket };
