import React, { useState, useEffect } from "react";
import "./Header.scss";

const Header = ({ connected, sessionId }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left">
          <h1 className="header__title">NewsVoosh</h1>
          <div className="header__status">
            <div
              className={`header__status-dot ${
                !connected ? "disconnected" : ""
              }`}
            ></div>
            <span>{connected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
        <div className="header__right">
          {sessionId && (
            <div className="header__info">
              Session: {sessionId.slice(0, 8)}...
            </div>
          )}
          <button className="header__theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
