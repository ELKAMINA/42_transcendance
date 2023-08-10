import { useState } from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from "../../components/NavBar";
import { IPongProps } from "../../interface/IClientGame";
import { useAppSelector } from "../../utils/redux-hooks";
import { selectCurrentUser } from "../../redux-features/auth/authSlice";

const EndGame: React.FC<IPongProps> = ({ room }) => {
    const theme = useTheme();
    const user = useAppSelector(selectCurrentUser);
    const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const [open, setOpen] = useState(true);
    const currentRoute = window.location.pathname;
    const navigate = useNavigate();

    const handleCancel = () => {
        setOpen(false);
    };

    const goHome = () => {
        navigate("/welcome");
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
            <DialogActions>
                <Button
                    variant="contained"
                    size="medium"
                    autoFocus
                    onClick={goHome}
                >
                    Back home
                </Button>
            </DialogActions>
        </div>
    );
};

export default EndGame;
