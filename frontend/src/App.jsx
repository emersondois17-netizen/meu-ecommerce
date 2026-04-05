import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Nossas ferramentas de rotas
import FormularioProduto from './components/FormularioProduto';
import ProdutoCard from './components/ProdutoCard';
import Carrinho from './components/Carrinho';
import Header from './components/Header';
import Footer from './components/Footer';
import MeusPedidos from './pages/MeusPedidos'; // Importando a página nova
import './App.css';

// Transformamos a sua loja antiga em um componente interno temporário para organizar as rotas
function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  const buscarProdutos = () => {
    fetch('http://localhost:3000/produtos')
      .then((resposta) => resposta.json())
      .then((dados) => setProdutos(dados))
      .catch((erro) => console.error('Erro ao buscar produtos:', erro));
  };

  useEffect(() => { buscarProdutos(); }, []);

  const deletarProduto = (id) => {
    fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' })
      .then(() => buscarProdutos());
  };

  const adicionarAoCarrinho = (produtoSelecionado) => {
    setCarrinho((carrinhoAtual) => {
      const itemJaExiste = carrinhoAtual.find(item => item.id === produtoSelecionado.id);
      if (itemJaExiste) {
        return carrinhoAtual.map(item => item.id === produtoSelecionado.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...carrinhoAtual, { ...produtoSelecionado, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (idProduto) => {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter((item) => item.id !== idProduto));
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    const valorTotal = carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);

    fetch('http://localhost:3000/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itens: carrinho, valor_total: valorTotal })
    })
      .then(res => res.json())
      .then(dados => {
        alert(`Venda realizada! Pedido nº ${dados.pedidoId}`);
        setCarrinho([]); 
      });
  };

  return (
    <>
      <div className="painel-controle"> 
        <FormularioProduto onProdutoAdicionado={buscarProdutos} />
        <Carrinho itensCarrinho={carrinho} onRemoverItem={removerDoCarrinho} onFinalizar={finalizarCompra} />
      </div>
      <h2 className="titulo-secao">Nossos Produtos</h2>
      <div className="produtos-grid">
        {produtos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} onDeletar={deletarProduto} onAdicionar={adicionarAoCarrinho} />
        ))}
      </div>
    </>
  );
}

// O App principal agora só gerencia a Casca (Header/Footer) e as Rotas (O Miolo)
function App() {
  return (
    <div className="app-wrapper"> 
      <Header /> 

      <div className="container"> 
        {/* A MÁGICA ACONTECE AQUI: Ele troca o miolo baseado na URL */}
        <Routes>
          <Route path="/" element={<Loja />} />
          <Route path="/pedidos" element={<MeusPedidos />} />
        </Routes>
      </div>

      <Footer /> 
    </div>
  );
}

export default App;