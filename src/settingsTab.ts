import { App, PluginSettingTab, Setting } from "obsidian";
import type ColecaoPlugin from "./main";
import { Idioma, t } from "./i18n";
import { obterPastaCapas, obterPastaColecao } from "./pastas";

export class ColecaoSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: ColecaoPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		const idioma = this.plugin.settings.idioma;
		containerEl.empty();
		new Setting(containerEl).setName(t(idioma, "configTitulo")).setHeading();

		new Setting(containerEl)
			.setName(t(idioma, "configPastaColecaoNome"))
			.setDesc(t(idioma, "configPastaColecaoDesc"))
			.addText((text) =>
				text
					.setPlaceholder(obterPastaColecao(this.plugin.settings))
					.setValue(this.plugin.settings.pastaColecao)
					.onChange(async (v) => {
						this.plugin.settings.pastaColecao = v.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t(idioma, "configPastaCapasNome"))
			.setDesc(t(idioma, "configPastaCapasDesc"))
			.addText((text) =>
				text
					.setPlaceholder(obterPastaCapas(this.plugin.settings))
					.setValue(this.plugin.settings.pastaCapas)
					.onChange(async (v) => {
						this.plugin.settings.pastaCapas = v.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t(idioma, "configApiKeyNome"))
			.setDesc(t(idioma, "configApiKeyDesc"))
			.addText((text) =>
				text.setValue(this.plugin.settings.googleApiKey).onChange(async (v) => {
					this.plugin.settings.googleApiKey = v;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(t(idioma, "configIdiomaNome"))
			.setDesc(t(idioma, "configIdiomaDesc"))
			.addDropdown((dd) =>
				dd
					.addOption("pt", "Português")
					.addOption("en", "English")
					.addOption("zh", "中文")
					.setValue(this.plugin.settings.idioma)
					.onChange(async (v) => {
						this.plugin.settings.idioma = v as Idioma;
						await this.plugin.saveSettings();
						this.display();
					})
			);
	}
}
