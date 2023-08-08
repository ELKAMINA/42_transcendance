import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Box, Grid, Typography, Stack } from "@mui/material";
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
    const [points, setTotalPoints] = useState("2");
    const [boardColor, setBoardColor] = useState("#000000");
    const [netColor, setNetColor] = useState("#FFFFFF");
    const [scoreColor, setScoreColor] = useState("#FFFFFF");
    const [paddleColor, setPaddleColor] = useState("#FFFFFF");
    const [ballColor, setBallColor] = useState("#FFFFFF");
    const [open, setOpen] = useState(true);

    const handleBoardColor = (newValue: string) => {
        setBoardColor(newValue);
    };

    const handleNetColor = (newValue: string) => {
        setNetColor(newValue);
    };

    const handleScoreColor = (newValue: string) => {
        setScoreColor(newValue);
    };

    const handlePaddleColor = (newValue: string) => {
        setPaddleColor(newValue);
    };

    const handleBallColor = (newValue: string) => {
        setBallColor(newValue);
    };

    const sendCancel = () => {
        console.warn("[Settings] Button 'cancel' clicked");
        navigate("/welcome");
    };

    const sendSettings = () => {
        console.log("[Settings] Button 'submit' clicked");
        socket.emit("RequestGameSettings", {
            roomInfo: clickPlay,
            points: points,
            boardColor: boardColor,
            netColor: netColor,
            scoreColor: scoreColor,
            ballColor: ballColor,
            paddleColor: paddleColor,
        });
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div>
            <Box sx={{
                height: '100vh',
                alignItems: 'center',
                background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)'
            }}>
                <Dialog fullScreen={false} maxWidth={'sm'} open={open} onClose={handleCancel}>
                    <DialogTitle>
                        <Typography align='center' sx={{
                            fontSize: 50,
                            margin: 1,
                            color: '#07457E',
                            textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                            transition: 'all 0.3s ease',
                        }}>
                            Customize the Game
                        </Typography>
                        <Typography align='center' sx={{
                            fontSize: 20,
                            margin: 1,
                            color: '#07457E',
                            textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                            transition: 'all 0.3s ease',
                        }}>
                            (room owner only)
                        </Typography>
                    </DialogTitle>
                    <Stack>
                        <DialogContent>
                            <Grid container spacing={2} columns={24}>
                                <Grid item xs={12}>
                                    <Typography align='left' component="div" sx={{
                                        margin: 1,
                                        color: '#07457E',
                                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        Total points
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
                                <Grid item xs={12}>
                                    <Typography align='left' component="div" sx={{
                                        margin: 1,
                                        color: '#07457E',
                                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        Board color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={boardColor}
                                        onChange={handleBoardColor}
                                    ></MuiColorInput>
                                </Grid>

                                <Grid item xs={12}>
                                <Typography align='left' component="div" sx={{
                                        margin: 1,
                                        color: '#07457E',
                                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        Net color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={netColor}
                                        onChange={handleNetColor}
                                    ></MuiColorInput>
                                </Grid>

                                <Grid item xs={12}>
                                <Typography align='left' component="div" sx={{
                                        margin: 1,
                                        color: '#07457E',
                                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        Score color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={scoreColor}
                                        onChange={handleScoreColor}
                                    ></MuiColorInput>
                                </Grid>

                                <Grid item xs={12}>
                                <Typography align='left' component="div" sx={{
                                        margin: 1,
                                        color: '#07457E',
                                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        Paddle color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={paddleColor}
                                        onChange={handlePaddleColor}
                                    ></MuiColorInput>
                                </Grid>
                                <Grid item xs={12}>
                                <Typography align='left' component="div" sx={{
                                        margin: 1,
                                        color: '#07457E',
                                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        Ball color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={ballColor}
                                        onChange={handleBallColor}
                                    ></MuiColorInput>
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
            </Box>
        </div>
    );
};

export default Settings;

/*
        <div>
            <Dialog fullScreen={fullScreen} open={open} onClose={handleCancel}>
                <DialogTitle>
                    <Typography align='center'>
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
                                    value={boardColor}
                                    onChange={handleBoardColor}
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
                                    value={netColor}
                                    onChange={handleNetColor}
                                ></MuiColorInput>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Score color:
                                </Typography>
                                <MuiColorInput
                                    format="hex"
                                    value={scoreColor}
                                    onChange={handleScoreColor}
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
                                    value={paddleColor}
                                    onChange={handlePaddleColor}
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
                                    value={ballColor}
                                    onChange={handleBallColor}
                                ></MuiColorInput>
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
*/