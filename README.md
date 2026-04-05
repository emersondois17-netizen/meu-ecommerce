# 🛒 TechNova - E-commerce Full Stack

Um sistema completo de e-commerce construído do zero, contemplando Front-end, Back-end e Banco de Dados Relacional. Este projeto simula uma loja de hardware de alta performance, permitindo o cadastro dinâmico de produtos, gerenciamento de carrinho de compras e finalização de pedidos com persistência de dados.

## 🚀 Funcionalidades

* **Catálogo Dinâmico:** Exibição de produtos consumidos diretamente de uma API RESTful.
* **Automação de Imagens:** Integração com a API do **Unsplash** no back-end para buscar imagens reais de produtos automaticamente quando o usuário não fornece uma URL.
* **Carrinho de Compras:** Elevação de estado (Lifting State Up) no React para gerenciar itens, calcular totais dinamicamente e evitar duplicidades.
* **Checkout e Transações:** Registro seguro de vendas utilizando transações SQL (tabelas `pedidos` e `itens_pedido`).
* **Rastreamento de Pedidos:** Página dedicada com rotas dinâmicas (`react-router-dom`) para consultar o histórico detalhado de uma compra.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* React (com Vite)
* React Router DOM (Single Page Application)
* CSS3 (Variáveis globais, CSS Grid, Flexbox e Design Responsivo)

**Back-end:**
* Node.js
* Express.js
* API Unsplash (Geração de imagens via Fetch)
* Cors & Dotenv

**Banco de Dados:**
* MySQL (Modelagem Relacional e Integridade Referencial)

## ⚙️ Como rodar este projeto na sua máquina

### Pré-requisitos
* Node.js instalado.
* MySQL Server rodando localmente.

### 1. Banco de Dados
Crie um banco de dados chamado `ecommerce` no seu MySQL e execute a criação das tabelas (Produtos, Pedidos e Itens_Pedido).

### 2. Configurando o Back-end
```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Crie um arquivo .env na raiz da pasta server com as variáveis:
# UNSPLASH_ACCESS_KEY=sua_chave_aqui
# DB_PASSWORD=sua_senha_mysql_aqui

# Inicie o servidor
npm run dev