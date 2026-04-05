require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexão com o Banco de Dados
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'ecommerce'
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao MySQL com sucesso!');
    connection.release();
  }
});

// ==========================================
// ROTAS DE PRODUTOS
// ==========================================

// Buscar todos os produtos
app.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Cadastrar Produto + Integração API Unsplash
app.post('/produtos', async (req, res) => {
  const { nome, preco, descricao, imagem_url } = req.body;
  
  let urlFinalImagem = imagem_url;

  // A JOGADA DE MESTRE: Verificamos se está vazio OU se é o placeholder do Frontend!
  if (!urlFinalImagem || urlFinalImagem.includes('via.placeholder.com')) {
    try {
      // Sua Access Key do Unsplash
      const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
      
      const respostaUnsplash = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(nome)}&client_id=${unsplashAccessKey}&per_page=1`);
      const dadosUnsplash = await respostaUnsplash.json();

      if (dadosUnsplash.results && dadosUnsplash.results.length > 0) {
        urlFinalImagem = dadosUnsplash.results[0].urls.regular;
      } else {
        urlFinalImagem = 'https://via.placeholder.com/150?text=Sem+Imagem';
      }
    } catch (erro) {
      console.error('Erro ao buscar imagem na API:', erro);
      urlFinalImagem = 'https://via.placeholder.com/150?text=Erro+na+API';
    }
  }

  const comandoSql = 'INSERT INTO produtos (nome, preco, descricao, imagem_url) VALUES (?, ?, ?, ?)';
  
  db.query(comandoSql, [nome, preco, descricao, urlFinalImagem], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar o produto' });
    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', id: results.insertId });
  });
});

// Deletar Produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM produtos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send('Produto deletado com sucesso!');
  });
});

// ==========================================
// ROTAS DE PEDIDOS E CHECKOUT
// ==========================================

// Checkout (Finalizar Compra) com Transação
app.post('/checkout', (req, res) => {
  const { itens, valor_total } = req.body;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);

    connection.beginTransaction((err) => {
      if (err) return res.status(500).send(err);

      const sqlPedido = 'INSERT INTO pedidos (valor_total) VALUES (?)';
      connection.query(sqlPedido, [valor_total], (err, result) => {
        if (err) return connection.rollback(() => res.status(500).send(err));

        const pedidoId = result.insertId;

        const sqlItens = 'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ?';
        const valoresItens = itens.map(item => [pedidoId, item.id, item.quantidade, item.preco]);

        connection.query(sqlItens, [valoresItens], (err) => {
          if (err) return connection.rollback(() => res.status(500).send(err));

          connection.commit((err) => {
            if (err) return connection.rollback(() => res.status(500).send(err));
            res.status(201).json({ mensagem: 'Pedido registrado com sucesso!', pedidoId });
          });
        });
      });
    });
  });
});

// Rastrear Pedido Específico
app.get('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  
  const sqlPedido = 'SELECT * FROM pedidos WHERE id = ?';
  const sqlItens = `
    SELECT ip.quantidade, ip.preco_unitario, p.nome, p.imagem_url 
    FROM itens_pedido ip 
    JOIN produtos p ON ip.produto_id = p.id 
    WHERE ip.pedido_id = ?
  `;

  db.query(sqlPedido, [id], (err, resultPedido) => {
    if (err) return res.status(500).send(err);
    if (resultPedido.length === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });

    db.query(sqlItens, [id], (err, resultItens) => {
      if (err) return res.status(500).send(err);
      
      res.json({
        pedido: resultPedido[0],
        itens: resultItens
      });
    });
  });
});

// Ligar o Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});