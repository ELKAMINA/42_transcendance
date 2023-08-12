import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { store } from "../app/store";
import Navbar from "../components/NavBar";
import api from "../utils/Axios-config/Axios";
import ProfileInfo from "../components/UserProfile/Statistics/ProfileInfo";
import UserProfileHeader from "../components/UserProfile/userProfile-header";
import "./userProfile.css";

export function transformData(queryParams: URLSearchParams) {
    const obj: Record<string, string> = {};

    for (const [key, value] of queryParams.entries()) {
        console.log(" in transform data ", value);
        console.log(" in transform data - typeof ", typeof value);
        obj[key] = value;
    }
    return obj;
}

const UserProfile = () => {
    const location = useLocation();
    const currentRoute = window.location.pathname;
    const [isMyfriend, setMyFriend] = useState({
        isMyfriend: false,
        myBlockedFriend: false,
        thoseWhoBlockedMe: false,
    });
    // const userToStalk = transformData(new URLSearchParams(location.search));
    const userToStalk = location.state.data;
    // console.log("user to Stalk ", userToStalk);

    const friendship = async () =>
        await api
            .post("http://localhost:4001/friendship/ismyfriend", {
                me: store.getState().persistedReducer.auth.nickname,
                him: userToStalk.login,
            })
            .then((res) => {
                setMyFriend(res.data);
            })
            .catch((e) => console.log("eroooor ", e));

    useEffect(() => {
        friendship();
    });

    return (
        <Box className="userprofile-container">
            <Box className="userprofile-header">
                <Navbar currentRoute={currentRoute} />
            </Box>
            <Box sx={{
                marginTop: 3.5,
            }}className="userprofile-middle">
                <UserProfileHeader
                    name={userToStalk.login}
                    status={userToStalk.status}
                    friendship={isMyfriend}
                    srcAvatar={userToStalk.avatar}
                />
                <ProfileInfo interestProfile={userToStalk} />
            </Box>
            <Box className="userprofile-infos"></Box>
        </Box>
    );
};

export default UserProfile;
