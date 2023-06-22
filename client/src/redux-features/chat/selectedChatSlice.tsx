import { createSlice } from "@reduxjs/toolkit";
// import { Chat } from "../../types/chat/chatTypes";
// import { useSelector } from "react-redux";
// import { RootState } from "../../app/store";

// const chats: Chat[] = useSelector((state:RootState) => state.persistedReducer.chats);

const initialState = null;

export const selectedChatSlice = createSlice({
	name: "selectedChat",
	initialState,
	reducers: {
		setSelectedChat : (state, action) => {
			const selectedChat = action.payload;
			console.log("selectedChat = ", selectedChat);
			return selectedChat;
		}
	}
})

export const { setSelectedChat } = selectedChatSlice.actions

export default selectedChatSlice.reducer