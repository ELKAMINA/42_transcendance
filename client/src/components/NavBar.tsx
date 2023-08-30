import Cookies from "js-cookie";
import Menu from "@mui/material/Menu";
import { Container } from "@mui/material";
import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import TelegramIcon from "@mui/icons-material/Telegram";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import api from "../utils/Axios-config/Axios";
import { EClientPlayType } from "../enum/EClientGame";
import { useLogOutMutation } from "../app/api/authApiSlice";
import { useAppSelector, useAppDispatch } from "../utils/redux-hooks";
import { FetchActualUser } from "../redux-features/friendship/friendshipSlice";
import {
    selectCurrentUser,
    selectCurrentAvatar,
    selectCurrentAccessToken,
    selectCurrentRefreshToken,
    logOut,
} from "../redux-features/auth/authSlice";

interface NavbarProps {
    currentRoute: string;
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#07457E",
        },
    },
});

const Navbar: React.FC<NavbarProps> = ({ currentRoute }) => {
    const dispatch = useAppDispatch();
    const nickname = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const [logout] = useLogOutMutation();
    const access_token = useAppSelector(selectCurrentAccessToken);
    const refresh_token = useAppSelector(selectCurrentRefreshToken);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getMyProfile = async () => {
        await api
            .get("http://localhost:4001/user/userprofile", {
                params: {
                    ProfileName: nickname,
                },
            })
            .then((res) => {
                navigate(`/userprofile?data`, { state: { data: res.data } });
            })
            .catch((e) => {
                console.log("ERROR from request with params ", e);
            });
    };

    const loggingOut = async (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        event.preventDefault();
        await logout({ nickname, access_token, refresh_token });
        if (Cookies.get("Authcookie") !== undefined)
            Cookies.remove("Authcookie", { path: "/", domain: "localhost" });
        dispatch(logOut(nickname));
        navigate("/sign");
    };

    const handleSubmit = async (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        event.preventDefault();
        navigate("/settings");
    };

    const home = async () => {
        navigate("/welcome");
    };

    const chat = () => {
        navigate("/chat");
    };

    const friendship = () => {
        navigate("/friendship");
    };

    const play = () => {
        navigate(`/game?data`, {
            state: {
                data: {
                    type: EClientPlayType.RANDOM,
                    sender: "",
                    receiver: "",
                },
            },
        });
    };

    useEffect(() => {
        dispatch(FetchActualUser());
        return () => {};
    }, [dispatch]);

    const srcAvatar = useAppSelector(selectCurrentAvatar);

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="primary">
                <Toolbar
                    variant="dense"
                    sx={{
                        height: "8vh",
                    }}
                >
                    <Container
                        sx={{
                            display: "flex",
                            flexGrow: "0.2",
                            justifyContent: "space-around",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <HomeIcon
                            sx={(theme) => ({
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.1rem",
                                    md: "1.3rem",
                                    lg: "1.7rem",
                                },
                            })}
                            onClick={home}
                        />
                        <PersonAddIcon
                            sx={(theme) => ({
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.1rem",
                                    md: "1.3rem",
                                    lg: "1.7rem",
                                },
                            })}
                            onClick={friendship}
                        />
                        <TelegramIcon
                            sx={(theme) => ({
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.1rem",
                                    md: "1.3rem",
                                    lg: "1.7rem",
                                },
                            })}
                            onClick={chat}
                        />
                        <SportsEsportsIcon
                            sx={(theme) => ({
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.1rem",
                                    md: "1.3rem",
                                    lg: "1.7rem",
                                },
                            })}
                            onClick={play}
                        />
                    </Container>
                    <Container
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: "1",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Avatar
                            src={srcAvatar}
                            sx={{
                                margin: "5px",
                                width: 40,
                                height: 40,
                            }}
                        />
                        <Button
                            id="demo-positioned-button"
                            aria-controls={
                                open ? "demo-positioned-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: "0.5rem",
                                    sm: "0.7rem",
                                    md: "0.8rem",
                                    lg: "1rem",
                                },
                                color: "white",
                            })}
                        >
                            {nickname}
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            sx={{
                                zIndex: 0,
                            }}
                        >
                            <MenuItem onClick={getMyProfile}>Profile</MenuItem>
                            <MenuItem
                                component="a"
                                href="/"
                                onClick={handleSubmit}
                            >
                                Settings
                            </MenuItem>
                            <MenuItem
                                component="a"
                                href="/"
                                onClick={loggingOut}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                        <IconButton component="a" href="/" onClick={loggingOut}>
                            <LogoutIcon
                                sx={(theme) => ({
                                    fontSize: {
                                        xs: "1rem",
                                        sm: "1.1rem",
                                        md: "1.3rem",
                                        lg: "1.7rem",
                                    },
                                    color: "white",
                                })}
                            />
                        </IconButton>
                    </Container>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
