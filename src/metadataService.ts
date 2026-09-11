import { requestUrl } from "obsidian";

export interface ResultadoBusca {
	titulo: string;
	tituloOriginal?: string;
	autores: string[];
	editora?: string;
	anoPublicacao?: string;
	paginas?: number;
	idioma?: string;
	sinopse?: string;
	categorias?: string[];
	isbn10?: string;
	isbn13?: string;
	capaUrl?: string;
	fonte: string;
	fonteUrl?: string;
}

interface GoogleBooksIndustryIdentifier {
	type?: string;
	identifier?: string;
}

interface GoogleBooksImageLinks {
	thumbnail?: string;
	smallThumbnail?: string;
}

interface GoogleBooksVolumeInfo {
	title?: string;
	authors?: string[];
	publisher?: string;
	publishedDate?: string;
	pageCount?: number;
	language?: string;
	description?: string;
	categories?: string[];
	industryIdentifiers?: GoogleBooksIndustryIdentifier[];
	imageLinks?: GoogleBooksImageLinks;
	infoLink?: string;
	canonicalVolumeLink?: string;
}

interface GoogleBooksVolume {
	volumeInfo?: GoogleBooksVolumeInfo;
}

interface GoogleBooksResponse {
	items?: GoogleBooksVolume[];
}

interface OpenLibraryAuthor {
	name?: string;
}

interface OpenLibrarySubject {
	name?: string;
}

interface OpenLibraryPublisher {
	name?: string;
}

interface OpenLibraryCover {
	small?: string;
	medium?: string;
	large?: string;
}

interface OpenLibraryBookData {
	title?: string;
	authors?: OpenLibraryAuthor[];
	publishers?: OpenLibraryPublisher[];
	publish_date?: string;
	number_of_pages?: number;
	subjects?: OpenLibrarySubject[];
	cover?: OpenLibraryCover;
	url?: string;
}

type OpenLibraryBooksResponse = Record<string, OpenLibraryBookData | undefined>;

interface OpenLibrarySearchDoc {
	title?: string;
	author_name?: string[];
	publisher?: string[];
	first_publish_year?: number;
	number_of_pages_median?: number;
	language?: string[];
	subject?: string[];
	isbn?: string[];
	cover_i?: number;
	key?: string;
}

interface OpenLibrarySearchResponse {
	docs?: OpenLibrarySearchDoc[];
}

function limparIsbn(isbn: string): string {
	return isbn.replace(/[^0-9Xx]/g, "").toUpperCase();
}

export function pareceIsbn(termo: string): boolean {
	const limpo = limparIsbn(termo);
	return limpo.length === 10 || limpo.length === 13;
}

export function pareceQuadrinho(categorias?: string[]): boolean {
	if (!categorias) return false;
	return categorias.some((c) => /comic|graphic novel|quadrinho|\bhq\b|manga/i.test(c));
}

async function buscarGoogleBooks(termo: string, apiKey?: string): Promise<ResultadoBusca[]> {
	const isbn = pareceIsbn(termo);
	const q = isbn ? `isbn:${limparIsbn(termo)}` : termo;
	const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}${apiKey ? `&key=${apiKey}` : ""}`;
	try {
		const res = await requestUrl({ url, throw: false });
		const dados = res.json as GoogleBooksResponse | undefined;
		if (res.status !== 200 || !dados?.items) return [];
		return dados.items.slice(0, 10).map((item): ResultadoBusca => {
			const info = item.volumeInfo ?? {};
			const ids = info.industryIdentifiers ?? [];
			const isbn10 = ids.find((i) => i.type === "ISBN_10")?.identifier;
			const isbn13 = ids.find((i) => i.type === "ISBN_13")?.identifier;
			const capa = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;
			return {
				titulo: info.title ?? "Sem título",
				autores: info.authors ?? [],
				editora: info.publisher,
				anoPublicacao: info.publishedDate,
				paginas: info.pageCount,
				idioma: info.language,
				sinopse: info.description,
				categorias: info.categories,
				isbn10,
				isbn13,
				capaUrl: capa ? capa.replace(/^http:/, "https:") : undefined,
				fonte: "Google Books",
				fonteUrl: info.infoLink ?? info.canonicalVolumeLink,
			};
		});
	} catch (e) {
		console.error("[Colecao] Erro Google Books:", e);
		return [];
	}
}

async function buscarOpenLibraryPorIsbn(termo: string): Promise<ResultadoBusca[]> {
	if (!pareceIsbn(termo)) return [];
	const isbn = limparIsbn(termo);
	try {
		const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
		const res = await requestUrl({ url, throw: false });
		if (res.status !== 200) return [];
		const resposta = res.json as OpenLibraryBooksResponse | undefined;
		const data = resposta?.[`ISBN:${isbn}`];
		if (!data) return [];
		return [{
			titulo: data.title ?? "Sem título",
			autores: (data.authors ?? []).map((a) => a.name).filter((n): n is string => Boolean(n)),
			editora: data.publishers?.[0]?.name,
			anoPublicacao: data.publish_date,
			paginas: data.number_of_pages,
			categorias: (data.subjects ?? []).map((s) => s.name).filter((n): n is string => Boolean(n)),
			isbn10: isbn.length === 10 ? isbn : undefined,
			isbn13: isbn.length === 13 ? isbn : undefined,
			capaUrl: data.cover?.large ?? data.cover?.medium ?? data.cover?.small,
			fonte: "Open Library",
			fonteUrl: data.url,
		}];
	} catch (e) {
		console.error("[Colecao] Erro Open Library (ISBN):", e);
		return [];
	}
}

async function buscarOpenLibraryPorTitulo(termo: string): Promise<ResultadoBusca[]> {
	try {
		const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=10`;
		const res = await requestUrl({ url, throw: false });
		const resposta = res.json as OpenLibrarySearchResponse | undefined;
		if (res.status !== 200 || !resposta?.docs) return [];
		return resposta.docs.slice(0, 10).map((doc): ResultadoBusca => ({
			titulo: doc.title ?? "Sem título",
			autores: doc.author_name ?? [],
			editora: doc.publisher?.[0],
			anoPublicacao: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
			paginas: doc.number_of_pages_median,
			idioma: doc.language?.[0],
			categorias: doc.subject?.slice(0, 8),
			isbn10: doc.isbn?.find((i) => i.length === 10),
			isbn13: doc.isbn?.find((i) => i.length === 13),
			capaUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : undefined,
			fonte: "Open Library",
			fonteUrl: doc.key ? `https://openlibrary.org${doc.key}` : undefined,
		}));
	} catch (e) {
		console.error("[Colecao] Erro Open Library (busca):", e);
		return [];
	}
}

function mesclar(principal: ResultadoBusca, secundario?: ResultadoBusca): ResultadoBusca {
	if (!secundario) return principal;
	return {
		...principal,
		editora: principal.editora ?? secundario.editora,
		anoPublicacao: principal.anoPublicacao ?? secundario.anoPublicacao,
		paginas: principal.paginas ?? secundario.paginas,
		idioma: principal.idioma ?? secundario.idioma,
		sinopse: principal.sinopse ?? secundario.sinopse,
		categorias: principal.categorias?.length ? principal.categorias : secundario.categorias,
		isbn10: principal.isbn10 ?? secundario.isbn10,
		isbn13: principal.isbn13 ?? secundario.isbn13,
		capaUrl: principal.capaUrl ?? secundario.capaUrl,
		fonteUrl: principal.fonteUrl ?? secundario.fonteUrl,
		fonte: `${principal.fonte} + ${secundario.fonte}`,
	};
}

/**
 * Busca por ISBN (10 ou 13) ou por termo livre (título/autor).
 * Para ISBN: consulta Google Books e Open Library em paralelo e mescla os dois
 * num único resultado (o que faltar em um é complementado pelo outro).
 * Para termo livre: junta as listas das duas fontes, sem tentar casar item a item.
 */
export async function buscarMetadados(termo: string, googleApiKey?: string): Promise<ResultadoBusca[]> {
	const termoLimpo = termo.trim();
	if (!termoLimpo) return [];

	if (pareceIsbn(termoLimpo)) {
		const [google, openLibrary] = await Promise.all([
			buscarGoogleBooks(termoLimpo, googleApiKey),
			buscarOpenLibraryPorIsbn(termoLimpo),
		]);
		if (google.length > 0) return [mesclar(google[0], openLibrary[0])];
		if (openLibrary.length > 0) return openLibrary;
		return [];
	}

	const [google, openLibrary] = await Promise.all([
		buscarGoogleBooks(termoLimpo, googleApiKey),
		buscarOpenLibraryPorTitulo(termoLimpo),
	]);
	return [...google, ...openLibrary].slice(0, 15);
}
