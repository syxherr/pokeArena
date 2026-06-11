import { createContext } from "react";

interface ThemeContextValue {
    theme: "dark" | "light";
    setTheme: (theme: "dark" | "light") => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);