import React from "react";
import {
  Box,
  Stack,
  Avatar,
  Grid,
  Typography
} from "@mui/material";
import { useState } from "react";
import { Button } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import CloseIcon from '@mui/icons-material/Close';
import ButtonBase from '@mui/material/ButtonBase';

import {socket} from '../components/AllFriendship'
import { selectCurrentUser } from "../redux-features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "../utils/redux-hooks";

type FriendshipProps = {
    id: string,
    login: string,
    avatar: string,
    type: string,
    bgColor: string,
  };


  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

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
            <Paper
                sx={{
                    p: 2,
                    borderRadius: '6%'
                }}
                elevation={3}
            >
                <Grid container spacing={2} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    // background: 'yellow',
                }}>
                    <Grid container spacing={2} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        p: 2,
                    }}
                    zeroMinWidth
                    >
                        <Grid item>
                            <Avatar src={avatar} sx={{ width: 90, height: 90 }}/>
                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="h6" component="div" noWrap>
                                {login}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{
                            display: 'flex',
                            // background: 'red',
                            justifyContent:'flex-end',
                        }}>
                        <Grid item >
                            {type === "request" &&  <Button variant="contained" onClick={addFriend}>Ajouter</Button>}
                            {type === "requestReception" && (
                                <>
                                <Grid container item direction='row' spacing={3}>
                                    <Grid item xs={6}>
                                        <Button variant="contained" color="success" onClick={accept}>Ajouter</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button variant="outlined" color="error" onClick={deny}>Supprimer</Button>
                                    </Grid>
                                </Grid>
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
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </> 
    );
}