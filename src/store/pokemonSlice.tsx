import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// data entry status history
export interface HistoryEntry {
  nameA: string;
  nameB: string;
  statusA: "Win" | "Lose" | "Draw";
  statusB: "Win" | "Lose" | "Draw";
  spriteA?: string;
  spriteB?: string;
}

// struktur state redux history
interface HistoryState {
  entries: HistoryEntry[];
}

const initialState: HistoryState = {
  entries: [],
};

// fungsi add clear history
const pokemonSlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    // dikirim harus sesuai interface HistoryEntry
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
