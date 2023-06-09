import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
// import api from "../../utils/Axios-config/Axios";
import { transformData } from "../../pages/userProfile";


interface authState {
    nickname: string,
    access_token: string,
    refresh_token: string,
    avatar: string | undefined,
    qrCode: string,
    selectedItems: string,
    email: string,
    tfaAuth: boolean,
    tfaState: string,
    afterSub: boolean,
    tfaInput: boolean,
}

// Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
const authSlice = createSlice({
    name: 'auth',
    initialState: { nickname:"", access_token: "", refresh_token: "", qrCode: "", avatar: undefined, tfaAuth: false, tfaState: 'Two Factor authentication is Off', afterSub: false, tfaInput: false } as authState,
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
        setSelectedItem: (state, action: PayloadAction<string>) => {
            state.selectedItems = action.payload
        },
        setNick: (state, action: PayloadAction<string>) => {
            state.nickname = action.payload
        },
        setMail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        setTfaAuth: (state, action: PayloadAction<boolean>) => {
            state.tfaAuth = action.payload
        },
        setQrCode: (state, action: PayloadAction<string>) => {
            state.qrCode = action.payload
        },
        setTfaState: (state, action: PayloadAction<string>) => {
            state.tfaState = action.payload
        },
        setAfterSub: (state, action: PayloadAction<boolean>) => {
            state.afterSub = action.payload
        },
        getTfaInput : (state, action: PayloadAction<boolean>) => {
            state.tfaInput = action.payload
        } 
    },
})

export const { setSignCredentials, logOut, setTokens, setOnlyTokens, setAvatar, setSelectedItem, setNick, setMail, setTfaAuth, setQrCode, setTfaState, setAfterSub, getTfaInput} = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.persistedReducer.auth.nickname
export const selectCurrentAccessToken = (state: RootState) => state.persistedReducer.auth.access_token
export const selectCurrentRefreshToken = (state: RootState) => state.persistedReducer.auth.refresh_token
export const selectCurrentAvatar = (state: RootState) => state.persistedReducer.auth.avatar
export const selectItems = (state: RootState) => state.persistedReducer.auth.selectedItems
export const selectTfaAuth = (state: RootState) => state.persistedReducer.auth.tfaAuth
export const selectQrCode = (state: RootState) => state.persistedReducer.auth.qrCode
export const selectTfaState = (state: RootState) => state.persistedReducer.auth.tfaState
export const selectAfterSub = (state: RootState) => state.persistedReducer.auth.afterSub
export const selectTfaInput = (state: RootState) => state.persistedReducer.auth.tfaInput



// export function FetchUser() {
//     return async (dispatch:any, getState: any) => {
//         await api
// 		.get('http://localhost:4001/user/userprofile', {
// 			params: {
// 				ProfileName: getState().persistedReducer.auth.nickname,
// 			}
// 		})
// 		.then((res) => {
// 			const params = new URLSearchParams(res.data)
//             const userData = transformData(params)
//             // console.log('params ', userData)
//             dispatch(setAvatar(userData.avatar))})
// 		.catch((e) => {
// 			console.log('ERROR from request with params ', e)
// 		})
//   }
// }