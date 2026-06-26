import { useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Box, Typography } from "@mui/material";
import type { BattleOverlayProps } from "../../types";

const PHASES = {
  begin: "begin",
  winner: "winner",
};

const BattleOverlay = memo(function BattleOverlay({
  phase,
  nameA,
  nameB,
  winsA,
  winsB,
  onBeginDone,
  onWinnerDismiss,
}: BattleOverlayProps) {
  const visible = phase === PHASES.begin || phase === PHASES.winner;

  useEffect(() => {
    if (phase !== PHASES.begin) return;
    const id = setTimeout(() => onBeginDone?.(), 3000);
    return () => clearTimeout(id);
  }, [phase, onBeginDone]);

  const winner = winsA > winsB ? nameA : winsB > winsA ? nameB : null;

  return (
    <AnimatePresence>
      {visible && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={phase === PHASES.winner ? onWinnerDismiss : undefined}
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {phase === PHASES.begin && (
              <Box
                component={motion.div}
                key="begin"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.15, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Unbounded", sans-serif',
                    fontSize: "clamp(28px, 6vw, 48px)",
                    fontWeight: 800,
                    color: "var(--red)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    textShadow:
                      "0 0 20px var(--accent-border), 0 0 40px var(--accent-border)",
                  }}
                >
                  Battle Begin!
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    mt: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: "22px",
                      letterSpacing: "0.06em",
                      color: "var(--win-a)",
                    }}
                  >
                    {capitalize(nameA)}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Unbounded", sans-serif',
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    VS
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: "22px",
                      letterSpacing: "0.06em",
                      color: "var(--win-b)",
                    }}
                  >
                    {capitalize(nameB)}
                  </Typography>
                </Box>
              </Box>
            )}

            {phase === PHASES.winner && (
              <Box
                component={motion.div}
                key="winner"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.15, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Click to dismiss"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "center",
                }}
              >
                {winner ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      The Winner Is
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Unbounded", sans-serif',
                        fontSize: "clamp(28px, 6vw, 48px)",
                        fontWeight: 800,
                        color: "var(--win-a)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                        textShadow:
                          "0 0 20px var(--win-a-dim), 0 0 40px var(--win-a-dim)",
                      }}
                    >
                      {capitalize(winner)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      It's A
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Unbounded", sans-serif',
                        fontSize: "clamp(28px, 6vw, 48px)",
                        fontWeight: 800,
                        color: "var(--text-muted)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                      }}
                    >
                      Draw
                    </Typography>
                  </>
                )}
                <Typography
                  sx={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: "32px",
                    letterSpacing: "0.1em",
                    color: "var(--text-secondary)",
                    mt: "2px",
                  }}
                >
                  {winsA} – {winsB}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mt: "8px",
                    opacity: 0.6,
                  }}
                >
                  tap to continue
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      )}
    </AnimatePresence>
  );
});

export default BattleOverlay;

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
