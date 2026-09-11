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
	googleApiKey: string;
	idioma: Idioma;
}

// Deixar pastaColecao/pastaCapas em branco faz o plugin usar o nome padrão do
// idioma atual (veja pastas.ts) - assim as pastas acompanham a troca de idioma.
export const CONFIGURACOES_PADRAO: ColecaoSettings = {
	pastaColecao: "",
	pastaCapas: "",
	googleApiKey: "",
	idioma: "pt",
};
