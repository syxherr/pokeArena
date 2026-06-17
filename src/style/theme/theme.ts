import { themes, type ThemeName } from "./color.js";

function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

export function applyTheme(themeName: ThemeName): void {
  const tokens = themes[themeName];
  if (!tokens) return;

  const root = document.documentElement;
  root.setAttribute("data-theme", themeName);

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--${toKebab(key)}`, value);
  });
}
