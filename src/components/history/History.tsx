import { useRef } from "react";
import { motion, useInView } from "motion/react";
import styles from "./History.module.css";
import { Button, Typography, Avatar } from "@mui/material";

interface HistoryEntry {
  nameA: string;
  nameB: string;
  statusA: "Win" | "Lose" | "Draw";
  statusB: "Win" | "Lose" | "Draw";
  spriteA?: string;
  spriteB?: string;
}

interface HistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

interface HistoryItemProps {
  entry: HistoryEntry;
  index: number;
}

interface AnimatedItemProps {
  children: React.ReactNode;
  index: number;
}

function AnimatedItem({ children, index }: AnimatedItemProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function History({ entries, onClear }: HistoryProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
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
          </Typography>{" "}
        </div>

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
      </div>

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
          No history yet.
        </Typography>
      ) : (
        <div className={styles.table}>
          <div className={styles.colHeaders}>
            <div className={styles.colRound}>Round</div>
            <div className={styles.colA}>Challenger 1</div>
            <div />
            <div className={styles.colB}>Challenger 2</div>
          </div>

          <div className={styles.list}>
            {entries.map((entry, i) => (
              <AnimatedItem key={i} index={i}>
                <HistoryItem entry={entry} index={entries.length - i} />
              </AnimatedItem>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryItem({ entry, index }: HistoryItemProps) {
  const { nameA, nameB, statusA, statusB, spriteA, spriteB } = entry;

  const nameClassA = styles.nameA;
  const nameClassB = styles.nameB;

  return (
    <div className={styles.row}>
      <div className={styles.roundNum}>{index}</div>

      <div className={styles.sideA}>
        {spriteA && (
          <Avatar
            variant="square"
            src={spriteA}
            alt={nameA}
            sx={{ width: 36, height: 36, borderRadius: "6px" }}
          />
        )}
        <div className={styles.pokeInfo}>
          <span className={`${styles.pokeName} ${nameClassA}`}>
            {capitalize(nameA)}
          </span>
          <div className={styles.status}>
            <span
              className={`${styles.statusText} ${statusA === "Win" ? styles.statusWin : statusA === "Lose" ? styles.statusLose : styles.statusDraw}`}
            >
              {statusA}
            </span>
          </div>
        </div>
      </div>

      <Typography sx={{ fontSize: "18px" }} aria-hidden="true">
        ⚔️
      </Typography>

      <div className={styles.sideB}>
        <div className={styles.pokeInfo} style={{ alignItems: "flex-end" }}>
          <span className={`${styles.pokeName} ${nameClassB}`}>
            {capitalize(nameB)}
          </span>
          <div className={styles.status}>
            <span
              className={`${styles.statusText} ${statusB === "Win" ? styles.statusWin : statusB === "Lose" ? styles.statusLose : styles.statusDraw}`}
            >
              {statusB}
            </span>
          </div>
        </div>
        {spriteB && (
          <Avatar
            variant="square"
            src={spriteB}
            alt={nameB}
            sx={{ width: 36, height: 36, borderRadius: "6px" }}
          />
        )}
      </div>
    </div>
  );
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
