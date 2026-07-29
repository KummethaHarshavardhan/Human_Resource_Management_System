import { useState } from "react";

export default function useTheme() {

  const [theme, setTheme] = useState("light-theme");

  const toggleTheme = () => {
    setTheme(prev =>
      prev === "light-theme"
        ? "dark-theme"
        : "light-theme"
    );
  };

  return {
    theme,
    toggleTheme
  };
}