import { useState, useEffect, memo, useMemo } from "react";
import { motion } from "motion/react";
import styles from "./StatsSection.module.css";
import type {
  StatsSectionProps,
  StatResult,
  CalcResults,
  AnimatedRowProps,
  StatRowProps,
  ResultBannerProps,
  Pokemon,
} from "../../types";
import { Box, Stack, Typography } from "@mui/material";

const STAT_KEYS = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];
const MAX_STAT = 255;

const StatsSection = memo(function StatsSection({
  pokemonA,
  pokemonB,
  onComplete,
}: StatsSectionProps) {
  const { winsA, winsB, statResults } = useMemo(
    () => calcResults(pokemonA, pokemonB),
    [pokemonA, pokemonB],
  );
  const listKey = `${pokemonA.name}-${pokemonB.name}`;

  const [visibleCount, setVisibleCount] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    setVisibleCount(0);
    setAllDone(false);
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next >= STAT_KEYS.length) {
          clearInterval(interval);
          setTimeout(() => setAllDone(true), 100);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pokemonA.name, pokemonB.name]);

  useEffect(() => {
    if (!allDone) return;
    const id = setTimeout(() => onComplete?.(), 2000);
    return () => clearTimeout(id);
  }, [allDone, onComplete]);

  return (
    <Box
      component="article"
      sx={{
        mt: "24px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        pt: "1rem",
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--win-a)",
            pl: "20px",
          }}
        >
          {capitalize(pokemonA.name)}
        </Typography>
        <Typography
          sx={{
            fontSize: "10px",
            color: "var(--text-muted)",
            textAlign: "center",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          Stats
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--win-b)",
            textAlign: "right",
            pr: "20px",
          }}
        >
          {capitalize(pokemonB.name)}
        </Typography>
      </Stack>

      <div
        key={listKey}
        role="list"
        aria-label={`${visibleCount} of ${STAT_KEYS.length} stats loaded`}
      >
        {statResults
          .slice(0, visibleCount)
          .map(({ statkey, va, vb, barA, barB, winA, winB }, index) => (
            <AnimatedRow
              key={statkey}
              label={statkey}
              index={index}
              allDone={allDone}
              va={va}
              vb={vb}
              barA={barA}
              barB={barB}
              winA={winA}
              winB={winB}
              nameA={pokemonA.name}
              nameB={pokemonB.name}
            />
          ))}
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: STAT_KEYS.length * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ResultBanner
            winsA={winsA}
            winsB={winsB}
            nameA={pokemonA.name}
            nameB={pokemonB.name}
          />
        </motion.div>
      )}
    </Box>
  );
});

export default StatsSection;

const AnimatedRow = memo(function AnimatedRow({
  index,
  allDone,
  label,
  va,
  vb,
  barA,
  barB,
  winA,
  winB,
  nameA,
  nameB,
}: AnimatedRowProps) {
  return (
    <div role="listitem">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          allDone
            ? { duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0 }
        }
      >
        <StatRow
          label={label}
          va={va}
          vb={vb}
          barA={barA}
          barB={barB}
          winA={winA}
          winB={winB}
          nameA={nameA}
          nameB={nameB}
        />
      </motion.div>
    </div>
  );
});

const StatRow = memo(function StatRow({
  label,
  va,
  vb,
  barA,
  barB,
  winA,
  winB,
  nameA,
  nameB,
}: StatRowProps) {
  const numSx = {
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: "22px",
    letterSpacing: "0.04em",
    lineHeight: 1,
  };

  const dotBaseSx = {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    flexShrink: 0,
  };

  return (
    <Box
      className={styles.statRow}
      aria-label={`${label.toUpperCase()} — ${capitalize(nameA)} ${va}, ${capitalize(nameB)} ${vb}${winA ? `, ${capitalize(nameA)} wins this stat` : winB ? `, ${capitalize(nameB)} wins this stat` : ", tied"}`}
      sx={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 80px",
        alignItems: "center",
        padding: "11px 20px",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.12s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
        {winA && (
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              ...dotBaseSx,
              background: "var(--win-a)",
              boxShadow:
                "0 0 4px 1px var(--win-a), 0 0 10px 2px var(--win-a-dim), 0 0 18px 3px var(--win-a-dim)",
            }}
          />
        )}
        <Typography
          component="span"
          aria-hidden="true"
          sx={{ ...numSx, color: winA ? "var(--win-a)" : "var(--text-muted)" }}
        >
          {va}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          px: "12px",
        }}
      >
        <Typography
          component="span"
          aria-hidden="true"
          sx={{
            fontSize: "10px",
            color: "var(--text-muted)",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label.toUpperCase()}
        </Typography>
        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}
          aria-hidden="true"
        >
          <Box
            sx={{
              height: "5px",
              borderRadius: "20px",
              background: "var(--bar-bg)",
              overflow: "visible",
              position: "relative",
            }}
          >
            <motion.div
              className={`${styles.barLeft} ${!winA ? styles.barDim : ""}`}
              initial={{ width: "0%" }}
              animate={{ width: `${barA}%` }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                height: "100%",
                borderRadius: "20px",
                position: "absolute",
                top: 0,
              }}
            />
          </Box>
          <Box
            sx={{
              height: "5px",
              borderRadius: "20px",
              background: "var(--bar-bg)",
              overflow: "visible",
              position: "relative",
            }}
          >
            <motion.div
              className={`${styles.barRight} ${!winB ? styles.barDim : ""}`}
              initial={{ width: "0%" }}
              animate={{ width: `${barB}%` }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                height: "100%",
                borderRadius: "20px",
                position: "absolute",
                top: 0,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "7px",
        }}
      >
        <Typography
          component="span"
          aria-hidden="true"
          sx={{ ...numSx, color: winB ? "var(--win-b)" : "var(--text-muted)" }}
        >
          {vb}
        </Typography>
        {winB && (
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              ...dotBaseSx,
              background: "var(--win-b)",
              boxShadow:
                "0 0 4px 1px var(--win-b), 0 0 10px 2px var(--win-b-dim), 0 0 18px 3px var(--win-b-dim)",
            }}
          />
        )}
      </Box>
    </Box>
  );
});

const ResultBanner = memo(function ResultBanner({
  winsA,
  winsB,
  nameA,
  nameB,
}: ResultBannerProps) {
  const resultBaseSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "15px 20px",
    background: "var(--bg-card-inner)",
    borderTop: "1px solid var(--border)",
  };

  const resultTextSx = {
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: "18px",
    letterSpacing: "0.08em",
  };

  const dotBaseSx = {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    flexShrink: 0,
  };

  if (winsA > winsB)
    return (
      <Box
        className={styles.result}
        role="status"
        aria-live="polite"
        sx={resultBaseSx}
      >
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            ...dotBaseSx,
            background: "var(--win-a)",
            boxShadow:
              "0 0 4px 1px var(--win-a), 0 0 10px 2px var(--win-a-dim), 0 0 18px 3px var(--win-a-dim)",
          }}
        />
        <Typography
          component="span"
          sx={{ ...resultTextSx, color: "var(--win-a)" }}
        >
          {capitalize(nameA)} wins
        </Typography>
        <Typography
          component="span"
          aria-label={`Score: ${winsA} to ${winsB}`}
          sx={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 400 }}
        >
          {winsA} – {winsB}
        </Typography>
      </Box>
    );

  if (winsB > winsA)
    return (
      <Box
        className={styles.result}
        role="status"
        aria-live="polite"
        sx={resultBaseSx}
      >
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            ...dotBaseSx,
            background: "var(--win-b)",
            boxShadow:
              "0 0 4px 1px var(--win-b), 0 0 10px 2px var(--win-b-dim), 0 0 18px 3px var(--win-b-dim)",
          }}
        />
        <Typography
          component="span"
          sx={{ ...resultTextSx, color: "var(--win-b)" }}
        >
          {capitalize(nameB)} wins
        </Typography>
        <Typography
          component="span"
          aria-label={`Score: ${winsA} to ${winsB}`}
          sx={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 400 }}
        >
          {winsA} – {winsB}
        </Typography>
      </Box>
    );

  return (
    <Box
      className={styles.result}
      role="status"
      aria-live="polite"
      sx={resultBaseSx}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{ ...dotBaseSx, background: "var(--text-muted)" }}
      />
      <Typography
        component="span"
        sx={{ ...resultTextSx, color: "var(--text-muted)" }}
      >
        Draw — {winsA} wins each
      </Typography>
      <Box
        component="span"
        aria-hidden="true"
        sx={{ ...dotBaseSx, background: "var(--text-muted)" }}
      />
    </Box>
  );
});

function calcResults(a: Pokemon, b: Pokemon): CalcResults {
  let winsA = 0,
    winsB = 0;
  const statResults: StatResult[] = STAT_KEYS.map((key) => {
    const va = a.stats[key] ?? 0;
    const vb = b.stats[key] ?? 0;
    const winA = va > vb,
      winB = vb > va;
    if (winA) winsA++;
    else if (winB) winsB++;
    return {
      statkey: key,
      va,
      vb,
      barA: Math.round((va / MAX_STAT) * 100),
      barB: Math.round((vb / MAX_STAT) * 100),
      winA,
      winB,
    };
  });
  return { winsA, winsB, statResults };
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
