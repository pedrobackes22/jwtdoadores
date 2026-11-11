-- REVISÃO DO BANCO EXISTENTE — Alimenta+, 11/11/2026, MySQL 8.0.16+.
-- Nenhuma alteração estrutural necessária no banco real inspecionado (MySQL 8.0.46).
-- Este arquivo NÃO é uma migração para schemas desconhecidos ou incompletos.
-- Apenas diagnóstico: não cria/altera tabelas nem modifica registros.
-- Atenção: foram encontradas 3 unidades antigas fora das opções atuais.
-- Não é possível deduzir a unidade correta de '11', '2,5kg' e 'kgaaa'.
-- A unidade e a quantidade devem ser confirmadas antes de qualquer correção de dados.
-- Nenhuma conversão automática está incluída; os registros foram preservados.
-- Execute inteiro no Workbench conectado ao banco existente.
USE alimenta_plus;
START TRANSACTION READ ONLY;

SELECT 'Somente diagnostico: nenhuma alteracao executada.' AS resultado;
SELECT VERSION() AS versao_mysql, DATABASE() AS banco, @@sql_mode AS sql_mode;

SELECT TABLE_NAME AS tabela, ENGINE AS engine, TABLE_COLLATION AS collation_tabela
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('usuarios', 'alimentos', 'solicitacoes')
ORDER BY TABLE_NAME;

SELECT TABLE_NAME AS tabela, COLUMN_NAME AS coluna, COLUMN_TYPE AS tipo,
       IS_NULLABLE AS aceita_null, COLUMN_DEFAULT AS valor_padrao,
       EXTRA AS extra, GENERATION_EXPRESSION AS expressao_gerada
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('usuarios', 'alimentos', 'solicitacoes')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

SELECT TABLE_NAME AS tabela, INDEX_NAME AS indice, NON_UNIQUE AS nao_unico,
       GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS colunas
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('usuarios', 'alimentos', 'solicitacoes')
GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
ORDER BY TABLE_NAME, INDEX_NAME;

SELECT k.TABLE_NAME AS tabela, k.CONSTRAINT_NAME AS chave,
       k.COLUMN_NAME AS coluna, k.REFERENCED_TABLE_NAME AS referencia,
       k.REFERENCED_COLUMN_NAME AS coluna_referenciada, r.UPDATE_RULE, r.DELETE_RULE
FROM information_schema.KEY_COLUMN_USAGE k
JOIN information_schema.REFERENTIAL_CONSTRAINTS r
  ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
  AND r.TABLE_NAME = k.TABLE_NAME
WHERE k.CONSTRAINT_SCHEMA = DATABASE()
  AND k.TABLE_NAME IN ('usuarios', 'alimentos', 'solicitacoes')
ORDER BY k.TABLE_NAME, k.CONSTRAINT_NAME;

SELECT t.TABLE_NAME AS tabela, t.CONSTRAINT_NAME AS restricao,
       c.CHECK_CLAUSE AS expressao, t.ENFORCED AS aplicada
FROM information_schema.TABLE_CONSTRAINTS t
JOIN information_schema.CHECK_CONSTRAINTS c
  ON c.CONSTRAINT_SCHEMA = t.CONSTRAINT_SCHEMA AND c.CONSTRAINT_NAME = t.CONSTRAINT_NAME
WHERE t.CONSTRAINT_SCHEMA = DATABASE()
  AND t.TABLE_NAME IN ('usuarios', 'alimentos', 'solicitacoes')
ORDER BY t.TABLE_NAME, t.CONSTRAINT_NAME;

SELECT 'usuarios' AS tabela, COUNT(*) AS registros FROM usuarios
UNION ALL SELECT 'alimentos', COUNT(*) FROM alimentos
UNION ALL SELECT 'solicitacoes', COUNT(*) FROM solicitacoes;

-- Todos os resultados de inconsistencias devem ser zero.
-- Apenas totais: não retorna nomes, e-mails, endereços, senhas ou hashes.
SELECT 'usuarios_campos_invalidos' AS verificacao, COUNT(*) AS inconsistencias
FROM usuarios WHERE TRIM(nome) = '' OR TRIM(email) = '' OR TRIM(telefone) = ''
  OR tipo_usuario NOT IN ('DOADOR', 'RECEPTOR')
UNION ALL
SELECT 'hash_fora_do_formato_bcrypt', COUNT(*) FROM usuarios
WHERE NOT REGEXP_LIKE(senha_hash, '^[$]2[aby][$][0-9]{2}[$][./A-Za-z0-9]{53}$', 'c')
UNION ALL
SELECT 'emails_duplicados', COUNT(*) FROM (
  SELECT email FROM usuarios GROUP BY email HAVING COUNT(*) > 1
) duplicados
UNION ALL
SELECT 'alimentos_doador_invalido', COUNT(*) FROM alimentos a
LEFT JOIN usuarios u ON u.id = a.doador_id
WHERE u.id IS NULL OR u.tipo_usuario <> 'DOADOR'
UNION ALL
SELECT 'alimentos_quantidade_invalida', COUNT(*) FROM alimentos WHERE quantidade <= 0
UNION ALL
SELECT 'alimentos_campos_invalidos', COUNT(*) FROM alimentos
WHERE TRIM(nome) = '' OR TRIM(cidade) = '' OR TRIM(bairro) = '' OR TRIM(endereco_retirada) = ''
  OR status NOT IN ('ATIVO', 'EXCLUIDO') OR YEAR(data_validade) = 0
UNION ALL
SELECT 'unidades_fora_das_opcoes_atuais', COUNT(*) FROM alimentos
WHERE BINARY unidade NOT IN ('kg', 'g', 'unidades', 'litros', 'pacotes')
UNION ALL
SELECT 'categorias_fora_das_opcoes_atuais', COUNT(*) FROM alimentos
WHERE BINARY categoria NOT IN ('Frutas', 'Verduras e legumes', 'Pães', 'Grãos e cereais', 'Laticínios', 'Alimentos não perecíveis', 'Outros')
UNION ALL
SELECT 'solicitacoes_alimento_inexistente', COUNT(*) FROM solicitacoes s
LEFT JOIN alimentos a ON a.id = s.alimento_id WHERE a.id IS NULL
UNION ALL
SELECT 'solicitacoes_receptor_invalido', COUNT(*) FROM solicitacoes s
LEFT JOIN usuarios u ON u.id = s.receptor_id
WHERE u.id IS NULL OR u.tipo_usuario <> 'RECEPTOR'
UNION ALL
SELECT 'solicitacoes_quantidade_ou_status_invalidos', COUNT(*) FROM solicitacoes
WHERE quantidade_solicitada <= 0 OR status NOT IN ('PENDENTE', 'APROVADA', 'RECUSADA', 'CANCELADA', 'ENTREGUE')
UNION ALL
SELECT 'pedidos_ativos_duplicados', COUNT(*) FROM (
  SELECT alimento_id, receptor_id FROM solicitacoes
  WHERE status IN ('PENDENTE', 'APROVADA')
  GROUP BY alimento_id, receptor_id HAVING COUNT(*) > 1
) pedidos_duplicados
UNION ALL
SELECT 'receptor_ativo_inconsistente', COUNT(*) FROM solicitacoes
WHERE NOT (receptor_ativo <=> CASE WHEN status IN ('PENDENTE', 'APROVADA') THEN receptor_id ELSE NULL END)
UNION ALL
SELECT 'estoque_negativo', COUNT(*) FROM alimentos a
JOIN (
  SELECT alimento_id, SUM(quantidade_solicitada) AS comprometida
  FROM solicitacoes WHERE status IN ('APROVADA', 'ENTREGUE') GROUP BY alimento_id
) s ON s.alimento_id = a.id WHERE s.comprometida > a.quantidade
UNION ALL
SELECT 'oferta_excluida_com_pedido_ativo', COUNT(*) FROM solicitacoes s
JOIN alimentos a ON a.id = s.alimento_id
WHERE a.status = 'EXCLUIDO' AND s.status IN ('PENDENTE', 'APROVADA')
UNION ALL
SELECT 'alimentos_datas_invertidas', COUNT(*) FROM alimentos WHERE updated_at < created_at
UNION ALL
SELECT 'solicitacoes_datas_invertidas', COUNT(*) FROM solicitacoes WHERE updated_at < created_at;

-- Disponibilidade é calculada, não uma coluna que deva ser adicionada.
-- Localiza unidades antigas sem expor dados pessoais. Não tenta adivinhar correções.
SELECT a.id AS alimento_id, a.unidade AS unidade_atual, a.status,
       (SELECT COUNT(*) FROM solicitacoes s WHERE s.alimento_id = a.id) AS solicitacoes_associadas
FROM alimentos a
WHERE BINARY a.unidade NOT IN ('kg', 'g', 'unidades', 'litros', 'pacotes')
ORDER BY a.id;

-- Vencimento não é inconsistência: ofertas vencidas ficam no histórico.
SELECT a.id AS alimento_id, a.status, a.data_validade, a.quantidade AS total_publicado,
       COALESCE(s.reservada, 0) AS reservada, COALESCE(s.entregue, 0) AS entregue,
       a.quantidade - COALESCE(s.reservada, 0) - COALESCE(s.entregue, 0) AS disponivel
FROM alimentos a
LEFT JOIN (
  SELECT alimento_id,
    SUM(CASE WHEN status = 'APROVADA' THEN quantidade_solicitada ELSE 0 END) AS reservada,
    SUM(CASE WHEN status = 'ENTREGUE' THEN quantidade_solicitada ELSE 0 END) AS entregue
  FROM solicitacoes GROUP BY alimento_id
) s ON s.alimento_id = a.id
ORDER BY a.id;

COMMIT;
