import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import GerenciamentoClientes from './pages/GerenciamentoClientes';
import GerenciamentoProdutos from './pages/GerenciamentoProdutos';
import GerenciamentoUsuarios from './pages/GerenciamentoUsuarios';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Assim que o site abre, ele verifica se já existe um crachá guardado
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioSupermercado');
    const tokenSalvo = localStorage.getItem('tokenSupermercado');
    
    if (usuarioSalvo && tokenSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  if (!usuarioLogado) {
    return <Login onLoginSucesso={setUsuarioLogado} />;
  }

  const fazerLogout = () => {
    localStorage.removeItem('tokenSupermercado');
    localStorage.removeItem('usuarioSupermercado');
    setUsuarioLogado(null);
  };

  // Se estiver logado, libera o sistema corporativo
  return (
    <div className="app-wrapper">
      <Header usuario={usuarioLogado} onLogout={fazerLogout} />

      <div className="container">
        <Routes>

          <Route path="/" element={<GerenciamentoProdutos />} />
          <Route path="/usuarios" element={<GerenciamentoUsuarios />} />
          <Route path="/clientes" element={<GerenciamentoClientes />} />
          <Route path="*" element={<Navigate to="/" />} />

          {/* Rota principal (Produtos) */}
          <Route path="/" element={<GerenciamentoProdutos />} />
          
          {/* Rota de Funcionários */}
          <Route path="/usuarios" element={<GerenciamentoUsuarios />} />
          
          {/* Rota de segurança para evitar que o usuário se perca */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;