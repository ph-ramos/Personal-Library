import { Plugin, TFile } from "obsidian";
import { ColecaoSettings, CONFIGURACOES_PADRAO } from "./types";
import { ColecaoSettingTab } from "./settingsTab";
import { ModalBusca } from "./searchModal";
import { garantirArquivoBase } from "./baseFileManager";
import { abrirModalStatusLeitura } from "./statusLeituraModal";
import { obterPastaColecao, obterPastaLivros } from "./pastas";
import { migrarEstruturaDePastas } from "./migracao";
import { t } from "./i18n";

export default class ColecaoPlugin extends Plugin {
	settings: ColecaoSettings = CONFIGURACOES_PADRAO;

	async onload() {
		await this.loadSettings();
		const idioma = this.settings.idioma;

		this.addRibbonIcon("book-plus", t(idioma, "ribbonTooltip"), () => {
			new ModalBusca(this.app, this.settings).open();
		});

		this.addRibbonIcon("star", t(idioma, "comandoAtualizarStatusNome"), () => {
			abrirModalStatusLeitura(this.app, this.settings, this.app.workspace.getActiveFile());
		});

		this.addRibbonIcon("layout-grid", t(idioma, "comandoBaseNome"), () => {
			void this.abrirOuCriarVisaoGeral();
		});

		this.addCommand({
			id: "adicionar-item-colecao",
			name: t(idioma, "comandoAdicionarNome"),
			callback: () => new ModalBusca(this.app, this.settings).open(),
		});

		this.addCommand({
			id: "criar-visao-geral-colecao",
			name: t(idioma, "comandoBaseNome"),
			callback: () => this.abrirOuCriarVisaoGeral(),
		});

		this.addCommand({
			id: "atualizar-status-leitura",
			name: t(idioma, "comandoAtualizarStatusNome"),
			callback: () => abrirModalStatusLeitura(this.app, this.settings, this.app.workspace.getActiveFile()),
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (!(file instanceof TFile) || file.extension !== "md") return;
				menu.addItem((item) =>
					item
						.setTitle(t(this.settings.idioma, "comandoAtualizarStatusNome"))
						.setIcon("book-check")
						.onClick(() => abrirModalStatusLeitura(this.app, this.settings, file))
				);
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, _editor, info) => {
				const file = info.file;
				if (!(file instanceof TFile) || file.extension !== "md") return;
				menu.addItem((item) =>
					item
						.setTitle(t(this.settings.idioma, "comandoAtualizarStatusNome"))
						.setIcon("book-check")
						.onClick(() => abrirModalStatusLeitura(this.app, this.settings, file))
				);
			})
		);

		this.addSettingTab(new ColecaoSettingTab(this.app, this));

		// Antes de garantir a visão geral (.base), migra (uma única vez) a
		// estrutura de pastas de versões anteriores do plugin para o novo
		// layout - pasta principal renomeada e notas numa subpasta dedicada
		// (veja migracao.ts) - e só então cria/abre o .base já com o nome e
		// os filtros atualizados, sem precisar que o usuário rode o comando
		// manualmente.
		this.app.workspace.onLayoutReady(() => {
			void migrarEstruturaDePastas(this.app, this.settings)
				.then(() => this.saveSettings())
				.then(() =>
					garantirArquivoBase(
						this.app,
						obterPastaColecao(this.settings),
						obterPastaLivros(this.settings),
						this.settings.idioma
					)
				)
				.catch((e) => console.error("[Colecao] Erro ao criar visão geral padrão:", e));
		});
	}

	/**
	 * Garante que o arquivo .base de visão geral exista (criando-o se
	 * necessário) e o abre numa nova aba. Usado tanto pelo comando quanto
	 * pelo ícone da barra lateral.
	 */
	private async abrirOuCriarVisaoGeral(): Promise<void> {
		const caminho = await garantirArquivoBase(
			this.app,
			obterPastaColecao(this.settings),
			obterPastaLivros(this.settings),
			this.settings.idioma
		);
		const arquivo = this.app.vault.getAbstractFileByPath(caminho);
		if (arquivo instanceof TFile) {
			await this.app.workspace.getLeaf(false).openFile(arquivo);
		}
	}

	async loadSettings() {
		const dadosSalvos = (await this.loadData()) as Partial<ColecaoSettings> | null;
		this.settings = Object.assign({}, CONFIGURACOES_PADRAO, dadosSalvos ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
