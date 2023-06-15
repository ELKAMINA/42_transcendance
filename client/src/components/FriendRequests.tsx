import React from "react";
import {
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from "../utils/redux-hooks";

import { selectSocket } from "../redux-features/friendship/friendshipSlice";

type FriendshipProps = {
    id: string,
    login: string,
    avatar: string,
    type: string,
  };

export const FriendSuggestion : React.FC<FriendshipProps> = ({id, login, avatar, type}) => {
    const socket = useAppSelector(selectSocket);
    const addFriend = () => {
        console.log("Est ce que j'ai récupéré la socket ou pas ?? ", socket )
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