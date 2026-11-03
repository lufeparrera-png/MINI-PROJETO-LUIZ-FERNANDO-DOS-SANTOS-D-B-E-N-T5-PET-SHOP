// ============================================================
// carrinho.ts  ->  Gerenciamento do carrinho de compras (Sprint 3).
// ============================================================
import type { Carrinho, Resultado } from "./tipos.js";
import { arredondar, falha, sucesso } from "./utils.js";
import { buscarProdutoPorId, precoPraticado } from "./produtos.js";

export interface LinhaCarrinho {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export function criarCarrinho(): Carrinho {
  return { itens: [] };
}

function quantidadeValida(quantidade: number): boolean {
  return Number.isInteger(quantidade) && quantidade > 0;
}

export function adicionarAoCarrinho(carrinho: Carrinho, produtoId: number, quantidade: number): Resultado<Carrinho> {
  if (!quantidadeValida(quantidade)) return falha("A quantidade deve ser um número inteiro maior que zero.");

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) return falha(`Produto com ID ${produtoId} não existe.`);

  // Regra pedida: produto com estoque ZERO nega a compra.
  if (produto.estoque === 0) {
    return falha(`Compra negada: "${produto.nome}" está sem estoque (estoque = 0).`);
  }

  const itemExistente = carrinho.itens.find((i) => i.produtoId === produtoId);
  const quantidadeFinal = (itemExistente?.quantidade ?? 0) + quantidade;

  if (quantidadeFinal > produto.estoque) {
    return falha(
      `Estoque insuficiente para "${produto.nome}": pedido de ${quantidadeFinal}, disponível ${produto.estoque}.`,
    );
  }

  if (itemExistente) {
    itemExistente.quantidade = quantidadeFinal; // mesmo produto: atualiza, sem linha duplicada
  } else {
    carrinho.itens.push({ produtoId, quantidade });
  }
  return sucesso(carrinho);
}

export function alterarQuantidade(carrinho: Carrinho, produtoId: number, novaQuantidade: number): Resultado<Carrinho> {
  if (!quantidadeValida(novaQuantidade)) return falha("A quantidade deve ser um número inteiro maior que zero.");

  const item = carrinho.itens.find((i) => i.produtoId === produtoId);
  if (!item) return falha(`O produto ${produtoId} não está no carrinho.`);

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) return falha(`Produto com ID ${produtoId} não existe.`);
  if (novaQuantidade > produto.estoque) {
    return falha(`Estoque insuficiente para "${produto.nome}": pedido de ${novaQuantidade}, disponível ${produto.estoque}.`);
  }

  item.quantidade = novaQuantidade;
  return sucesso(carrinho);
}

export function removerDoCarrinho(carrinho: Carrinho, produtoId: number): Resultado<Carrinho> {
  const indice = carrinho.itens.findIndex((i) => i.produtoId === produtoId);
  if (indice === -1) return falha(`O produto ${produtoId} não está no carrinho.`);
  carrinho.itens.splice(indice, 1);
  return sucesso(carrinho);
}

// Monta cada linha com preço unitário x quantidade = subtotal.
export function detalharCarrinho(carrinho: Carrinho): LinhaCarrinho[] {
  return carrinho.itens.flatMap((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (!produto) return []; // produto removido do catálogo: ignora a linha
    const precoUnitario = precoPraticado(produto);
    return [
      {
        produtoId: produto.id,
        nome: produto.nome,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal: arredondar(precoUnitario * item.quantidade),
      },
    ];
  });
}

// Total = soma dos subtotais.
export function calcularTotalCarrinho(carrinho: Carrinho): number {
  return arredondar(detalharCarrinho(carrinho).reduce((soma, linha) => soma + linha.subtotal, 0));
}
