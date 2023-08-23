import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

export interface CreateChannelErrorState {
    channelNameError: boolean;
    channelUserListError: boolean;
    channelTypeError: boolean;
}

const initialState: CreateChannelErrorState = {
    channelNameError: false,
    channelUserListError: false,
    channelTypeError: false,
};

export const createChannelError = createSlice({
    name: "createChannelError",
    initialState,
    reducers: {
        setNameErrorState: (state, action: PayloadAction<boolean>) => {
            const errorState = action.payload;
            state.channelNameError = errorState;
        },
        setUserListErrorState: (state, action: PayloadAction<boolean>) => {
            const errorState = action.payload;
            state.channelUserListError = errorState;
        },
        setTypeErrorState: (state, action: PayloadAction<boolean>) => {
            const errorState = action.payload;
            state.channelTypeError = errorState;
        },
        resetCreateChannelState: (state) => initialState,
    },
});

export const {
    setNameErrorState,
    setUserListErrorState,
    setTypeErrorState,
    resetCreateChannelState,
} = createChannelError.actions;

export default createChannelError.reducer;

export const selectChannelNameError = (state: RootState) => state.persistedReducer.createChannelError.channelNameError;
export const selectChannelUserListError = (state: RootState) => state.persistedReducer.createChannelError.channelUserListError;
export const selectChannelTypeError = (state: RootState) => state.persistedReducer.createChannelError.channelTypeError;
