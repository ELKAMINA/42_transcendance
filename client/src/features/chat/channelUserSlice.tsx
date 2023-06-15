import { createSlice } from "@reduxjs/toolkit";
import { User, userList } from "../../data/userList";

const initialState: User[] = [];

// this is the list of users in a channel
export const channelUserSlice = createSlice({
	name: "channelUser",
	initialState,
	reducers: {
		addChannelUser: (state, action) => {
			// {type : channelUser/addChannelUser, payload: array of usernames}
			
			const userNames = action.payload;
			console.log("userNames = ", userNames);

			state = userList.filter(user => userNames.includes(user.name));
		},
		deleteChannelUser: (state, action) => {
			// {type : channelUser/deleteChannelUser, payload: user name : string}
			state = state.filter(user => user.name !== action.payload);
		}
	}
})

export const { addChannelUser, deleteChannelUser } = channelUserSlice.actions

export default channelUserSlice.reducer