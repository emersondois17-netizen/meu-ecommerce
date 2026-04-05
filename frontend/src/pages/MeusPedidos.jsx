import { useState } from 'react';

function MeusPedidos() {
  const [buscaId, setBuscaId] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const buscarPedido = (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    if (!buscaId) return;

    fetch(`http://localhost:3000/pedidos/${buscaId}`)
      .then(res => {
        if (!res.ok) throw new Error('Pedido não encontrado');
        return res.json();
      })
      .then(dados => setResultado(dados))
      .catch(err => setErro(err.message));
  };

  return (
    <div className="pedidos-container">
      <h2 className="titulo-secao">Rastrear Pedido</h2>
      
      <form onSubmit={buscarPedido} className="busca-pedido-form">
        <input 
          type="number" 
          placeholder="Digite o número do seu pedido (Ex: 1)" 
          value={buscaId}
          onChange={(e) => setBuscaId(e.target.value)}
          required
        />
        <button type="submit" className="btn-cadastrar">Buscar Pedido</button>
      </form>

      {erro && <p className="mensagem-erro">❌ {erro}. Verifique o número digitado.</p>}

      {resultado && (
        <div className="resultado-pedido">
          <h3>Pedido #{resultado.pedido.id}</h3>
          <p>Data: {new Date(resultado.pedido.data_pedido).toLocaleString('pt-BR')}</p>
          
          <ul className="carrinho-lista" style={{ marginTop: '20px' }}>
            {resultado.itens.map((item, index) => (
              <li key={index} className="carrinho-item">
                <div className="item-info">
                  <img src={item.imagem_url} alt={item.nome} style={{ width: '40px', borderRadius: '4px', marginRight: '10px' }} />
                  <strong>{item.quantidade}x</strong> {item.nome}
                </div>
                <span>
                  {Number(item.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="carrinho-total">
            <h3>Total Pago: {Number(resultado.pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeusPedidos;