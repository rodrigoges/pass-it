export enum CategoriaPT {
  CLOTHES = 'Roupas',
  FURNITURE = 'Móveis',
  ELECTRONICS = 'Eletrônicos',
  BOOKS = 'Livros',
  TOYS = 'Brinquedos',
  OTHER = 'Outros',
}

export enum StatusPT {
  AVAILABLE = 'Disponível',
  RESERVED = 'Reservado',
  DONATED = 'Doado',
}

export function traduzCategoria(categoria: string): string {
  return CategoriaPT[categoria as keyof typeof CategoriaPT] || categoria;
}

export function traduzStatus(status: string): string {
  return StatusPT[status as keyof typeof StatusPT] || status;
}
