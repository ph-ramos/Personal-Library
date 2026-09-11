function valorYaml(v: unknown): string {
	if (v === undefined || v === null) return "";
	if (typeof v === "number" || typeof v === "boolean") return String(v);
	const s = String(v);
	if (/^[a-zA-Z0-9À-ÿ ]+$/.test(s)) return s;
	return JSON.stringify(s);
}

function chaveYaml(chave: string): string {
	// Chaves simples (letras/números/underscore, sem começar com número) não
	// precisam de aspas. Qualquer outra coisa (espaço, "@", etc.) é citada -
	// "@" sozinho, por exemplo, é um indicador reservado em YAML e quebra o
	// parser se não for citado.
	if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(chave)) return chave;
	return JSON.stringify(chave);
}

/**
 * Monta um bloco de frontmatter YAML a partir de um objeto simples.
 * Suporta strings, números, booleanos e arrays desses tipos.
 * Chaves com valor undefined/null/""/[] são omitidas.
 */
export function construirFrontmatter(campos: Record<string, unknown>): string {
	const linhas: string[] = ["---"];
	for (const [chave, valor] of Object.entries(campos)) {
		if (valor === undefined || valor === null || valor === "") continue;
		const chaveFinal = chaveYaml(chave);
		if (Array.isArray(valor)) {
			if (valor.length === 0) continue;
			linhas.push(`${chaveFinal}:`);
			for (const item of valor) {
				linhas.push(`  - ${valorYaml(item)}`);
			}
		} else {
			linhas.push(`${chaveFinal}: ${valorYaml(valor)}`);
		}
	}
	linhas.push("---", "");
	return linhas.join("\n");
}
