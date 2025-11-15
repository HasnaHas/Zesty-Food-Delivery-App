import React from "react";
import "./Header.css";
import { assets } from '../../assets/frontend_assets/assets'

const Header = () => {

  const scrollToMenu = () => {
    const menuSection = document.getElementById("explore-menu");
    if(menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      className="header"
      style={{ backgroundImage: `url(${assets.hero})` }}
    >
      <div className="header-contents">
        <h2>Delight in Every Bite</h2>
        <p>
          Explore our curated menu featuring signature dishes crafted with premium ingredients.
          Savor the flavors, enjoy the experience, and let us make every meal memorable.
        </p>
        <button onClick={scrollToMenu}>Explore Menu</button>
      </div>
    </div>
  );
};

export default Header;
