// ============================================================
// utils.ts  ->  Funções pequenas e reutilizáveis.
// ============================================================
import type { Falha, Sucesso } from "./tipos.js";

// Criam os "resultados" padronizados das operações.
export function sucesso<T>(valor: T): Sucesso<T> {
  return { ok: true, valor };
}

export function falha(erro: string): Falha {
  return { ok: false, erro };
}

// Evita erros de ponto flutuante (0.1 + 0.2 = 0.30000000000000004).
export function arredondar(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Remove acentos e maiúsculas: "Ração" -> "racao" (ajuda nas buscas).
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
