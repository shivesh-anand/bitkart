import { IMessage } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  messages: IMessage[];
  selectedMessage: IMessage | null;
}

const initialState: MessageState = {
  messages: [],
  selectedMessage: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = action.payload;
    },
    setSelectedMessage(state, action: PayloadAction<IMessage>) {
      state.selectedMessage = action.payload;
    },
    clearSelectedMessage(state) {
      state.selectedMessage = null;
    },
  },
});

export const { setMessages, setSelectedMessage, clearSelectedMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
