// ============================================================
// produtos.ts  ->  Cadastro e gerenciamento de produtos (Sprint 2).
// ============================================================
import { produtos } from "./dados.js";
import type { Produto, Resultado } from "./tipos.js";
import { arredondar, falha, normalizar, sucesso } from "./utils.js";

// Confere as regras de um produto. Devolve a mensagem de erro, ou null se estiver tudo certo.
function validarProduto(p: Produto): string | null {
  if (!Number.isInteger(p.id) || p.id <= 0) return "O ID deve ser um número inteiro maior que zero.";
  if (p.nome.trim() === "") return "O nome do produto não pode estar vazio.";
  if (!(p.preco > 0)) return "O preço deve ser maior que zero.";
  if (!Number.isInteger(p.estoque) || p.estoque < 0) return "O estoque deve ser um inteiro igual ou maior que zero.";
  if (p.promocaoPercentual !== undefined && !(p.promocaoPercentual > 0 && p.promocaoPercentual < 100)) {
    return "A promoção deve estar entre 0 e 100 (exclusivo).";
  }
  return null;
}

export function cadastrarProduto(novo: Produto): Resultado<Produto> {
  const erro = validarProduto(novo);
  if (erro) return falha(erro);

  if (produtos.some((p) => p.id === novo.id)) {
    return falha(`Já existe um produto cadastrado com o ID ${novo.id}.`);
  }
  if (produtos.some((p) => normalizar(p.nome) === normalizar(novo.nome))) {
    return falha(`Já existe um produto cadastrado com o nome "${novo.nome.trim()}".`);
  }

  const produto: Produto = { ...novo, nome: novo.nome.trim() };
  produtos.push(produto);
  return sucesso(produto);
}

export function listarProdutos(): Produto[] {
  return [...produtos]; // cópia da lista, para ninguém bagunçar o array original
}

// Devolve o próprio objeto guardado (não uma cópia): o pedido usa isso para baixar o estoque.
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((p) => p.id === id);
}

export function buscarProdutosPorNome(trecho: string): Produto[] {
  const busca = normalizar(trecho);
  return produtos.filter((p) => normalizar(p.nome).includes(busca));
}

export function filtrarPorCategoria(categoria: string): Produto[] {
  const busca = normalizar(categoria);
  return produtos.filter((p) => normalizar(p.categoria) === busca);
}

// Partial<...> = "qualquer subconjunto dos campos, exceto o id".
export function atualizarProduto(id: number, alteracoes: Partial<Omit<Produto, "id">>): Resultado<Produto> {
  const indice = produtos.findIndex((p) => p.id === id);
  const atual = produtos[indice]; // com noUncheckedIndexedAccess o tipo é Produto | undefined
  if (!atual) return falha(`Produto com ID ${id} não encontrado.`);

  const atualizado: Produto = { ...atual, ...alteracoes };
  const erro = validarProduto(atualizado);
  if (erro) return falha(erro);

  if (produtos.some((p) => p.id !== id && normalizar(p.nome) === normalizar(atualizado.nome))) {
    return falha(`Já existe outro produto com o nome "${atualizado.nome}".`);
  }

  produtos[indice] = atualizado;
  return sucesso(atualizado);
}

export function removerProduto(id: number): Resultado<Produto> {
  const indice = produtos.findIndex((p) => p.id === id);
  if (indice === -1) return falha(`Produto com ID ${id} não encontrado.`);
  const [removido] = produtos.splice(indice, 1);
  return removido ? sucesso(removido) : falha("Não foi possível remover o produto.");
}

// ---------- Promoções ----------

export function aplicarPromocao(id: number, percentual: number): Resultado<Produto> {
  return atualizarProduto(id, { promocaoPercentual: percentual });
}

export function encerrarPromocao(id: number): Resultado<Produto> {
  const produto = buscarProdutoPorId(id);
  if (!produto) return falha(`Produto com ID ${id} não encontrado.`);
  delete produto.promocaoPercentual;
  return sucesso(produto);
}

// Preço que o cliente realmente paga (já com a promoção, se houver).
export function precoPraticado(produto: Produto): number {
  const desconto = produto.promocaoPercentual ?? 0;
  return arredondar(produto.preco * (1 - desconto / 100));
}
