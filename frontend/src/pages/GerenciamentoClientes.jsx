import { useState, useEffect } from 'react';

function GerenciamentoClientes() {
  const [clientes, setClientes] = useState([]);
  
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [cpfIdentidade, setCpfIdentidade] = useState('');
  const [idade, setIdade] = useState('');
  const [tempoCliente, setTempoCliente] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/clientes');
      const dados = await resposta.json();
      setClientes(dados);
    } catch (erro) {
      console.error('Erro ao carregar clientes:', erro);
    }
  };

  const cadastrarCliente = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome, 
          cpf_identidade: cpfIdentidade, 
          idade, 
          tempo_cliente: tempoCliente 
        })
      });

      if (resposta.ok) {
        alert('Cliente cadastrado com sucesso!');
        carregarClientes();
        setNome(''); setCpfIdentidade(''); setIdade(''); setTempoCliente('');
      } else {
        const erro = await resposta.json();
        alert(erro.erro);
      }
    } catch (erro) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  const deletarCliente = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir este cliente do registro?')) {
      await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
      carregarClientes();
    }
  };

  return (
    <div className="admin-section">
      <h2>🤝 Carteira de Clientes do Supermercado</h2>
      
      <div className="admin-grid">
        {/* Formulário de Cadastro */}
        <div className="admin-card form-card">
          <h3>Registrar Novo Cliente</h3>
          <form onSubmit={cadastrarCliente}>
            <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="CPF ou Identidade" value={cpfIdentidade} onChange={e => setCpfIdentidade(e.target.value)} required />
            <input type="number" placeholder="Idade" value={idade} onChange={e => setIdade(e.target.value)} required min="1" />
            <input type="text" placeholder="Tempo de Cliente (Ex: 2 anos, 6 meses)" value={tempoCliente} onChange={e => setTempoCliente(e.target.value)} required />
            <button type="submit" className="btn-primary">Registrar Cliente</button>
          </form>
        </div>

        {/* Lista de Clientes */}
        <div className="admin-card list-card">
          <h3>Clientes Registrados</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/RG</th>
                <th>Idade</th>
                <th>Fidelidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c._id}>
                  <td>{c.nome}</td>
                  <td>{c.cpf_identidade}</td>
                  <td>{c.idade} anos</td>
                  <td>{c.tempo_cliente}</td>
                  <td>
                    <button onClick={() => deletarCliente(c._id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clientes.length === 0 && <p style={{marginTop: '15px', color: '#666'}}>Nenhum cliente registrado no momento.</p>}
        </div>
      </div>
    </div>
  );
}

export default GerenciamentoClientes;