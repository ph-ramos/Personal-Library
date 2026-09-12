import { App, Notice } from "obsidian";
import { ItemColecao, ColecaoSettings } from "./types";
import { baixarCapa, criarNotaItem, resolverNomeArquivoUnico } from "./noteCreator";
import { obterPastaCapas, obterPastaLivros } from "./pastas";
import { t } from "./i18n";

/**
 * Fluxo único de registro: resolve as pastas (respeitando customização ou o
 * padrão do idioma atual), resolve um nome de arquivo único a partir do
 * título, baixa a capa (se houver) usando esse mesmo nome, cria a nota na
 * subpasta de livros/quadrinhos e abre ela. Usado tanto pela busca
 * automática quanto pelo cadastro manual.
 */
export async function registrarItem(app: App, settings: ColecaoSettings, item: ItemColecao): Promise<void> {
	const idioma = settings.idioma;
	const pastaLivros = obterPastaLivros(settings);
	const pastaCapas = obterPastaCapas(settings);
	const nomeArquivo = resolverNomeArquivoUnico(app, pastaLivros, item.titulo);

	let caminhoCapa: string | undefined;
	if (item.capaUrl) {
		caminhoCapa = await baixarCapa(app, item.capaUrl, pastaCapas, nomeArquivo);
	}
	try {
		const nota = await criarNotaItem(app, item, pastaLivros, nomeArquivo, idioma, caminhoCapa);
		new Notice(`"${item.titulo}" ${t(idioma, "noticeAdicionado")}`);
		await app.workspace.getLeaf(false).openFile(nota);
	} catch (e: unknown) {
		const mensagem = e instanceof Error ? e.message : String(e);
		new Notice(`${t(idioma, "noticeErroItem")} ${mensagem}`);
		throw e;
	}
}
