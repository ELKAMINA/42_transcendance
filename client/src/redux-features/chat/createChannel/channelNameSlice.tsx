import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";

export const channelNameSlice = createSlice({
	name: "channelName",
	initialState,
	reducers: {
		changeChannelName: (state, action) => {
			const newChannelName = action.payload;
			// console.log("name ok!");
			return newChannelName;
		},
		resetChannelName: () => initialState,
		resetChannelNameStore : (state) => {
            return initialState;
        }
	}
})

export const { changeChannelName, resetChannelName, resetChannelNameStore } = channelNameSlice.actions

export default channelNameSlice.reducer