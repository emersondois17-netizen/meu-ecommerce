import { useState } from 'react';

// Recebemos a função "onProdutoAdicionado" como propriedade (prop) para avisar o App que a lista deve ser atualizada
function FormularioProduto({ onProdutoAdicionado }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const novoProduto = {
      nome: nome,
      preco: parseFloat(preco),
      descricao: descricao,
      imagem_url: imagemUrl || 'https://via.placeholder.com/150'
    };

    fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoProduto),
    })
      .then((resposta) => resposta.json())
      .then(() => {
        alert('Produto cadastrado com sucesso!');
        
        // Chama a função do App.jsx para recarregar a lista na tela
        onProdutoAdicionado(); 
        
        // Limpa os campos
        setNome('');
        setPreco('');
        setDescricao('');
        setImagemUrl('');
      })
      .catch((erro) => console.error('Erro ao cadastrar:', erro));
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Novo Produto</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nome (Ex: Placa Mãe B550M)" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Preço (R$)" 
          value={preco} 
          onChange={(e) => setPreco(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Descrição do Produto" 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="URL da Imagem (Opcional)" 
          value={imagemUrl} 
          onChange={(e) => setImagemUrl(e.target.value)} 
        />
        <button type="submit" className="btn-cadastrar">Salvar Produto</button>
      </form>
    </div>
  );
}

export default FormularioProduto;