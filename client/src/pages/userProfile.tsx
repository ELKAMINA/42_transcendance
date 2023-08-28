import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { sock as socketSettings } from "./settings";
import { store } from "../app/store";
import Navbar from "../components/NavBar";
import api from "../utils/Axios-config/Axios";
import ProfileInfo from "../components/UserProfile/Statistics/ProfileInfo";
import UserProfileHeader from "../components/UserProfile/userProfile-header";
import "./userProfile.css";
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import { selectCurrentUser } from "../redux-features/auth/authSlice";
import { FetchAFriend, FetchFriendshipInfo, getIsMyFriend, getUserToStalk, selectIsMyFriend, selectSpecificFriend } from "../redux-features/friendship/friendshipSlice";

export function transformData(queryParams: URLSearchParams) {
    const obj: Record<string, string> = {};

    for (const [key, value] of queryParams.entries()) {
        // console.log(" in transform data ", value);
        // console.log(" in transform data - typeof ", typeof value);
        obj[key] = value;
    }
    return obj;
}

const UserProfile = () => {
    const location = useLocation();
    const dispatch: any = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser)
    const currentRoute = window.location.pathname;
    let userToStalk = location.state.data;



    useEffect(() => {
        dispatch(FetchAFriend(userToStalk.login))
        dispatch(FetchFriendshipInfo(currentUser, userToStalk.login))

        return () => {
            dispatch(getUserToStalk(undefined))
            dispatch(getIsMyFriend({isMyfriend: false, myBlockedFriend: false, thoseWhoBlockedMe: false}))

        }
    }, [userToStalk.login]);

    let finalUser = useAppSelector(selectSpecificFriend)
    let isMyFriend = useAppSelector(selectIsMyFriend)
    // console.log('isMyFriend ', isMyFriend)
    return (
        <Box className="userprofile-container">
            {/* <Box className="userprofile-header"> */}
            <Navbar currentRoute={currentRoute} />
            {/* </Box> */}
            <Box sx={{
                marginTop: 3.5,
            }} className="userprofile-middle">
                <UserProfileHeader
                    name={finalUser?.login}
                    status={finalUser?.status}
                    friendship={isMyFriend}
                    srcAvatar={finalUser?.avatar}
                />
                <ProfileInfo interestProfile={finalUser} />
            </Box>
            {/* <Box className="userprofile-infos"></Box> */}
        </Box>
    );
};

export default UserProfile;
