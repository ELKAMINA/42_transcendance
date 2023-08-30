import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
// import api from "../../utils/Axios-config/Axios";

interface authState {
    nickname: string;
    access_token: string;
    refresh_token: string;
    avatar: string;
    qrCode: string;
    selectedItems: string;
    email: string;
    tfaAuth: boolean;
    tfaState: string;
    afterSub: boolean;
    tfaInput: boolean;
    user: Record<string, any>;
}

const initialState: authState = {
    nickname: "",
    access_token: "",
    refresh_token: "",
    qrCode: "",
    avatar: "",
    selectedItems: "",
    email: "",
    tfaAuth: false,
    tfaState: "Two Factor authentication is Off",
    afterSub: false,
    tfaInput: false,
    user: {},
};

// Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSignCredentials: (state, action) => {
            // console.log('payloooaad ', action.payload)
            const { nickname } = action.payload;
            const { access_token, refresh_token } = action.payload.tokens;
            state.access_token = access_token;
            state.refresh_token = refresh_token;
            state.nickname = nickname;
            // state.avatar = avatar
        },
        setTokens: (state, action) => {
            const { access_token, refresh_token, nickname } = action.payload;
            state.access_token = access_token;
            state.refresh_token = refresh_token;
            state.nickname = nickname;
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload;
        },
        setOnlyTokens: (state, action) => {
            // console.log("Action ", action.payload)
            const { access_token, refresh_token } = action.payload;
            state.access_token = access_token;
            state.refresh_token = refresh_token;
        },
        logOut: (state, action) => {
            state.access_token = "";
            state.refresh_token = "";
            state.nickname = "";
            state.avatar = "";
            state.qrCode = "";
        },
        setSelectedItem: (state, action: PayloadAction<string>) => {
            state.selectedItems = action.payload;
        },
        setNick: (state, action: PayloadAction<string>) => {
            state.nickname = action.payload;
        },
        setMail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setTfaAuth: (state, action: PayloadAction<boolean>) => {
            state.tfaAuth = action.payload;
        },
        setQrCode: (state, action: PayloadAction<string>) => {
            state.qrCode = action.payload;
        },
        setTfaState: (state, action: PayloadAction<string>) => {
            state.tfaState = action.payload;
        },
        setAfterSub: (state, action: PayloadAction<boolean>) => {
            state.afterSub = action.payload;
        },
        getTfaInput: (state, action: PayloadAction<boolean>) => {
            state.tfaInput = action.payload;
        },
        resetAuthStore: (state) => {
            return initialState;
        },
    },
});

export const {
    setSignCredentials,
    logOut,
    setTokens,
    setOnlyTokens,
    setAvatar,
    setSelectedItem,
    setNick,
    setMail,
    setTfaAuth,
    setQrCode,
    setTfaState,
    setAfterSub,
    getTfaInput,
    resetAuthStore,
} = authSlice.actions;

export const selectCurrentUser = (state: RootState) =>
    state.persistedReducer.auth.nickname;
export const selectCurrentAccessToken = (state: RootState) =>
    state.persistedReducer.auth.access_token;
export const selectCurrentRefreshToken = (state: RootState) =>
    state.persistedReducer.auth.refresh_token;
export const selectCurrentAvatar = (state: RootState) =>
    state.persistedReducer.auth.avatar;
export const selectItems = (state: RootState) =>
    state.persistedReducer.auth.selectedItems;
export const selectTfaAuth = (state: RootState) =>
    state.persistedReducer.auth.tfaAuth;
export const selectQrCode = (state: RootState) =>
    state.persistedReducer.auth.qrCode;
export const selectTfaState = (state: RootState) =>
    state.persistedReducer.auth.tfaState;
export const selectAfterSub = (state: RootState) =>
    state.persistedReducer.auth.afterSub;
export const selectTfaInput = (state: RootState) =>
    state.persistedReducer.auth.tfaInput;

export default authSlice.reducer;
