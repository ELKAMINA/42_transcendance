import React from "react";
import {
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from "../utils/redux-hooks";

import { selectCurrentUser } from "../redux-features/auth/authSlice";
import {socket} from '../components/AllFriendship'

type FriendshipProps = {
    id: string,
    login: string,
    avatar: string,
    type: string,
    bgColor: string,
  };

export const FriendSuggestion : React.FC<FriendshipProps> = ({id, login, avatar, type, bgColor}) => {
    // const [avt, setAvtr] = useState('')
    const sender = useAppSelector(selectCurrentUser);
    const [buttonColor, setButtonColor] = useState('red'); // State to track the button color
    const [blockBgColor, setBlockBgColor] = useState('yellowgreen');
    const dispatch = useAppDispatch();

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
        // console.log('je bloque ??')
        socket.emit('blockFriend', {
            sender: sender,
            receiver: receiver,
        })
        setButtonColor('grey')
        setBlockBgColor('grey')
    }

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
                backgroundColor: blockBgColor === 'yellowgreen' ? bgColor : blockBgColor,
                '&:hover': {
                    backgroundColor: '#AFEEEE',
                },
                opacity: 0.8,
            }}
            >
                <Stack direction="row" spacing={1} alignItems='center' >
                    <Avatar src={avatar} sx={{ width: 30, height: 30 }}/>
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
                    {(type === 'blockedFriends') && (
                        <>
                            <BlockIcon sx={{ color: 'grey', width: 20, height: 20 }}/>
                        </>
                    )}
                </Stack>
            </Box>
        </> 
    )
}