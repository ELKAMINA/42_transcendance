import { createSlice } from "@reduxjs/toolkit";

const initialState: any[] = []
// Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
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

