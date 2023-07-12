import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';

export interface socketState {
    connect: boolean 
}

const initialState: socketState = {
    connect: false
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState: initialState,
    reducers: { // function that has for first param the actual state, and the 2nd param, the action that we want to apply to this state. Hence, the reducer will reduce this 2 params in one final state
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connect = action.payload;
        },
    },
})

export const { setConnected } = socketSlice.actions
