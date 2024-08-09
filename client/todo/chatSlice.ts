import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IChat } from "@/types/chat";

interface ChatState {
  chats: IChat[];
  selectedChat: IChat | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<IChat[]>) {
      state.chats = action.payload;
    },
    setSelectedChat(state, action: PayloadAction<IChat>) {
      state.selectedChat = action.payload;
    },
    clearSelectedChat(state) {
      state.selectedChat = null;
    },
  },
});

export const { setChats, setSelectedChat, clearSelectedChat } =
  chatSlice.actions;
export default chatSlice.reducer;
