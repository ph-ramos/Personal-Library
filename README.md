# Books and Comics Tracker

Plugin para [Obsidian](https://obsidian.md) que cataloga livros e quadrinhos direto no seu vault: busca por ISBN (10 ou 13) ou título, baixa automaticamente capa, autor, editora, número de páginas e outros metadados, e cria uma nota pronta para você anotar impressões, citações ou colar fotos.

## Funcionalidades

- **Busca por ISBN ou título**, cruzando [Google Books](https://developers.google.com/books) e [Open Library](https://openlibrary.org/developers/api) — o que faltar em uma fonte é complementado pela outra.
- **Leitura de código de barras pela câmera do dispositivo**, para pegar o ISBN direto do livro/quadrinho físico sem digitar nada.
- **Livros e quadrinhos como tipos separados**, com campos próprios (autor/tradutor/edição para livros; equipe autoral/série/número para quadrinhos).
- **Cadastro manual** como alternativa, para quando a busca automática não encontra nada — comum em edições de editoras nacionais menores.
- **Completa automaticamente o ISBN-10/13** quando você só informa um dos dois, através da conversão matemática padrão entre os formatos.
- **Capa baixada localmente** para o vault e vinculada à nota.
- **Status de leitura** (não li, quero ler, lendo, já li, relendo), com data de início/fim de leitura preenchida automaticamente e uma propriedade numerada por releitura.
- **Nota de 0,5 a 5 estrelas** e marcação de **favorito**.
- **Visão geral da coleção** usando a feature nativa [Bases](https://help.obsidian.md/bases) do Obsidian (views em cards com capa, separadas por tipo, além de uma tabela com todos os itens).
- **Nota "Biblioteca" linkada automaticamente** a cada livro/quadrinho cadastrado, permitindo visualizar a coleção inteira conectada no modo Grafo do Obsidian.
- **Interface em Português, English ou 中文** — e as propriedades das notas criadas a partir daí seguem o idioma selecionado.

## Instalação

Este plugin ainda não está na lista oficial de plugins da comunidade do Obsidian. Para instalar manualmente:

1. Baixe `main.js`, `manifest.json` e `styles.css` da [última release](../../releases/latest).
2. Copie os três arquivos para `<seu-vault>/.obsidian/plugins/colecao-livros-quadrinhos/`.
3. No Obsidian, vá em **Configurações → Community plugins**, desative o "Restricted mode" se necessário, e ative "Books and Comics Tracker" (nome interno do plugin: Coleção de Livros e Quadrinhos).

## Uso

- Ícone **"Adicionar à coleção"** na barra lateral (ou o comando equivalente) abre a busca — pelo campo de texto ou pelo ícone de câmera, para escanear o código de barras.
- Ícone **de estrela** na barra lateral (ou o comando "Atualizar status de leitura", disponível também no menu de contexto da nota) abre o status de leitura, nota e favorito do item aberto.
- Ícone **de grade** na barra lateral (ou o comando "Criar/abrir visão geral da coleção") abre a visão geral em Bases — gerada automaticamente na primeira vez que o plugin é ativado, sem nenhuma configuração manual.

### Sobre a permissão de câmera

A leitura de código de barras usa a câmera do dispositivo só enquanto a janela de escaneamento estiver aberta — nenhuma imagem ou vídeo é salvo ou enviado para fora do seu computador. Na primeira vez, o sistema operacional (ou o navegador, no caso do Obsidian mobile/web) pede sua permissão explícita; se você negar ou fechar a janela, o plugin simplesmente não consegue escanear e pede para tentar de novo ou digitar o ISBN manualmente.

## Configurações

| Opção | Descrição |
|---|---|
| Pasta da coleção | Pasta principal (por padrão, "Biblioteca"), dentro da qual ficam as subpastas de notas e de capas. Em branco, segue o padrão do idioma selecionado. |
| Pasta dos livros e quadrinhos | Subpasta (dentro da pasta da coleção) onde as notas de cada livro/quadrinho são criadas. Em branco, uma subpasta padrão dentro da pasta da coleção. |
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
