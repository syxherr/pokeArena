import { useState } from "react";
import { ThemeContext } from "./ThemeContext"
import { applyTheme } from "./theme";
import React from "react";

export function ThemeProvider({ children }: {children: React.ReactNode}) {
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}