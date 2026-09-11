import { App, Modal, Notice, Setting } from "obsidian";
import { ItemColecao, ColecaoSettings, TipoItem } from "./types";
import { registrarItem } from "./registrar";
import { t } from "./i18n";

export class ModalCadastroManual extends Modal {
	private tipo: TipoItem;
	private campos: Record<string, string> = {};

	constructor(app: App, private settings: ColecaoSettings, tipoInicial: TipoItem = "livro", tituloInicial = "") {
		super(app);
		this.tipo = tipoInicial;
		if (!/^\d{9,13}[Xx]?$/.test(tituloInicial.trim())) {
			this.campos.titulo = tituloInicial;
		} else {
			this.campos.isbn13 = tituloInicial.length >= 13 ? tituloInicial : "";
			this.campos.isbn10 = tituloInicial.length === 10 ? tituloInicial : "";
		}
	}

	private get idioma() {
		return this.settings.idioma;
	}

	onOpen() {
		this.render();
	}

	onClose() {
		this.contentEl.empty();
	}

	private campoTexto(container: HTMLElement, chave: string, rotulo: string, placeholder = "") {
		new Setting(container).setName(rotulo).addText((text) => {
			text.setPlaceholder(placeholder)
				.setValue(this.campos[chave] ?? "")
				.onChange((v) => (this.campos[chave] = v));
		});
	}

	private render() {
		const { contentEl } = this;
		const idioma = this.idioma;
		contentEl.empty();
		contentEl.createEl("h2", { text: t(idioma, "manualTitulo") });
		contentEl.createEl("p", {
			text: t(idioma, "manualDescricao"),
			cls: "setting-item-description",
		});

		new Setting(contentEl).setName(t(idioma, "buscaTipoNome")).addDropdown((dd) =>
			dd
				.addOption("livro", t(idioma, "tipoLivro"))
				.addOption("quadrinho", t(idioma, "tipoQuadrinho"))
				.setValue(this.tipo)
				.onChange((v) => {
					this.tipo = v as TipoItem;
					this.render();
				})
		);

		this.campoTexto(contentEl, "titulo", t(idioma, "campoTituloObrigatorio"));
		this.campoTexto(contentEl, "tituloOriginal", t(idioma, "campoTituloOriginal"));

		if (this.tipo === "livro") {
			this.campoTexto(contentEl, "autores", t(idioma, "campoAutores"), t(idioma, "placeholderVirgula"));
			this.campoTexto(contentEl, "tradutor", t(idioma, "campoTradutor"));
			this.campoTexto(contentEl, "edicao", t(idioma, "campoEdicao"));
		} else {
			this.campoTexto(contentEl, "equipeAutoral", t(idioma, "campoEquipeAutoral"), t(idioma, "placeholderEquipeAutoral"));
			this.campoTexto(contentEl, "serie", t(idioma, "campoSerie"));
			this.campoTexto(contentEl, "numeroEdicao", t(idioma, "campoNumeroEdicao"));
		}

		this.campoTexto(contentEl, "editora", t(idioma, "campoEditora"));
		this.campoTexto(contentEl, "selo", t(idioma, "campoSelo"));
		this.campoTexto(contentEl, "anoPublicacao", t(idioma, "campoAno"));
		this.campoTexto(contentEl, "paginas", t(idioma, "campoPaginas"));
		this.campoTexto(contentEl, "idioma", t(idioma, "campoIdioma"));
		this.campoTexto(contentEl, "isbn10", t(idioma, "campoIsbn10"));
		this.campoTexto(contentEl, "isbn13", t(idioma, "campoIsbn13"));
		this.campoTexto(contentEl, "capaUrl", t(idioma, "campoCapaUrl"), "https://...");
		this.campoTexto(contentEl, "fonteUrl", t(idioma, "campoFonteUrl"), t(idioma, "placeholderFonteUrl"));
		this.campoTexto(contentEl, "sinopse", t(idioma, "campoSinopse"));

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText(t(idioma, "botaoCadastrar"))
				.setCta()
				.onClick(() => this.confirmar())
		);
	}

	private listaOuUndefined(v?: string): string[] | undefined {
		if (!v) return undefined;
		const lista = v.split(",").map((s) => s.trim()).filter(Boolean);
		return lista.length ? lista : undefined;
	}

	private async confirmar() {
		const idioma = this.idioma;
		if (!this.campos.titulo?.trim()) {
			new Notice(t(idioma, "avisoPreencherTitulo"));
			return;
		}

		const paginasNum = this.campos.paginas ? Number(this.campos.paginas) : undefined;

		const base = {
			titulo: this.campos.titulo.trim(),
			tituloOriginal: this.campos.tituloOriginal || undefined,
			editora: this.campos.editora || undefined,
			selo: this.campos.selo || undefined,
			anoPublicacao: this.campos.anoPublicacao || undefined,
			paginas: paginasNum !== undefined && Number.isFinite(paginasNum) ? paginasNum : undefined,
			idioma: this.campos.idioma || undefined,
			isbn10: this.campos.isbn10 || undefined,
			isbn13: this.campos.isbn13 || undefined,
			capaUrl: this.campos.capaUrl || undefined,
			fonteUrl: this.campos.fonteUrl || undefined,
			sinopse: this.campos.sinopse || undefined,
			fonte: t(idioma, "fonteManualValor"),
		};

		const item: ItemColecao =
			this.tipo === "livro"
				? {
						...base,
						tipo: "livro",
						autores: this.listaOuUndefined(this.campos.autores),
						tradutor: this.campos.tradutor || undefined,
						edicao: this.campos.edicao || undefined,
				  }
				: {
						...base,
						tipo: "quadrinho",
						equipeAutoral: this.listaOuUndefined(this.campos.equipeAutoral),
						serie: this.campos.serie || undefined,
						numeroEdicao: this.campos.numeroEdicao || undefined,
				  };

		try {
			await registrarItem(this.app, this.settings, item);
			this.close();
		} catch {
			// erro já notificado dentro de registrarItem
		}
	}
}
