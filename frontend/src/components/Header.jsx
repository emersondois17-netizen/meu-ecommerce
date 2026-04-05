import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="main-header">
      <div className="logo-container">
        <div className="logo-icon">
          <span>T</span>
          <div className="icon-detail"></div>
        </div>
        <div className="logo-text">
          <h1>Tech<span>Nova</span></h1>
          <p>Hardware Premium</p>
        </div>
      </div>
      
      <nav className="header-nav">
        <Link to="/" className="nav-link">Loja</Link>
        <Link to="/pedidos" className="nav-link">Meus Pedidos</Link>
      </nav>

    </header>
  );
}

export default Header;