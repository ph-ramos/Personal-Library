import { ColecaoSettings } from "./types";
import { t } from "./i18n";

/**
 * Pasta da coleção efetivamente em uso: o valor customizado pelo usuário nas
 * configurações, ou (se estiver em branco) o nome padrão no idioma atual do
 * plugin. Assim, deixando o campo em branco, a pasta acompanha a troca de
 * idioma para as próximas inserções.
 */
export function obterPastaColecao(settings: ColecaoSettings): string {
	return settings.pastaColecao.trim() || t(settings.idioma, "pastaColecaoPadrao");
}

/**
 * Pasta das capas efetivamente em uso: o valor customizado pelo usuário, ou
 * (se estiver em branco) uma subpasta com nome padrão no idioma atual, dentro
 * da pasta da coleção.
 */
export function obterPastaCapas(settings: ColecaoSettings): string {
	const customizada = settings.pastaCapas.trim();
	if (customizada) return customizada;
	return `${obterPastaColecao(settings)}/${t(settings.idioma, "pastaCapasSubpasta")}`;
}

/**
 * Pasta das notas de livros/quadrinhos efetivamente em uso: o valor
 * customizado pelo usuário, ou (se estiver em branco) uma subpasta com nome
 * padrão no idioma atual, dentro da pasta da coleção - do mesmo jeito que a
 * pasta das capas. Assim a pasta principal fica só com as subpastas (notas e
 * capas) e o arquivo .base, sem notas soltas na raiz.
 */
export function obterPastaLivros(settings: ColecaoSettings): string {
	const customizada = settings.pastaLivros.trim();
	if (customizada) return customizada;
	return `${obterPastaColecao(settings)}/${t(settings.idioma, "pastaLivrosSubpasta")}`;
}

/**
 * Caminho (sem extensão) da nota "hub" da Biblioteca - a nota central para a
 * qual toda nota de livro/quadrinho linka, permitindo visualizar a coleção
 * inteira conectada no modo Grafo do Obsidian. Fica na raiz da pasta da
 * coleção, com o mesmo nome traduzido usado como padrão da própria pasta.
 */
export function obterCaminhoNotaBiblioteca(settings: ColecaoSettings): string {
	return `${obterPastaColecao(settings)}/${t(settings.idioma, "pastaColecaoPadrao")}`;
}
