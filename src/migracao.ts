import { App, TFile, TFolder, normalizePath } from "obsidian";
import { ColecaoSettings } from "./types";
import { obterPastaColecao, obterPastaLivros } from "./pastas";

/**
 * Nomes de pasta padrão usados por versões anteriores do plugin, antes da
 * pasta principal passar a se chamar "Biblioteca"/"Library"/"图书馆". Usado
 * só pela migração automática abaixo.
 */
const PASTA_COLECAO_PADRAO_ANTIGA: Record<string, string> = {
	pt: "Colecao",
	en: "Collection",
	zh: "收藏",
};

/**
 * Migração automática, feita uma única vez por vault (controlada por
 * settings.migracaoV3Feita), da reorganização de pastas introduzida junto
 * com a renomeação da pasta principal para "Biblioteca" e do arquivo de
 * visão geral para "Estante":
 *
 * 1) Se o usuário nunca customizou a pasta da coleção (campo em branco) e a
 *    pasta com o nome padrão ANTIGO existir no vault (e a pasta com o nome
 *    padrão novo ainda não existir), ela é renomeada para o nome padrão
 *    atual - preservando tudo que já estava lá, em vez de deixar a coleção
 *    dividida em duas pastas só por causa da troca do nome padrão.
 * 2) Qualquer nota .md que esteja diretamente na raiz da pasta da coleção
 *    (e não já dentro de uma subpasta, como a de capas) é movida para a
 *    nova subpasta dedicada às notas de livros/quadrinhos.
 *
 * Chamada no onload do plugin, antes de garantir o .base. Não lança: um erro
 * é logado pelo chamador e a migração é tentada de novo no próximo
 * carregamento (settings.migracaoV3Feita só é marcado como concluído no
 * final, se nada falhar).
 */
export async function migrarEstruturaDePastas(app: App, settings: ColecaoSettings): Promise<void> {
	if (settings.migracaoV3Feita) return;

	if (!settings.pastaColecao.trim()) {
		const nomeAntigo = PASTA_COLECAO_PADRAO_ANTIGA[settings.idioma] ?? PASTA_COLECAO_PADRAO_ANTIGA.pt;
		const antiga = normalizePath(nomeAntigo);
		const atual = normalizePath(obterPastaColecao(settings));
		if (antiga !== atual) {
			const pastaAntiga = app.vault.getAbstractFileByPath(antiga);
			const pastaAtualExiste = await app.vault.adapter.exists(atual);
			if (pastaAntiga instanceof TFolder && !pastaAtualExiste) {
				await app.fileManager.renameFile(pastaAntiga, atual);
			}
		}
	}

	const pastaColecao = normalizePath(obterPastaColecao(settings));
	const pastaLivros = normalizePath(obterPastaLivros(settings));
	if (pastaColecao !== pastaLivros) {
		const pastaRaiz = app.vault.getAbstractFileByPath(pastaColecao);
		if (pastaRaiz instanceof TFolder) {
			const notasSoltas = pastaRaiz.children.filter(
				(f): f is TFile => f instanceof TFile && f.extension === "md"
			);
			if (notasSoltas.length > 0) {
				if (!(await app.vault.adapter.exists(pastaLivros))) {
					await app.vault.adapter.mkdir(pastaLivros);
				}
				for (const nota of notasSoltas) {
					await app.fileManager.renameFile(nota, normalizePath(`${pastaLivros}/${nota.name}`));
				}
			}
		}
	}

	settings.migracaoV3Feita = true;
}
