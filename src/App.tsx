import { usePokemonList } from "./hooks/usePokemon";
import { Helmet } from "react-helmet-async";
import { useComparator } from "./hooks/useComparator";
import { useTheme } from "./style/theme/useTheme";
import {
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useRef,
  useEffect,
  useState,
} from "react";
import PokemonPicker from "./components/picker/PokemonPicker";
import styles from "./App.module.css";
import { calcWinner } from "./hooks/useComparator";
import BattleOverlay from "./components/battle/BattleOverlay";
import { fetchPokemonDetail } from "./hooks/usePokemon";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";

import Button from "@mui/material/Button";
import { Switch, Alert, Box, Typography, Card } from "@mui/material";

const History = lazy(() => import("./components/history/History"));
const StatsSection = lazy(() => import("./components/battle/StatsSection"));

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pokemon Arena",
  description:
    "A web app to compare Pokemon stats in a fun and interactive way.",
  applicationCategory: "Game",
  operatingSystem: "Web",
};

export default function App() {
  // custom hook usePokemonList(
  const { list, loading: listLoading, error } = usePokemonList();

  // custom hook useComparator()
  const {
    selected,
    statsVisible,
    overlayPhase,
    history,
    selectPokemon,
    compare,
    reset,
    clearHistory,
    onBeginDone,
    onStatsComplete,
    onWinnerDismiss,
  } = useComparator();

  // custom hook useTheme()
  const { theme, setTheme } = useTheme();

  const [randomLoading, setRandomLoading] = useState(false);

  const handleRandom = useCallback(() => {
    if (list.length < 2) return;
    const idxA = Math.floor(Math.random() * list.length);
    let idxB;
    do {
      idxB = Math.floor(Math.random() * list.length);
    } while (idxB === idxA);

    selectPokemon(0, null);
    selectPokemon(1, null);
    setRandomLoading(true);

    Promise.all([
      fetchPokemonDetail(list[idxA].name),
      fetchPokemonDetail(list[idxB].name),
    ])
      .then(([a, b]) => {
        selectPokemon(0, a);
        selectPokemon(1, b);
      })
      .finally(() => {
        setRandomLoading(false);
      });
  }, [list, selectPokemon]);

  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (statsVisible && statsRef.current) {
      const id = setTimeout(() => statsRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [statsVisible]);

  const battleResult = useMemo(() => {
    if (!selected[0] || !selected[1]) return { winsA: 0, winsB: 0 };
    return calcWinner(selected[0], selected[1]);
  }, [selected]);

  const handleThemeToggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme],
  );

  const canCompare = useMemo(
    () => Boolean(selected[0] && selected[1]),
    [selected],
  );

  return (
    <>
      <Helmet>
        <title>Pokemon Arena</title>
        <meta
          name="description"
          content="Pick two Pokémon and start the battle!"
        />
        <meta property="og:title" content="Pokemon Arena" />
        <meta
          property="og:description"
          content="Pick two Pokémon and start the battle!"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" />
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      </Helmet>
      <Box className={styles.app}>
        <Box component="header" className={styles.header}>
          <Box className={styles.brand}>
            <img src="/pokeball.svg" alt="Logo" className={styles.logo} />
            <Box className={styles.brandText}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                Pokemon Arena
              </Typography>
            </Box>
          </Box>

          <Switch
            checked={theme === "dark"}
            onChange={handleThemeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            sx={{
              width: 48,
              height: 26,
              padding: 0,
              "& .MuiSwitch-switchBase": {
                padding: 0,
                margin: "4px",
                "&.Mui-checked": {
                  transform: "translateX(22px)",
                  "& .MuiSwitch-thumb": {
                    background: "var(--accent)",
                  },
                  "& + .MuiSwitch-track": {
                    background: "var(--accent-dim)",
                    border: "1.5px solid var(--accent-border)",
                    opacity: 1,
                  },
                },
              },
              "& .MuiSwitch-thumb": {
                width: 18,
                height: 18,
                background: "var(--toggle-theme)",
              },
              "& .MuiSwitch-track": {
                borderRadius: 30,
                background: "var(--bg-card-inner)",
                border: "1.5px solid var(--border)",
                opacity: 1,
              },
            }}
          />

          {/* <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              role="switch"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-checked={theme === "dark"}
              checked={theme === "dark"}
              onChange={handleThemeToggle}
            />
            <span className={styles.toggleTrack} aria-hidden="true">
              <span className={styles.toggleThumb} />
            </span>
          </label> */}
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13px",
              borderRadius: "12px",
            }}
          >
            Failed load data: {error}
          </Alert>
        )}

        <Card
          component="section"
          variant="outlined"
          className={styles.card}
          sx={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            boxShadow: "none",
            padding: 3,
          }}
        >
          <PokemonPicker
            pokemonList={list}
            listLoading={listLoading}
            selected={selected}
            onSelect={selectPokemon}
            randomLoading={randomLoading}
          />

          <div
            className={styles.actions}
            role="group"
            aria-label="Battle actions"
          >
            <Button
              variant="outlined"
              onClick={reset}
              aria-label="Reset Pokemon"
              sx={{
                borderRadius: "12px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "none",
                borderColor: "var(--border-focus)",
                color: "var(--text-secondary)",
                padding: "11px 22px",
                "&:hover": {
                  borderColor: "var(--border-focus)",
                  color: "var(--text-primary)",
                  background: "transparent",
                },
              }}
            >
              Reset
            </Button>

            <Button
              variant="outlined"
              onClick={handleRandom}
              disabled={listLoading}
              aria-label="Pick two random Pokémon"
              sx={{
                borderRadius: "12px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "none",
                borderColor: "var(--border-focus)",
                color: "var(--text-secondary)",
                padding: "11px 22px",
                "&:hover": {
                  borderColor: "var(--border-focus)",
                  color: "var(--text-primary)",
                  background: "transparent",
                },
                "&:disabled": {
                  opacity: 0.35,
                  borderColor: "var(--border-focus)",
                },
              }}
            >
              Random
            </Button>

            <Button
              variant="contained"
              onClick={compare}
              disabled={!canCompare}
              aria-disabled={!canCompare}
              sx={{
                borderRadius: "12px",
                fontFamily: "'Unbounded', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "none",
                background: "var(--accent)",
                color: "#fff",
                padding: "11px 26px",
                boxShadow:
                  "3px 3px 0 rgba(0,0,0,0.35), 0 4px 14px var(--accent-border)",
                "&:hover": {
                  background: "var(--accent)",
                  filter: "brightness(1.08)",
                  boxShadow:
                    "3px 3px 0 rgba(0,0,0,0.35), 0 6px 20px var(--accent-border)",
                },
                "&:active": {
                  transform: "translate(2px, 2px)",
                  boxShadow:
                    "1px 1px 0 rgba(0,0,0,0.35), 0 2px 8px var(--accent-border)",
                },
                "&:disabled": {
                  opacity: 0.35,
                  background: "var(--accent)",
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
            >
              Start Battle
            </Button>
          </div>

          {statsVisible && selected[0] && selected[1] && (
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <div ref={statsRef} tabIndex={-1} aria-label="Battle results">
                  <StatsSection
                    pokemonA={selected[0]}
                    pokemonB={selected[1]}
                    onComplete={onStatsComplete}
                  />
                </div>
              </Suspense>
            </ErrorBoundary>
          )}
        </Card>

        {history.length > 0 && (
          <Card
            component="section"
            variant="outlined"
            className={styles.card}
            aria-label="Battle history"
            sx={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "none",
              padding: 2.1,
            }}
          >
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <History entries={history} onClear={clearHistory} />
              </Suspense>
            </ErrorBoundary>
          </Card>
        )}
      </Box>
      {/* props */}
      <BattleOverlay
        phase={overlayPhase}
        nameA={selected[0]?.name ?? ""}
        nameB={selected[1]?.name ?? ""}
        winsA={battleResult.winsA}
        winsB={battleResult.winsB}
        onBeginDone={onBeginDone}
        onWinnerDismiss={onWinnerDismiss}
      />
    </>
  );
}
