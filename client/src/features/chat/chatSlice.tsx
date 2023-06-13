import { createSlice } from "@reduxjs/toolkit";

const initialState: any[] = []
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        sendMessage: (state, action) => {
            console.log('DISPATCH')
            state.push(action.payload)
        }
    },
})

export const { sendMessage } = chatSlice.actions

export default chatSlice.reducer

