# digital-font

Fonte de "display" em pixels para React: cada caractere é uma matriz `8×13` desenhada em um grid invisível, renderizada como quadrados. Glifos serifados, com zonas verticais para acento, ascendente, altura-x e descendente.

## Instalação

```bash
npm install digital-font
```

## Uso

```tsx
import { PixelText } from "digital-font";
import "digital-font/styles.css";

export function App() {
  return <PixelText text="HELLO" pixelSize={14} gap={2} color="#16a34a" />;
}
```

## Props de `PixelText`

| Prop            | Tipo               | Padrão         | Descrição                                  |
| --------------- | ------------------ | -------------- | ------------------------------------------ |
| `text`          | `string`           | —              | Texto a renderizar (obrigatório).          |
| `pixelSize`     | `number \| string` | `6px`          | Tamanho de cada pixel.                      |
| `gap`           | `number \| string` | `1px`          | Espaço entre pixels.                        |
| `letterSpacing` | `number \| string` | `pixelSize`    | Espaço entre caracteres.                    |
| `color`         | `string`           | `currentColor` | Cor do pixel aceso.                         |
| `offColor`      | `string`           | `transparent`  | Cor do pixel apagado.                       |
| `pixelShape`        | `PixelShape` | `dot`   | Forma do pixel: `dot`, `squircle`, `diamond`, `ring`, `square`. |
| `smartCorners`      | `boolean`    | `false` | Arredonda os cantos externos por vizinhança (só `square`/`squircle`). |
| `smoothness`        | `number`     | `0.6`   | Intensidade do arredondamento (`0` retrô → `1` orgânico).       |
| `proportional`      | `boolean`    | `true`  | Apara o side-bearing de cada glifo (kerning justo). `false` = monospace. |
| `spaceWidth`        | `number`     | `4`     | Largura do caractere de espaço, em células.                     |
| `letterSpacing`     | `number \| string` | `0.5` célula | Vão entre caracteres (aceita negativo p/ aproximar). |
| `fluid`             | `boolean`    | `false` | Largura segue o pai; altura mantém a proporção.                 |
| `gapRatio`          | `number`     | `0.16`  | Gap entre pixels como fração do pixel (modo fluido).            |
| `letterSpacingRatio`| `number`     | `0.5`   | Vão entre caracteres como fração do pixel (modo fluido).        |

## Kerning

Por padrão (`proportional`), cada glifo é aparado nas colunas vazias laterais e renderizado na sua largura de tinta real, com um vão pequeno e uniforme entre as letras — em vez do espaçamento largo e irregular do canvas monospace. O vão é ajustável via `letterSpacing` (e `letterSpacingRatio` no modo fluido), inclusive com valores negativos para sobrepor letras. Use `proportional={false}` para o visual monospace de display clássico.

## Largura fluida

No modo `fluid`, o componente vira um *container query context* (`container-type: inline-size`) com `width: 100%`, e o tamanho do pixel passa a ser `calc(100cqw / unidades)`. Como gaps e espaçamento são proporções do pixel, **tudo escala junto** — a largura preenche o pai e a altura acompanha mantendo a razão de aspecto, sem JavaScript de medição.

```tsx
<div style={{ width: "100%" }}>
  <PixelText text="Olá, Mundo!" fluid color="#fbbf24" />
</div>
```

## Animação por pixel

Todos os pixels (acesos e apagados) são renderizados como elementos no DOM. Cada pixel aceso expõe variáveis CSS para animar individualmente:

- `--df-i`: índice sequencial do pixel aceso no texto inteiro.
- `--df-n`: total de pixels acesos.
- `--df-row` / `--df-col`: posição do pixel na matriz do caractere.

Exemplo de varredura:

```css
.minha-classe .digital-font__pixel--on {
  animation: acende 1.6s ease-in-out infinite alternate;
  animation-delay: calc(var(--df-i) * 28ms);
}

@keyframes acende {
  from { opacity: 0.1; transform: scale(0.6); }
  to   { opacity: 1;   transform: scale(1); }
}
```

## Métrica do canvas (`8×13`)

| Linhas | Zona               |
| ------ | ------------------ |
| 0–1    | Acento             |
| 2–9    | Corpo das maiúsculas |
| 4–9    | Altura-x           |
| 10–12  | Descendentes       |

## Desenvolvimento

```bash
npm run dev            # demo visual
npm test               # testes
npm run test:coverage  # testes + cobertura
npm run build          # build da lib + tipos
```

## Status

Conjunto de glifos atual é um **piloto** para validar a estética serifada (`A E H I L O T`, `l o p`, `Á`, `.`, `!`, espaço). O charset completo (latino PT/ES/FR + pontuação) será desenhado em seguida, com composição base + diacrítico para os acentuados.
