import { App, normalizePath } from "obsidian";
import { Idioma, t } from "./i18n";

/**
 * Garante que exista um arquivo .base com a visão geral da coleção
 * (Livros, Quadrinhos e Todos). Só cria se ainda não existir - não sobrescreve
 * customizações que o usuário tenha feito manualmente depois.
 * Os nomes de propriedade e os valores de filtro usados aqui seguem o idioma
 * selecionado no momento em que o arquivo é criado.
 *
 * Observação: a propriedade de imagem da view "cards" (qual campo usar como
 * capa) precisa ser configurada uma vez pela interface do Obsidian (ícone de
 * engrenagem da view -> Image property), porque a chave YAML exata pode
 * variar entre versões do Bases e é mais seguro configurar pela UI.
 */
export async function garantirArquivoBase(app: App, pastaColecao: string, idioma: Idioma = "pt"): Promise<string> {
	const caminho = normalizePath(`${pastaColecao}/Colecao.base`);
	if (await app.vault.adapter.exists(caminho)) {
		return caminho;
	}

	const propTipo = t(idioma, "propTipo");
	const propEditora = t(idioma, "propEditora");
	const propAno = t(idioma, "propAnoPublicacao");
	const propPaginas = t(idioma, "propPaginas");
	const valorLivro = t(idioma, "tipoLivro");
	const valorQuadrinho = t(idioma, "tipoQuadrinho");

	const conteudo = `filters:
  and:
    - 'file.inFolder("${pastaColecao}")'

views:
  - type: cards
    name: "${t(idioma, "baseViewLivros")}"
    filters:
      and:
        - '${propTipo} == "${valorLivro}"'
  - type: cards
    name: "${t(idioma, "baseViewQuadrinhos")}"
    filters:
      and:
        - '${propTipo} == "${valorQuadrinho}"'
  - type: table
    name: "${t(idioma, "baseViewTodos")}"
    order:
      - file.name
      - ${propTipo}
      - ${propEditora}
      - ${propAno}
      - ${propPaginas}
`;
	await app.vault.create(caminho, conteudo);
	return caminho;
}
