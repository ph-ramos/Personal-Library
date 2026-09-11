import { App, DropdownComponent, Modal, Notice, Setting, TextComponent } from "obsidian";
import { buscarMetadados, pareceQuadrinho, ResultadoBusca } from "./metadataService";
import { ItemColecao, ColecaoSettings, TipoItem } from "./types";
import { registrarItem } from "./registrar";
import { ModalCadastroManual } from "./manualEntryModal";
import { abrirScannerComPermissao } from "./barcodeScanner";
import { t } from "./i18n";

export class ModalBusca extends Modal {
	private termo = "";
	private tipoSelecionado: TipoItem = "livro";
	private tipoEscolhidoPeloUsuario = false;
	private resultados: ResultadoBusca[] = [];
	private buscando = false;
	private areaResultados!: HTMLElement;
	private dropdownTipo?: DropdownComponent;
	private inputTexto?: TextComponent;

	constructor(app: App, private settings: ColecaoSettings) {
		super(app);
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

	private render() {
		const { contentEl } = this;
		const idioma = this.idioma;
		contentEl.empty();
		contentEl.addClass("colecao-modal-busca");
		contentEl.createEl("h2", { text: t(idioma, "buscaTitulo") });

		new Setting(contentEl)
			.setName(t(idioma, "buscaTipoNome"))
			.setDesc(t(idioma, "buscaTipoDesc"))
			.addDropdown((dd) => {
				this.dropdownTipo = dd;
				dd.addOption("livro", t(idioma, "tipoLivro"))
					.addOption("quadrinho", t(idioma, "tipoQuadrinho"))
					.setValue(this.tipoSelecionado)
					.onChange((v) => {
						this.tipoSelecionado = v as TipoItem;
						this.tipoEscolhidoPeloUsuario = true;
					});
			});

		new Setting(contentEl)
			.setName(t(idioma, "buscaCampoNome"))
			.addText((text) => {
				this.inputTexto = text;
				text.setPlaceholder(t(idioma, "buscaCampoPlaceholder"));
				text.onChange((v) => (this.termo = v));
				text.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
					if (e.key === "Enter") void this.buscar();
				});
			})
			.addExtraButton((btn) =>
				btn
					.setIcon("camera")
					.setTooltip(t(idioma, "scannerTitulo"))
					.onClick(() => this.abrirScanner())
			)
			.addButton((btn) => btn.setButtonText(t(idioma, "buscaBotao")).setCta().onClick(() => this.buscar()));

		this.areaResultados = contentEl.createDiv({ cls: "colecao-resultados" });

		window.setTimeout(() => this.inputTexto?.inputEl.focus(), 0);
	}

	private abrirScanner(): void {
		void abrirScannerComPermissao(this.app, this.idioma, (codigo) => {
			this.termo = codigo;
			this.inputTexto?.setValue(codigo);
			void this.buscar();
		});
	}

	private async buscar() {
		const idioma = this.idioma;
		if (this.buscando) return;
		const termo = this.termo.trim();
		if (!termo) {
			new Notice(t(idioma, "avisoDigiteTermo"));
			return;
		}
		this.buscando = true;
		this.areaResultados.empty();
		this.areaResultados.createEl("p", { text: t(idioma, "buscando") });

		try {
			this.resultados = await buscarMetadados(termo, this.settings.googleApiKey || undefined);
		} catch (e) {
			console.error("[Colecao] erro na busca:", e);
			this.resultados = [];
		}

		if (!this.tipoEscolhidoPeloUsuario && this.resultados.length > 0) {
			const provavelQuadrinho = pareceQuadrinho(this.resultados[0].categorias);
			this.tipoSelecionado = provavelQuadrinho ? "quadrinho" : "livro";
			this.dropdownTipo?.setValue(this.tipoSelecionado);
		}

		this.buscando = false;
		this.renderResultados();
	}

	private renderResultados() {
		const idioma = this.idioma;
		this.areaResultados.empty();

		if (this.resultados.length === 0) {
			const aviso = this.areaResultados.createDiv({ cls: "colecao-sem-resultado" });
			aviso.createEl("p", { text: t(idioma, "buscaSemResultado") });
			new Setting(aviso).addButton((btn) =>
				btn
					.setButtonText(t(idioma, "botaoCadastroManual"))
					.setCta()
					.onClick(() => {
						this.close();
						new ModalCadastroManual(this.app, this.settings, this.tipoSelecionado, this.termo).open();
					})
			);
			return;
		}

		for (const resultado of this.resultados) {
			const linha = this.areaResultados.createDiv({ cls: "colecao-item-resultado" });
			if (resultado.capaUrl) {
				linha.createEl("img", { cls: "colecao-capa-thumb", attr: { src: resultado.capaUrl } });
			} else {
				linha.createDiv({ cls: "colecao-capa-thumb colecao-capa-vazia" });
			}
			const info = linha.createDiv({ cls: "colecao-info-resultado" });
			info.createEl("div", { cls: "colecao-titulo-resultado", text: resultado.titulo });
			const detalhes = [resultado.autores?.join(", "), resultado.editora, resultado.anoPublicacao]
				.filter(Boolean)
				.join(" · ");
			if (detalhes) info.createEl("div", { cls: "colecao-detalhes-resultado", text: detalhes });
			info.createEl("div", { cls: "colecao-fonte-resultado", text: `${t(idioma, "fontePrefixo")}: ${resultado.fonte}` });

			const acoes = linha.createDiv({ cls: "colecao-acoes-resultado" });
			new Setting(acoes).addButton((btn) =>
				btn
					.setButtonText(t(idioma, "botaoAdicionar"))
					.setCta()
					.onClick(() => this.selecionar(resultado))
			);
		}

		const rodape = this.areaResultados.createDiv({ cls: "colecao-rodape-resultados" });
		new Setting(rodape).addButton((btn) =>
			btn.setButtonText(t(idioma, "botaoNenhumDesses")).onClick(() => {
				this.close();
				new ModalCadastroManual(this.app, this.settings, this.tipoSelecionado, this.termo).open();
			})
		);
	}

	private async selecionar(resultado: ResultadoBusca) {
		const base = {
			titulo: resultado.titulo,
			editora: resultado.editora,
			anoPublicacao: resultado.anoPublicacao,
			paginas: resultado.paginas,
			idioma: resultado.idioma,
			sinopse: resultado.sinopse,
			isbn10: resultado.isbn10,
			isbn13: resultado.isbn13,
			capaUrl: resultado.capaUrl,
			fonte: resultado.fonte,
			fonteUrl: resultado.fonteUrl,
		};

		const item: ItemColecao =
			this.tipoSelecionado === "livro"
				? { ...base, tipo: "livro", autores: resultado.autores }
				: { ...base, tipo: "quadrinho", equipeAutoral: resultado.autores };

		this.close();
		await registrarItem(this.app, this.settings, item);
	}
}
