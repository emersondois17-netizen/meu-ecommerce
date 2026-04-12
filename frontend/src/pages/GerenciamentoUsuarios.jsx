import { useState, useEffect } from 'react';

function GerenciamentoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [identificador, setIdentificador] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/usuarios');
      const dados = await resposta.json();
      setUsuarios(dados);
    } catch (erro) {
      console.error('Erro ao carregar usuários:', erro);
    }
  };

  const cadastrarUsuario = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, cpf, identificador })
      });

      if (resposta.ok) {
        alert('Funcionário cadastrado com sucesso!');
        carregarUsuarios();
        setNome(''); setEmail(''); setSenha(''); setCpf(''); setIdentificador('');
      } else {
        const erro = await resposta.json();
        alert(erro.erro);
      }
    } catch (erro) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="admin-section">
      <h2>👥 Gerenciamento de Funcionários</h2>
      
      <div className="admin-grid">
        {/* Formulário de Cadastro */}
        <div className="admin-card form-card">
          <h3>Novo Funcionário</h3>
          <form onSubmit={cadastrarUsuario}>
            <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="email" placeholder="E-mail Institucional" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha Temporária" value={senha} onChange={e => setSenha(e.target.value)} required />
            <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} required />
            <input type="text" placeholder="ID do Funcionário (Ex: MAT-001)" value={identificador} onChange={e => setIdentificador(e.target.value)} required />
            <button type="submit" className="btn-primary">Cadastrar</button>
          </form>
        </div>

        {/* Lista de Funcionários */}
        <div className="admin-card list-card">
          <h3>Equipe Supermercado</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CPF</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u._id}>
                  <td>{u.identificador}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.cpf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GerenciamentoUsuarios;