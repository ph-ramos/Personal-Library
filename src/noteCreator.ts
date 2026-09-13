import { App, TFile, normalizePath, requestUrl } from "obsidian";
import { ItemColecao } from "./types";
import { construirFrontmatter } from "./frontmatter";
import { completarIsbns } from "./isbn";
import { Idioma, t } from "./i18n";

function sanitizarNomeArquivo(nome: string): string {
	return nome.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function extensaoDaUrl(url: string): string {
	const match = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
	return match ? match[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function garantirPasta(app: App, caminho: string): Promise<void> {
	const normalizado = normalizePath(caminho);
	if (!(await app.vault.adapter.exists(normalizado))) {
		await app.vault.adapter.mkdir(normalizado);
	}
}

/**
 * Resolve um nome de arquivo único (sem extensão) para o título dado, dentro
 * da pasta indicada. Se já existir um arquivo com esse nome, acrescenta
 * " (2)", " (3)" etc. até achar um livre.
 */
export function resolverNomeArquivoUnico(app: App, pasta: string, titulo: string): string {
	const base = sanitizarNomeArquivo(titulo);
	let tentativa = base;
	let contador = 2;
	while (app.vault.getAbstractFileByPath(normalizePath(`${pasta}/${tentativa}.md`))) {
		tentativa = `${base} (${contador})`;
		contador++;
	}
	return tentativa;
}

/**
 * Baixa a imagem de capa (se houver URL) para a pasta de capas do vault.
 * Retorna o caminho relativo do arquivo criado, ou undefined se não baixou.
 */
export async function baixarCapa(
	app: App,
	capaUrl: string | undefined,
	pastaCapas: string,
	nomeArquivo: string
): Promise<string | undefined> {
	if (!capaUrl) return undefined;
	try {
		await garantirPasta(app, pastaCapas);
		const resposta = await requestUrl({ url: capaUrl, throw: false });
		if (resposta.status !== 200) {
			console.warn("[Colecao] Não foi possível baixar a capa:", capaUrl, resposta.status);
			return undefined;
		}
		const ext = extensaoDaUrl(capaUrl);
		const caminho = normalizePath(`${pastaCapas}/${nomeArquivo}.${ext}`);
		const existente = app.vault.getAbstractFileByPath(caminho);
		if (existente instanceof TFile) {
			await app.vault.modifyBinary(existente, resposta.arrayBuffer);
		} else {
			await app.vault.createBinary(caminho, resposta.arrayBuffer);
		}
		return caminho;
	} catch (e) {
		console.error("[Colecao] Falha ao baixar capa:", e);
		return undefined;
	}
}

/**
 * Cria a nota markdown do item na pasta de livros/quadrinhos. Tanto os NOMES
 * das propriedades quanto o VALOR do campo de tipo (livro/quadrinho) são
 * escritos no idioma selecionado nas configurações do plugin - itens já
 * existentes, criados com outro idioma, não são retroativamente alterados.
 * `nomeArquivo` já deve vir resolvido (único) por resolverNomeArquivoUnico.
 * Se apenas um dos ISBNs (10 ou 13) foi informado, o outro é derivado
 * automaticamente por conversão matemática padrão.
 */
export async function criarNotaItem(
	app: App,
	item: ItemColecao,
	pastaLivros: string,
	nomeArquivo: string,
	idioma: Idioma,
	caminhoCapa?: string,
	caminhoNotaBiblioteca?: string
): Promise<TFile> {
	await garantirPasta(app, pastaLivros);

	const caminhoNota = normalizePath(`${pastaLivros}/${nomeArquivo}.md`);
	const { isbn10, isbn13 } = completarIsbns(item.isbn10, item.isbn13);
	const tipoTraduzido = t(idioma, item.tipo === "livro" ? "tipoLivro" : "tipoQuadrinho");

	const campos: Record<string, unknown> = {
		[t(idioma, "propTipo")]: tipoTraduzido,
		[t(idioma, "propTitulo")]: item.titulo,
		[t(idioma, "propTituloOriginal")]: item.tituloOriginal,
		Isbn10: isbn10,
		Isbn13: isbn13,
		[t(idioma, "propEditora")]: item.editora,
		[t(idioma, "propSelo")]: item.selo,
		[t(idioma, "propAnoPublicacao")]: item.anoPublicacao,
		[t(idioma, "propPaginas")]: item.paginas,
		[t(idioma, "propIdioma")]: item.idioma,
		[t(idioma, "propFonte")]: item.fonte,
		[t(idioma, "propFonteUrl")]: item.fonteUrl,
		[t(idioma, "propCapa")]: caminhoCapa ? `[[${caminhoCapa}]]` : (item.capaUrl ?? ""),
		[t(idioma, "propBiblioteca")]: caminhoNotaBiblioteca ? `[[${caminhoNotaBiblioteca}]]` : undefined,
	};

	if (item.tipo === "livro") {
		campos[t(idioma, "propAutores")] = item.autores;
		campos[t(idioma, "propTradutor")] = item.tradutor;
		campos[t(idioma, "propEdicao")] = item.edicao;
	} else {
		campos[t(idioma, "propEquipeAutoral")] = item.equipeAutoral;
		campos[t(idioma, "propSerie")] = item.serie;
		campos[t(idioma, "propNumeroEdicao")] = item.numeroEdicao;
	}

	// Toda entrada nova começa com status "não li" e não favoritada - o
	// usuário ajusta isso depois pelo comando/menu de status de leitura.
	campos[t(idioma, "propStatusLeitura")] = t(idioma, "statusNaoLi");
	campos[t(idioma, "propFavorito")] = false;

	const frontmatter = construirFrontmatter(campos);
	const sinopse = item.sinopse ? `${item.sinopse}\n\n` : "";
	const conteudo = `${frontmatter}\n${sinopse}## ${t(idioma, "secaoNotas")}\n\n`;

	return app.vault.create(caminhoNota, conteudo);
}
