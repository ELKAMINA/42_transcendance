import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Grid, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Input from "@mui/joy/Input";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { MuiColorInput } from "mui-color-input";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { socket } from "../../pages/game";
import { IRoomInfo } from "../../interface/IClientGame";

interface SettingsProps {
    clickPlay: IRoomInfo;
}

const Settings: React.FC<SettingsProps> = ({ clickPlay }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const navigate = useNavigate();
    const [board, setBoardColor] = useState("#000000");
    const [net, setNetColor] = useState("#ffffff");
    const [paddle, setPaddleColor] = useState("#ffffff");
    const [ball, setBallColor] = useState("#ffffff");
    const [points, setTotalPoints] = useState("2");
    const [open, setOpen] = useState(true);

    const handleBoard = (newValue: string) => {
        setBoardColor(newValue);
    };

    const handleNet = (newValue: string) => {
        setNetColor(newValue);
    };

    const handlePaddle = (newValue: string) => {
        setPaddleColor(newValue);
    };

    const handleBall = (newValue: string) => {
        setBallColor(newValue);
    };

    const sendCancel = () => {
        console.warn("[Settings] Button 'cancel' clicked");
        navigate("/welcome");
    };

    const sendSettings = () => {
        console.log("[Settings] Button 'submit' clicked");
        socket.emit("RequestGameSettings", {
            board: board,
            net: net,
            ball: ball,
            paddle: paddle,
            points: points,
            roomInfo: clickPlay,
        });
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog fullScreen={fullScreen} open={open} onClose={handleCancel}>
                <DialogTitle>
                    <Typography>
                        {" "}
                        As the owner of the room, you can customize the Game{" "}
                    </Typography>
                </DialogTitle>
                <Stack>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Board color:
                                </Typography>
                                <MuiColorInput
                                    format="hex"
                                    value={board}
                                    onChange={handleBoard}
                                ></MuiColorInput>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Net color:
                                </Typography>
                                <MuiColorInput
                                    format="hex"
                                    value={net}
                                    onChange={handleNet}
                                ></MuiColorInput>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Paddle color:
                                </Typography>
                                <MuiColorInput
                                    format="hex"
                                    value={paddle}
                                    onChange={handlePaddle}
                                ></MuiColorInput>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Ball color:
                                </Typography>
                                <MuiColorInput
                                    format="hex"
                                    value={ball}
                                    onChange={handleBall}
                                ></MuiColorInput>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Total Points:
                                </Typography>
                                <Input
                                    sx={{
                                        maxWidth: "229.993px",
                                        height: "55.9943px",
                                        borderRadius: "4px",
                                    }}
                                    value={points}
                                    type="Total points"
                                    size="lg"
                                    placeholder="Total points"
                                    onChange={(e: any) =>
                                        setTotalPoints(e.target.value)
                                    }
                                ></Input>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            size="medium"
                            autoFocus
                            onClick={sendCancel}
                        >
                            CANCEL
                        </Button>
                        <Button
                            variant="contained"
                            size="medium"
                            autoFocus
                            onClick={sendSettings}
                        >
                            SUBMIT
                        </Button>
                    </DialogActions>
                </Stack>
            </Dialog>
        </div>
    );
};

export default Settings;
