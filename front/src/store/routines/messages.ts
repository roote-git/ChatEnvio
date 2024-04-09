import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { chatService } from "../../api";
import { ChatState } from "../features/messages";

export const initialFetchMessages = createAsyncThunk(
  "chat/initialFetch",
  async () => {
    const response = await chatService.getAllMessages();    
    return response;
  }
);

export const getMessagesRoutines = (
  builder: ActionReducerMapBuilder<ChatState>
) => {
  builder.addCase(initialFetchMessages.pending, (state) => {
    state.loading = true;
  });
  builder.addCase(initialFetchMessages.fulfilled, (state, action) => {
    state.loading = false;
    state.messages = action.payload;
  });
  builder.addCase(initialFetchMessages.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "";
  });
};
