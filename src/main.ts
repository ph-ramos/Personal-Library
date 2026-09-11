import { Plugin, TFile } from "obsidian";
import { ColecaoSettings, CONFIGURACOES_PADRAO } from "./types";
import { ColecaoSettingTab } from "./settingsTab";
import { ModalBusca } from "./searchModal";
import { garantirArquivoBase } from "./baseFileManager";
import { obterPastaColecao } from "./pastas";
import { t } from "./i18n";

export default class ColecaoPlugin extends Plugin {
	settings: ColecaoSettings = CONFIGURACOES_PADRAO;

	async onload() {
		await this.loadSettings();
		const idioma = this.settings.idioma;

		this.addRibbonIcon("book-plus", t(idioma, "ribbonTooltip"), () => {
			new ModalBusca(this.app, this.settings).open();
		});

		this.addCommand({
			id: "adicionar-item-colecao",
			name: t(idioma, "comandoAdicionarNome"),
			callback: () => new ModalBusca(this.app, this.settings).open(),
		});

		this.addCommand({
			id: "criar-visao-geral-colecao",
			name: t(idioma, "comandoBaseNome"),
			callback: async () => {
				const caminho = await garantirArquivoBase(this.app, obterPastaColecao(this.settings), this.settings.idioma);
				const arquivo = this.app.vault.getAbstractFileByPath(caminho);
				if (arquivo instanceof TFile) {
					await this.app.workspace.getLeaf(false).openFile(arquivo);
				}
			},
		});

		this.addSettingTab(new ColecaoSettingTab(this.app, this));
	}

	async loadSettings() {
		const dadosSalvos = (await this.loadData()) as Partial<ColecaoSettings> | null;
		this.settings = Object.assign({}, CONFIGURACOES_PADRAO, dadosSalvos ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
