import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { HistoryEntry, HistoryState } from "../types";

const initialState: HistoryState = {
  entries: [],
};

const pokemonSlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory(state, action: PayloadAction<HistoryEntry>) {
      state.entries.unshift(action.payload);
    },
    clearHistory(state) {
      state.entries = [];
    },
  },
});

export const { addHistory, clearHistory } = pokemonSlice.actions;
export default pokemonSlice.reducer;