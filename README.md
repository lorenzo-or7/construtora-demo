# ATRIUM: Engenharia & Incorporação

Protótipo comercial da Or7.dev. Website de uma construtora **fictícia** de alto padrão, com o conceito *Architecture in Motion*.

Marca, empreendimentos, localizações, status e indicadores são demonstrativos. As fotografias vêm da Unsplash (Licença Unsplash) e não retratam projetos da marca.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run typecheck  # TypeScript estrito
npm test           # testes de validação/sanitização do formulário (Vitest)
npm run build      # build de produção em dist/
npm run preview    # serve o build
```

## Stack

React 18 + TypeScript (strict) · Vite · CSS Modules + tokens em `src/styles/tokens.css` · Motion · Lucide · React Router · fontes self-hosted (Fontsource: Instrument Serif e Manrope).

Lenis **não** foi usado: a rolagem nativa mantém a acessibilidade e evita scroll hijacking. Os efeitos de percurso horizontal e timeline usam `position: sticky` + `useScroll`, sem interceptar a roda do mouse.

## Estrutura

```
src/
  components/   Hero, Nav, Manifesto, Developments, Process, Materials,
                LivingGallery, Lightbox, Philosophy, Contact, Footer,
                Img (srcset + placeholder), Reveal (motion primitives), Logo
  pages/        Home, ProjectPage (rota /empreendimentos/:slug), InfoPage
  data/         projects.ts (conteúdo fictício), image-meta.json (gerado)
  hooks/        tema persistente, media query, seção ativa, scroll lock
  lib/          contact.ts (validação, sanitização, WhatsApp) + testes
scripts/        fetch-images.mjs (baixa e otimiza fotos), make-og.mjs
public/images/  WebP 800/1600 px
```

## Limitações conhecidas

- **WhatsApp:** nenhum número real foi configurado. Com `WHATSAPP_NUMBER` vazio (`src/lib/contact.ts`), o link `wa.me/?text=` abre o WhatsApp para o visitante escolher o contato. Para produção, preencha o número.
- **Formulário:** não há backend. A mensagem é preparada e só é enviada se o visitante confirmar no WhatsApp. Não há simulação de envio.
- **Deploy:** rotas usam `BrowserRouter`. O servidor precisa de fallback SPA para `index.html` (Vercel/Netlify fazem isso com uma regra de rewrite).
- **Crédito Or7.dev:** o rodapé aponta para `https://or7.dev`. Ajuste se o domínio oficial for outro.
- `axe-core` está em devDependencies apenas para auditoria de acessibilidade durante o desenvolvimento.

## GitHub Pages

Repositório: `construtora-demo`.
Configure Settings > Pages > GitHub Actions.
O deploy inclui suporte a rotas internas via `404.html`.

URL: https://lorenzo-or7.github.io/construtora-demo/
