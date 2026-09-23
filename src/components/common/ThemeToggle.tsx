import { useTheme } from "@/context/theme-context";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
} from "./Icons";

export const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <div className="join items-center">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Current theme is ${resolvedTheme}. Click to toggle light/dark.`}
          className="btn btn-ghost btn-sm btn-square join-item text-base-content/80 hover:text-base-content hover:bg-base-200 transition-transform active:scale-95"
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <MoonIcon className="w-4 h-4 text-indigo-400" />
          ) : (
            <SunIcon className="w-4 h-4 text-amber-500" />
          )}
        </button>
        <button
          tabIndex={0}
          role="button"
          aria-label="Theme options"
          className="btn btn-ghost btn-xs px-1 join-item text-base-content/50 hover:text-base-content hover:bg-base-200"
        >
          <ChevronDownIcon className="w-3 h-3" />
        </button>
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm bg-base-100 rounded-xl z-30 mt-2 w-36 p-1.5 shadow-xl border border-base-200"
      >
        <li>
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg ${
              theme === "light" ? "active font-semibold" : ""
            }`}
          >
            <SunIcon className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg ${
              theme === "dark" ? "active font-semibold" : ""
            }`}
          >
            <MoonIcon className="w-4 h-4 text-indigo-400" />
            <span>Dark</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg ${
              theme === "system" ? "active font-semibold" : ""
            }`}
          >
            <ComputerDesktopIcon className="w-4 h-4 text-base-content/70" />
            <span>System</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeToggle;
