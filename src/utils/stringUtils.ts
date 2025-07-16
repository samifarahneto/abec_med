/**
 * Remove acentos de uma string
 * @param str - String a ser normalizada
 * @returns String sem acentos
 */
export function removeAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Normaliza uma string para busca (remove acentos e converte para minúsculas)
 * @param str - String a ser normalizada
 * @returns String normalizada para busca
 */
export function normalizeForSearch(str: string): string {
  return removeAccents(str).trim();
}
