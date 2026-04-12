import { useState, useEffect } from 'react';

function GerenciamentoProdutos() {
  const [produtos, setProdutos] = useState([]);
  
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco_atual, setPrecoAtual] = useState('');
  const [data_validade, setDataValidade] = useState('');
  const [imagem_url, setImagemUrl] = useState('');

  // Carregar produtos ao abrir a página
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/produtos');
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro);
    }
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    const novoProduto = {
      nome, tipo, descricao, 
      preco_atual: Number(preco_atual), 
      data_validade, imagem_url
    };

    try {
      await fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      });
      alert('Produto cadastrado com sucesso!');
      carregarProdutos(); // Atualiza a lista na hora
      // Limpa os campos
      setNome(''); setTipo(''); setDescricao(''); setPrecoAtual(''); setDataValidade(''); setImagemUrl('');
    } catch (erro) {
      alert('Erro ao cadastrar produto.');
    }
  };

  const deletarProduto = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir este produto?')) {
      await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
      carregarProdutos();
    }
  };

  const aplicarPromocao = async (id) => {
    const novoPreco = prompt('Digite o novo preço promocional (ou 0 para remover a promoção):');
    if (novoPreco !== null) {
      await fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preco_promocao: Number(novoPreco) })
      });
      carregarProdutos();
    }
  };

  return (
    <div className="admin-section">
      <h2>📦 Gestão de Produtos e Promoções</h2>
      
      <div className="admin-grid">
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <div className="admin-card form-card">
          <h3>Cadastrar Novo Produto</h3>
          <form onSubmit={cadastrarProduto}>
            <input type="text" placeholder="Nome do Produto" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="Tipo (Ex: Mercearia, Limpeza)" value={tipo} onChange={e => setTipo(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Preço Atual (R$)" value={preco_atual} onChange={e => setPrecoAtual(e.target.value)} required />
            <input type="date" title="Data de Validade" value={data_validade} onChange={e => setDataValidade(e.target.value)} required />
            <textarea placeholder="Descrição breve..." value={descricao} onChange={e => setDescricao(e.target.value)} />
            <input type="text" placeholder="URL da Imagem (Opcional)" value={imagem_url} onChange={e => setImagemUrl(e.target.value)} />
            <button type="submit" className="btn-primary">Salvar Produto</button>
          </form>
        </div>

        {/* LADO DIREITO: LISTA */}
        <div className="admin-card list-card">
          <h3>Catálogo do Supermercado</h3>
          {produtos.length === 0 ? <p>Nenhum produto cadastrado ainda.</p> : (
            <div className="produtos-lista">
              {produtos.map(produto => (
                <div key={produto._id} className="produto-card">
                  <img src={produto.imagem_url} alt={produto.nome} className="produto-img" />
                  
                  <div className="produto-info">
                    <h4>{produto.nome} <span className="badge">{produto.tipo}</span></h4>
                    
                    {produto.preco_promocao > 0 ? (
                      <p>
                        <s style={{ color: 'var(--cor-perigo)' }}>R$ {produto.preco_atual.toFixed(2)}</s> 
                        <strong style={{ color: 'var(--cor-sucesso)', marginLeft: '10px' }}>R$ {produto.preco_promocao.toFixed(2)}</strong>
                        <span className="badge" style={{ background: 'var(--cor-sucesso)', color: 'white', marginLeft: '8px' }}>OFERTA</span>
                      </p>
                    ) : (
                      <p><strong>R$ {produto.preco_atual.toFixed(2)}</strong></p>
                    )}
                  </div>
                  
                  <div className="produto-acoes">
                    <button onClick={() => aplicarPromocao(produto._id)} className="btn-warning">🏷️ Promoção</button>
                    <button onClick={() => deletarProduto(produto._id)} className="btn-danger">🗑️ Remover</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GerenciamentoProdutos;