// ============================================================
// main.ts  ->  Ponto de entrada: executa um fluxo completo de testes.
// Rode com:  npm run dev   (ou: tsc && node dist/main.js)
// ============================================================
import { alterarQuantidade, adicionarAoCarrinho, calcularTotalCarrinho, criarCarrinho, detalharCarrinho, removerDoCarrinho } from "./carrinho.js";
import { buscarClientePorId, cadastrarCliente, listarClientes } from "./clientes.js";
import { consultarPedidos, consultarPedidosDoCliente, finalizarPedido, gerarMensagemAgradecimento } from "./pedidos.js";
import {
  aplicarPromocao, atualizarProduto, buscarProdutoPorId, buscarProdutosPorNome, cadastrarProduto,
  encerrarPromocao, filtrarPorCategoria, listarProdutos, precoPraticado, removerProduto,
} from "./produtos.js";
import type { Pedido, Produto, Resultado } from "./tipos.js";
import { formatarMoeda } from "./utils.js";

// ---------- Ajudantes de impressão ----------
function titulo(texto: string): void {
  console.log(`\n${"=".repeat(60)}\n${texto}\n${"=".repeat(60)}`);
}

function mostrar<T>(descricao: string, resultado: Resultado<T>, detalhe?: (valor: T) => string): void {
  if (resultado.ok) {
    console.log(`✅ ${descricao}${detalhe ? ` -> ${detalhe(resultado.valor)}` : ""}`);
  } else {
    console.log(`❌ ${descricao}\n   Motivo: ${resultado.erro}`);
  }
}

function tabelaProdutos(lista: Produto[]): void {
  console.table(
    lista.map((p) => ({
      ID: p.id,
      Nome: p.nome,
      Categoria: p.categoria,
      Preço: formatarMoeda(p.preco),
      Promo: p.promocaoPercentual ? `${p.promocaoPercentual}%` : "-",
      "Preço final": formatarMoeda(precoPraticado(p)),
      Estoque: p.estoque,
    })),
  );
}

function imprimirPedido(pedido: Pedido): void {
  const cliente = buscarClientePorId(pedido.clienteId);
  console.log(`\n🧾 Pedido nº ${pedido.id} | Cliente: ${cliente?.nome ?? "?"} | ${pedido.data.toLocaleString("pt-BR")}`);
  for (const item of pedido.itens) {
    console.log(`   ${item.quantidade}x ${item.nome} (${formatarMoeda(item.precoUnitario)}) = ${formatarMoeda(item.subtotal)}`);
  }
  console.log(`   Subtotal: ${formatarMoeda(pedido.subtotal)}`);
  if (pedido.cupom) console.log(`   Cupom ${pedido.cupom}: -${formatarMoeda(pedido.desconto)}`);
  console.log(`   TOTAL: ${formatarMoeda(pedido.total)}`);
}

function imprimirCarrinho(nome: string, carrinho: ReturnType<typeof criarCarrinho>): void {
  console.log(`\n🛒 Carrinho de ${nome}:`);
  for (const l of detalharCarrinho(carrinho)) {
    console.log(`   ${l.quantidade}x ${l.nome} (${formatarMoeda(l.precoUnitario)}) = ${formatarMoeda(l.subtotal)}`);
  }
  console.log(`   Total do carrinho: ${formatarMoeda(calcularTotalCarrinho(carrinho))}`);
}

// ============================================================
titulo("A) PRODUTOS - catálogo inicial");
tabelaProdutos(listarProdutos());

titulo("A) PRODUTOS - cadastro (sucesso e erros)");
mostrar("Cadastrar 'Tapete Higiênico 30un' (ID 12)",
  cadastrarProduto({ id: 12, nome: "Tapete Higiênico 30un", categoria: "Higiene", preco: 39.9, estoque: 20 }),
  (p) => `${p.nome} cadastrado`);
mostrar("Cadastrar com ID repetido (ID 1)",
  cadastrarProduto({ id: 1, nome: "Produto Qualquer", categoria: "Teste", preco: 10, estoque: 5 }));
mostrar("Cadastrar com NOME repetido ('coleira ajustável m')",
  cadastrarProduto({ id: 99, nome: "coleira ajustável m", categoria: "Acessórios", preco: 10, estoque: 5 }));
mostrar("Cadastrar com nome vazio",
  cadastrarProduto({ id: 98, nome: "   ", categoria: "Teste", preco: 10, estoque: 5 }));
mostrar("Cadastrar com preço zero",
  cadastrarProduto({ id: 97, nome: "Produto Grátis", categoria: "Teste", preco: 0, estoque: 5 }));
mostrar("Cadastrar com estoque negativo",
  cadastrarProduto({ id: 96, nome: "Produto Negativo", categoria: "Teste", preco: 10, estoque: -3 }));

titulo("A) PRODUTOS - buscas");
console.log("Por ID 4:", buscarProdutoPorId(4)?.nome ?? "não encontrado");
console.log("Por ID 999:", buscarProdutoPorId(999)?.nome ?? "não encontrado");
console.log("Por nome 'racao' (sem acento):", buscarProdutosPorNome("racao").map((p) => p.nome));
console.log("Categoria 'brinquedos':", filtrarPorCategoria("brinquedos").map((p) => p.nome));

titulo("A) PRODUTOS - atualizar, promoções e remover");
mostrar("Atualizar preço do ID 12 para R$ 42,90", atualizarProduto(12, { preco: 42.9 }), (p) => formatarMoeda(p.preco));
mostrar("Atualizar preço do ID 12 para -5", atualizarProduto(12, { preco: -5 }));
mostrar("Aplicar promoção de 25% na Ração de Gatos (ID 2)", aplicarPromocao(2, 25),
  (p) => `de ${formatarMoeda(p.preco)} por ${formatarMoeda(precoPraticado(p))}`);
mostrar("Encerrar promoção da Ração de Gatos (ID 2)", encerrarPromocao(2),
  (p) => `volta a ${formatarMoeda(precoPraticado(p))}`);
mostrar("Remover produto ID 12", removerProduto(12), (p) => `${p.nome} removido`);
mostrar("Remover produto ID 999", removerProduto(999));

// ============================================================
titulo("B) CLIENTES");
console.table(listarClientes());
mostrar("Cadastrar cliente extra de teste (ID 4)",
  cadastrarCliente({ id: 4, nome: "Paulo Henrique", email: "paulo.h@email.com" }), (c) => c.nome);
mostrar("Cadastrar cliente com ID repetido (ID 1)",
  cadastrarCliente({ id: 1, nome: "Outra Pessoa", email: "outra@email.com" }));
mostrar("Cadastrar cliente com e-mail repetido",
  cadastrarCliente({ id: 5, nome: "Outra Pessoa", email: "MARIANA.SOUZA@email.com" }));
mostrar("Cadastrar cliente com e-mail inválido",
  cadastrarCliente({ id: 6, nome: "Sem Arroba", email: "semarroba.com" }));
console.log("Busca cliente ID 2:", buscarClientePorId(2)?.nome ?? "não encontrado");
console.log("Busca cliente ID 50:", buscarClientePorId(50)?.nome ?? "não encontrado");

// ============================================================
titulo("C) CARRINHO");
const carrinhoMariana = criarCarrinho();
mostrar("Adicionar 2x Ração Cães (ID 1, com promoção)", adicionarAoCarrinho(carrinhoMariana, 1, 2));
mostrar("Adicionar 4x Caminha Pet (ID 10)", adicionarAoCarrinho(carrinhoMariana, 10, 4));
mostrar("Adicionar 2x Bolinha (ID 6)", adicionarAoCarrinho(carrinhoMariana, 6, 2));
mostrar("Adicionar +1x Bolinha (mesmo produto: soma, sem duplicar)", adicionarAoCarrinho(carrinhoMariana, 6, 1));
mostrar("Adicionar produto inexistente (ID 999)", adicionarAoCarrinho(carrinhoMariana, 999, 1));
mostrar("Adicionar quantidade 0", adicionarAoCarrinho(carrinhoMariana, 4, 0));
mostrar("Adicionar quantidade -2", adicionarAoCarrinho(carrinhoMariana, 4, -2));
mostrar("Adicionar 100x Coleira (acima do estoque)", adicionarAoCarrinho(carrinhoMariana, 4, 100));
mostrar("Adicionar Comedouro Inox (ESTOQUE ZERO)", adicionarAoCarrinho(carrinhoMariana, 11, 1));
mostrar("Alterar Bolinha para 5 unidades", alterarQuantidade(carrinhoMariana, 6, 5));
mostrar("Remover Bolinha do carrinho", removerDoCarrinho(carrinhoMariana, 6));
mostrar("Remover Bolinha de novo (não está mais lá)", removerDoCarrinho(carrinhoMariana, 6));
imprimirCarrinho("Mariana", carrinhoMariana);

// ============================================================
titulo("D) PEDIDOS");
mostrar("Finalizar carrinho VAZIO", finalizarPedido(2, criarCarrinho()));
mostrar("Finalizar para cliente inexistente (ID 77)", finalizarPedido(77, carrinhoMariana));
mostrar("Finalizar com cupom inválido", finalizarPedido(1, carrinhoMariana, "NAOEXISTE"));

// Carlos compra 5 caminhas ANTES da Mariana -> sobra 1 em estoque.
const carrinhoCarlos = criarCarrinho();
adicionarAoCarrinho(carrinhoCarlos, 10, 5);
const compraCarlos = finalizarPedido(2, carrinhoCarlos);
mostrar("Carlos finaliza 5x Caminha", compraCarlos);
if (compraCarlos.ok) console.log(`💙 ${gerarMensagemAgradecimento(compraCarlos.valor)}`);

console.log(`\nEstoque da Caminha agora: ${buscarProdutoPorId(10)?.estoque}  |  Ração Cães: ${buscarProdutoPorId(1)?.estoque}`);
mostrar("Mariana tenta finalizar (pede 4 caminhas, sobrou 1) -> deve falhar", finalizarPedido(1, carrinhoMariana));
console.log(`Estoque da Ração Cães continua: ${buscarProdutoPorId(1)?.estoque} (nada foi descontado pela metade)`);

mostrar("Mariana ajusta Caminha para 1 unidade", alterarQuantidade(carrinhoMariana, 10, 1));
const compraMariana = finalizarPedido(1, carrinhoMariana, "pet10");
mostrar("Mariana finaliza com cupom PET10", compraMariana);
if (compraMariana.ok) {
  imprimirPedido(compraMariana.valor);
  console.log(`\n💙 ${gerarMensagemAgradecimento(compraMariana.valor)}`);
}
console.log(`\nEstoque após compras -> Ração Cães: ${buscarProdutoPorId(1)?.estoque} | Caminha: ${buscarProdutoPorId(10)?.estoque}`);

titulo("D) PEDIDOS - preço guardado no momento da compra");
atualizarProduto(1, { preco: 199.9 });
console.log(`Preço de tabela da Ração hoje: ${formatarMoeda(buscarProdutoPorId(1)?.preco ?? 0)}`);
const primeiroItem = consultarPedidosDoCliente(1)[0]?.itens[0];
console.log(`No pedido da Mariana a Ração continua em: ${formatarMoeda(primeiroItem?.precoUnitario ?? 0)}`);

// ============================================================
titulo("E) CONSULTAS DE PEDIDOS");
console.log(`Total de pedidos registrados: ${consultarPedidos().length}`);
consultarPedidos().forEach(imprimirPedido);
console.log(`\nPedidos do cliente 2 (Carlos): ${consultarPedidosDoCliente(2).length}`);
console.log(`Pedidos do cliente 3 (Fernanda): ${consultarPedidosDoCliente(3).length}`);
