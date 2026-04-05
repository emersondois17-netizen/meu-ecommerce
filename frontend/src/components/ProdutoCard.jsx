function ProdutoCard({ produto, onDeletar, onAdicionar }) {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir: ${produto.nome}?`)) {
      onDeletar(produto.id);
    }
  };

  return (
    <div className="produto-card">
      <button className="btn-excluir" onClick={handleDelete} title="Excluir Produto">
        X
      </button>
      
      <img src={produto.imagem_url} alt={produto.nome} />
      <h2>{produto.nome}</h2>
      <p>{produto.descricao}</p>
      <p className="preco">
        {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
      {/* Adicionando a função de clique no botão */}
      <button className="btn-comprar" onClick={() => onAdicionar(produto)}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
}

export default ProdutoCard;