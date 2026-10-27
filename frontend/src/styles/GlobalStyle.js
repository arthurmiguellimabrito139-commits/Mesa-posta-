import { createGlobalStyle } from 'styled-components';

// Fontes locais (vieram do template, pasta public/fonts) + estilos base da página
export const GlobalStyle = createGlobalStyle`
  @font-face { font-family: "Fraunces"; src: url("/fonts/Fraunces.ttf") format("truetype"); font-style: normal; font-weight: 100 900; font-display: swap; }
  @font-face { font-family: "Fraunces"; src: url("/fonts/Fraunces-Italic.ttf") format("truetype"); font-style: italic; font-weight: 100 900; font-display: swap; }
  @font-face { font-family: "DM Sans"; src: url("/fonts/DMSans.ttf") format("truetype"); font-weight: 100 1000; font-display: swap; }
  @font-face { font-family: "DM Mono"; src: url("/fonts/DMMono-Regular.ttf") format("truetype"); font-weight: 400; font-display: swap; }
  @font-face { font-family: "DM Mono"; src: url("/fonts/DMMono-Medium.ttf") format("truetype"); font-weight: 500; font-display: swap; }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    background: ${({ theme }) => theme.cores.n100};
    color: ${({ theme }) => theme.cores.n900};
    font: 400 0.875rem/1.55 ${({ theme }) => theme.fontes.texto};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-weight: 400;
    margin: 0;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  p { margin: 0; }
  a { color: inherit; }
  button, input, select, textarea { font: inherit; color: inherit; }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.cores.terracota600};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  /* Na impressão do comprovante, some tudo que não é o comprovante */
  @media print {
    body { background: #fff; }
    .nao-imprimir { display: none !important; }
  }
`;
