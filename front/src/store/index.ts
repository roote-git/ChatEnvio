import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import chats from "./features/messages";

const store = configureStore({
  reducer: {
    chats,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type StoreState = ReturnType<typeof store.getState>;
export default store;
