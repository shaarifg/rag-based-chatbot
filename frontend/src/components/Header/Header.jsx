import React from "react";
import { useTheme } from "@/context/ThemeContext";
import "./Header.scss";

const Header = ({ connected, sessionId }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left">
          <h1 className="header__title">
            <span className="header__title-icon">◆</span>
            NewsVoosh
          </h1>
          {sessionId && (
            <span className="header__session">
              Session: {sessionId.slice(0, 8)}
            </span>
          )}
        </div>
        <div className="header__right">
          <div className="header__status">
            <div
              className={`header__status-dot ${
                !connected ? "disconnected" : ""
              }`}
            ></div>
            <span>{connected ? "Connected" : "Disconnected"}</span>
          </div>
          <button
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
