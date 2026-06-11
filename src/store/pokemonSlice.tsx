import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryEntry {
  nameA: string;
  nameB: string;
  statusA: "Win" | "Lose" | "Draw";
  statusB: "Win" | "Lose" | "Draw";

}

interface HistoryState {
  entries: HistoryEntry[];
}

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