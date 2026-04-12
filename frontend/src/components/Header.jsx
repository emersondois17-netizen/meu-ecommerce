import { Link } from 'react-router-dom';

function Header({ usuario, onLogout }) {
  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo SVG desenhada diretamente no código */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            <path d="M12 5v4m-2-2h4" stroke="#1E293B"></path> {/* Detalhe de "Adicionar" sutil */}
          </svg>
          <h1>SuperAdmin <span>UNIFACISA</span></h1>
        </div>
        
        <nav className="admin-nav">
          <Link to="/">📦 Produtos</Link>
          <Link to="/usuarios">👥 Funcionários</Link>
          <Link to="/clientes">🤝 Clientes</Link>
        </nav>

        <div className="user-info">
          <span>Olá, <strong>{usuario.nome}</strong></span>
          <button onClick={onLogout} className="btn-logout">Sair</button>
        </div>
      </div>
    </header>
  );
}

export default Header;