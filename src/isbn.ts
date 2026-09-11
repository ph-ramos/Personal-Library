function limpar(isbn: string): string {
	return isbn.replace(/[^0-9Xx]/g, "").toUpperCase();
}

function isbn10ParaIsbn13(isbn10Limpo: string): string {
	const semVerificador = "978" + isbn10Limpo.slice(0, 9);
	let soma = 0;
	for (let i = 0; i < semVerificador.length; i++) {
		const d = Number(semVerificador[i]);
		soma += i % 2 === 0 ? d : d * 3;
	}
	const resto = soma % 10;
	const verificador = resto === 0 ? 0 : 10 - resto;
	return semVerificador + verificador;
}

function isbn13ParaIsbn10(isbn13Limpo: string): string | undefined {
	// ISBNs 979-* não existiam no padrão antigo de 10 dígitos, não há conversão possível.
	if (!isbn13Limpo.startsWith("978")) return undefined;
	const nucleo = isbn13Limpo.slice(3, 12);
	if (nucleo.length !== 9) return undefined;
	let soma = 0;
	for (let i = 0; i < 9; i++) {
		soma += Number(nucleo[i]) * (10 - i);
	}
	const resto = soma % 11;
	const verificadorNum = 11 - resto;
	const verificador = verificadorNum === 11 ? "0" : verificadorNum === 10 ? "X" : String(verificadorNum);
	return nucleo + verificador;
}

/**
 * Dado o ISBN-10 e/ou ISBN-13 já conhecidos, completa o que estiver faltando
 * usando a conversão matemática padrão entre os dois formatos. Um ISBN-13 com
 * prefixo 979 não tem equivalente em ISBN-10 (nesse caso o campo continua vazio).
 */
export function completarIsbns(isbn10?: string, isbn13?: string): { isbn10?: string; isbn13?: string } {
	const i10 = isbn10 ? limpar(isbn10) : undefined;
	const i13 = isbn13 ? limpar(isbn13) : undefined;

	if (i10 && i10.length === 10 && !i13) {
		return { isbn10: i10, isbn13: isbn10ParaIsbn13(i10) };
	}
	if (i13 && i13.length === 13 && !i10) {
		return { isbn10: isbn13ParaIsbn10(i13), isbn13: i13 };
	}
	return { isbn10: i10, isbn13: i13 };
}
