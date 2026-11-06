-- MySQL 8.0.16+; importação não apaga dados existentes. Não inclui contas fictícias.
CREATE DATABASE IF NOT EXISTS alimenta_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE alimenta_plus;
CREATE TABLE IF NOT EXISTS usuarios (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(120) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 telefone VARCHAR(25) NOT NULL,
 senha_hash VARCHAR(255) NOT NULL,
 tipo_usuario ENUM('DOADOR','RECEPTOR') NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS alimentos (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 doador_id INT UNSIGNED NOT NULL,
 nome VARCHAR(120) NOT NULL,
 descricao TEXT NOT NULL,
 categoria VARCHAR(50) NOT NULL,
 quantidade DECIMAL(10,3) NOT NULL,
 unidade VARCHAR(25) NOT NULL,
 data_validade DATE NOT NULL,
 cidade VARCHAR(100) NOT NULL,
 bairro VARCHAR(100) NOT NULL,
 endereco_retirada VARCHAR(255) NOT NULL,
 informacoes_adicionais TEXT NOT NULL,
 imagem_url VARCHAR(2048) NULL,
 status ENUM('ATIVO','EXCLUIDO') NOT NULL DEFAULT 'ATIVO',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_alimento_doador FOREIGN KEY (doador_id) REFERENCES usuarios(id),
 CONSTRAINT ck_quantidade CHECK (quantidade > 0),
 INDEX idx_catalogo(status, data_validade, categoria),
 INDEX idx_doador(doador_id, created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS solicitacoes (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 alimento_id INT UNSIGNED NOT NULL,
 receptor_id INT UNSIGNED NOT NULL,
 quantidade_solicitada DECIMAL(10,3) NOT NULL,
 status ENUM('PENDENTE','APROVADA','RECUSADA','CANCELADA','ENTREGUE') NOT NULL DEFAULT 'PENDENTE',
 -- Uma única solicitação ativa por receptor/oferta; histórico encerrado pode repetir.
 receptor_ativo INT UNSIGNED GENERATED ALWAYS AS
  (CASE WHEN status IN ('PENDENTE','APROVADA') THEN receptor_id ELSE NULL END) STORED,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_solicitacao_alimento FOREIGN KEY (alimento_id) REFERENCES alimentos(id),
 CONSTRAINT fk_solicitacao_receptor FOREIGN KEY (receptor_id) REFERENCES usuarios(id),
 CONSTRAINT ck_quantidade_solicitada CHECK (quantidade_solicitada > 0),
 UNIQUE KEY uk_solicitacao_ativa(alimento_id, receptor_ativo),
 INDEX idx_estoque(alimento_id, status),
 INDEX idx_receptor(receptor_id, created_at)
) ENGINE=InnoDB;
