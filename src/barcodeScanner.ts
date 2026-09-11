import { App, Modal, Notice } from "obsidian";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, Exception, Result } from "@zxing/library";
import { Idioma, t } from "./i18n";

/**
 * Verifica a permissão de câmera (quando o navegador/Electron expõe a
 * Permissions API) antes de abrir o scanner. Se já estiver explicitamente
 * negada, avisa e nem tenta abrir a câmera - caso contrário (concedida,
 * "prompt" ou API indisponível), abre o modal normalmente, que vai disparar
 * o pedido de permissão nativo se ainda for necessário.
 */
export async function abrirScannerComPermissao(
	app: App,
	idioma: Idioma,
	aoDetectar: (codigo: string) => void
): Promise<void> {
	const negada = await permissaoCameraNegada();
	if (negada) {
		new Notice(t(idioma, "scannerPermissaoNegada"));
		return;
	}
	new ModalScanner(app, idioma, aoDetectar).open();
}

async function permissaoCameraNegada(): Promise<boolean> {
	try {
		if (!navigator.permissions?.query) return false;
		const status = await navigator.permissions.query({ name: "camera" as PermissionName });
		return status.state === "denied";
	} catch {
		return false;
	}
}

/**
 * Modal que abre a câmera do dispositivo e tenta ler continuamente um código
 * de barras (EAN-13, que é o formato usado pelo ISBN impresso nos livros).
 * Ao detectar um código, chama `aoDetectar` com o texto lido e se fecha.
 */
export class ModalScanner extends Modal {
	private controls: IScannerControls | null = null;
	private resolvido = false;

	constructor(app: App, private idioma: Idioma, private aoDetectar: (codigo: string) => void) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("colecao-modal-scanner");
		contentEl.createEl("h2", { text: t(this.idioma, "scannerTitulo") });
		contentEl.createEl("p", {
			text: t(this.idioma, "scannerInstrucao"),
			cls: "colecao-scanner-instrucao",
		});

		const video = contentEl.createEl("video", { cls: "colecao-scanner-video" });
		video.muted = true;
		video.playsInline = true;

		void this.iniciarCamera(video);
	}

	private async iniciarCamera(video: HTMLVideoElement): Promise<void> {
		const hints = new Map<DecodeHintType, unknown>();
		hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.UPC_A]);
		const leitor = new BrowserMultiFormatReader(hints);

		try {
			// deviceId undefined => pede a câmera com facingMode "environment"
			// (traseira em celulares; em notebooks cai de volta pra webcam padrão).
			this.controls = await leitor.decodeFromVideoDevice(
				undefined,
				video,
				(resultado?: Result, _erro?: Exception, _controles?: IScannerControls) => {
					if (resultado && !this.resolvido) {
						this.resolvido = true;
						this.aoDetectar(resultado.getText());
						this.close();
					}
				}
			);
		} catch (e) {
			console.error("[Colecao] Erro ao acessar câmera:", e);
			let chave: "scannerSemCamera" | "scannerPermissaoNegada" | "scannerErroCamera" = "scannerErroCamera";
			if (e instanceof Error && e.name === "NotFoundError") {
				chave = "scannerSemCamera";
			} else if (e instanceof Error && e.name === "NotAllowedError") {
				chave = "scannerPermissaoNegada";
			}
			new Notice(t(this.idioma, chave));
			this.close();
		}
	}

	onClose(): void {
		this.controls?.stop();
		this.controls = null;
		this.contentEl.empty();
	}
}
