import { createStore, combineReducers } from "redux";
import { historyReducer } from "./reducer";

const rootReducer = combineReducers({
  history: historyReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;