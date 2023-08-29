import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Box, Grid, Typography, Stack } from "@mui/material";
import Input from "@mui/joy/Input";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { MuiColorInput } from "mui-color-input";
import DialogTitle from "@mui/material/DialogTitle";
import { socket } from "../../pages/game";
import { IRoomInfo } from "../../interface/IClientGame";
import Navbar from "../../components/NavBar";

interface SettingsProps {
    clickPlay: IRoomInfo;
}

const Settings: React.FC<SettingsProps> = ({ clickPlay }) => {
    const currentRoute = window.location.pathname;
    const navigate = useNavigate();
    const defaultBoardColor = "#000000";
    const defaultGameObjectColor = "#FFFFFF";
    const maxPoint = 2000;
    const [points, setTotalPoints] = useState("2");
    const [boardColor, setBoardColor] = useState(defaultBoardColor);
    const [netColor, setNetColor] = useState(defaultGameObjectColor);
    const [scoreColor, setScoreColor] = useState(defaultGameObjectColor);
    const [paddleColor, setPaddleColor] = useState(defaultGameObjectColor);
    const [ballColor, setBallColor] = useState(defaultGameObjectColor);
    const [open, setOpen] = useState(true);
    const [pointsError, setPointsError] = useState(false);
    const [boardColorError, setBoardColorError] = useState(false);
    const [netColorError, setNetColorError] = useState(false);
    const [scoreColorError, setScoreColorError] = useState(false);
    const [paddleColorError, setPaddleColorError] = useState(false);
    const [ballColorError, setBallColorError] = useState(false);

    const isHexColor = (value: string): boolean => {
        if (!value || value.length !== 7 || value.at(0) !== "#") {
            return false;
        }
        return true;
    };

    const handleScore = (event: any) => {
        const value = event.target.value;
        const numValue = parseInt(value, 10);

        if (isNaN(numValue) || numValue <= 0 || numValue > maxPoint) {
            setPointsError(true);
            setTotalPoints("");
        } else {
            setPointsError(false);
            setTotalPoints(value);
        }
    };

    const handleBoardColor = (newValue: string) => {
        if (isHexColor(newValue) === false) {
            setBoardColorError(true);
            setBoardColor(defaultBoardColor);
        } else {
            setBoardColorError(false);
            setBoardColor(newValue);
        }
    };

    const handleNetColor = (newValue: string) => {
        if (isHexColor(newValue) === false) {
            setNetColorError(true);
            setNetColor(defaultGameObjectColor);
        } else {
            setNetColorError(false);
            setNetColor(newValue);
        }
    };

    const handleScoreColor = (newValue: string) => {
        if (isHexColor(newValue) === false) {
            setScoreColorError(true);
            setScoreColor(defaultGameObjectColor);
        } else {
            setScoreColorError(false);
            setScoreColor(newValue);
        }
    };

    const handlePaddleColor = (newValue: string) => {
        if (isHexColor(newValue) === false) {
            setPaddleColorError(true);
            setPaddleColor(defaultGameObjectColor);
        } else {
            setPaddleColorError(false);
            setPaddleColor(newValue);
        }
    };

    const handleBallColor = (newValue: string) => {
        if (isHexColor(newValue) === false) {
            setBallColorError(true);
            setBallColor(defaultGameObjectColor);
        } else {
            setBallColorError(false);
            setBallColor(newValue);
        }
    };

    const sendCancel = () => {
        // console.warn("[Settings] Button 'cancel' clicked");
        navigate("/welcome");
    };

    const sendSettings = () => {
        if (
            pointsError ||
            boardColorError ||
            netColorError ||
            scoreColorError ||
            paddleColorError ||
            ballColorError
        ) {
            return;
        }
        // console.log("[Settings] Button 'submit' clicked");
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

    // HANDLE CANCEL ONLY BY CLINKING ON "CANCEL" BUTTON
    const handleCancel = (event: object, reason: string) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setOpen(false);
        }
    };

    return (
        <div>
            <Navbar currentRoute={currentRoute} />
            <Box
                sx={{
                    height: "100vh",
                    alignItems: "center",
                    background:
                        "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)",
                }}
            >
                <Dialog
                    fullScreen={false}
                    maxWidth={"sm"}
                    open={open}
                    onClose={handleCancel}
                    disableEscapeKeyDown={true}
                >
                    <DialogTitle>
                        <Typography
                            align="center"
                            sx={{
                                fontSize: 50,
                                margin: 1,
                                color: "#07457E",
                                textShadow:
                                    "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                transition: "all 0.3s ease",
                            }}
                        >
                            Customize the Game
                        </Typography>
                        <Typography
                            align="center"
                            sx={{
                                fontSize: 20,
                                margin: 1,
                                color: "#07457E",
                                textShadow:
                                    "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                transition: "all 0.3s ease",
                            }}
                        >
                            (room owner only)
                        </Typography>
                    </DialogTitle>
                    <Stack>
                        <DialogContent>
                            <Grid container spacing={2} columns={24}>
                                <Grid item xs={12}>
                                    <Typography
                                        align="left"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Total points (1 &ge; x &le; {maxPoint})
                                    </Typography>
                                    <Input
                                        sx={{
                                            maxWidth: "229.993px",
                                            height: "55.9943px",
                                            borderRadius: "4px",
                                        }}
                                        value={points}
                                        size="lg"
                                        placeholder="Total points"
                                        required={true}
                                        error={pointsError}
                                        type="number"
                                        onChange={handleScore}
                                    ></Input>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        align="left"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Board color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={boardColor}
                                        required={true}
                                        error={boardColorError}
                                        onChange={handleBoardColor}
                                    ></MuiColorInput>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        align="left"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Net color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={netColor}
                                        required={true}
                                        error={netColorError}
                                        onChange={handleNetColor}
                                    ></MuiColorInput>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        align="left"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Score color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={scoreColor}
                                        required={true}
                                        error={scoreColorError}
                                        onChange={handleScoreColor}
                                    ></MuiColorInput>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        align="left"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Paddle color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={paddleColor}
                                        required={true}
                                        error={paddleColorError}
                                        onChange={handlePaddleColor}
                                    ></MuiColorInput>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        align="left"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Ball color
                                    </Typography>
                                    <MuiColorInput
                                        format="hex"
                                        value={ballColor}
                                        required={true}
                                        error={ballColorError}
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
