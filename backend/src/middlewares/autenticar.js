import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
  // o header chega assim: "Bearer eyJhbGciOi..."
  const [tipo, token] = (req.get('authorization') || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faça login para continuar.' });
  }

  try {
    // confere a assinatura E a validade. O algorithms fixa o tipo de assinatura aceito.
    const dados = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.usuario = { id: dados.id, nome: dados.nome, email: dados.email };
    next();
  } catch {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login de novo.' });
  }
}

export function autenticarOpcional(req, res, next) {
  const [tipo, token] = (req.get('authorization') || '').split(' ');

  if (tipo === 'Bearer' && token) {
    try {
      const dados = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      req.usuario = { id: dados.id, nome: dados.nome, email: dados.email };
    } catch {
      // token inválido numa rota pública: trata como visitante
    }
  }
  next();
}