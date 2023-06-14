import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";

export const channelSlice = createSlice({
	name: "channelName",
	initialState,
	reducers: {
		changeChannelName: (state, action) => {
			// {type : channelName/changeChannelName, payload: <name>}
			const newChannelName = action.payload;
			console.log("name ok!");
			return newChannelName;
		},
	}
})

export const { changeChannelName } = channelSlice.actions

export default channelSlice.reducer