import { createSlice } from "@reduxjs/toolkit";
import { DisplayedChat } from "../../types/chat/chatTypes";

const initialState: DisplayedChat[] = [];

// this is an array of chats
export const chatsSlice = createSlice({
	name: "chats",
	initialState,
	reducers: {
		initChat : (state, action) => {
			state = action.payload;
			console.log("all my chats : ", state);
			return state;
		},
		addChat: (state, action) => {
			const newchat = action.payload
			
			// FOR DEBUG
			// console.log("adding chat...");
			
			state.push(newchat);

			// FOR DEBUG
			console.log("chat ADDED WITH SUCCESS!")
			// console.log("chat name : " + newchat.login) 
			// console.log("chat id = " + newchat.id)
			// console.log("chat type = " + newchat.type)
			// console.log("chat pwd = " + newchat.password)
			// console.log("chat users = " + newchat.users[0]);
		},
		deleteChat: (state, action) => {
			// {type : chats/deletechat, payload: <id of chat to be deleted> : number}

			const chatToDelete = action.payload;
			const filteredchats = state.filter(chat => chat.login !== chatToDelete);
			
			// FOR DEBUG
			// console.log("chat " + action.payload + " deleted !")
			state.map(chat => console.log(chat.login));

			// Update the state by returning a new array
  			return filteredchats;
		},
		deleteAllChats: (state, action) => {
			if (action.payload === true) {
				// console.log("I will now delete all the chats");
				state.splice(0, state.length);
				// console.log("size of chats now : ", state.length);
				return state;
			}
		}
	}
})

export const { initChat, addChat, deleteChat, deleteAllChats } = chatsSlice.actions

export default chatsSlice.reducer