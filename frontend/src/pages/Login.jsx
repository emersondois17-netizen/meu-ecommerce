import { useState } from 'react';

function Login({ onLoginSucesso }) {
  const [isCadastro, setIsCadastro] = useState(false);
  const [erro, setErro] = useState('');
  
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const url = isCadastro ? 'http://localhost:3000/usuarios' : 'http://localhost:3000/api/login';
    const body = isCadastro 
      ? JSON.stringify({ nome, email, senha, cpf })
      : JSON.stringify({ email, senha });

    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro na comunicação com o servidor');
      }

      if (isCadastro) {
        alert('Administrador criado com sucesso! Agora faça o login.');
        setIsCadastro(false); // Volta para a tela de login
      } else {
        // Se for login, passa os dados do usuário para o App.jsx liberar a tela
        onLoginSucesso(dados.usuario);
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>{isCadastro ? 'Cadastrar Administrador' : 'Acesso Restrito'}</h2>
          <p>Painel de Gestão do Supermercado</p>
        </div>

        {erro && <div className="mensagem-erro-login">❌ {erro}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isCadastro && (
            <>
              <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
            </>
          )}
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          
          <button type="submit" className="btn-login">
            {isCadastro ? 'Criar Conta' : 'Entrar no Sistema'}
          </button>
        </form>

        <p className="login-toggle" onClick={() => setIsCadastro(!isCadastro)}>
          {isCadastro ? 'Já tenho uma conta. Fazer Login.' : 'Primeiro acesso? Cadastrar Administrador.'}
        </p>
      </div>
    </div>
  );
}

export default Login;