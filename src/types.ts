import type { ReactNode } from "react";


// interface data

// data yang ada di dropdown
export interface PokemonListItem {
  id: number;
  name: string;
}

// mendefinisikan data detail pokemon
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string | null;
  stats: Record<string, number>;
}

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
export interface HistoryState {
  entries: HistoryEntry[];
}

// kalkulasi satu baris stat
export interface StatResult {
  statkey: string;
  va: number;
  vb: number;
  barA: number;
  barB: number;
  winA: boolean;
  winB: boolean;
}

// hasil total poin
export interface CalcResults {
  winsA: number;
  winsB: number;
  statResults: StatResult[];
}

// interface props

export interface PokemonPickerProps {
  pokemonList: PokemonListItem[];
  listLoading: boolean;
  selected: [Pokemon | null, Pokemon | null];
  onSelect: (slot: number, pokemon: Pokemon | null) => void;
  randomLoading: boolean;
}

export interface SlotPickerProps {
  label: string;
  side: "left" | "right";
  pokemonList: PokemonListItem[];
  listLoading: boolean;
  pokemon: Pokemon | null;
  onSelect: (pokemon: Pokemon | null) => void;
  randomLoading: boolean;
}

export interface BattleOverlayProps {
  phase: "begin" | "winner" | null;
  nameA: string;
  nameB: string;
  winsA: number;
  winsB: number;
  onBeginDone?: () => void;
  onWinnerDismiss?: () => void;
}

export interface StatsSectionProps {
  pokemonA: Pokemon;
  pokemonB: Pokemon;
  onComplete?: () => void;
}


export interface AnimatedRowProps {
  index: number;
  allDone: boolean;
  label: string;
  va: number;
  vb: number;
  barA: number;
  barB: number;
  winA: boolean;
  winB: boolean;
  nameA: string;
  nameB: string;
}

export interface StatRowProps {
  label: string;
  va: number;
  vb: number;
  barA: number;
  barB: number;
  winA: boolean;
  winB: boolean;
  nameA: string;
  nameB: string;
}

export interface ResultBannerProps {
  winsA: number;
  winsB: number;
  nameA: string;
  nameB: string;
}

export interface HistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export interface HistoryItemProps {
  entry: HistoryEntry;
  index: number;
}

export interface AnimatedItemProps {
  children: ReactNode;
  index: number;
}

export interface PokemonCardProps {
  pokemon: Pokemon | null;
  loading: boolean;
  side: "left" | "right";
}

export interface TypePillProps {
  type: string;
}