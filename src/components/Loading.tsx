import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./Loading.module.css";

export default function StatsLoading() {
  return (
    <Box
      className={styles.wrap}
      role="status"
      aria-label="Loading Battle"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
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