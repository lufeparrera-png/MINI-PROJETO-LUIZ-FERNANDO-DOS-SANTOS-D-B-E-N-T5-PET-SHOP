# Miniprojeto E-commerce — Pet Shop

> **Estudante:** [LUIZ FERNANDO DOS SANTOS]  
> **Turma:** [D B E N T5]  
> **Módulo 1 — Mini-Projeto Avaliativo**

## 1. Objetivo da aplicação

Sistema de gerenciamento de e-commerce de **artigos para pet shop**, desenvolvido em **TypeScript** e executado no terminal. A aplicação administra um catálogo de produtos, cadastra clientes, gerencia o carrinho de compras e registra pedidos, mantendo as informações (como o estoque) consistentes durante a execução.

O foco do projeto é demonstrar a organização do código em módulos, o uso de tipagem explícita e a implementação de regras de negócio — não é um sistema comercial completo.

## 2. Funcionalidades implementadas

**Produtos**
- Cadastrar, listar, atualizar e remover produtos.
- Buscar por identificador, por parte do nome (ignora maiúsculas e acentos) e filtrar por categoria.
- Promoções percentuais por produto (aplicar e encerrar).

**Clientes**
- Cadastrar, listar e buscar cliente por identificador.

**Carrinho de compras**
- Adicionar, alterar a quantidade e remover itens.
- Cálculo do subtotal de cada item e do total do carrinho.

**Pedidos**
- Finalizar a compra de um carrinho (com cupom de desconto opcional).
- Baixa automática no estoque.
- Consultar todos os pedidos e os pedidos de um cliente específico.
- Mensagem de agradecimento quando a compra é concluída com sucesso.

## 3. Tecnologias utilizadas

- [TypeScript](https://www.typescriptlang.org/) (modo `strict`, com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`)
- [Node.js](https://nodejs.org/) (módulos ES — `module: nodenext`)
- Git e GitHub para versionamento

## 4. Estrutura dos arquivos

```
Miniprojeto_Ecommerce_NomeAluno_Turma/
├── src/
│   ├── tipos.ts       # Interfaces e tipos (Produto, Cliente, Carrinho, Pedido, Resultado)
│   ├── utils.ts       # Funções auxiliares (arredondar, formatar moeda, normalizar texto)
│   ├── dados.ts       # Dados iniciais (produtos, clientes, cupons) e lista de pedidos
│   ├── produtos.ts    # Regras e operações de produtos e promoções
│   ├── clientes.ts    # Regras e operações de clientes
│   ├── carrinho.ts    # Regras e operações do carrinho
│   ├── pedidos.ts     # Finalização e consulta de pedidos
│   └── main.ts        # Fluxo de demonstração e testes
├── tsconfig.json      # Configuração do TypeScript
├── package.json       # Scripts e módulo ES
└── README.md
```

## 5. Instruções de compilação e execução

**Pré-requisitos:** Node.js 20 ou superior.

```bash
# 1. Instalar as dependências de desenvolvimento
npm install -D typescript @types/node

# 2. Compilar (gera a pasta dist/ com os arquivos .js)
npx tsc

# 3. Executar
node dist/main.js
```

Atalho: `npm run dev` compila e executa em um único comando.

## 6. Exemplos das principais operações

```ts
// Cadastrar produto
cadastrarProduto({ id: 12, nome: "Tapete Higiênico 30un", categoria: "Higiene", preco: 39.9, estoque: 20 });

// Montar um carrinho
const carrinho = criarCarrinho();
adicionarAoCarrinho(carrinho, 1, 2); // 2 unidades do produto de ID 1

// Finalizar a compra do cliente 1 com cupom
const resultado = finalizarPedido(1, carrinho, "PET10");
if (resultado.ok) {
  console.log(gerarMensagemAgradecimento(resultado.valor));
} else {
  console.log(resultado.erro);
}
```

Saída de uma compra bem-sucedida:

```
Agradecemos pela sua preferência, Mariana Souza! Pedido nº 2 confirmado. Total: R$ 318,35.
```

Todas as operações retornam um `Resultado`: `{ ok: true, valor }` em caso de sucesso ou `{ ok: false, erro }` com a mensagem explicando o problema.

## 7. Regras de negócio implementadas

**Produtos**
- O ID de cada produto é único e o **nome também não pode se repetir** (o erro é informado no cadastro).
- O nome não pode estar vazio; o preço deve ser maior que zero; o estoque não pode ser negativo.

**Clientes**
- O ID é único e o e-mail não pode se repetir nem ter formato inválido.

**Carrinho**
- Quantidade deve ser inteira e maior que zero.
- Não é possível adicionar produtos inexistentes.
- **Produto com estoque igual a zero tem a compra negada.**
- Não é possível pedir mais do que o estoque disponível.
- Adicionar o mesmo produto novamente atualiza a quantidade (sem linhas duplicadas).
- Subtotal = preço unitário × quantidade; total = soma dos subtotais.

**Pedidos**
- Não finaliza pedido sem itens nem para cliente inexistente.
- A finalização é **atômica**: se qualquer item falhar, nada é registrado e o estoque não é alterado.
- Após o sucesso, o estoque é reduzido e o carrinho é esvaziado.
- Cada pedido recebe um ID único e guarda o **preço praticado no momento da compra**.

**Promoções (extras)**
- Desconto percentual por produto (ex.: 10%).
- Cupons de desconto sobre o pedido: `PET10` (10%) e `BEMVINDO5` (5%).

## 8. Limitações conhecidas

- Os dados ficam apenas em memória: ao encerrar o programa, tudo é perdido.
- Não há interface gráfica, API, banco de dados, login ou pagamento.
- O fluxo de testes é fixo no `main.ts` (não há menu interativo).
- Os cupons são fixos no código e não têm validade nem limite de uso.
- A remoção de produto só verifica se ele existe.

## 9. Autor
[LUIZ FERNANDO DOS SANTOS] — Turma [D B E N T5]
