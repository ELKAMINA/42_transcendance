import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../data/userList";

const initialState: User[] = [];

// this is the list of users in a channel
export const channelUserSlice = createSlice({
	name: "channelUser",
	initialState,
	reducers: {
		addChannelUser: (state, action) => {
			// {type : channelUser/addChannelUser, payload: User object}
			console.log("action.payload = ", action.payload);
			const newUser = action.payload;
			console.log("YOUHOUUUU");
			state.push(newUser);
		},
		deleteChannelUser: (state, action) => {
			// {type : channelUser/deleteChannelUser, payload: user name : string}
			state = state.filter(user => user.name !== action.payload);
		}
	}
})

export const { addChannelUser, deleteChannelUser } = channelUserSlice.actions

export default channelUserSlice.reducer