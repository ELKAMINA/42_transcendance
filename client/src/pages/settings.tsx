import * as React from "react";
import Popup from "reactjs-popup";
import Box from "@mui/material/Box";
import { io } from "socket.io-client";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CssBaseline from "@mui/material/CssBaseline";
import { MuiOtpInput } from "mui-one-time-password-input";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Container, FormControl, Typography } from "@mui/material";

import "./settings.css";
import Cookies from "js-cookie";
import api from "../utils/Axios-config/Axios";
import { useAppSelector, useAppDispatch } from "../utils/redux-hooks";
import {
    FetchActualUser,
    selectActualUser,
} from "../redux-features/friendship/friendshipSlice";
import {
    selectCurrentUser,
    setNick,
    setAvatar,
    setTfaAuth,
    selectTfaAuth,
    setQrCode,
    selectQrCode,
    selectTfaState,
    setTfaState,
    selectAfterSub,
    setAfterSub,
    selectCurrentAccessToken,
    selectCurrentRefreshToken,
} from "../redux-features/auth/authSlice";

export const sock = io("http://localhost:4003", {
    withCredentials: true,
    transports: ["websocket"],
    upgrade: false,
    autoConnect: false,
});

/** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
export const sockChat = io("http://localhost:4002", {
    withCredentials: true,
    transports: ["websocket"],
    upgrade: false,
    autoConnect: false,
});

export const sockFriend = io("http://localhost:4006", {
    withCredentials: true,
    transports: ["websocket"],
    upgrade: false,
    autoConnect: false,
});

export function PersonalInformation() {
    const [nickname, setNickname] = React.useState("");
    const [password, setPwd] = React.useState("");
    const [avatar, setAr] = React.useState("");
    const currUser = useAppSelector(selectCurrentUser);
    const access_token = useAppSelector(selectCurrentAccessToken);
    const refresh_token = useAppSelector(selectCurrentRefreshToken);
    const [errMsg, setErrMsg] = React.useState("");
    const [confMsg, setConfMsg] = React.useState("");
    const errRef = React.useRef<HTMLInputElement>(null);
    const confRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        sock.connect();
        /** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
        sockChat.connect();
        sockFriend.connect();
        sock.on("connect", () => {});
        return () => {
            // cleanUp function when component unmount
            if (sock.connected) {
                sock.disconnect();
            }
            /** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
            if (sockChat.connected) {
                sockChat.disconnect();
            }
            if (sockFriend.connected) {
                sockFriend.disconnect();
            }
        };
    }, []);

    sock.off("UpdateInfoUser").on("UpdateInfoUser", async (data: any) => {
        // console.log(' Qui suis-je ', currUser)
        if (data.status === 403) {
            setErrMsg(data.message);
        } else if (data !== null) {
            /** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
            sockFriend.emit("autoRefreshWhenUsernameChanging", {});
            sockChat.emit("autoRefreshWhenUsernameChanging", {});
            if (data.login) dispatch(setNick(data.login));
            if (data.avatar) dispatch(setAvatar(data.avatar));
            setConfMsg("Changes saved");
            const serializedData = JSON.stringify({
                nickname: data.login,
                accessToken: access_token,
                refreshToken: refresh_token,
            });
            Cookies.set("Authcookie", serializedData, {
                sameSite: "lax",
                secure: false,
                expires: new Date(Date.now() + 1800000000),
                path: "/",
            });
        } else {
            console.log("Data is null");
        }
    });

    sock.off("exception").on("exception", function (error) {
        if (error.length > 0) {
            setErrMsg("Password must be at least 6 characters");
        }
    });

    /** ISSUE 118 ***/
    // WILL SET ERROR MESSAGE IF THE USER HAS THE STATUS 'Playing'
    sock.off("ErrorChangeProfileOnPlaying").on(
        "ErrorChangeProfileOnPlaying",
        () => {
            setErrMsg("Impossible to change settings when an user is playing");
        }
    );

    React.useEffect(() => {
        setErrMsg("");
    }, [nickname, password, avatar]);

    const [selectedImage, setSelectedImage] = React.useState<string>("");
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // setSelectedImage(reader.result as string);
                const imageSrc = reader.result as string;
                setSelectedImage(imageSrc);
                setAr(imageSrc);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        const fileInput = document.getElementById(
            "image-upload"
        ) as HTMLInputElement;
        fileInput?.click();
    };

    const handlePwdChange: any = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPwd(e.target.value);
    };

    const handleNicknameChange: any = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNickname(e.target.value);
    };

    const handleSubmit: any = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        if (nickname === "" && password === "" && avatar === "") {
            setErrMsg("Form is null");
            return;
        }
        try {
            sock.emit("changeProfile", {
                oldNick: currUser,
                login: nickname,
                pwd: password,
                atr: avatar,
            });
        } catch (err: any) {
            if (!err) setErrMsg("No Server Response");
            else setErrMsg(err.data.message);
            if (errRef && errRef.current) errRef.current.focus();
        }
    };

    const content = (
        <Container
            sx={{
                width: "40%",
                height: "40%",
                p: 2,
            }}
        >
            <CssBaseline />
            <Typography
                align="center"
                variant="h4"
                sx={{
                    margin: "5%",
                }}
            >
                Personal Information
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
            >
                <Tooltip title={errMsg}>
                    <TextField
                        error={errMsg === "" ? false : true}
                        margin="normal"
                        required
                        fullWidth
                        label="Nickname"
                        name="nickname"
                        autoComplete="nickname"
                        value={nickname}
                        onChange={handleNicknameChange}
                        autoFocus
                        sx={{
                            color: "whitesmoke",
                        }}
                    />
                </Tooltip>
                <Tooltip title={errMsg}>
                    <TextField
                        error={errMsg === "" ? false : true}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handlePwdChange}
                        helperText={errMsg}
                        autoComplete="current-password"
                        sx={{
                            "& .MuiFormHelperText-root": {
                                color: "red", // Your custom color
                            },
                        }}
                    />
                </Tooltip>
                <FormControl
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    />
                    <IconButton onClick={handleButtonClick}>
                        <Avatar
                            src={selectedImage}
                            style={{
                                margin: "10px",
                                width: "60px",
                                height: "60px",
                            }}
                        />
                    </IconButton>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Save
                </Button>
                <Typography
                    sx={{
                        color: "green",
                    }}
                    ref={confRef}
                    className={confMsg ? "confmsg" : "offscreen"}
                    aria-live="assertive"
                >
                    {confMsg}
                </Typography>
            </Box>
        </Container>
    );
    return content;
}

export function Security() {
    const user = useAppSelector(selectCurrentUser);
    const twofa = useAppSelector(selectTfaState);
    let qrcode = useAppSelector(selectQrCode);
    let [TfaCode, setTfaCode] = React.useState("");
    const [confMsg, setConfMsg] = React.useState("");
    const confRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(FetchActualUser());
        sock.connect();
        sock.on("newUserConnected", (faEnabled: boolean) => {
            dispatch(setAfterSub(true));
            dispatch(setTfaAuth(faEnabled));
            if (faEnabled) {
                dispatch(setTfaState("Two Factor authentication is ON"));
            } else dispatch(setTfaState("Two Factor authentication is OFF"));
        });
        return () => {
            if (sock.connected)
                // cleanUp function when component unmount
                sock.disconnect();
            dispatch(setAfterSub(true));
            // console.log("je rentre ici ");
            dispatch(setQrCode(""));
            // qrcode = "";
        };
    }, [dispatch]);

    const actualUser = useAppSelector(selectActualUser);

    const tfa = async () => {
        await api
            .post("http://localhost:4001/auth/2fa/generate", actualUser)
            .then((res) => {
                dispatch(setQrCode(res.data));
            })
            .catch((e) => {
                console.log("error ");
            });
    };

    const cancelTfa = async () => {
        await api
            .post("http://localhost:4001/auth/2fa/cancel", { nickname: user })
            .then((res) => {})
            .catch((e) => {
                console.log("error ");
            });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log('event ', event.target.checked)
        dispatch(setTfaAuth(event.target.checked));
        if (event.target.checked) {
            dispatch(setTfaState("Two Factor authentication is ON"));
            dispatch(setAfterSub(false));
            tfa();
        } else {
            dispatch(setTfaState("Two Factor authentication is OFF"));
            dispatch(setQrCode(""));
            setTfaCode("");
            dispatch(setAfterSub(true));
            cancelTfa();
        }
    };
    const handleSubmit = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault(); // faire pareil que ci-dessus
        await api
            .post("http://0.0.0.0:4001/auth/2fa/turn-on", {
                TfaCode,
                actualUser,
            })
            .then((res) => {
                setConfMsg("Two Factor authentication is now activated");
                setTfaCode("");
                dispatch(setQrCode(""));
                dispatch(setAfterSub(true));
            })
            .catch((e) => {
                if (e.response.data.message[0].constraints)
                    console.error(e.response.data.message[0].constraints);
                dispatch(setTfaState("Two Factor authentication is OFF"));
                dispatch(setQrCode(""));
                setTfaCode("");
                dispatch(setAfterSub(false));
                dispatch(setTfaAuth(false));
            });
    };

    const handleCode = (newValue: string) => {
        setTfaCode(newValue);
    };

    const afterSub = useAppSelector(selectAfterSub);
    const checked = useAppSelector(selectTfaAuth);
    // console.log('After Sub ', afterSub)
    return (
        <Container
            sx={{
                width: "40%",
                height: "40%",
                p: 2,
            }}
        >
            <CssBaseline />
            <Typography
                align="center"
                variant="h4"
                sx={{
                    margin: "5%",
                }}
            >
                Two Factor Authentication
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={checked ?? false}
                            onChange={handleChange}
                        />
                    }
                    label={twofa}
                    sx={{}}
                />
                {checked && (
                    <>
                        <Popup
                            position="right center"
                            on="click"
                            closeOnDocumentClick
                            modal
                            nested
                        >
                            <div></div>
                        </Popup>
                        <img src={qrcode} alt="" className="omg" />
                    </>
                )}

                {checked === true && afterSub === false && (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                flex: 1,
                            }}
                        >
                            <MuiOtpInput
                                value={TfaCode}
                                onChange={handleCode}
                                gap={1}
                                length={6}
                                margin={6}
                                sx={{
                                    fontSize: {
                                        xs: 5,
                                        sm: 8,
                                        md: 10,
                                        lg: 12,
                                    },
                                }}
                            />
                            <Button
                                className="tfa-btn"
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Send code
                            </Button>
                            <p
                                ref={confRef}
                                className={confMsg ? "confmsg" : "offscreen"}
                                aria-live="assertive"
                            >
                                {confMsg}
                            </p>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
}
