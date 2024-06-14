"use client";

import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const renderThemeChanger = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <div
          className="w-6 h-6 text-yellow-500 "
          role="button"
          onClick={() => setTheme("light")}
        >
          light
        </div>
      );
    } else {
      return (
        <div
          className="w-6 h-6 text-gray-900 "
          role="button"
          onClick={() => setTheme("dark")}
        >
          Dark
        </div>
      );
    }
  };

  return <div className="dark">{renderThemeChanger()}</div>;
};

export default ThemeSwitcher;
