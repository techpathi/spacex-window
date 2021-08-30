import React from "react";
import "./header.scss";
import brandLogo from "../../images/brand-logo.png";

export default function Header() {
  return (
    <div className="header-container">
      <img src={brandLogo} className="header-logo" alt="SpaceX logo" />
    </div>
  );
}
