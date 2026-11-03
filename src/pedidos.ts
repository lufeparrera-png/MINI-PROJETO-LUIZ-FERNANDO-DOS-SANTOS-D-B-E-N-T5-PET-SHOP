// ============================================================
// pedidos.ts  ->  Finalização e consulta de pedidos (Sprint 4).
// ============================================================
import { cupons, pedidos } from "./dados.js";
import type { Carrinho, ItemPedido, Pedido, Produto, Resultado } from "./tipos.js";
import { arredondar, falha, formatarMoeda, sucesso } from "./utils.js";
import { buscarClientePorId } from "./clientes.js";
import { buscarProdutoPorId, precoPraticado } from "./produtos.js";

let proximoIdPedido = 1;

export function finalizarPedido(clienteId: number, carrinho: Carrinho, codigoCupom?: string): Resultado<Pedido> {
  // ---------- 1) VALIDAR TUDO (nada é alterado nesta fase) ----------
  if (carrinho.itens.length === 0) return falha("Não é possível finalizar um pedido sem itens.");
  if (!buscarClientePorId(clienteId)) return falha(`Cliente com ID ${clienteId} não existe.`);

  let percentualCupom = 0;
  let cupomAplicado: string | undefined;
  if (codigoCupom !== undefined) {
    const codigo = codigoCupom.trim().toUpperCase();
    const percentual = cupons[codigo]; // number | undefined
    if (percentual === undefined) return falha(`Cupom "${codigoCupom}" é inválido.`);
    percentualCupom = percentual;
    cupomAplicado = codigo;
  }

  const itensPedido: ItemPedido[] = [];
  const baixas: { produto: Produto; quantidade: number }[] = [];

  for (const item of carrinho.itens) {
    const produto = buscarProdutoPorId(item.produtoId);
    if (!produto) return falha(`O produto ${item.produtoId} não existe mais no catálogo.`);
    if (produto.estoque === 0) return falha(`Compra negada: "${produto.nome}" está sem estoque (estoque = 0).`);
    if (item.quantidade > produto.estoque) {
      return falha(
        `Estoque insuficiente para "${produto.nome}": pedido de ${item.quantidade}, disponível ${produto.estoque}.`,
      );
    }

    const precoUnitario = precoPraticado(produto); // "foto" do preço neste momento
    itensPedido.push({
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario,
      subtotal: arredondar(precoUnitario * item.quantidade),
    });
    baixas.push({ produto, quantidade: item.quantidade });
  }

  // ---------- 2) EFETIVAR (só chega aqui se TODOS os itens estavam ok) ----------
  for (const { produto, quantidade } of baixas) {
    produto.estoque -= quantidade;
  }

  const subtotal = arredondar(itensPedido.reduce((soma, i) => soma + i.subtotal, 0));
  const desconto = arredondar((subtotal * percentualCupom) / 100);

  const pedido: Pedido = {
    id: proximoIdPedido++,
    clienteId,
    itens: itensPedido,
    subtotal,
    desconto,
    total: arredondar(subtotal - desconto),
    // exactOptionalPropertyTypes: só incluímos "cupom" se ele existir (nada de cupom: undefined).
    ...(cupomAplicado !== undefined ? { cupom: cupomAplicado } : {}),
    data: new Date(),
  };

  pedidos.push(pedido);
  carrinho.itens = []; // carrinho esvaziado após a compra
  return sucesso(pedido);
}

export function gerarMensagemAgradecimento(pedido: Pedido): string {
  const cliente = buscarClientePorId(pedido.clienteId);
  const nome = cliente ? cliente.nome : "cliente";
  return `Agradecemos pela sua preferência, ${nome}! Pedido nº ${pedido.id} confirmado. Total: ${formatarMoeda(pedido.total)}.`;
}

export function consultarPedidos(): Pedido[] {
  return [...pedidos];
}

export function consultarPedidosDoCliente(clienteId: number): Pedido[] {
  return pedidos.filter((p) => p.clienteId === clienteId);
}