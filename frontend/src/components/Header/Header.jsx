import React from "react";
import "./Header.scss";

const Header = ({ connected, sessionId }) => {
  return (
    <header className="header">
      <div className="header__content">
        <div>
          <h1 className="header__title">NewsVoosh</h1>
          {sessionId && (
            <div className="header__info">
              Session: {sessionId.slice(0, 8)}...
            </div>
          )}
        </div>
        <div className="header__status">
          <div
            className={`header__status-dot ${!connected ? "disconnected" : ""}`}
          ></div>
          <span>{connected ? "CONNECTED" : "DISCONNECTED"}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
