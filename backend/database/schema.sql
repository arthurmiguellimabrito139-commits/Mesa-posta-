CREATE DATABASE IF NOT EXISTS mesa_posta;
USE mesa_posta;

-- classe Evento
CREATE TABLE IF NOT EXISTS events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(12) NOT NULL UNIQUE,
  admin_token VARCHAR(64) NOT NULL,
  name        VARCHAR(80) NOT NULL,
  date        DATE        NOT NULL,
  time        VARCHAR(5)  NOT NULL DEFAULT '20:00',
  location    VARCHAR(80) NULL
);

-- classe Mesa
CREATE TABLE IF NOT EXISTS event_tables (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  event_id  INT NOT NULL,
  number    INT NOT NULL,
  seats     INT NOT NULL CHECK (seats BETWEEN 2 AND 16),
  UNIQUE (event_id, number),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- classe Pessoa (cada linha ocupa uma cadeira)
CREATE TABLE IF NOT EXISTS pessoas (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  event_id  INT          NOT NULL,
  mesa_id   INT          NULL,
  nome      VARCHAR(80)  NOT NULL,
  email     VARCHAR(120) NULL,
  telefone  VARCHAR(20)  NULL,
  FOREIGN KEY (event_id) REFERENCES events(id)       ON DELETE CASCADE,
  FOREIGN KEY (mesa_id)  REFERENCES event_tables(id) ON DELETE SET NULL
);