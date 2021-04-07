import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./mainReducer";
import ReduxThunk from "redux-thunk";

export const createStore = () => {
  return configureStore({
    reducer: mainReducer,
    middleware: [ReduxThunk],
  });
};
