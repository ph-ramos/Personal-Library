import type { Idioma } from "./i18n";

export type TipoItem = "livro" | "quadrinho";
export type { Idioma };

export interface ItemBase {
	tipo: TipoItem;
	titulo: string;
	tituloOriginal?: string;
	isbn10?: string;
	isbn13?: string;
	editora?: string;
	selo?: string;
	anoPublicacao?: string;
	paginas?: number;
	idioma?: string;
	sinopse?: string;
	capaUrl?: string;
	fonte?: string;
	fonteUrl?: string;
}

export interface Livro extends ItemBase {
	tipo: "livro";
	autores?: string[];
	tradutor?: string;
	edicao?: string;
}

export interface Quadrinho extends ItemBase {
	tipo: "quadrinho";
	equipeAutoral?: string[];
	serie?: string;
	numeroEdicao?: string;
}

export type ItemColecao = Livro | Quadrinho;

export type StatusLeitura = "naoLi" | "queroLer" | "lendo" | "jaLi" | "relendo";

export interface ColecaoSettings {
	pastaColecao: string;
	pastaCapas: string;
	pastaLivros: string;
	googleApiKey: string;
	idioma: Idioma;
	/** Controla se a migração automática de pastas (renomeação da pasta
	 * principal e criação da subpasta dedicada às notas) já foi feita neste
	 * vault - veja migracao.ts. Roda uma única vez. */
	migracaoV3Feita: boolean;
	/** Controla se a migração automática que adiciona o link para a nota
	 * "hub" da Biblioteca nas notas de livros/quadrinhos já existentes (veja
	 * migracao.ts) já foi feita neste vault. Roda uma única vez. */
	migracaoBibliotecaFeita: boolean;
}

// Deixar pastaColecao/pastaCapas/pastaLivros em branco faz o plugin usar o
// nome padrão do idioma atual (veja pastas.ts) - assim as pastas acompanham
// a troca de idioma.
export const CONFIGURACOES_PADRAO: ColecaoSettings = {
	pastaColecao: "",
	pastaCapas: "",
	pastaLivros: "",
	googleApiKey: "",
	idioma: "pt",
	migracaoV3Feita: false,
	migracaoBibliotecaFeita: false,
};
