import React from "react";
import {
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import { green } from "@mui/material/colors";

type FriendshipProps = {
    login: string,
    avatar: string,
  };

export const FriendSuggestion : React.FC<FriendshipProps> = ({login, avatar}) => {
    return (
        <>
            <Box
            sx={{
                width: 100,
                height: 60,
                backgroundColor: 'primary.dark',
                '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
                },
            }}
            >
                <Stack>
                    <Avatar src={avatar}/>
                    <h1>{login}</h1>
                    <AddReactionRoundedIcon sx={{ color: green }}/>
                </Stack>
            </Box>
        </>
    )
}