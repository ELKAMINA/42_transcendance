import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { Box, Container, FormControl } from "@mui/material";

import logoft from "../img/42 white.png";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../types/users/userType";
import { useAppDispatch } from "../utils/redux-hooks";
import { FetchUserByName } from "../utils/global/global";
import { resetChannelStore } from "../redux-features/chat/channelsSlice";
import { resetChannelType } from "../redux-features/chat/createChannel/channelTypeSlice";
import {
    useSignupMutation,
    useSigninMutation,
    useCheckPwdMutation,
} from "../app/api/authApiSlice";
import {
    resetChannelName,
    resetChannelNameStore,
} from "../redux-features/chat/createChannel/channelNameSlice";
import {
    setSignCredentials,
    setAvatar,
    setNick,
    resetAuthStore,
} from "../redux-features/auth/authSlice";
import { resetFriendshipStore } from "../redux-features/friendship/friendshipSlice";

interface Signing {
    intro: string;
    type: string;
}

export default function Sign(props: Signing) {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const dispatch = useAppDispatch();
    const userRef = React.useRef<HTMLInputElement>(null);
    const errRef = React.useRef<HTMLInputElement>(null);
    const [nickname, setNickname] = React.useState("");
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [password, setPwd] = React.useState("");
    // const [avtr, setAr] = React.useState('')
    const [errMsg, setErrMsg] = React.useState("");
    // const tfaInput = useAppSelector(selectTfaInput)
    const [signin] = useSigninMutation();
    const [signup] = useSignupMutation(); // isLoading : Frequently Used Query Hook Return Values => When true, indicates that the query is currently loading for the first time, and has no data yet. This will be true for the first request fired off, but not for subsequent requests.
    const [checkPwd] = useCheckPwdMutation();
    const navigate = useNavigate();
    const [IsFt, setFt] = useState<string>("");

    React.useEffect(() => {
        dispatch(resetAuthStore());
        dispatch(resetFriendshipStore());
        dispatch(resetChannelType());
        dispatch(resetChannelName());
        dispatch(resetChannelStore());
        dispatch(resetChannelNameStore());
        if (userRef && userRef.current) userRef.current.focus();
    }, [dispatch]);

    React.useEffect(() => {
        // console.log('je rentre ici 1')
        if (error) {
            // console.log('je rentre ici 2', error)
            setErrMsg("Credentials taken");
        }
    }, [error]);

    // console.log('ereuuur state ', errMsg)
    React.useEffect(() => {
        if (error === null) setErrMsg("");
    }, [nickname, password, error]);

    const ft_auth = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setFt(event.currentTarget.name);
        window.open("http://localhost:4001/auth/42/callback", "_self");
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageSrc = reader.result as string;
                setSelectedImage(imageSrc);
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data === null) {
            setErrMsg("Form is null");
            return;
        }
        const nicknameValue = data.get("nickname");
        const passwordValue = data.get("password");
        if (nicknameValue === null || passwordValue === null) {
            setErrMsg("Nickname or password is missing");
            return;
        }
        const nickname: string = nicknameValue.toString();
        const password: string = passwordValue.toString();
        try {
            let userData = null;
            let avatar: string = "";
            if (selectedImage) {
                dispatch(setAvatar(selectedImage));
                avatar = selectedImage;
            }
            if (props.type === "Sign up") {
                if (IsFt !== "42") {
                    userData = await signup({
                        nickname,
                        password,
                        avatar,
                        type: "notTfa",
                    }).unwrap(); // unwrap extracts the payload of a fulfilled action or to throw either the error
                }
            } else {
                let user: UserModel;
                try {
                    user = await FetchUserByName(nickname);
                    if (user.faEnabled) {
                        dispatch(setNick(nickname));
                        await checkPwd({ nickname, password })
                            .unwrap()
                            .then(() => {
                                navigate("/tfa");
                            });
                    } else {
                        if (IsFt !== "42") {
                            userData = await signin({
                                nickname,
                                password,
                                avatar,
                                type: "notTfa",
                            })
                                .unwrap()
                                .then((userData: any) => {
                                    dispatch(
                                        setSignCredentials({
                                            ...userData,
                                            nickname,
                                        })
                                    );
                                    navigate("/welcome");
                                });
                        }
                    }
                } catch (err: any) {
                    if (
                        err.data &&
                        err.data.message &&
                        typeof err.data.message === "string"
                    ) {
                        setErrMsg(err.data.message);
                    } else setErrMsg("No user found");
                    navigate("/");
                }
            }
            if (userData) {
                dispatch(setSignCredentials({ ...userData, nickname }));
                navigate("/welcome");
            }
        } catch (err: any) {
            if (err) {
                // console.log('error ', err);
                if (err.status === 400) {
                    setErrMsg(
                        "Nickname must be at least 1 character and less than 24 characters && Password must be at least 6 characters && Field must not be empty\n"
                    );
                } else if (
                    err.data &&
                    err.data.message &&
                    typeof err.data.message === "string"
                ) {
                    setErrMsg(err.data.message);
                } else setErrMsg("No user found");
            }
            if (!err) setErrMsg("No Server Response");
            if (errRef && errRef.current) errRef.current.focus();
        }
        setNickname("");
        setPwd("");
        // setAr('')
    };
    const content = (
        <Container>
            <CssBaseline />
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
                        autoFocus
                        helperText=""
                        sx={{
                            "& .MuiFormHelperText-root": {
                                color: "red", // Your custom color
                            },
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
                        helperText=""
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
                    {props.type}
                </Button>
                <Button
                    name="42"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1.5, mb: 2 }}
                    onClick={ft_auth}
                >
                    <span>{props.type} with</span>
                    <img src={logoft} alt="42" width={"20px"} />
                </Button>
            </Box>
        </Container>
    );
    return content;
}
