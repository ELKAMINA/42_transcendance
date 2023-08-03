import { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Navbar from "../../components/NavBar";
import { PongProps } from "../../data/gameInfo";
import { socket } from "../../pages/game";
import { selectCurrentUser } from "../../redux-features/auth/authSlice";
import { useAppSelector } from "../../utils/redux-hooks";

export const EndGame: React.FC<PongProps> = ({ room }) => {
    const theme = useTheme();
    const user = useAppSelector(selectCurrentUser);
    const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const [open, setOpen] = useState(true);
    const currentRoute = window.location.pathname;

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div>
            <Navbar currentRoute={currentRoute} />
            <Dialog fullScreen={fullScreen} open={open} onClose={handleCancel}>
                {user === room.players[0] &&
                    room.scorePlayers[0] > room.scorePlayers[1] && (
                        <>
                            <DialogTitle>You win </DialogTitle>
                            <DialogContent>
                                {" "}
                                Score : {room.scorePlayers[0]} :{" "}
                                {room.scorePlayers[1]}
                            </DialogContent>
                        </>
                    )}
                {user === room.players[0] &&
                    room.scorePlayers[0] < room.scorePlayers[1] && (
                        <>
                            <DialogTitle>You Lose </DialogTitle>
                            <DialogContent>
                                {" "}
                                Score : {room.scorePlayers[0]} :{" "}
                                {room.scorePlayers[1]}
                            </DialogContent>
                        </>
                    )}
                {user === room.players[1] &&
                    room.scorePlayers[0] > room.scorePlayers[1] && (
                        <>
                            <DialogTitle>You lose </DialogTitle>
                            <DialogContent>
                                {" "}
                                Score : {room.scorePlayers[0]} :{" "}
                                {room.scorePlayers[1]}
                            </DialogContent>
                        </>
                    )}
                {user === room.players[1] &&
                    room.scorePlayers[0] < room.scorePlayers[1] && (
                        <>
                            <DialogTitle>You Win </DialogTitle>
                            <DialogContent>
                                {" "}
                                Score : {room.scorePlayers[0]} :{" "}
                                {room.scorePlayers[1]}
                            </DialogContent>
                        </>
                    )}
            </Dialog>
        </div>
    );
};
