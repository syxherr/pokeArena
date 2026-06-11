import { useState } from "react";
import type { Pokemon } from "./usePokemon";
import { useSelector, useDispatch } from "react-redux";
import { addHistory, clearHistory } from "../store/pokemonSlice";
import type { RootState } from "../store/store";


const STAT_KEYS = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];


export function useComparator() {
  const [selected, setSelected] = useState<[Pokemon | null, Pokemon | null]>([
    null,
    null,
  ]);
  const [overlayPhase, setOverlayPhase] = useState<"begin" | "winner" | null>(
    null,
  );
  const [statsVisible, setStatsVisible] = useState(false);

  const history = useSelector((state: RootState) => state.history.entries);
  const dispatch = useDispatch();

  function selectPokemon(slot: number, pokemon: Pokemon | null) {
    setSelected((prev) => {
      const next: [Pokemon | null, Pokemon | null] = [prev[0], prev[1]];
      next[slot] = pokemon;
      return next;
    });
    setStatsVisible(false);
    setOverlayPhase(null);
  }

  function compare() {
    const [a, b] = selected;
    if (!a || !b) return;

    setOverlayPhase("begin");
    setStatsVisible(false);
  }

  function onBeginDone() {
    setOverlayPhase(null);
    setStatsVisible(true);
  }

  function onStatsComplete() {
    setOverlayPhase("winner");
  }

  // 5. d history
  function onWinnerDismiss() {
    const [a, b] = selected;
    if (!a || !b) return;
    const { statusA, statusB } = calcWinner(a, b);
    dispatch(addHistory({ nameA: a.name, nameB: b.name, statusA, statusB }));
    setOverlayPhase(null);
  }

  // 6. reset pokemon
  function reset() {
    setSelected([null, null]);
    setStatsVisible(false);
    setOverlayPhase(null);
  }

  return {
    selected,
    statsVisible,
    overlayPhase,
    history,
    selectPokemon,
    compare,
    reset,
    clearHistory: () => dispatch(clearHistory()),
    onBeginDone,
    onStatsComplete,
    onWinnerDismiss,
  };
}

// 5. a&b hitung compare stat pokemon
export function calcWinner(a: Pokemon, b: Pokemon) {
  let winsA = 0;
  let winsB = 0;

  STAT_KEYS.forEach((key) => {
    const va = a.stats[key] ?? 0;
    const vb = b.stats[key] ?? 0;
    // + 1 poin
    if (va > vb) winsA++;
    else if (vb > va) winsB++;
  });

  let statusA: "Win" | "Lose" | "Draw";
  let statusB: "Win" | "Lose" | "Draw";
  // menentukan total poin
  if (winsA > winsB) {
    statusA = "Win";
    statusB = "Lose";
  } else if (winsB > winsA) {
    statusA = "Lose";
    statusB = "Win";
  } else {
    statusA = "Draw";
    statusB = "Draw";
  }

  return { winsA, winsB, statusA, statusB };
}
