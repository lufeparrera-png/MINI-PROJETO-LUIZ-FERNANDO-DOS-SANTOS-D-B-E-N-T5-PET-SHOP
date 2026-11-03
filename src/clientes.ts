// ============================================================
// clientes.ts  ->  Cadastro e consulta de clientes (Sprint 3).
// ============================================================
import { clientes } from "./dados.js";
import type { Cliente, Resultado } from "./tipos.js";
import { falha, normalizar, sucesso } from "./utils.js";

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cadastrarCliente(novo: Cliente): Resultado<Cliente> {
  if (!Number.isInteger(novo.id) || novo.id <= 0) return falha("O ID deve ser um número inteiro maior que zero.");
  if (novo.nome.trim() === "") return falha("O nome do cliente não pode estar vazio.");
  if (!FORMATO_EMAIL.test(novo.email)) return falha(`E-mail inválido: "${novo.email}".`);

  if (clientes.some((c) => c.id === novo.id)) {
    return falha(`Já existe um cliente cadastrado com o ID ${novo.id}.`);
  }
  if (clientes.some((c) => normalizar(c.email) === normalizar(novo.email))) {
    return falha(`Já existe um cliente cadastrado com o e-mail "${novo.email}".`);
  }

  const cliente: Cliente = { ...novo, nome: novo.nome.trim() };
  clientes.push(cliente);
  return sucesso(cliente);
}

export function listarClientes(): Cliente[] {
  return [...clientes];
}

export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((c) => c.id === id);
}
