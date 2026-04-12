# 🛒 SuperAdmin - Sistema de Gestão de Supermercado

Um sistema administrativo (Backoffice) completo desenvolvido para o gerenciamento de um supermercado. Este projeto contempla Front-end, Back-end e Banco de Dados NoSQL, com foco em segurança, controle de acesso e experiência do usuário (UX/UI). 

Projeto acadêmico desenvolvido para a disciplina de Programação em Linguagem Interpretada.

## 🚀 Funcionalidades

* **Autenticação de Usuários:** Sistema de Login seguro com criptografia de senhas (`bcrypt`) para restringir o acesso apenas a funcionários autorizados.
* **Dashboard Administrativo:** Interface limpa e 100% responsiva, adaptável para celulares, tablets e desktops (CSS Grid e Flexbox).
* **Gestão de Produtos e Promoções:** CRUD completo de produtos com integração automática à API do **Unsplash** para busca de imagens. Permite a aplicação e remoção de preços promocionais em tempo real.
* **Gestão de Funcionários (Equipe):** Cadastro de novos usuários/funcionários com geração de ID/Matrícula e validação de dados únicos (CPF/E-mail).
* **Carteira de Clientes:** Módulo para registro e controle de fidelidade dos clientes do supermercado.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* React (via Vite)
* React Router DOM (Single Page Application e Rotas Protegidas)
* CSS3 Avançado (Variáveis, Grid, Flexbox e Media Queries)

**Back-end:**
* Node.js com Express.js
* Autenticação e Segurança: Bcrypt
* Integração de APIs: Fetch API (Unsplash)

**Banco de Dados:**
* MongoDB (NoSQL)
* Mongoose (Modelagem de Dados, Schemas e Validação)

## ⚙️ Como rodar este projeto na sua máquina

### Pré-requisitos
* Node.js instalado.
* MongoDB instalado localmente ou uma conta no MongoDB Atlas.

### 1. Configurando o Back-end
```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Crie um arquivo .env na raiz da pasta server com as variáveis:
# UNSPLASH_ACCESS_KEY=sua_chave_do_unsplash_aqui
# MONGODB_URI=mongodb://localhost:27017/supermercado_admin

# Inicie o servidor
npm run dev