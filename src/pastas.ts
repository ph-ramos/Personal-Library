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
