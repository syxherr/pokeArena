import type { HistoryEntry, HistoryState } from "../types";

// action type constants
export const ADD_HISTORY = "history/ADD_HISTORY";
export const CLEAR_HISTORY = "history/CLEAR_HISTORY";

// action interfaces
interface AddHistoryAction {
  type: typeof ADD_HISTORY;
  payload: HistoryEntry;
    [key: string]: unknown; 
}

interface ClearHistoryAction {
  type: typeof CLEAR_HISTORY;
  [key: string]: unknown;
}

export type HistoryAction = AddHistoryAction | ClearHistoryAction;

// action creators
export const addHistory = (entry: HistoryEntry): AddHistoryAction => ({
  type: ADD_HISTORY,
  payload: entry,
});
export const clearHistory = (): ClearHistoryAction => ({
  type: CLEAR_HISTORY,
  
});

// reducer
const STORAGE_KEY = "battle_history";

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    
    // handle format lama redux-persist
    if (parsed?.state?.history) {
      return parsed.state.history as HistoryEntry[];
    }
    
    // format baru (array langsung)
    if (Array.isArray(parsed)) return parsed as HistoryEntry[];
    
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const initialState: HistoryState = {
  entries: loadFromStorage(),
};

export function historyReducer(
  state: HistoryState = initialState,
  action: HistoryAction,
): HistoryState {
  switch (action.type) {
    case ADD_HISTORY: {
      const entries = [action.payload, ...state.entries];
      saveToStorage(entries);
      return { entries };
    }
    case CLEAR_HISTORY: {
      saveToStorage([]);
      return { entries: [] };
    }
    default:
      return state;
  }
}