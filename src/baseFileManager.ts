import { App, normalizePath } from "obsidian";
import { Idioma, t } from "./i18n";

/**
 * Marcador de versão do schema do .base gerado automaticamente. Deve ser
 * incrementado sempre que a estrutura gerada abaixo mudar de forma
 * relevante (ex.: chave de imagem corrigida). Se o arquivo existente não
 * começar com o marcador atual, ele é tratado como desatualizado (gerado
 * por uma versão anterior do plugin, com um bug já corrigido) e é
 * regenerado. Se o usuário customizar o arquivo manualmente mantendo o
 * marcador, a customização é respeitada e não é sobrescrita.
 */
const VERSAO_SCHEMA = 3;
const MARCADOR = `# gerado por colecao-livros-quadrinhos - schema v${VERSAO_SCHEMA} (edite à vontade; remova esta linha para impedir atualizações automáticas de schema)`;

/**
 * Garante que exista um arquivo .base com a visão geral da coleção (Visão
 * geral em cards, Livros, Quadrinhos e Todos em tabela). Só (re)cria quando
 * o arquivo não existe ou quando foi gerado por uma versão de schema
 * anterior (veja MARCADOR/VERSAO_SCHEMA acima) - não sobrescreve
 * customizações feitas em cima da versão atual do schema.
 * Os nomes de propriedade e os valores de filtro usados aqui seguem o idioma
 * selecionado no momento em que o arquivo é criado.
 *
 * Notas sobre chaves do Bases usadas aqui (confirmadas via exemplos reais
 * de usuários no fórum do Obsidian, já que a documentação oficial não lista
 * os nomes literais das chaves de YAML):
 * - "image": chave correta para a capa de cada card ("imageProperty" NÃO
 *   existe, apesar do rótulo "Image property" na UI).
 * - "imageFit: contain": faz a capa inteira aparecer sem cortes, ajustada
 *   ao espaço do card (o padrão do Bases, "cover", cortaria a imagem para
 *   preencher o card por completo).
 * - "file.ext == \"md\"" no filtro: sem isso, os arquivos de imagem da capa
 *   (salvos na mesma pasta da coleção) também apareceriam como itens nas
 *   views, já que o filtro de pasta sozinho não distingue notas de anexos.
 * - A fórmula de destaque usa a forma de 2 argumentos de if() (se não for
 *   favorito, se resolve a "null"), para que o Bases não desenhe nenhuma
 *   marcação no card - só aparece a estrela quando o item é favorito, sem
 *   nenhuma indicação para quem não é.
 */
export async function garantirArquivoBase(app: App, pastaColecao: string, idioma: Idioma = "pt"): Promise<string> {
	const caminho = normalizePath(`${pastaColecao}/Colecao.base`);
	const existe = await app.vault.adapter.exists(caminho);

	if (existe) {
		const atual = await app.vault.adapter.read(caminho);
		if (atual.startsWith(MARCADOR)) {
			return caminho;
		}
	}

	const propTipo = t(idioma, "propTipo");
	const propTitulo = t(idioma, "propTitulo");
	const propEditora = t(idioma, "propEditora");
	const propAno = t(idioma, "propAnoPublicacao");
	const propPaginas = t(idioma, "propPaginas");
	const propCapa = t(idioma, "propCapa");
	const propStatus = t(idioma, "propStatusLeitura");
	const propNota = t(idioma, "propNota");
	const propFavorito = t(idioma, "propFavorito");
	const valorLivro = t(idioma, "tipoLivro");
	const valorQuadrinho = t(idioma, "tipoQuadrinho");

	const conteudo = `${MARCADOR}
filters:
  and:
    - 'file.inFolder("${pastaColecao}")'
    - 'file.ext == "md"'

formulas:
  destaque: 'if(${propFavorito}, "⭐")'

properties:
  formula.destaque:
    displayName: "${propFavorito}"

views:
  - type: cards
    name: "${t(idioma, "baseViewGeral")}"
    image: ${propCapa}
    imageFit: contain
    order:
      - ${propTitulo}
      - ${propStatus}
      - formula.destaque
  - type: cards
    name: "${t(idioma, "baseViewLivros")}"
    filters:
      and:
        - '${propTipo} == "${valorLivro}"'
    image: ${propCapa}
    imageFit: contain
    order:
      - ${propTitulo}
      - ${propStatus}
      - formula.destaque
  - type: cards
    name: "${t(idioma, "baseViewQuadrinhos")}"
    filters:
      and:
        - '${propTipo} == "${valorQuadrinho}"'
    image: ${propCapa}
    imageFit: contain
    order:
      - ${propTitulo}
      - ${propStatus}
      - formula.destaque
  - type: table
    name: "${t(idioma, "baseViewTodos")}"
    order:
      - file.name
      - ${propTipo}
      - ${propStatus}
      - ${propNota}
      - ${propFavorito}
      - ${propEditora}
      - ${propAno}
      - ${propPaginas}
`;
	if (existe) {
		await app.vault.adapter.write(caminho, conteudo);
	} else {
		await app.vault.create(caminho, conteudo);
	}
	return caminho;
}
