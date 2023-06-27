import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";

export const channelNameSlice = createSlice({
	name: "channelName",
	initialState,
	reducers: {
		changeChannelName: (state, action) => {
			// {type : channelName/changeChannelName, payload: <name>}
			const newChannelName = action.payload;
			// console.log("name ok!");
			return newChannelName;
		},
		resetChannelName: () => initialState,
	}
})

export const { changeChannelName, resetChannelName } = channelNameSlice.actions

export default channelNameSlice.reducer