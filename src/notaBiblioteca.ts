import { App, normalizePath } from "obsidian";
import { ColecaoSettings } from "./types";
import { t } from "./i18n";
import { obterPastaColecao, obterCaminhoNotaBiblioteca } from "./pastas";

/**
 * Garante que a nota "hub" da Biblioteca exista (criando-a se ainda não
 * existir). Nunca sobrescreve o conteúdo de uma nota já existente nesse
 * caminho - o usuário pode editá-la livremente (adicionar suas próprias
 * anotações, por exemplo) sem o plugin apagar essas mudanças depois.
 * Retorna o caminho (sem extensão), usado para linkar cada nota de
 * livro/quadrinho a ela.
 */
export async function garantirNotaBiblioteca(app: App, settings: ColecaoSettings): Promise<string> {
	const idioma = settings.idioma;
	const caminhoSemExtensao = obterCaminhoNotaBiblioteca(settings);
	const caminho = normalizePath(`${caminhoSemExtensao}.md`);

	if (!(await app.vault.adapter.exists(caminho))) {
		const pastaColecao = normalizePath(obterPastaColecao(settings));
		if (!(await app.vault.adapter.exists(pastaColecao))) {
			await app.vault.adapter.mkdir(pastaColecao);
		}
		const conteudo = `# ${t(idioma, "propBiblioteca")}\n\n${t(idioma, "notaBibliotecaTexto")}\n`;
		await app.vault.create(caminho, conteudo);
	}

	return caminhoSemExtensao;
}
