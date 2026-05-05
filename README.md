# Cardápio Digital — Churrascaria Espaço Livre

Site mobile-first em **Next.js 14 (App Router) + TypeScript + Tailwind CSS** para servir como cardápio digital acessado por QR Code na mesa do restaurante.

- Sem backend — dados estáticos em `lib/menu.ts`.
- Imagens via `next/image` (Unsplash).
- Otimizado para Lighthouse 95+ em mobile.
- Pronto para deploy na **Vercel**.

---

## 1. Como rodar localmente

Requer Node.js 18.17+.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — o layout é pensado para um container de **480px** centralizado (use o DevTools no modo mobile).

Outros scripts:

```bash
npm run build      # build de produção
npm start          # serve a build
npm run type-check # tsc --noEmit
npm run lint       # next lint
```

---

## 2. Como trocar o logo

Substitua `public/logo.png` pelo seu logo. Recomendado:

- PNG/SVG quadrado (transparente).
- Pelo menos **256×256 px**.
- Aparece dentro de um quadrado branco 56×56 com cantos arredondados.

> Não precisa mexer em código.

---

## 3. Como editar o cardápio

Tudo está em `lib/menu.ts`. Cada categoria tem este formato:

```ts
{
  id: 'pizzas',          // identificador único (slug)
  name: 'Pizzas',        // título exibido
  icon: '🍕',            // emoji
  subtitle: 'Pequena | Grande', // opcional
  items: [
    { name: 'Mussarela', desc: '...', sizes: [31, 51], img: '...' },
  ],
}
```

Tipos de preço suportados em `MenuItem`:

| Campo     | Quando usar                        | Exemplo               |
|-----------|------------------------------------|-----------------------|
| `price`   | Preço único                        | `price: 18`           |
| `sizes`   | Pizza com 2 tamanhos `[P, G]`      | `sizes: [31, 51]`     |
| `sizes3`  | Churrasco `[1kg, 500g, 300g]`      | `sizes3: [190, 105, 75]` |

Imagens podem vir de qualquer URL `https://images.unsplash.com/...`. Para liberar outro domínio, edite `next.config.js` (`images.remotePatterns`).

A ordem das categorias no array é a ordem que aparece na tela.

---

## 4. Deploy na Vercel

A forma mais rápida:

1. Crie um repo no GitHub e faça `git push`.
2. Em https://vercel.com/new, importe o repositório.
3. **Framework Preset:** Next.js (detectado automaticamente).
4. **Build Command / Install / Output:** padrões da Vercel.
5. Clique em **Deploy**.

A Vercel devolve uma URL como `https://espaco-livre.vercel.app`. Depois você pode plugar um domínio próprio (Settings → Domains).

Sem variáveis de ambiente. Não precisa de banco.

---

## 5. Como gerar o QR Code para a mesa

Depois do deploy, pegue a URL final (ex.: `https://espaco-livre.vercel.app`) e gere um QR Code:

- **Online (rápido):** https://www.qr-code-generator.com/ ou https://qrcode-monkey.com/ — cole a URL, exporte em PNG/SVG **alta resolução**.
- **Linha de comando:**

  ```bash
  npx qrcode "https://espaco-livre.vercel.app" -o mesa.png -w 1024
  ```

Imprima em **acabamento fosco**, no mínimo 4×4 cm na mesa, com a mensagem _"Aponte a câmera para ver o cardápio"_.

> Dica: se trocar o domínio depois, **regenere o QR**. Os antigos param de funcionar.

---

## Estrutura

```
app/
  layout.tsx          # html, fonte, viewport, theme-color
  page.tsx            # monta Hero + MenuView
  globals.css         # tailwind + reset + reduced-motion
components/
  Hero.tsx            # banner com gradiente vermelho→laranja
  SearchBar.tsx       # busca (client)
  CategoryChips.tsx   # chips sticky (client)
  CategorySection.tsx # cabeçalho de seção + lista
  MenuItemRow.tsx     # cada item (foto + preço)
  PriceBadge.tsx      # badge P/G/1kg/500g/300g
  MenuView.tsx        # client wrapper que orquestra busca+filtro
lib/
  menu.ts             # dados do cardápio
public/
  logo.png            # logo no canto superior do hero
```
