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
import type { Pokemon, PokemonListItem, PokemonPickerProps, SlotPickerProps, PokemonCardProps, TypePillProps } from "../../types";
import { Box, TextField, IconButton, Chip, Avatar, Typography } from "@mui/material";


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
  const handleSelectA = useCallback((poke: Pokemon | null) => onSelect(0, poke), [onSelect]);
  const handleSelectB = useCallback((poke: Pokemon | null) => onSelect(1, poke), [onSelect]);

  return (
    <Box
      role="group"
      aria-label="Select two Pokémon to battle"
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 52px 1fr",
        gap: "12px",
        alignItems: "start",
      }}
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

      <Box
        aria-hidden="true"
        sx={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          mx: "auto",
          mt: "117px",
        }}
      >
        <SwordAltIcon width={30} height={30} />
      </Box>

      <SlotPicker
        label="Challenger 2"
        side="right"
        pokemonList={pokemonList}
        listLoading={listLoading}
        pokemon={selected[1]}
        onSelect={handleSelectB}
        randomLoading={randomLoading}
      />
    </Box>
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    async (p: PokemonListItem) => {
      setQuery(capitalize(p.name));
      setOpen(false);
      setFetching(true);
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

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  }, []);

  const handleFocus = useCallback(() => setOpen(true), []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Typography
        component="label"
        htmlFor={inputId}
        sx={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </Typography>

      <Box ref={wrapRef} sx={{ position: "relative" }}>
        <TextField
          id={inputId}
          fullWidth
          size="small"
          placeholder={listLoading ? "Loading..." : "Search Pokémon"}
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
          
        />

        {open && filtered.length > 0 && (
          <Box
            component="ul"
            id={listboxId}
            aria-label={`${label} Pokémon options`}
            sx={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "var(--bg-card)",
              border: "1px solid var(--border-focus)",
              borderRadius: "12px",
              listStyle: "none",
              padding: "4px",
              margin: 0,
              maxHeight: "220px",
              overflowY: "auto",
              zIndex: 100,
              boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            }}
          >
            {filtered.map((p) => (
              <Box
                component="li"
                key={p.id}
                className={styles.dropdownItem}
                onMouseDown={() => handleSelect(p)}
                role="option"
                aria-selected={pokemon?.name === p.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
              >
                <Avatar
                  variant="square"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                  alt=""
                  sx={{ width: 65, height: 65, borderRadius: "4px", background: "transparent" }}
                />
                <Typography
                  component="span"
                  sx={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}
                >
                  {capitalize(p.name)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <PokemonCard pokemon={pokemon} loading={fetching || randomLoading} side={side} />
    </Box>
  );
});

const PokemonCard = memo(function PokemonCard({ pokemon, loading, side }: PokemonCardProps) {
  if (loading) {
    return (
      <Box
        sx={{
          background: "var(--bg-poke-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          height: "240px",
        }}
      >
        <Loading />
      </Box>
    );
  }

  if (!pokemon) {
    return (
      <ErrorBoundary>
        <Box
          sx={{
            background: "var(--bg-poke-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px 16px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            height: "240px",
          }}
        >
          <Typography
            role="img"
            aria-label="No Pokémon selected"
            sx={{ fontSize: "13px", color: "var(--text-secondary)" }}
          >
            Choose Your Pokemon
          </Typography>
        </Box>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Box
        component="article"
        aria-label={`${capitalize(pokemon.name)} — selected as ${side === "left" ? "Challenger 1" : "Challenger 2"}`}
        sx={{
          background: "var(--bg-poke-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          position: "relative",
          overflow: "hidden",
          height: "240px",
          justifyContent: "center",
        }}
      >
        <Box
          className={`${styles[side]}`}
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            top: "-20px",
            right: "-20px",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <Box className={`${styles.bgCircle}`} sx={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </Box>

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
              position: "relative",
              zIndex: 1,
            }}
          />
        )}

        <Box sx={{ textAlign: "center", position: "relative", zIndex: 1, width: "100%" }}>
          <Box
            className={`${styles[side]} ${styles.cardName}`}
            sx={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              letterSpacing: "0.06em",
              lineHeight: 1.1,
              margin: "2px 0 6px",
              color: side === "left" ? "var(--win-a)" : "var(--win-b)",
            }}
          >
            {capitalize(pokemon.name)}
          </Box>

          <Box
            role="list"
            aria-label={`${capitalize(pokemon.name)} types`}
            sx={{ display: "flex", gap: "5px", justifyContent: "center", flexWrap: "wrap" }}
          >
            {pokemon.types.map((t) => (
              <TypePill key={t} type={t} />
            ))}
          </Box>
        </Box>
      </Box>
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
      }}
    />
  );
});

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}