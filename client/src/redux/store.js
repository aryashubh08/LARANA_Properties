import { configureStore } from "@reduxjs/toolkit";
import stateReducer from "./slices/state";

export const store = configureStore({
  reducer: stateReducer,
});
