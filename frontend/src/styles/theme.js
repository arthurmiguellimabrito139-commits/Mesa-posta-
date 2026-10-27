// Cores, fontes e medidas do template (style-guide.md), num lugar só.
// Nos componentes: ${({ theme }) => theme.cores.terracota600}
export const theme = {
  cores: {
    n900: 'hsl(33, 15%, 15%)',
    n800: 'hsl(33, 22%, 20%)',
    n700: 'hsl(32, 20%, 29%)',
    n600: 'hsl(33, 17%, 41%)',
    n400: 'hsl(36, 22%, 86%)',
    n200: 'hsl(30, 24%, 93%)',
    n100: 'hsl(35, 60%, 96%)',
    n50: 'hsl(40, 60%, 98%)',
    n0: 'hsl(0, 0%, 100%)',

    sol500: 'hsl(42, 83%, 58%)',
    sol300: 'hsl(44, 84%, 75%)',
    sol200: 'hsl(45, 100%, 74%)',
    sol50: 'hsl(41, 100%, 93%)',

    terracota700: 'hsl(15, 69%, 37%)',
    terracota600: 'hsl(15, 74%, 41%)',
    terracota500: 'hsl(18, 62%, 47%)',
    terracota400: 'hsl(22, 72%, 56%)',

    azul: 'hsl(230, 49%, 56%)',
    rosa: 'hsl(340, 48%, 52%)',
    verde: 'hsl(150, 38%, 36%)',
  },
  fontes: {
    titulo: '"Fraunces", Georgia, serif',
    texto: '"DM Sans", system-ui, sans-serif',
    mono: '"DM Mono", ui-monospace, monospace',
  },
  sombra: '0 1px 2px hsla(33, 30%, 20%, .06), 0 12px 32px -12px hsla(25, 40%, 25%, .22)',
  raio: '1rem',
  mobile: '860px', // abaixo disso a sidebar vira barra no topo
};
