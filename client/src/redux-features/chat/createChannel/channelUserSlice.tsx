import { createSlice } from "@reduxjs/toolkit";
import { UserByLogin } from "../../../types/users/userType";
import { RootState } from "../../../app/store";

const initialState: UserByLogin[] = [];

// this is the list of users in a channel
export const channelUserSlice = createSlice({
	name: "channelUser",
	initialState,
	reducers: {
		addChannelUser: (state, action) => {
			// action.payload is an array of UserByLogin
			state.push(...action.payload);
		},
		deleteChannelUser: (state, action) => {
			state = state.filter(user => user.login !== action.payload);
		},
		resetChannelUser: () => initialState,
	}
})

export const { addChannelUser, deleteChannelUser, resetChannelUser } = channelUserSlice.actions
export const selectUsersInChannel = (state: RootState) => state.persistedReducer.channelUser

export default channelUserSlice.reducer