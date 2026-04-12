require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json()); // Permite ler JSON no body de forma segura

// ==========================================
// 1. CONEXÃO COM O MONGODB
// ==========================================
// O Mongoose gerencia a conexão de forma assíncrona e reconecta automaticamente se cair.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermercado_admin')
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// ==========================================
// 2. SCHEMAS (MOLDES DE DADOS)
// O MongoDB cria automaticamente um '_id' único e seguro para cada documento salvo.
// ==========================================

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }, // Será salva criptografada
  cpf: { type: String, required: true, unique: true }
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  descricao: { type: String },
  preco_atual: { type: Number, required: true },
  preco_promocao: { type: Number, default: 0 }, // 0 = Sem promoção
  data_validade: { type: Date, required: true },
  imagem_url: { type: String }
});
const Produto = mongoose.model('Produto', produtoSchema);

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf_identidade: { type: String, required: true, unique: true },
  idade: { type: Number, required: true },
  tempo_cliente: { type: String }
});
const Cliente = mongoose.model('Cliente', clienteSchema);

// ==========================================
// 3. ROTAS DE AUTENTICAÇÃO (LOGIN)
// ==========================================

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Busca o usuário pelo email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
    }

    // 2. Compara a senha digitada com a senha criptografada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
    }

    // Login aprovado! (Em um sistema real, retornaríamos um Token JWT aqui)
    res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario: { id: usuario._id, nome: usuario.nome } });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ==========================================
// 4. ROTAS DE USUÁRIOS (FUNCIONÁRIOS)
// ==========================================

app.get('/usuarios', async (req, res) => {
  try {
    // Retorna todos os usuários, mas exclui o campo de senha por segurança (-senha)
    const usuarios = await Usuario.find().select('-senha');
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, cpf } = req.body;

    // Criptografa a senha antes de salvar no banco (10 "salt rounds" é o padrão seguro)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({ nome, email, senha: senhaHash, cpf });
    await novoUsuario.save(); // Salva no MongoDB

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: novoUsuario._id });
  } catch (erro) {
    // Tratamento específico se o e-mail ou CPF já existirem (Erro 11000 do MongoDB)
    if (erro.code === 11000) return res.status(400).json({ erro: 'E-mail ou CPF já cadastrado' });
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

// ==========================================
// 5. ROTAS DE PRODUTOS (Com Unsplash Integrado)
// ==========================================

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const { nome, tipo, descricao, preco_atual, data_validade, imagem_url } = req.body;
    let urlFinalImagem = imagem_url;

    // Automação do Unsplash (Adaptada para Async/Await limpo)
    if (!urlFinalImagem || urlFinalImagem.includes('via.placeholder.com')) {
      try {
        const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
        const respostaUnsplash = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(nome)}&client_id=${unsplashAccessKey}&per_page=1`);
        const dadosUnsplash = await respostaUnsplash.json();

        if (dadosUnsplash.results && dadosUnsplash.results.length > 0) {
          urlFinalImagem = dadosUnsplash.results[0].urls.regular;
        } else {
          urlFinalImagem = 'https://via.placeholder.com/150?text=Sem+Imagem';
        }
      } catch (erroUnsplash) {
        console.error('Erro na API Unsplash:', erroUnsplash);
        urlFinalImagem = 'https://via.placeholder.com/150?text=Erro+API';
      }
    }

    const novoProduto = new Produto({
      nome, tipo, descricao, preco_atual, data_validade, imagem_url: urlFinalImagem
    });
    
    await novoProduto.save();
    res.status(201).json({ mensagem: 'Produto cadastrado!', id: novoProduto._id });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar produto', detalhes: erro.message });
  }
});

// Rota para Atualizar um Produto (Usada para Aplicar Promoções)
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const atualizacoes = req.body; // Pega os novos dados (ex: { preco_promocao: 10.50 })

    // findByIdAndUpdate busca e atualiza em um único comando seguro
    const produtoAtualizado = await Produto.findByIdAndUpdate(id, atualizacoes, { new: true });
    
    if (!produtoAtualizado) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json({ mensagem: 'Produto atualizado!', produto: produtoAtualizado });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Produto removido com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar produto' });
  }
});

// ==========================================
// 6. ROTAS DE CLIENTES
// ==========================================

// Buscar Clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

// Cadastrar Cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nome, cpf_identidade, idade, tempo_cliente } = req.body;
    
    const novoCliente = new Cliente({ 
      nome, 
      cpf_identidade, 
      idade: Number(idade), 
      tempo_cliente 
    });
    
    await novoCliente.save();
    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!', id: novoCliente._id });
  } catch (erro) {
    if (erro.code === 11000) return res.status(400).json({ erro: 'CPF/Identidade já cadastrado no sistema.' });
    res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
});

// Deletar Cliente (Bônus para facilitar a gestão)
app.delete('/clientes/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Cliente removido com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar cliente' });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});