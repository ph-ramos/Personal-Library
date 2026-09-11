# Books and Comics Tracker

Plugin para [Obsidian](https://obsidian.md) que cataloga livros e quadrinhos direto no seu vault: busca por ISBN (10 ou 13) ou título, baixa automaticamente capa, autor, editora, número de páginas e outros metadados, e cria uma nota pronta para você anotar impressões, citações ou colar fotos.

## Funcionalidades

- **Busca por ISBN ou título**, cruzando [Google Books](https://developers.google.com/books) e [Open Library](https://openlibrary.org/developers/api) — o que faltar em uma fonte é complementado pela outra.
- **Livros e quadrinhos como tipos separados**, com campos próprios (autor/tradutor/edição para livros; equipe autoral/série/número para quadrinhos).
- **Cadastro manual** como alternativa, para quando a busca automática não encontra nada — comum em edições de editoras nacionais menores.
- **Completa automaticamente o ISBN-10/13** quando você só informa um dos dois, através da conversão matemática padrão entre os formatos.
- **Capa baixada localmente** para o vault e vinculada à nota.
- **Visão geral da coleção** usando a feature nativa [Bases](https://help.obsidian.md/bases) do Obsidian (views em galeria com capa, separadas por tipo).
- **Interface em Português, English ou 中文** — e as propriedades das notas criadas a partir daí seguem o idioma selecionado.

## Instalação

Este plugin ainda não está na lista oficial de plugins da comunidade do Obsidian. Para instalar manualmente:

1. Baixe `main.js`, `manifest.json` e `styles.css` da [última release](../../releases/latest).
2. Copie os três arquivos para `<seu-vault>/.obsidian/plugins/colecao-livros-quadrinhos/`.
3. No Obsidian, vá em **Configurações → Community plugins**, desative o "Restricted mode" se necessário, e ative "Books and Comics Tracker" (nome interno do plugin: Coleção de Livros e Quadrinhos).

## Uso

- Comando **"Adicionar livro ou quadrinho à coleção"** (ou o ícone na barra lateral) abre a busca.
- Comando **"Criar/abrir visão geral da coleção (.base)"** gera o arquivo de visão geral (Bases). Na primeira vez, configure manualmente a "Image property" de cada view Cards para `Capa` (ou o nome equivalente no idioma escolhido) pelo ícone de engrenagem da view — a chave exata dessa configuração ainda não é totalmente padronizada entre versões do Bases, por isso esse passo é manual.

## Configurações

| Opção | Descrição |
|---|---|
| Pasta da coleção | Onde as notas são criadas. Em branco, segue o padrão do idioma selecionado. |
| Pasta das capas | Onde as capas baixadas são salvas. Em branco, uma subpasta dentro da pasta da coleção. |
| Chave de API do Google Books | Opcional — aumenta o limite de requisições diárias. |
| Idioma da interface | Português, English ou 中文. Afeta a interface e as propriedades de itens cadastrados a partir da troca. |

## Desenvolvimento

```bash
npm install
npm run dev    # build com watch
npm run build  # build de produção
```

## Licença

[MIT](LICENSE)
