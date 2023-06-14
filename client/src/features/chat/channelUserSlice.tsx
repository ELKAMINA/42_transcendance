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
			const newUser = action.payload;
			state.push(newUser);
			// for (let i = 0; i < state.length; i++)
				// console.log(state[i].name);
		},
		deleteChannelUser: (state, action) => {
			// {type : channelUser/deleteChannelUser, payload: user name : string}
			state = state.filter(user => user.name !== action.payload);
		}
	}
})

export const { addChannelUser, deleteChannelUser } = channelUserSlice.actions

export default channelUserSlice.reducer