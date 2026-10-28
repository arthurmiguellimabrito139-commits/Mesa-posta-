export function erroInterno(res, erro) {
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno. Tente de novo em instantes.' });
}