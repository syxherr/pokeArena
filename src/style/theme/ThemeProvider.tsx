import { useState, useMemo } from "react";
import { ThemeContext } from "./ThemeContext";
import { applyTheme } from "./theme";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function buildMuiTheme(mode: "dark" | "light") {
  return createTheme({
    palette: {
      mode,
    },
    typography: {
      fontFamily: "'Nunito', sans-serif",
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: { h1: "h1", h2: "h2", h3: "h3", body1: "p", body2: "p" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            fontFamily: "'Nunito', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            textTransform: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            fontFamily: "'Nunito', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            height: "22px",
          },
          label: {
            padding: "0 9px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "var(--bg-input)",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-primary)",
              "& fieldset": { borderColor: "var(--border)", borderWidth: "1px" },
              "&:hover fieldset": { borderColor: "var(--border-focus)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--border-focus)",
                borderWidth: "1px",
                boxShadow: "0 0 0 2px var(--accent-dim)",
              },
              "&.Mui-disabled": { opacity: 0.4 },
            },
            "& .MuiOutlinedInput-input": {
              padding: "11px 14px",
              "&::placeholder": { color: "var(--text-muted)", opacity: 1 },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            boxShadow: "none",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            fontFamily: "'Nunito', sans-serif",
            fontSize: "13px",
            borderRadius: "12px",
          },
        },
      },
    },
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    const t = (localStorage.getItem("poke-theme") || "dark") as "dark" | "light";
    applyTheme(t);
    return t;
  });

  function changeTheme(next: "dark" | "light") {
    applyTheme(next);
    localStorage.setItem("poke-theme", next);
    setTheme(next);
  }

  const muiTheme = useMemo(() => buildMuiTheme(theme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}