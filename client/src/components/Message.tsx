import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
// import socket from '../utils/Socketio-config/socketConfig';
import { selectCurrentAccessToken } from '../redux-features/auth/authSlice';
// import { sendMessage } from '../features/chat/chatSlice';
// import { useNavigate } from 'react-router-dom';

// socket.connect();

const Chat = () => {
    const [msg, setMsg] = React.useState("");
    const socket = io('http://localhost:4001/chat');
    // const access_token = useSelector(selectCurrentAccessToken)
    // const [recv, setrecp] = React.useState("");
    // const dispatch = useDispatch();
    // const chat = useSelector((state) => state?.chat);
    // const username = useSelector((state) => state?.user?.name);
    const sendMessage = () => {
        // console.log('lol');
        socket.emit('MsgToServer', {msg:"Hello, i'm the client REACT"})
        // const socket = io('http://localhost:4001/chat');   
        // socket.on("MsgToClient", (data) => {
        //     console.log('la data qui revient ');
        //     // dispatch(sendMessage(data));
        // });
        };

        socket.on('onMessage', (data)=> {
            // console.log("la data reçue du serveur ", data);
        });
        
        useEffect(() => {
            socket.on('connect', () => {
                // console.log('From Client side --  Connected ')
            })
            return () => {
                // console.log('Unregistering events...');
                socket.off('onMessage');
            }
        } //when the component mounts, the connection between server and client is on
        , []);

    return (
        <>
        <h1> Private Chatting </h1>
        {/* <div>
            {chat?.map((item, id) => (
            <p
                key={id.toString()}
                className={
                username === item?.name ? "text text-left" : "text text-right"
                }
            >
                <span className={username === item?.name ? " capsule you" : " capsule other"}>
                {item.message}
                <small>{item.name}</small>
                </span>
            </p>
            ))}
        </div> */}
        <div className="chatdiv">
            <input
            type="text"
            placeholder="Message...."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
        </>
    );
}

  

export default Chat;