USE mesa_posta;

-- 1. tabela de usuários (quem organiza eventos)
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(80)  NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  senha_hash  VARCHAR(100) NOT NULL,
  criado_em   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 2. cada evento ganha um dono
ALTER TABLE events
  ADD COLUMN usuario_id INT NULL,
  ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;