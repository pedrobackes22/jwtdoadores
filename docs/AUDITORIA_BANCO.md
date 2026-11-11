# Revisão MySQL — Alimenta+

Data: 11/11/2026. Banco real consultado: `alimenta_plus`, MySQL **8.0.46**. A revisão usou metadados, `SHOW CREATE TABLE` e consultas de leitura. O diagnóstico foi executado dentro de `START TRANSACTION READ ONLY`. Não foram executadas alterações estruturais ou de registros no banco real.

## Conclusão

**Nenhuma atualização estrutural é necessária.** As três tabelas e todas as colunas usadas pelo backend estão presentes com tipos compatíveis. Não é necessário criar uma quarta tabela nem colunas de saldo/JWT. Existem, porém, **três registros antigos com unidades inválidas para o formulário/API atuais**. Isso é uma pendência de qualidade dos dados, não ausência de coluna ou relacionamento. Nenhuma correção foi presumida ou executada.

Contagens no momento da consulta: **5 usuários, 4 alimentos e 2 solicitações**. Essas contagens podem mudar com o uso normal do aplicativo.

## Arquivos e execução no Workbench

### Banco atual: `database/atualizacao_alimenta_plus.sql`

O nome solicitado foi mantido, mas o conteúdo é **somente diagnóstico**, pois não há mudança estrutural necessária. Não contém comandos de escrita ou criação de objetos. Não é uma migração genérica para um schema antigo desconhecido.

1. Abra a conexão do MySQL que contém seu banco atual.
2. Use **File → Open SQL Script** e abra o arquivo, ou copie **todo o conteúdo** para uma aba SQL nova.
3. Execute o script inteiro pelo botão de raio correspondente a executar tudo/seleção. Não execute apenas a consulta sob o cursor.
4. Confira os conjuntos de resultados nas abas **Result Grid** e o painel **Action Output**. O script já seleciona `alimenta_plus` e encerra sua transação com `COMMIT`; como ela é somente leitura, não há dados alterados para confirmar.
5. Se interromper a execução antes do fim, encerre a transação dessa aba com `ROLLBACK` ou feche a sessão antes de fazer outra operação.

Resultados esperados para o banco inspecionado:

| Resultado | O que conferir |
| --- | --- |
| Identificação | `banco = alimenta_plus`, versão MySQL 8.0.16 ou superior. |
| Tabelas | `usuarios`, `alimentos`, `solicitacoes`, todas InnoDB/utf8mb4. |
| Colunas | 7 em usuários, 16 em alimentos, 9 em solicitações, incluindo `receptor_ativo` gerado. |
| Índices | 3 PKs, UNIQUE de e-mail, UNIQUE de pedido ativo e índices de catálogo/doador/estoque/receptor. |
| Relacionamentos | 3 FKs, apontando para IDs `INT UNSIGNED`, sem cascata de remoção. |
| Restrições CHECK | Duas restrições positivas com `aplicada = YES`. |
| Integridade | `inconsistencias = 0` em todas as linhas, **exceto unidades: 3**, enquanto os registros antigos não forem corrigidos. |
| Unidades antigas | IDs 1, 2 e 3, com seus valores atuais e contagem de solicitações. |
| Estoque | Nenhum `disponivel` negativo; ofertas 3 e 4 com saldo 2 e 7 no momento da revisão. |

Se os resultados diferirem, revise a diferença antes de qualquer alteração. O arquivo informa achados; ele não corrige registros ou garante que outro banco com o mesmo nome tenha o schema esperado.

### Outro computador: `database/estrutura_final_alimenta_plus.sql`

1. Conecte-se a uma instância MySQL 8.0.16+ onde esse banco ainda não exista. Use uma conta com permissão de criar banco/tabelas.
2. Abra o arquivo ou copie todo o SQL para uma aba nova e execute inteiro.
3. Atualize **Schemas**, abra `alimenta_plus → Tables` e confira as três tabelas e seus relacionamentos. Uma instalação nova começa com **zero registros** nas três tabelas.
4. Configure o `backend/.env` desse computador com `DB_NAME=alimenta_plus`, usuário/senha locais e segredo JWT próprio. Não copie credenciais para o SQL.
5. Inicie a API e cadastre contas pela interface. Não existem contas demonstrativas no script.

O script completo instala **estrutura, não dados**. Para transportar registros, é necessário um backup/exportação separado. `IF NOT EXISTS` permite repetir a instalação sem apagar dados, mas não transforma automaticamente tabelas incompatíveis. Não é preciso executar a instalação completa no seu banco atual.

O arquivo original `database/alimenta_plus.sql` foi preservado. O novo arquivo explicita charset/collation nas tabelas para uma instalação previsível. O banco real usa `utf8mb4_0900_ai_ci`, enquanto os scripts usam `utf8mb4_unicode_ci`; ambas são compatíveis com as consultas atuais, mas não têm regras de ordenação idênticas. Não foi proposta conversão porque ela não é necessária e poderia afetar comparação de dados/índices únicos.

## Pendência real: unidades antigas

| Alimento (ID) | Unidade atual | Status | Solicitações associadas |
| --- | --- | --- | --- |
| 1 | `11` | EXCLUIDO | 0 |
| 2 | `2,5kg` | EXCLUIDO | 0 |
| 3 | `kgaaa` | ATIVO | 1 |

As opções atuais são `kg`, `g`, `unidades`, `litros` e `pacotes`. Não se pode concluir se `2,5kg` significa unidade kg, quantidade 2,5 ou outra informação, nem o significado de `11` e `kgaaa`. Por isso não há `UPDATE` automático no script. Uma correção futura exige confirmar a unidade e, se necessário, a quantidade e as solicitações vinculadas, além de autorização explícita para escrever no banco real.

O backend impede mudar a unidade de oferta com solicitações. No ID 3, a validação de unidade atual e a proteção do histórico podem impedir salvar uma edição pelo formulário; isso deve ser resolvido como correção de dados validada, sem relaxar permissões ou substituir valores por adivinhação. Os outros dois registros estão excluídos logicamente e foram mantidos no histórico.

## Campos, tipos e compatibilidade

| Entidade | Campos verificados | Relação com o backend |
| --- | --- | --- |
| `usuarios` | `id INT UNSIGNED AUTO_INCREMENT`; `nome VARCHAR(120)`; `email VARCHAR(190) UNIQUE`; `telefone VARCHAR(25)`; `senha_hash VARCHAR(255)`; `tipo_usuario ENUM('DOADOR','RECEPTOR')`; `created_at TIMESTAMP` | `authController` cadastra e consulta pelos mesmos nomes; bcrypt é armazenado em `senha_hash`. Middleware consulta perfil/papel atual. Nenhuma senha original é necessária no schema. |
| `alimentos` | `id`, `doador_id`; `nome VARCHAR(120)`; `descricao TEXT`; `categoria VARCHAR(50)`; `quantidade DECIMAL(10,3)`; `unidade VARCHAR(25)`; `data_validade DATE`; `cidade/bairro VARCHAR(100)`; `endereco_retirada VARCHAR(255)`; `informacoes_adicionais TEXT`; `imagem_url VARCHAR(2048) NULL`; status ATIVO/EXCLUIDO; `created_at`, `updated_at` | Whitelist de `validarAlimento` coincide com as colunas inseridas/editadas. Endereço pode ser ocultado na resposta sem ser removido do banco. Imagem é URL, não arquivo binário; nenhuma tabela de imagens é necessária. |
| `solicitacoes` | `id`, `alimento_id`, `receptor_id`; `quantidade_solicitada DECIMAL(10,3)`; status PENDENTE/APROVADA/RECUSADA/CANCELADA/ENTREGUE; `receptor_ativo` gerado STORED; `created_at`, `updated_at` | INSERT usa IDs e quantidade; status inicial PENDENTE é default. PATCH atualiza status e MySQL atualiza `updated_at`. Coluna gerada não é enviada pelo cliente. |

Todos os campos são NOT NULL, exceto imagem e `receptor_ativo`. Campos opcionais de descrição/observação são enviados como texto vazio pela validação, compatível com TEXT NOT NULL. DATE guarda dia civil; o pool usa `dateStrings: true` e a aplicação compara validade no dia de Brasília. Os TIMESTAMPs registram criação/última atualização, não um histórico de cada transição; auditoria histórica detalhada não faz parte das funcionalidades atuais.

## Chaves, restrições e índices

- PK auto incremental nas três tabelas; FKs também `INT UNSIGNED`.
- `fk_alimento_doador`: alimentos → usuários.
- `fk_solicitacao_alimento`: solicitações → alimentos.
- `fk_solicitacao_receptor`: solicitações → usuários.
- Sem exclusão em cascata. A exclusão da oferta no aplicativo é lógica (`UPDATE status='EXCLUIDO'`), preservando referências.
- E-mail único e coluna gerada `receptor_ativo`: assume o receptor apenas em pedidos pendentes/aprovados e NULL nos encerrados. UNIQUE `(alimento_id,receptor_ativo)` impede duplicação ativa e permite novos pedidos após encerramento.
- CHECK `quantidade > 0` e `quantidade_solicitada > 0`, ambas ENFORCED no banco real.
- `idx_catalogo(status,data_validade,categoria)` atende filtro base do catálogo; `idx_doador(doador_id,created_at)` atende consultas por proprietário; `idx_estoque(alimento_id,status)` apoia saldo; `idx_receptor(receptor_id,created_at)` apoia listagem por receptor.
- Busca com `LIKE '%termo%'`, agregação de saldo e algumas ordenações podem exigir varredura/ordenação. Isso não é incompatibilidade nem justifica novos índices sem medição em volume representativo. Nenhum benchmark de carga foi realizado.

As regras de CHECK são efetivamente aplicadas a partir do MySQL 8.0.16, conforme o [manual oficial de CHECK](https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html). A instalação utiliza [coluna gerada STORED](https://dev.mysql.com/doc/refman/8.0/en/create-table-generated-columns.html) para a unicidade condicional. Execução prática desta revisão: MySQL 8.0.46; não houve execução em todas as versões intermediárias.

## Estoque, regras e limites de responsabilidade

Saldo = total publicado − soma APROVADA − soma ENTREGUE. PENDENTE não reserva. Aprovar reserva; recusar libera reserva; entregar converte reserva em consumo definitivo. Não é necessário armazenar três colunas derivadas, que poderiam divergir entre si.

O backend trava a linha do alimento antes da solicitação (`FOR UPDATE`) e usa transação READ COMMITTED. A leitura do saldo acontece depois de obter o bloqueio, para considerar confirmações anteriores. Os testes concorrentes aprovam apenas um de dois pedidos que juntos excedem o saldo. Edição impede reduzir total abaixo do comprometido e impede trocar a unidade após existir pedido. Exclusão lógica bloqueia reservas aprovadas e recusa pendências. Novos pedidos/aprovações vencidos são bloqueados; registros vencidos permanecem no histórico.

FKs garantem existência dos usuários, não seu papel. O middleware/controllers garantem que doador/receptor/proprietário sejam adequados. Unidades/categorias, limite de precisão, datas e transições são validados pela API. O saldo entre várias linhas não é garantido pelos CHECKs positivos isoladamente: depende das transações do backend. Escritas manuais por Workbench podem violar essas regras; esta revisão não acrescentou triggers ou CHECKs que rejeitariam dados antigos. O diagnóstico detectou zero inconsistências de papel, saldo ou duplicação no snapshot consultado.

## Consultas e conexão revisadas

Foram lidos `backend/app.js`, `server.js`, `config/ambiente.js`, `database/conexao.js`, todos os controllers, routes, middlewares e `utils/regras.js`.

| Grupo | Resultado |
| --- | --- |
| Cadastro/login e perfil | INSERT/SELECT de usuários compatíveis; consultas parametrizadas; hash removido da resposta. |
| Catálogo/meus/detalhes | JOIN com usuário e agregação das solicitações coerentes com FKs/status/DECIMAL; `data_validade` DATE compatível com ISO recebido. |
| Criar/editar alimentos | Campos dinâmicos vêm da whitelist de validação, não de nomes fornecidos diretamente pelo usuário; valores usam parâmetros. |
| Exclusão lógica | Apenas UPDATE de status, preservando pedidos e FKs. |
| Criar/listar solicitações | Defaults, joins, papéis e endereço condicionado ao status compatíveis com schema. |
| Aprovar/recusar/cancelar/entregar | UPDATE por ID em transação, com validação de proprietário, papel e transição. |
| Pool | mysql2/promise, conexão real configurada em backend/.env, utf8mb4, `decimalNumbers`, `dateStrings`, dez conexões; configuração privada não foi reproduzida no relatório. |
| Inicialização | `SELECT 1` antes de aceitar conexões; nenhuma migração automática na API. |

Nenhum controller, rota, serviço ou funcionalidade do aplicativo foi alterado nesta revisão. Apenas arquivos SQL/documentação e testes foram adicionados/ajustados.

## Relação com as quatro entregas

| Entrega | Compatibilidade do banco e limites |
| --- | --- |
| 1 — Proposta e estrutura | Usuários DOADOR/RECEPTOR e entidades de doação correspondem ao problema proposto. Banco sozinho não comprova navegação, Git ou entrega inicial. |
| 2 — Modelagem/API/integração | Estrutura completa, três entidades relacionadas, SQL de instalação e conexão real; testes verificam GET/POST e persistência. |
| 3 — JWT/permissões/CRUD | Campos de hash/papel e FKs sustentam cadastro, autenticação e CRUD. JWT é stateless; não é necessária tabela de tokens para as funcionalidades atuais. Autorização e propriedade são verificadas na API. |
| 4 — Testes/documentação/build | Scripts portáveis e diagnóstico reproduzível preparados; testes isolados cobrem fluxo e preservação. APK, execução física e publicação Git continuam itens separados; o schema não comprova esses requisitos. |

Fontes de requisitos: PDF de oito páginas e matriz já identificados em [AUDITORIA_ENTREGAS.md](AUDITORIA_ENTREGAS.md). Não se declara que as quatro entregas completas foram atendidas apenas pela revisão do banco.

## Testes desta revisão

O runner MySQL cria diretório e porta novos e inicializa uma instância independente, sem conectar ao banco pessoal. A instalação passa a usar `estrutura_final_alimenta_plus.sql`. O novo teste reexecuta os dois scripts de instalação e o diagnóstico, confere CHECKs aplicados, compara `SHOW CREATE TABLE` e checksums das tabelas antes/depois, comprovando preservação dos registros de teste. Nenhum comando SQL DROP, TRUNCATE ou DELETE é executado pelos scripts fornecidos; o teste de exclusão usa endpoint HTTP DELETE que realiza UPDATE lógico no banco isolado.

| Comando | Resultado |
| --- | --- |
| `npm.cmd test` | 9 aprovados, zero falhas. |
| `npm.cmd run test:mysql` | 15 aprovados, zero falhas, incluindo preservação dos scripts. |
| `npm.cmd run test:web` | 16 aprovados, zero falhas; inclui instalação, diagnóstico e fluxo real até entrega. |
| `npm.cmd run lint` | Sem erros/avisos. |
| `npm.cmd run typecheck` | Concluído; análise de JavaScript sem checkJs estrito. |

No banco real foram verificadas 17 condições agregadas: 16 retornaram zero; a condição de unidades fora do domínio atual retornou três. O diagnóstico não testa senhas conhecidas nem exibe seus hashes; verifica apenas o formato bcrypt armazenado. Nenhum segredo ou dado pessoal foi incluído neste relatório.
