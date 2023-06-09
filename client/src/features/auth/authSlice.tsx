import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';

interface authState {
    nickname: string,
    access_token: string,
    refresh_token: string,
    avatar: string,
    qrCode: string,

}

// Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
const authSlice = createSlice({
    name: 'auth',
    initialState: { nickname:"", access_token: "", refresh_token: "", qrCode: "" } as authState,
    reducers: {
        setSignCredentials: (state, action) => {
            const { nickname, avatar } = action.payload
            console.log ("NICKNAME", nickname);
            const {access_token, refresh_token} = action.payload.tokens
            state.access_token = access_token
            state.refresh_token = refresh_token
            state.nickname = nickname
            state.avatar = avatar
        },
        setTokens: (state, action) => {
            // console.log("Action ", action.payload)
            const {access_token, refresh_token, nickname} = action.payload
            state.access_token = access_token
            state.refresh_token = refresh_token
            // console.log("AT ", state.access_token)
            // console.log("RT ", state.refresh_token)
            state.nickname = nickname
        },
        logOut: (state, action) => {
            state.access_token = ""
            state.refresh_token = ""
            state.nickname = ""
            state.avatar = ""
            state.qrCode = ""
        },
    },
})

export const { setSignCredentials, logOut, setTokens} = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.nickname
export const selectCurrentAccessToken = (state: RootState) => state.auth.access_token
export const selectCurrentRefreshToken = (state: RootState) => state.auth.refresh_token
export const selectCurrentAvatar = (state: RootState) => state.auth.avatar
