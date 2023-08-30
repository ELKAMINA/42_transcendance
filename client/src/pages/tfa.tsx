import * as React from "react";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";

import "./home.css";
import api from "../utils/Axios-config/Axios";
import {
    selectCurrentUser,
    setSignCredentials,
} from "../redux-features/auth/authSlice";

function Tfa() {
    let nickname: string;
    const dispatch = useAppDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    nickname = useAppSelector(selectCurrentUser);
    const param = searchParams.get("param1");
    if (param && nickname === "") nickname = param;
    const navigate = useNavigate();
    let [TfaCode, setTfaCode] = React.useState("");

    const handleSubmit = async () => {
        try {
            await api
                .post("http://localhost:4001/auth/2fa/authenticate", {
                    TfaCode,
                    nickname,
                })
                .then((res) => {
                    dispatch(setSignCredentials({ ...res.data, nickname }));
                    navigate("/welcome");
                })
                .catch((e) => {
                    if (e.message)
                        console.error("Authentication with TFA has failed");
                    navigate("/sign");
                });
        } catch {
            console.log("2FA has failed");
        }
    };
    const handleCode = (newValue: string) => {
        setTfaCode(newValue);
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                background:
                    "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 70%)",
                justifyContent: "space-evenly",
            }}
        >
            <Typography
                sx={{
                    color: "#07457E",
                    fontSize: "40px",
                    textShadow:
                        "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                }}
            >
                {" "}
                Enter your TFA code to Sign in{" "}
            </Typography>
            <MuiOtpInput
                width="50%"
                value={TfaCode}
                onChange={handleCode}
                gap={3}
                length={6}
                margin="6%"
            />
            <Button
                className="mui-btn"
                type="submit"
                variant="contained"
                onClick={handleSubmit}
            >
                Send code
            </Button>
            <Button
                className="mui-btn"
                type="submit"
                variant="contained"
                onClick={handleCancel}
            >
                Cancel
            </Button>
        </Box>
    );
}

export default Tfa;
