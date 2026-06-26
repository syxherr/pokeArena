import { useRef } from "react";
import { motion, useInView } from "motion/react";
import styles from "./History.module.css";
import { Box, Button, Typography, Avatar } from "@mui/material";
import type { HistoryProps, HistoryItemProps, AnimatedItemProps } from "../../types";

function AnimatedItem({ children, index }: AnimatedItemProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function History({ entries, onClear }: HistoryProps) {
  return (
    <Box sx={{ mt: "24px" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            History
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={onClear}
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "none",
            padding: "6px 14px",
            borderRadius: "8px",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            "&:hover": {
              borderColor: "rgba(224,58,47,0.3)",
              color: "var(--red)",
              background: "transparent",
            },
          }}
        >
          Clear
        </Button>
      </Box>

      {entries.length === 0 ? (
        <Typography
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No battle yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "52px 1fr 48px 1fr",
              padding: "0 14px 8px",
              borderBottom: "1.5px solid var(--border)",
              mb: "8px",
            }}
          >
            {[
              { label: "Round", color: "var(--text-muted)", align: "left" },
              { label: "Challenger 1", color: "var(--win-a)", align: "left" },
              { label: "", color: "transparent", align: "left" },
              { label: "Challenger 2", color: "var(--win-b)", align: "right" },
            ].map(({ label, color, align }) => (
              <Typography
                key={label}
                sx={{
                  fontSize: "9px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color,
                  textAlign: align,
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {entries.map((entry, i) => (
              <AnimatedItem key={i} index={i}>
                <HistoryItem entry={entry} index={entries.length - i} />
              </AnimatedItem>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

function HistoryItem({ entry, index }: HistoryItemProps) {
  const { nameA, nameB, statusA, statusB, spriteA, spriteB } = entry;

  const statusColor = (status: string) =>
    status === "Win" ? "var(--status-win)" : status === "Lose" ? "var(--status-lose)" : "var(--text-muted)";

  return (
    <Box
      className={styles.row}
      sx={{
        display: "grid",
        gridTemplateColumns: "52px 1fr 48px 1fr",
        alignItems: "center",
        padding: "10px 14px",
        background: "var(--bg-card-inner)",
        border: "1.5px solid var(--border)",
        borderRadius: "14px",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      <Typography
        sx={{
          pl: "8px",
          minWidth: "40px",
          fontFamily: "'Unbounded', sans-serif",
          fontSize: "20px",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--text-muted)",
        }}
      >
        {index}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {spriteA && (
          <Avatar variant="square" src={spriteA} alt={nameA} sx={{ width: 36, height: 36, borderRadius: "6px" }} />
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.01em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: "var(--win-a)",
            }}
          >
            {capitalize(nameA)}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: statusColor(statusA),
            }}
          >
            {statusA}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ fontSize: "18px", textAlign: "center" }} aria-hidden="true">
        ⚔️
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-end" }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.01em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: "var(--win-b)",
            }}
          >
            {capitalize(nameB)}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: statusColor(statusB),
            }}
          >
            {statusB}
          </Typography>
        </Box>
        {spriteB && (
          <Avatar variant="square" src={spriteB} alt={nameB} sx={{ width: 36, height: 36, borderRadius: "6px" }} />
        )}
      </Box>
    </Box>
  );
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}