// ============================================================
// tipos.ts  ->  "Moldes" (interfaces) dos dados do sistema.
// Aqui só existem tipos: não geram nenhum código JavaScript.
// ============================================================

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number; // preço de tabela (sem promoção)
  estoque: number;
  promocaoPercentual?: number; // opcional: ex.: 10 = 10% de desconto
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface ItemCarrinho {
  produtoId: number;
  quantidade: number;
}

export interface Carrinho {
  itens: ItemCarrinho[];
}

// Linha de um pedido: guarda uma "foto" do produto no momento da compra.
export interface ItemPedido {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number; // preço praticado NA HORA da compra
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  subtotal: number;
  desconto: number; // desconto do cupom (0 se não houver)
  total: number;
  cupom?: string;
  data: Date;
}

// Resultado de uma operação: ou deu certo (ok: true) ou deu erro (ok: false).
export type Sucesso<T> = { ok: true; valor: T };
export type Falha = { ok: false; erro: string };
export type Resultado<T> = Sucesso<T> | Falha;
