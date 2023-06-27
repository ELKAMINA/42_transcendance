import { createSlice } from "@reduxjs/toolkit";
import { UserDetails } from "../../../types/users/userType";

const initialState: UserDetails[] = [];

// this is the list of users in a channel
export const channelUserSlice = createSlice({
	name: "channelUser",
	initialState,
	reducers: {
		addChannelUser: (state, action) => {
			const userNames = action.payload;
			
		},
		deleteChannelUser: (state, action) => {
			state = state.filter(user => user.login !== action.payload);
		},
		resetChannelUser: () => initialState,
	}
})

export const { addChannelUser, deleteChannelUser, resetChannelUser } = channelUserSlice.actions

export default channelUserSlice.reducer