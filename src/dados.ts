// ============================================================
// dados.ts  ->  "Banco de dados" em memória + dados iniciais.
// Os arrays são exportados para que outros arquivos leiam e alterem.
// ============================================================
import type { Cliente, Pedido, Produto } from "./tipos.js";

export const produtos: Produto[] = [
  { id: 1, nome: "Ração Cães Adultos 10kg", categoria: "Alimentação", preco: 129.9, estoque: 15, promocaoPercentual: 10 },
  { id: 2, nome: "Ração Gatos Castrados 3kg", categoria: "Alimentação", preco: 69.9, estoque: 20 },
  { id: 3, nome: "Petisco Bifinho 500g", categoria: "Alimentação", preco: 19.9, estoque: 40, promocaoPercentual: 15 },
  { id: 4, nome: "Coleira Ajustável M", categoria: "Acessórios", preco: 24.9, estoque: 30 },
  { id: 5, nome: "Guia Retrátil 5m", categoria: "Acessórios", preco: 49.9, estoque: 12 },
  { id: 6, nome: "Bolinha de Borracha", categoria: "Brinquedos", preco: 9.9, estoque: 50 },
  { id: 7, nome: "Arranhador para Gatos", categoria: "Brinquedos", preco: 89.9, estoque: 8, promocaoPercentual: 20 },
  { id: 8, nome: "Shampoo Neutro 500ml", categoria: "Higiene", preco: 22.9, estoque: 25 },
  { id: 9, nome: "Areia Sanitária 4kg", categoria: "Higiene", preco: 17.9, estoque: 35 },
  { id: 10, nome: "Caminha Pet Média", categoria: "Conforto", preco: 119.9, estoque: 6 },
  // Estoque ZERO de propósito: serve para testar a compra negada.
  { id: 11, nome: "Comedouro Inox", categoria: "Acessórios", preco: 14.9, estoque: 0 },
];

export const clientes: Cliente[] = [
  { id: 1, nome: "Mariana Souza", email: "mariana.souza@email.com" },
  { id: 2, nome: "Carlos Eduardo Lima", email: "carlos.lima@email.com" },
  { id: 3, nome: "Fernanda Oliveira", email: "fernanda.oliveira@email.com" },
];

export const pedidos: Pedido[] = [];

// Cupons: código -> percentual de desconto sobre o total do pedido.
export const cupons: Record<string, number> = {
  PET10: 10,
  BEMVINDO5: 5,
};
