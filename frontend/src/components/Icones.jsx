// Ícones em SVG, no mesmo traço fino dos ícones do template.
// currentColor = herdam a cor do texto onde estão.
const base = {
  width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconeSol = ({ tamanho = 34 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <g stroke="#c25a2e" strokeWidth="1.275">
      <path fill="#f5d98a" d="M17 22.95a5.95 5.95 0 1 0 0-11.9 5.95 5.95 0 0 0 0 11.9Z" />
      <path strokeLinecap="round" d="M26.35 17h4.25m-6.989 6.611 3.006 3.006M17 26.35v4.25m-6.611-6.989-3.006 3.006M7.65 17H3.4m6.989-6.611-3.006-3.006M17 7.65V3.4m6.611 6.989 3.006-3.006" />
    </g>
  </svg>
);

export const IconeSolBranco = () => (
  <svg width="48" height="48" viewBox="0 0 49 49" fill="none" aria-hidden="true">
    <g stroke="#ffde7a" strokeWidth="1.837">
      <path fill="#edb63a" d="M24.5 33.074a8.575 8.575 0 1 0 0-17.149 8.575 8.575 0 0 0 0 17.15Z" />
      <path strokeLinecap="round" d="M37.975 24.5H44.1m-10.072 9.528 4.331 4.331M24.5 37.975V44.1m-9.529-10.072-4.33 4.331m.384-13.859H4.9m10.071-9.528-4.33-4.331m13.859.384V4.9m9.528 10.072 4.331-4.331" />
    </g>
  </svg>
);

export const IconeMenu = () => (
  <svg {...base}><path d="M3.333 15.833h13.334M3.333 4.167h13.334M3.333 10h13.334" /></svg>
);

export const IconeFechar = () => (
  <svg {...base}><path d="m5 5 10 10m0-10L5 15" /></svg>
);

export const IconeMais = () => (
  <svg {...base}><path d="M10 4v12M4 10h12" /></svg>
);

export const IconeMesa = (p) => (
  <svg {...base} {...p}>
    <circle cx="10" cy="10" r="4" />
    <circle cx="10" cy="2.8" r="1.3" /><circle cx="10" cy="17.2" r="1.3" />
    <circle cx="2.8" cy="10" r="1.3" /><circle cx="17.2" cy="10" r="1.3" />
  </svg>
);

export const IconePessoas = (p) => (
  <svg {...base} {...p}>
    <circle cx="7.5" cy="7" r="2.6" /><path d="M2.8 16.2c.6-2.6 2.5-4.1 4.7-4.1s4.1 1.5 4.7 4.1" />
    <circle cx="13.6" cy="7.8" r="2.1" /><path d="M13.4 12.1c1.9 0 3.4 1.2 3.9 3.3" />
  </svg>
);

export const IconeRelogio = (p) => (
  <svg {...base} {...p}><circle cx="10" cy="10" r="7" /><path d="M10 6.2V10l2.6 1.6" /></svg>
);

export const IconeLocal = (p) => (
  <svg {...base} {...p}>
    <path d="M3.979 9.022c0 4.284 5.057 8.378 6.02 8.378.964 0 6.021-4.094 6.021-8.378a6.02 6.02 0 1 0-12.041 0" />
    <path d="M12.006 8.972a2.006 2.006 0 1 0-4.013 0 2.006 2.006 0 0 0 4.013 0" />
  </svg>
);

export const IconeCasa = (p) => (
  <svg {...base} {...p}>
    <path d="M3.748 7.313v7.229A2.553 2.553 0 0 0 6.3 17.095h7.4a2.553 2.553 0 0 0 2.552-2.553v-7.23" />
    <path d="m17.5 8.297-6.272-4.965a1.98 1.98 0 0 0-2.456 0L2.5 8.297" />
  </svg>
);

export const IconeIngresso = (p) => (
  <svg {...base} {...p}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h11A1.5 1.5 0 0 1 17 6.5v1.8a1.8 1.8 0 0 0 0 3.4v1.8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 13.5v-1.8a1.8 1.8 0 0 0 0-3.4z" />
    <path d="M12 5v10" strokeDasharray="1.5 1.8" />
  </svg>
);

export const Brilho = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
    <path fill="#b7411b" d="M3.64 7.68q-.11-.65-.58-1.4-.47-.76-1.34-1.41Q.86 4.22 0 4.04v-.42a4.8 4.8 0 0 0 1.63-.74 5.2 5.2 0 0 0 1.32-1.32Q3.49.77 3.64 0h.42q.09.5.36 1.03.27.52.69 1 .43.47.96.85.79.56 1.61.74v.42a3.8 3.8 0 0 0-1.14.45 6 6 0 0 0-1.08.81 4.8 4.8 0 0 0-.82.97q-.47.75-.58 1.41z" />
  </svg>
);

// Código de barras do recibo (o mesmo desenho do template)
export const CodigoDeBarras = () => (
  <svg width="93" height="28" viewBox="0 0 93 28" aria-hidden="true">
    <g fill="#2b2620">
      {[[0, 3], [5, 2, .78], [9, 4, .78], [15, 1], [18, 3], [23, 2, .78], [27, 5], [34, 2], [38, 3, .78], [43, 1], [46, 4], [52, 2, .78], [56, 3], [61, 5], [68, 2, .78], [72, 3], [77, 1, .78], [80, 4], [86, 2], [90, 3, .78]]
        .map(([x, w, o = 1]) => <rect key={x} x={x} y="0" width={w} height="28" opacity={o} />)}
    </g>
  </svg>
);
