import * as React from 'react';
import io from "socket.io-client";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
// import { sendMessage } from '../features/chat/chatSlice';
// import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:4001');
socket.connect();

const Chat = () => {
    const [msg, setMsg] = React.useState("");
    const dispatch = useDispatch();
    // const chat = useSelector((state) => state?.chat);
    // const username = useSelector((state) => state?.user?.name);
    const sendMessage = () => {
        socket.emit("MsgToServer", { message: msg});
        setMsg("");
    };

    useEffect(() => {
        socket.on("MsgToClient", (data) => {
            // console.log('la data qui revient ', data)console.log(
        // dispatch(sendMessage(data));
        });
    }, []);

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