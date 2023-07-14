import React, { useEffect } from "react";
import {
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from "../utils/redux-hooks";
import { useState } from "react";

// import { selectSocket } from "../redux-features/friendship/friendshipSlice";
import { selectCurrentUser } from "../redux-features/auth/authSlice";
import { FetchUserByName } from "../utils/global/global";
// import { FriendReqSocket } from "../pages/friendship";
// import { socket } from '../socket'
import { socket } from '../pages/friendship';


type FriendshipProps = {
    id: string,
    login: string,
    avatar: string,
    type: string,
  };

export const FriendSuggestion : React.FC<FriendshipProps> = ({id, login, avatar, type}) => {
    const [buttonColor, setButtonColor] = useState('red'); // State to track the button color
    const [blockBgColor, setBlockBgColor] = useState('yellowgreen');
    const [avt, setAvtr] = useState('')
    const sender = useAppSelector(selectCurrentUser);
    let rec: any;

    const getTheReceiver = async () => {
        try {
            rec = await FetchUserByName(login)
            setAvtr(rec.avatar)
            avatar = ''
            console.log('le user a afficher ', avatar)
        }
        catch {
            console.log('erreur maybe')
        }
    }
    const receiver = {
        nickname: login,
        avatar: avatar,
    }
    const addFriend = () => {
        socket.emit('friendReq', {
            sender: sender,
            receiver: receiver,
        })
    }
    const accept = () => {
        socket.emit('acceptFriend', {
            sender: sender,
            receiver: receiver,
        })
    }
    const deny = () => {
        socket.emit('denyFriend', {
            sender: receiver,
            receiver: sender,
        })
    }
    const block = () => {
        socket.emit('blockFriend', {
            sender: sender,
            receiver: receiver,
        })
        setButtonColor('grey')
        setBlockBgColor('grey')
    }
    useEffect(() => {
        getTheReceiver()
    }, [])
    return (
        <>
            <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems:'center',
                width: 150,
                height: 40,
                borderRadius: 2,
                backgroundColor: blockBgColor,
                '&:hover': {
                    backgroundColor: 'grey',
                },
                opacity: 0.8,
            }}
            >
                <Stack direction="row" spacing={1} alignItems='center' >
                    <Avatar src={avt} sx={{ width: 30, height: 30 }}/>
                    <h3 style={{'color': 'black', 'fontSize': '13px'}}>{login}</h3>
                    {type === "request" && <AddIcon sx={{ color: 'yellow' }} onClick={addFriend}/>}
                    {type === "requestReception" && (
                        <>
                            <DoneIcon sx={{ color: 'green' }} onClick={accept}/>
                            <CloseIcon sx={{ color: 'red' }} onClick={deny}/>               
                        </>
                    )}
                    {(type === 'myFriends') && (
                        <>
                            <BlockIcon sx={{ color: buttonColor, width: 20, height: 20 }} onClick={block}/>
                        </>
                    )}
                </Stack>
            </Box>
        </> 
    )
}