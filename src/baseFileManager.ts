import { App, normalizePath } from "obsidian";
import { Idioma, t } from "./i18n";

/**
 * Garante que exista um arquivo .base com a visão geral da coleção (Visão
 * geral em cards, Livros, Quadrinhos e Todos em tabela). Só cria se ainda
 * não existir - não sobrescreve customizações que o usuário tenha feito
 * manualmente depois.
 * Os nomes de propriedade e os valores de filtro usados aqui seguem o idioma
 * selecionado no momento em que o arquivo é criado.
 *
 * A capa de cada card já vem configurada via "imageProperty" na própria
 * definição da view (não precisa mais configurar manualmente pela UI). O
 * destaque de favoritos usa uma fórmula que mostra uma estrela quando a
 * propriedade de favorito é verdadeira - a reordenação dos cards (por
 * título, nota, status etc.) é feita pelo próprio Bases, direto na barra da
 * view.
 */
export async function garantirArquivoBase(app: App, pastaColecao: string, idioma: Idioma = "pt"): Promise<string> {
	const caminho = normalizePath(`${pastaColecao}/Colecao.base`);
	if (await app.vault.adapter.exists(caminho)) {
		return caminho;
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

	const conteudo = `filters:
  and:
    - 'file.inFolder("${pastaColecao}")'

formulas:
  destaque: 'if(${propFavorito}, "⭐", "")'

properties:
  formula.destaque:
    displayName: "${propFavorito}"

views:
  - type: cards
    name: "${t(idioma, "baseViewGeral")}"
    imageProperty: ${propCapa}
    imageFit: cover
    order:
      - ${propTitulo}
      - ${propStatus}
      - formula.destaque
  - type: cards
    name: "${t(idioma, "baseViewLivros")}"
    filters:
      and:
        - '${propTipo} == "${valorLivro}"'
    imageProperty: ${propCapa}
    imageFit: cover
    order:
      - ${propTitulo}
      - ${propStatus}
      - formula.destaque
  - type: cards
    name: "${t(idioma, "baseViewQuadrinhos")}"
    filters:
      and:
        - '${propTipo} == "${valorQuadrinho}"'
    imageProperty: ${propCapa}
    imageFit: cover
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
	await app.vault.create(caminho, conteudo);
	return caminho;
}
