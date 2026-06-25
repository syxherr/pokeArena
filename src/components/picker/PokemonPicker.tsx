import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useId,
} from "react";
import ErrorBoundary from "../ErrorBoundary";
import { fetchPokemonDetail } from "../../hooks/usePokemon";
import styles from "./PokemonPicker.module.css";
import SwordAltIcon from "../../style/SwordAltIcon";
import Loading from "../Loading";
import type { Pokemon, PokemonListItem } from "../../hooks/usePokemon";

import { TextField, IconButton, Chip, Avatar } from "@mui/material";

// 
interface PokemonPickerProps {
  pokemonList: PokemonListItem[];
  listLoading: boolean;
  selected: [Pokemon | null, Pokemon | null];
  onSelect: (slot: number, pokemon: Pokemon | null) => void;
  randomLoading: boolean;
}


// props untuk slot (challenger 1 atau challenger 2)
interface SlotPickerProps {
  label: string;
  side: "left" | "right";
  pokemonList: PokemonListItem[];
  listLoading: boolean;
  pokemon: Pokemon | null;
  onSelect: (pokemon: Pokemon | null) => void;
  randomLoading: boolean;
}

//  props card nampilin sprite dan nama pokemon
interface PokemonCardProps {
  pokemon: Pokemon | null;
  loading: boolean;
  side: "left" | "right";
}

interface TypePillProps {
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  fire: "#FF6B35",
  water: "#4A90D9",
  grass: "#3ddc84",
  electric: "#F5C518",
  psychic: "#D4538A",
  ghost: "#7B5EA7",
  dragon: "#4A6FA5",
  dark: "#5C4A3A",
  poison: "#b87dff",
  normal: "#A8A878",
  flying: "#7ecfff",
  ice: "#74CCF4",
  rock: "#B5A642",
  ground: "#C4A35A",
  fighting: "#E07B39",
  bug: "#9CB820",
  steel: "#8C9DB5",
  fairy: "#EE99AC",
};

const PokemonPicker = memo(function PokemonPicker({
  pokemonList,
  listLoading,
  selected,
  onSelect,
  randomLoading,
}: PokemonPickerProps) {
  const handleSelectA = useCallback(
    (poke: Pokemon | null) => onSelect(0, poke),
    [onSelect],
  );
  const handleSelectB = useCallback(
    (poke: Pokemon | null) => onSelect(1, poke),
    [onSelect],
  );

  return (
    <div
      className={styles.picker}
      role="group"
      aria-label="Select two Pokémon to battle"
    >
      <SlotPicker
        label="Challenger 1"
        side="left"
        pokemonList={pokemonList}
        listLoading={listLoading}
        pokemon={selected[0]}
        onSelect={handleSelectA}
        randomLoading={randomLoading}
      />

      <div className={styles.vs} aria-hidden="true">
        <SwordAltIcon width={30} height={30} />
      </div>

      <SlotPicker
        label="Challenger 2"
        side="right"
        pokemonList={pokemonList}
        listLoading={listLoading}
        pokemon={selected[1]}
        onSelect={handleSelectB}
        randomLoading={randomLoading}
      />
    </div>
  );
});

export default PokemonPicker;

const SlotPicker = memo(function SlotPicker({
  label,
  side,
  pokemonList,
  listLoading,
  pokemon,
  onSelect,
  randomLoading,
}: SlotPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const inputId = useId();
  const listboxId = useId();

  // 2. autocomplete based on query user
  const filtered = useMemo(() => {
    if (query.trim().length === 0) return pokemonList.slice(0, 80);
    return pokemonList
      .filter(
        (p) =>
          p.name.includes(query.toLowerCase()) ||
          String(p.id).padStart(3, "0").includes(query),
      )
      .slice(0, 60);
  }, [query, pokemonList]);

  // autocomplete tutup
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 3. call fetchPokemonDetail, ngambil data lengkap pokemon
  const handleSelect = useCallback(
    async (p: PokemonListItem) => {
      setQuery(capitalize(p.name));
      setOpen(false);
      setFetching(true);
      // fetch detail pokemon
      try {
        const detail = await fetchPokemonDetail(p.name);
        onSelect(detail);
      } catch {
        onSelect(null);
      } finally {
        setFetching(false);
      }
    },
    [onSelect],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSelect(null);
  }, [onSelect]);

  // autocomplete kebuka
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setOpen(true);
    },
    [],
  );

  const handleFocus = useCallback(() => setOpen(true), []);

  return (
    <div className={`${styles.slot} ${styles[side]}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      <div className={styles.autocompleteWrap} ref={wrapRef}>
        <TextField
          id={inputId}
          fullWidth
          size="small"
          placeholder={listLoading ? "Loading..." : "SearchPokemon"}
          value={query}
          disabled={listLoading}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && filtered.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-busy={listLoading}
          slotProps={{
            input: {
              endAdornment: query && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  tabIndex={-1}
                  aria-label={`Clear ${label} selection`}
                  sx={{
                    color: "var(--text-muted)",
                    "&:hover": { color: "var(--text-primary)" },
                  }}
                >
                  ✕
                </IconButton>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "var(--bg-input)",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-primary)",
              "& fieldset": {
                borderColor: "var(--border)",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: "var(--border-focus)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--border-focus)",
                borderWidth: "1px",
                boxShadow: "0 0 0 2px var(--accent-dim)",
              },
              "&.Mui-disabled": {
                opacity: 0.4,
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "11px 14px",
              "&::placeholder": {
                color: "var(--text-muted)",
                opacity: 1,
              },
            },
          }}
        />

        {/* 2. dropdown suggestion */}
        {open && filtered.length > 0 && (
          <ul
            id={listboxId}
            className={styles.dropdown}
            aria-label={`${label} Pokémon options`}
          >
            {filtered.map((p) => (
              // 3. pokemon dipilih = panggil handleSelect
              <li
                key={p.id}
                className={styles.dropdownItem}
                onMouseDown={() => handleSelect(p)}
                role="option"
                aria-selected={pokemon?.name === p.name}
              >
                <Avatar
                  variant="square"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                  alt=""
                  sx={{
                    width: 65,
                    height: 65,
                    borderRadius: "4px",
                    background: "transparent",
                  }}
                />
                <span className={styles.dropName}>{capitalize(p.name)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PokemonCard
        pokemon={pokemon}
        loading={fetching || randomLoading}
        side={side}
      />
    </div>
  );
});

const PokemonCard = memo(function PokemonCard({
  pokemon,
  loading,
  side,
}: PokemonCardProps) {
  if (loading) {
    return (
      <div className={`${styles.card} ${styles[side]}`}>
        <Loading />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <ErrorBoundary>
        <div className={`${styles.card} ${styles[side]}`}>
          <div
            className={styles.cardEmpty}
            role="img"
            aria-label="No Pokémon selected"
          >
            Choose Your Pokemon
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <article
        className={`${styles.card} ${styles[side]}`}
        aria-label={`${capitalize(pokemon.name)} — selected as ${side === "left" ? "Challenger 1" : "Challenger 2"}`}
      >
        {pokemon.sprite && (
          <Avatar
            variant="square"
            src={pokemon.sprite}
            alt={`${capitalize(pokemon.name)} sprite`}
            sx={{
              width: 130,
              height: 130,
              borderRadius: "8px",
              background: "transparent",
            }}
          />
        )}
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{capitalize(pokemon.name)}</div>

          <div
            className={styles.types}
            role="list"
            aria-label={`${capitalize(pokemon.name)} types`}
          >
            {pokemon.types.map((t) => (
              <TypePill key={t} type={t} />
            ))}
          </div>
        </div>
      </article>
    </ErrorBoundary>
  );
});

const TypePill = memo(function TypePill({ type }: TypePillProps) {
  const color = TYPE_COLORS[type] ?? "#999";
  return (
    <Chip
      label={type}
      size="small"
      role="listitem"
      sx={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        borderRadius: "20px",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        height: "22px",
        "& .MuiChip-label": {
          padding: "0 9px",
        },
      }}
    />
    //   <span
    //     className={styles.typePill}
    //     style={{
    //       background: `${color}22`,
    //       color,
    //       border: `1px solid ${color}44`,
    //     }}
    //     role="listitem"
    //   >
    //     {type}
    //   </span>
  );
});

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
