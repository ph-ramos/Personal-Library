export type Idioma = "pt" | "en" | "zh";

type ChaveTraducao =
	| "ribbonTooltip"
	| "comandoAdicionarNome"
	| "comandoBaseNome"
	| "configTitulo"
	| "configPastaColecaoNome"
	| "configPastaColecaoDesc"
	| "configPastaCapasNome"
	| "configPastaCapasDesc"
	| "configApiKeyNome"
	| "configApiKeyDesc"
	| "configIdiomaNome"
	| "configIdiomaDesc"
	| "buscaTitulo"
	| "buscaTipoNome"
	| "buscaTipoDesc"
	| "tipoLivro"
	| "tipoQuadrinho"
	| "buscaCampoNome"
	| "buscaCampoPlaceholder"
	| "buscaBotao"
	| "buscando"
	| "buscaSemResultado"
	| "botaoCadastroManual"
	| "fontePrefixo"
	| "botaoAdicionar"
	| "botaoNenhumDesses"
	| "avisoDigiteTermo"
	| "manualTitulo"
	| "manualDescricao"
	| "campoTituloObrigatorio"
	| "campoTituloOriginal"
	| "campoAutores"
	| "campoTradutor"
	| "campoEdicao"
	| "campoEquipeAutoral"
	| "campoSerie"
	| "campoNumeroEdicao"
	| "campoEditora"
	| "campoSelo"
	| "campoAno"
	| "campoPaginas"
	| "campoIdioma"
	| "campoIsbn10"
	| "campoIsbn13"
	| "campoCapaUrl"
	| "campoFonteUrl"
	| "campoSinopse"
	| "placeholderVirgula"
	| "placeholderEquipeAutoral"
	| "placeholderFonteUrl"
	| "botaoCadastrar"
	| "avisoPreencherTitulo"
	| "noticeAdicionado"
	| "noticeErroItem"
	| "secaoNotas"
	| "baseViewLivros"
	| "baseViewQuadrinhos"
	| "baseViewTodos"
	| "fonteManualValor"
	| "propTipo"
	| "propTitulo"
	| "propTituloOriginal"
	| "propEditora"
	| "propSelo"
	| "propAnoPublicacao"
	| "propPaginas"
	| "propIdioma"
	| "propFonte"
	| "propFonteUrl"
	| "propCapa"
	| "propAutores"
	| "propTradutor"
	| "propEdicao"
	| "propEquipeAutoral"
	| "propSerie"
	| "propNumeroEdicao"
	| "pastaColecaoPadrao"
	| "pastaCapasSubpasta";

const TRADUCOES: Record<Idioma, Record<ChaveTraducao, string>> = {
	pt: {
		ribbonTooltip: "Adicionar à coleção",
		comandoAdicionarNome: "Adicionar livro ou quadrinho à coleção",
		comandoBaseNome: "Criar/abrir visão geral da coleção (.base)",
		configTitulo: "Coleção de Livros e Quadrinhos",
		configPastaColecaoNome: "Pasta da coleção",
		configPastaColecaoDesc: "Onde as notas de cada livro/quadrinho serão criadas.",
		configPastaCapasNome: "Pasta das capas",
		configPastaCapasDesc: "Onde as imagens de capa baixadas serão salvas.",
		configApiKeyNome: "Chave de API do Google Books (opcional)",
		configApiKeyDesc: "Aumenta o limite de requisições por dia. Sem ela, o plugin já funciona normalmente.",
		configIdiomaNome: "Idioma da interface",
		configIdiomaDesc: "Idioma dos menus, botões e mensagens do plugin — e também das propriedades dos itens que forem cadastrados a partir de agora.",
		buscaTitulo: "Adicionar à coleção",
		buscaTipoNome: "Tipo",
		buscaTipoDesc: "O plugin tenta adivinhar pelo resultado da busca, mas você pode ajustar.",
		tipoLivro: "Livro",
		tipoQuadrinho: "Quadrinho",
		buscaCampoNome: "ISBN ou título",
		buscaCampoPlaceholder: "978... ou nome do livro/quadrinho",
		buscaBotao: "Buscar",
		buscando: "Buscando...",
		buscaSemResultado: "Nenhum resultado encontrado (comum em edições de editoras nacionais/pequenas).",
		botaoCadastroManual: "Cadastrar manualmente",
		fontePrefixo: "Fonte",
		botaoAdicionar: "Adicionar",
		botaoNenhumDesses: "Nenhum desses — cadastrar manualmente",
		avisoDigiteTermo: "Digite um ISBN ou um título para buscar.",
		manualTitulo: "Cadastro manual",
		manualDescricao: "Use quando a busca automática não encontrar o item (comum em edições de editoras nacionais menores).",
		campoTituloObrigatorio: "Título *",
		campoTituloOriginal: "Título original",
		campoAutores: "Autor(es)",
		campoTradutor: "Tradutor",
		campoEdicao: "Edição",
		campoEquipeAutoral: "Equipe autoral",
		campoSerie: "Série/arco",
		campoNumeroEdicao: "Número/edição",
		campoEditora: "Editora",
		campoSelo: "Selo",
		campoAno: "Ano de publicação",
		campoPaginas: "Número de páginas",
		campoIdioma: "Idioma",
		campoIsbn10: "ISBN-10",
		campoIsbn13: "ISBN-13",
		campoCapaUrl: "URL da capa (opcional)",
		campoFonteUrl: "URL da fonte (opcional)",
		campoSinopse: "Sinopse",
		placeholderVirgula: "separados por vírgula",
		placeholderEquipeAutoral: "roteirista, desenhista, colorista... separados por vírgula",
		placeholderFonteUrl: "de onde você tirou essas informações",
		botaoCadastrar: "Cadastrar",
		avisoPreencherTitulo: "Preencha ao menos o título.",
		noticeAdicionado: "adicionado à coleção.",
		noticeErroItem: "Erro ao criar item:",
		secaoNotas: "Notas",
		baseViewLivros: "Livros",
		baseViewQuadrinhos: "Quadrinhos",
		baseViewTodos: "Todos",
		fonteManualValor: "Manual",
		propTipo: "Tipo",
		propTitulo: "Titulo",
		propTituloOriginal: "Titulo_original",
		propEditora: "Editora",
		propSelo: "Selo",
		propAnoPublicacao: "Ano_publicacao",
		propPaginas: "Paginas",
		propIdioma: "Idioma",
		propFonte: "Fonte",
		propFonteUrl: "Fonte_url",
		propCapa: "Capa",
		propAutores: "Autores",
		propTradutor: "Tradutor",
		propEdicao: "Edicao",
		propEquipeAutoral: "Equipe autoral",
		propSerie: "Serie",
		propNumeroEdicao: "Numero_edicao",
		pastaColecaoPadrao: "Colecao",
		pastaCapasSubpasta: "_Capas",
	},
	en: {
		ribbonTooltip: "Add to collection",
		comandoAdicionarNome: "Add book or comic to collection",
		comandoBaseNome: "Create/open collection overview (.base)",
		configTitulo: "Book & Comic Collection",
		configPastaColecaoNome: "Collection folder",
		configPastaColecaoDesc: "Where each book/comic note will be created.",
		configPastaCapasNome: "Cover folder",
		configPastaCapasDesc: "Where downloaded cover images will be saved.",
		configApiKeyNome: "Google Books API key (optional)",
		configApiKeyDesc: "Raises the daily request limit. The plugin works fine without it.",
		configIdiomaNome: "Interface language",
		configIdiomaDesc: "Language for the plugin's menus, buttons and messages — and also for the properties of items registered from now on.",
		buscaTitulo: "Add to collection",
		buscaTipoNome: "Type",
		buscaTipoDesc: "The plugin tries to guess it from the search result, but you can adjust it.",
		tipoLivro: "Book",
		tipoQuadrinho: "Comic",
		buscaCampoNome: "ISBN or title",
		buscaCampoPlaceholder: "978... or the book/comic title",
		buscaBotao: "Search",
		buscando: "Searching...",
		buscaSemResultado: "No results found (common for small/local publisher editions).",
		botaoCadastroManual: "Register manually",
		fontePrefixo: "Source",
		botaoAdicionar: "Add",
		botaoNenhumDesses: "None of these — register manually",
		avisoDigiteTermo: "Enter an ISBN or a title to search.",
		manualTitulo: "Manual entry",
		manualDescricao: "Use this when the automatic search finds nothing (common for smaller/local publisher editions).",
		campoTituloObrigatorio: "Title *",
		campoTituloOriginal: "Original title",
		campoAutores: "Author(s)",
		campoTradutor: "Translator",
		campoEdicao: "Edition",
		campoEquipeAutoral: "Creative team",
		campoSerie: "Series/arc",
		campoNumeroEdicao: "Number/issue",
		campoEditora: "Publisher",
		campoSelo: "Imprint",
		campoAno: "Publication year",
		campoPaginas: "Page count",
		campoIdioma: "Language",
		campoIsbn10: "ISBN-10",
		campoIsbn13: "ISBN-13",
		campoCapaUrl: "Cover URL (optional)",
		campoFonteUrl: "Source URL (optional)",
		campoSinopse: "Synopsis",
		placeholderVirgula: "comma separated",
		placeholderEquipeAutoral: "writer, artist, colorist... comma separated",
		placeholderFonteUrl: "where you got this information from",
		botaoCadastrar: "Register",
		avisoPreencherTitulo: "Fill in at least the title.",
		noticeAdicionado: "added to the collection.",
		noticeErroItem: "Error creating item:",
		secaoNotas: "Notes",
		baseViewLivros: "Books",
		baseViewQuadrinhos: "Comics",
		baseViewTodos: "All",
		fonteManualValor: "Manual",
		propTipo: "Type",
		propTitulo: "Title",
		propTituloOriginal: "Original_title",
		propEditora: "Publisher",
		propSelo: "Imprint",
		propAnoPublicacao: "Publication_year",
		propPaginas: "Pages",
		propIdioma: "Language",
		propFonte: "Source",
		propFonteUrl: "Source_url",
		propCapa: "Cover",
		propAutores: "Authors",
		propTradutor: "Translator",
		propEdicao: "Edition",
		propEquipeAutoral: "Creative team",
		propSerie: "Series",
		propNumeroEdicao: "Issue_number",
		pastaColecaoPadrao: "Collection",
		pastaCapasSubpasta: "_Covers",
	},
	zh: {
		ribbonTooltip: "添加到收藏",
		comandoAdicionarNome: "添加图书或漫画到收藏",
		comandoBaseNome: "创建/打开收藏概览 (.base)",
		configTitulo: "图书与漫画收藏",
		configPastaColecaoNome: "收藏文件夹",
		configPastaColecaoDesc: "每本书/漫画的笔记将创建在这里。",
		configPastaCapasNome: "封面文件夹",
		configPastaCapasDesc: "下载的封面图片将保存在这里。",
		configApiKeyNome: "Google Books API 密钥(可选)",
		configApiKeyDesc: "提高每日请求上限。没有它插件也能正常工作。",
		configIdiomaNome: "界面语言",
		configIdiomaDesc: "插件菜单、按钮和消息使用的语言 — 也是此后新添加条目的属性所使用的语言。",
		buscaTitulo: "添加到收藏",
		buscaTipoNome: "类型",
		buscaTipoDesc: "插件会根据搜索结果尝试猜测,但你可以自行调整。",
		tipoLivro: "书籍",
		tipoQuadrinho: "漫画",
		buscaCampoNome: "ISBN 或标题",
		buscaCampoPlaceholder: "978... 或书籍/漫画的名称",
		buscaBotao: "搜索",
		buscando: "搜索中...",
		buscaSemResultado: "未找到结果(小型/本地出版社的版本常见此情况)。",
		botaoCadastroManual: "手动添加",
		fontePrefixo: "来源",
		botaoAdicionar: "添加",
		botaoNenhumDesses: "都不是 — 手动添加",
		avisoDigiteTermo: "请输入 ISBN 或标题进行搜索。",
		manualTitulo: "手动添加",
		manualDescricao: "当自动搜索找不到结果时使用(小型/本地出版社的版本常见此情况)。",
		campoTituloObrigatorio: "标题 *",
		campoTituloOriginal: "原标题",
		campoAutores: "作者",
		campoTradutor: "译者",
		campoEdicao: "版本",
		campoEquipeAutoral: "创作团队",
		campoSerie: "系列/篇章",
		campoNumeroEdicao: "期号/卷号",
		campoEditora: "出版社",
		campoSelo: "印记",
		campoAno: "出版年份",
		campoPaginas: "页数",
		campoIdioma: "语言",
		campoIsbn10: "ISBN-10",
		campoIsbn13: "ISBN-13",
		campoCapaUrl: "封面链接(可选)",
		campoFonteUrl: "来源链接(可选)",
		campoSinopse: "简介",
		placeholderVirgula: "用逗号分隔",
		placeholderEquipeAutoral: "编剧、绘者、上色师...用逗号分隔",
		placeholderFonteUrl: "你获取这些信息的地方",
		botaoCadastrar: "添加",
		avisoPreencherTitulo: "请至少填写标题。",
		noticeAdicionado: "已添加到收藏。",
		noticeErroItem: "创建条目时出错:",
		secaoNotas: "笔记",
		baseViewLivros: "书籍",
		baseViewQuadrinhos: "漫画",
		baseViewTodos: "全部",
		fonteManualValor: "手动",
		propTipo: "类型",
		propTitulo: "标题",
		propTituloOriginal: "原标题",
		propEditora: "出版社",
		propSelo: "印记",
		propAnoPublicacao: "出版年份",
		propPaginas: "页数",
		propIdioma: "语言",
		propFonte: "来源",
		propFonteUrl: "来源链接",
		propCapa: "封面",
		propAutores: "作者",
		propTradutor: "译者",
		propEdicao: "版本",
		propEquipeAutoral: "创作团队",
		propSerie: "系列",
		propNumeroEdicao: "期号",
		pastaColecaoPadrao: "收藏",
		pastaCapasSubpasta: "_封面",
	},
};

export function t(idioma: Idioma, chave: ChaveTraducao): string {
	return TRADUCOES[idioma]?.[chave] ?? TRADUCOES.pt[chave];
}
