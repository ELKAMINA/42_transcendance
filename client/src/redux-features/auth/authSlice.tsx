import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import api from "../../utils/Axios-config/Axios";
import { transformData } from "../../pages/userProfile";


interface authState {
    nickname: string,
    access_token: string,
    refresh_token: string,
    avatar: string | undefined,
    qrCode: string,

}

// Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
const authSlice = createSlice({
    name: 'auth',
    initialState: { nickname:"", access_token: "", refresh_token: "", qrCode: "", avatar: undefined } as authState,
    reducers: {
        setSignCredentials: (state, action) => {
            console.log('payloooaad ', action.payload)
            const { nickname } = action.payload
            const {access_token, refresh_token} = action.payload.tokens
            state.access_token = access_token
            state.refresh_token = refresh_token
            state.nickname = nickname
            // state.avatar = avatar
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
        setOnlyTokens: (state, action) => {
            // console.log("Action ", action.payload)
            const {accessToken, refreshToken} = action.payload
            state.access_token = accessToken
            state.refresh_token = refreshToken
        },
        logOut: (state, action) => {
            state.access_token = ""
            state.refresh_token = ""
            state.nickname = ""
            state.avatar = ""
            state.qrCode = ""
        },
        setAvatar: (state, action: PayloadAction<string>) => {
            state.avatar = action.payload
        },
    },
})

export const { setSignCredentials, logOut, setTokens, setOnlyTokens, setAvatar} = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.persistedReducer.auth.nickname
export const selectCurrentAccessToken = (state: RootState) => state.persistedReducer.auth.access_token
export const selectCurrentRefreshToken = (state: RootState) => state.persistedReducer.auth.refresh_token
export const selectCurrentAvatar = (state: RootState) => state.persistedReducer.auth.avatar


export function FetchUser() {
    return async (dispatch:any, getState: any) => {
        await api
		.get('http://localhost:4001/user/userprofile', {
			params: {
				ProfileName: getState().persistedReducer.auth.nickname,
			}
		})
		.then((res) => {
			const params = new URLSearchParams(res.data)
            const userData = transformData(params)
            // console.log('params ', userData)
            dispatch(setAvatar(userData.avatar))})
		.catch((e) => {
			console.log('ERROR from request with params ', e)
		})
  }
}