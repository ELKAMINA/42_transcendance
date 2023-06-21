import React from "react";
import {
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import { Socket } from "socket.io-client";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from "../utils/redux-hooks";

// import { selectSocket } from "../redux-features/friendship/friendshipSlice";
import { selectCurrentUser } from "../redux-features/auth/authSlice";
// import { FriendReqSocket } from "../pages/friendship";
import { socket } from '../socket'


type FriendshipProps = {
    id: string,
    login: string,
    avatar: string,
    type: string,
  };

export const FriendSuggestion : React.FC<FriendshipProps> = ({id, login, avatar, type}) => {
    const sender = useAppSelector(selectCurrentUser);
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
                backgroundColor: 'yellowgreen',
                '&:hover': {
                    backgroundColor: 'grey',
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
                            <DoneIcon sx={{ color: 'green' }}/>
                            <CloseIcon sx={{ color: 'red' }}/>               
                        </>
                    )}
                </Stack>
            </Box>
        </>
    )
}