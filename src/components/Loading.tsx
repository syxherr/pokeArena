import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./Loading.module.css";

export default function StatsLoading() {
  return (
    <Box
      role="status"
      aria-label="Loading Battle"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "32px",
      }}
    >
      <img src="/pokeball.svg" alt="" className={styles.pokeball} width={48} height={48} />
      <Typography
        sx={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        Catching Pokemon
      </Typography>
    </Box>
  );
}