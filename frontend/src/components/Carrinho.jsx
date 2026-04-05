// RECEBENDO A PROP onFinalizar AQUI EM CIMA:
function Carrinho({ itensCarrinho, onRemoverItem, onFinalizar }) {
  const valorTotal = itensCarrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  return (
    <div className="carrinho-container">
      <h2>🛒 Carrinho de Compras</h2>
      
      {itensCarrinho.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="carrinho-lista">
            {itensCarrinho.map((item) => (
              <li key={item.id} className="carrinho-item">
                <div className="item-info">
                  <strong>{item.quantidade}x</strong> {item.nome}
                </div>
                <div className="item-acoes">
                  <span>
                    {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <button 
                    className="btn-remover-carrinho" 
                    onClick={() => onRemoverItem(item.id)}
                    title="Remover do carrinho"
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="carrinho-total">
            <h3>Total: {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
            {/* COLOCANDO O EVENTO onClick NO BOTÃO: */}
            <button className="btn-finalizar" onClick={onFinalizar}>Finalizar Compra</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrinho;