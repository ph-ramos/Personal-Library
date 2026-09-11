import { App, Modal, Notice, Setting, TFile } from "obsidian";
import { ColecaoSettings, StatusLeitura } from "./types";
import { Idioma, t } from "./i18n";

const STATUS_ORDENADOS: StatusLeitura[] = ["naoLi", "queroLer", "lendo", "jaLi", "relendo"];

function rotuloStatus(idioma: Idioma, status: StatusLeitura): string {
	switch (status) {
		case "naoLi":
			return t(idioma, "statusNaoLi");
		case "queroLer":
			return t(idioma, "statusQueroLer");
		case "lendo":
			return t(idioma, "statusLendo");
		case "jaLi":
			return t(idioma, "statusJaLi");
		case "relendo":
			return t(idioma, "statusRelendo");
	}
}

function statusDoRotulo(idioma: Idioma, rotulo: unknown): StatusLeitura | undefined {
	return STATUS_ORDENADOS.find((s) => rotuloStatus(idioma, s) === rotulo);
}

function dataHoje(): string {
	const d = new Date();
	const mes = String(d.getMonth() + 1).padStart(2, "0");
	const dia = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${mes}-${dia}`;
}

/**
 * Abre o modal de status de leitura para o arquivo dado. Valida que o
 * arquivo é de fato um item da coleção (tem a propriedade "Tipo" com um dos
 * valores esperados) antes de abrir - caso contrário, avisa e não faz nada.
 * Lê o estado atual (status/nota/favorito) do frontmatter para pré-preencher
 * o modal.
 */
export function abrirModalStatusLeitura(app: App, settings: ColecaoSettings, file: TFile | null): void {
	const idioma = settings.idioma;

	if (!file) {
		new Notice(t(idioma, "statusModalSemArquivo"));
		return;
	}

	const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter as Record<string, unknown> | undefined;
	const chaveTipo = t(idioma, "propTipo");
	const valoresValidos = [t(idioma, "tipoLivro"), t(idioma, "tipoQuadrinho")];
	if (!frontmatter || !valoresValidos.includes(String(frontmatter[chaveTipo]))) {
		new Notice(t(idioma, "statusModalSemArquivo"));
		return;
	}

	const statusAtual = statusDoRotulo(idioma, frontmatter[t(idioma, "propStatusLeitura")]);
	const notaBruta = frontmatter[t(idioma, "propNota")];
	const notaAtual = typeof notaBruta === "number" ? notaBruta : undefined;
	const favoritoAtual = frontmatter[t(idioma, "propFavorito")] === true;

	new ModalStatusLeitura(app, settings, file, statusAtual, notaAtual, favoritoAtual).open();
}

export class ModalStatusLeitura extends Modal {
	private status: StatusLeitura;
	private nota: number | undefined;
	private favorito: boolean;

	constructor(
		app: App,
		private settings: ColecaoSettings,
		private file: TFile,
		statusAtual: StatusLeitura | undefined,
		notaAtual: number | undefined,
		favoritoAtual: boolean
	) {
		super(app);
		this.status = statusAtual ?? "naoLi";
		this.nota = notaAtual;
		this.favorito = favoritoAtual;
	}

	private get idioma(): Idioma {
		return this.settings.idioma;
	}

	onOpen(): void {
		this.render();
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private render(): void {
		const { contentEl } = this;
		const idioma = this.idioma;
		contentEl.empty();
		contentEl.addClass("colecao-modal-status");
		contentEl.createEl("h2", { text: `${t(idioma, "statusModalTitulo")} — ${this.file.basename}` });

		new Setting(contentEl).setName(t(idioma, "statusModalCampoStatus")).addDropdown((dd) => {
			for (const s of STATUS_ORDENADOS) {
				dd.addOption(s, rotuloStatus(idioma, s));
			}
			dd.setValue(this.status).onChange((v) => {
				this.status = v as StatusLeitura;
			});
		});

		new Setting(contentEl).setName(t(idioma, "statusModalCampoNota")).addDropdown((dd) => {
			dd.addOption("", t(idioma, "statusModalOpcaoSemNota"));
			for (let n = 1; n <= 5; n += 0.5) {
				dd.addOption(String(n), String(n));
			}
			dd.setValue(this.nota !== undefined ? String(this.nota) : "");
			dd.onChange((v) => {
				this.nota = v === "" ? undefined : Number(v);
			});
		});

		new Setting(contentEl).setName(t(idioma, "statusModalCampoFavorito")).addToggle((tg) =>
			tg.setValue(this.favorito).onChange((v) => {
				this.favorito = v;
			})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText(t(idioma, "statusModalBotaoSalvar"))
				.setCta()
				.onClick(() => void this.salvar())
		);
	}

	private async salvar(): Promise<void> {
		const idioma = this.idioma;
		const chaveStatus = t(idioma, "propStatusLeitura");
		const chaveNota = t(idioma, "propNota");
		const chaveFavorito = t(idioma, "propFavorito");
		const chaveDataInicio = t(idioma, "propDataInicioLeitura");
		const chaveDataFim = t(idioma, "propDataFimLeitura");
		const prefixoReleitura = `${t(idioma, "propDataReleituraPrefixo")}${idioma === "zh" ? "" : "_"}`;
		const status = this.status;
		const nota = this.nota;
		const favorito = this.favorito;

		await this.app.fileManager.processFrontMatter(this.file, (frontmatter: Record<string, unknown>) => {
			frontmatter[chaveStatus] = rotuloStatus(idioma, status);
			frontmatter[chaveFavorito] = favorito;

			if (nota === undefined) {
				delete frontmatter[chaveNota];
			} else {
				frontmatter[chaveNota] = nota;
			}

			if (status === "lendo" && !frontmatter[chaveDataInicio]) {
				frontmatter[chaveDataInicio] = dataHoje();
			}

			if (status === "jaLi" && !frontmatter[chaveDataFim]) {
				frontmatter[chaveDataFim] = dataHoje();
			}

			if (status === "relendo") {
				const existentes = Object.keys(frontmatter).filter(
					(k) => k.startsWith(prefixoReleitura) && /^\d+$/.test(k.slice(prefixoReleitura.length))
				);
				const proximo = existentes.length + 1;
				frontmatter[`${prefixoReleitura}${proximo}`] = dataHoje();
			}
		});

		new Notice(t(idioma, "statusModalSucesso"));
		this.close();
	}
}
