# Revisão final das quatro entregas — 11/11/2026

## Fontes e estado atual

O PDF completo de oito páginas foi relido nesta revisão. Ele foi encontrado em Downloads e copiado, sem alteração de conteúdo, para `referencias/Projeto Avaliativo Aplicacao Mobile JWT.pdf` (SHA-256 `8C279488BF09F45F5E2480C24BD2A1B610EDCF75D616E674024FD6A5781B0DD6`). A referência técnica `referencias/loja-jwt` foi novamente examinada e não foi modificada. Não se afirma equivalência com PDFs/ZIPs de outros sufixos.

Os fluxos Web/API atuais passaram nos testes reais com MySQL isolado. **A entrega final não está concluída**: faltam hospedagem pública HTTPS autorizada, APK instalado/testado, publicação Git autorizada e apresentação do aluno. O usuário informou que celular e computador usam redes diferentes, então o IP privado foi retirado dos perfis EAS; nenhum build definitivo foi executado com esse endereço.

## Indicadores oficiais reavaliados

| Entrega | Indicador do PDF | Estado atual | Evidência / pendência |
| --- | --- | --- | --- |
| 1 | Identificação do problema e proposta de solução | ATENDIDO | README: desperdício, público, justificativa e proposta. |
| 1 | Definição inicial do sistema | ATENDIDO | Papéis, permissões, funcionalidades, dez telas e fluxo documentados. |
| 1 | Estrutura inicial do aplicativo | ATENDIDO | React Native/Expo, componentes e telas organizados. |
| 1 | Navegação, versionamento e primeira versão funcional | PARCIALMENTE ATENDIDO | Dez telas percorridas no Web e Git local; comprovação temporal das entregas não inferida. Remoto permanece no primeiro commit. |
| 2 | Modelagem dos dados | ATENDIDO | Três tabelas, relacionamentos, índices, CHECKs e SQL portável; revisão real somente leitura. |
| 2 | Estrutura da API | ATENDIDO | Express, app/server, routes/controllers, middleware e mysql2/promise. |
| 2 | Integração aplicativo, API e banco | ATENDIDO | fetch, GET/POST e persistência verificados com MySQL real isolado. |
| 2 | Evolução, documentação e versionamento | PARCIALMENTE ATENDIDO | Documentação atualizada; sete commits locais além do remoto, sem publicação desta revisão. |
| 3 | Cadastro, login e proteção de senha | ATENDIDO | Cadastro dos dois papéis, validação e bcrypt; testes HTTP e interface. |
| 3 | JWT e gerenciamento da sessão | PARCIALMENTE ATENDIDO | Assinatura/expiração/Bearer/logout testados. SecureStore nativo revisado; retomada em Android físico pendente. Web usa memória da aba. |
| 3 | Controle de acesso | ATENDIDO | Matriz 401/403, papéis e propriedade testados diretamente na API. |
| 3 | CRUD e integração geral | ATENDIDO no Web/dados válidos | Publicar, consultar, editar e excluir logicamente; solicitações/estados. Três registros reais antigos de unidade inválida continuam pendentes de confirmação. |
| 3 | Funcionamento, evolução e versionamento | PARCIALMENTE ATENDIDO | Testes atuais aprovados e correções documentadas; commit/push final não autorizados. |
| 4 | Solução final e atendimento ao problema | PARCIALMENTE ATENDIDO | Fluxo funcional no Web; hospedagem externa e validação do APK faltam. |
| 4 | Funcionamento, testes e build final | PARCIALMENTE ATENDIDO | 12 testes unitários/configuração, 16 MySQL, 17 Web; Expo Doctor 20/20; APK NÃO ATENDIDO. |
| 4 | Demonstração prática e domínio técnico | NÃO VERIFICADO | Roteiro pronto; depende da apresentação real do aluno. |
| 4 | Versionamento, documentação e defesa | PARCIALMENTE ATENDIDO | README, SQL, roteiro e relatórios atualizados; remoto final e defesa pendentes. |

## Checklist dos requisitos específicos

| Entrega | Requisitos conferidos | Situação |
| --- | --- | --- |
| 1 | Problema, público, justificativa, solução, nome, tipos, permissões, funcionalidades, telas e fluxo | ATENDIDO na documentação atual. |
| 1 | Expo, estrutura de pastas, React Navigation, pelo menos três telas, navegação e identidade | ATENDIDO no Web; execução física pendente. |
| 1 | Repositório e primeiros commits | Git local/remoto existem; histórico de oito commits locais é real. Datas de entrega específicas NÃO VERIFICADAS. |
| 2 | Requisitos funcionais, telas/fluxos, entidades/campos, rotas e permissões atualizados | ATENDIDO no README/SQL/relatórios. |
| 2 | MySQL, tabelas/FKs, Express, conexão real, fetch, GET/POST, dados persistentes | ATENDIDO nos testes e revisão do schema. |
| 2 | README/repositório atualizado | README ATENDIDO; remoto atual PARCIALMENTE ATENDIDO. |
| 3 | Cadastro, hash, login, emissão/armazenamento/envio JWT, Bearer e validação | Implementado; Web/API ATENDIDOS; restauração SecureStore física NÃO VERIFICADA. |
| 3 | Logout, dois níveis, rotas protegidas, permissões no backend, CRUD completo MySQL | ATENDIDO no escopo Web/API testado. |
| 3 | Commits/push de autenticação, funcionalidades e correções | Commits locais existentes; push final NÃO ATENDIDO. Não houve publicação nesta revisão. |
| 4 | Revisar funcionalidades/interface, corrigir erros, testar navegação/auth/permissões/CRUD, organizar código/README | ATENDIDO no escopo automatizado e revisão atual. |
| 4 | Commit/push final e correspondência com APK | NÃO ATENDIDO: faltam autorização e APK. |
| 4 | APK gerado, instalável, API configurada e teste físico de auth/níveis/CRUD/navegação | NÃO ATENDIDO: configuração preparada, mas sem build ou instalação. |
| 4 | Demonstração do problema, solução, cadastro/login/JWT/middleware/níveis/CRUD/banco/Git/APK | Roteiro preparado; apresentação real NÃO VERIFICADA e APK ausente. |
| Final | Fonte/API/SQL/README/material de apresentação | Arquivos locais prontos para revisão; publicação remota ainda pendente. |

## Referência técnica e preservação

Mantidos os padrões do exemplo: Expo/Native Stack, fetch, API Express separada, mysql2 parametrizado, bcrypt, JWT e consulta do papel no banco. O Alimenta+ usa Context/abas, SecureStore, propriedade das ofertas, validade, endereço liberado após aprovação e estoque por reservas/entregas. Não foram copiados dados comerciais nem alterado o projeto do professor. A tabela técnica detalhada da auditoria inicial permanece no histórico abaixo.

## Correções e arquivos desta revisão final

| Arquivos | Mudança e motivo |
| --- | --- |
| `backend/controllers/alimentosController.js` | Comparação de total em milésimos: evita falso 409 quando 0,1 entregue + 0,2 reservado corresponde ao total 0,3. Redução real continua bloqueada. |
| `screens/DetalhesAlimento.js` | Limpa erro ao tentar carregar novamente; exibe vencido e oculta solicitação de oferta vencida/inativa, mantendo bloqueio do servidor. |
| `package.json`, `package-lock.json` | Expo 58.0.24, SecureStore 58.0.3 e StatusBar 58.0.5; React/RN preservados. Auditoria sem force; avisos residuais registrados. |
| `app.json` | Plugin StatusBar requerido pelo patch; configurações existentes preservadas. |
| `app.config.js`, `shared/configBuild.js`, `eas.json` | Build público exige HTTPS, bloqueia IPs privados e desativa HTTP no perfil público. URL privada removida. |
| `scripts/verificar-apk.js`, `tests/configBuild.test.js` | Pré-verificação de URL/health e testes de regressão dos endereços proibidos. Sem URL pública, o comando falha intencionalmente. |
| `.gitignore`, `.easignore` | Proteção de variantes .env, assinatura/credenciais, backups e exclusão de backend/banco do upload EAS. |
| `backend/tests/mysql.integration.test.js` | Regressão de estoque decimal e confirmação de exclusão lógica pelo fluxo visual. |
| `tests/fluxo-web.js` | Todas as dez telas; inclui busca, cancelamento, recusa, filtro e exclusão pela interface. |
| `jsconfig.json` | Inclui a nova configuração dinâmica na análise JS. |
| `README.md`, `docs/TESTES.md`, este relatório e `docs/ROTEIRO_APRESENTACAO.md` | Atualização de estado real, evidências e preparação para defesa. |
| `docs/APK_ANDROID.md`, `docs/HOSPEDAGEM_API.md` | Passos de build/instalação, opções de HTTPS e plano de migração autorizado, sem publicação executada. |

## Resultados e limitações

Testes detalhados: [TESTES.md](TESTES.md). As três invocações solicitadas de `npm test`/`npm run test` são aliases da mesma suíte de 12 casos, não 36 casos diferentes. MySQL/Web também compartilham cenários; as contagens incluem teste-pai.

Banco real: 5 usuários, 4 alimentos e 2 solicitações, consultados apenas em leitura nesta revisão. Schema correto; zero estoque negativo/órfãos/duplicações ativas. Unidades `11`, `2,5kg` e `kgaaa` nos IDs 1/2/3 continuam preservadas; ID 3 ativo tem histórico e precisa de correção de dados confirmada antes de editar sua unidade. MySQL/JWT locais não foram reconfigurados.

Nove avisos moderados persistem no npm audit, sem high/critical. Não foi executado `audit fix --force`, downgrade do Expo ou override de dependência principal. Compatibilidade Expo aprovada e Doctor 20/20 não significam ausência de vulnerabilidades.

GitHub foi conferido por consulta somente leitura: local inicialmente `492c0d1`, agora `291988e`; remoto permanece `b37fd98`, sete commits locais à frente. O novo commit `291988e` foi observado durante o trabalho e não foi criado por comando do agente. `git status` estava limpo inicialmente; parte das mudanças entrou nesse commit externo, enquanto os últimos ajustes de documentação/ignore continuam sem commit. Variantes `.env`/credenciais protegidas, segredo JWT local não encontrado nos arquivos versionados pela busca direta realizada. Isso não é auditoria de todos os segredos em todo histórico remoto. O agente não executou commit/push.

APK: não gerado. EAS sem login/projeto; não há SDK/adb configurados para alternativa local validada. IP privado respondeu pelo computador, mas o celular está em outra rede. A configuração atual bloqueia uso desse IP no APK definitivo. Hospedagem é apenas plano, com opções e custos em [HOSPEDAGEM_API.md](HOSPEDAGEM_API.md); nenhuma API/túnel/banco foi publicado.

Para concluir: escolher/autorizar hospedagem e base de demonstração, testar API HTTPS no celular, configurar EAS, aprovar build, instalar/testar, autorizar commit/push correspondente e ensaiar a apresentação. Até lá, a demonstração Web local está testada, mas a entrega 4 permanece incompleta.

---

# Histórico — auditoria técnica de 10/11/2026

O conteúdo abaixo registra a situação inicial. Para estado final, requisitos e contagens, prevalece a revisão de 11/11 acima.

Data: 10/11/2026. Revisão do projeto existente, sem recriação. Nenhum push, exclusão de registros pessoais ou alteração destrutiva de banco foi executado.

## Fontes e limites

- Projeto atual: raiz jwtdoadores, incluindo frontend, backend, SQL, testes, configuração e documentação.
- PDF lido integralmente: C:/Users/PEDROHENRIQUEBACKES/Downloads/Projeto Avaliativo Aplicacao Mobile JWT.pdf, oito páginas. SHA-256: 8C279488BF09F45F5E2480C24BD2A1B610EDCF75D616E674024FD6A5781B0DD6. O PDF com sufixo (4) não foi encontrado; equivalência não comprovada.
- Referência examinada: referencias/loja-jwt, já extraída antes desta auditoria. Downloads contém loja-jwt.zip e loja-jwt (1).zip, mas não loja-jwt(3).zip. Não se afirma que a cópia extraída corresponde ao ZIP (3). A comparação abaixo é com o código extraído disponível.
- Documentos anteriores de 06/11 são históricos. Os resultados desta auditoria prevalecem; não foram reutilizados como prova de execução atual.

## A. Matriz detalhada das quatro entregas

A situação inicial indica o código/documentação encontrado; a final considera as verificações desta auditoria. ATENDIDO no Web/API não comprova execução nativa.

| Entrega | Exigência do professor | Situação atual (antes) | Evidência no código | Problema encontrado | Correção necessária / aplicada | Situação após a correção |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Problema atual identificado | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Contexto e público afetado | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Justificativa | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Solução proposta | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Nome da aplicação | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Tipos de usuário | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Permissões iniciais | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Funcionalidades previstas | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Telas previstas | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Fluxo inicial de navegação | ATENDIDO | README.md; navigation/AppNavigator.js; docs/ROTEIRO_APRESENTACAO.md | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Projeto React Native com Expo | ATENDIDO | App.js; index.js; package.json; screens/ (10 telas); components/ui.js; navigation/AppNavigator.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Estrutura de pastas | ATENDIDO | App.js; index.js; package.json; screens/ (10 telas); components/ui.js; navigation/AppNavigator.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | React Navigation | ATENDIDO | App.js; index.js; package.json; screens/ (10 telas); components/ui.js; navigation/AppNavigator.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Pelo menos três telas | ATENDIDO | App.js; index.js; package.json; screens/ (10 telas); components/ui.js; navigation/AppNavigator.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Navegação funcional | ATENDIDO | App.js; index.js; package.json; screens/ (10 telas); components/ui.js; navigation/AppNavigator.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Identidade visual | ATENDIDO | App.js; index.js; package.json; screens/ (10 telas); components/ui.js; navigation/AppNavigator.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Git criado e primeiros commits | ATENDIDO | git log: b37fd98, b170a77, 0b8d557, c245a1c | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 1 | Repositório atualizado na entrega e registros de evolução | NÃO VERIFICADO | Git local e origin configurados; nenhuma consulta remota nesta auditoria | Não é possível comprovar conteúdo remoto ou envio na data de cada entrega. | Conferir histórico/remoto com autorização; não criar histórico fictício. | NÃO VERIFICADO |
| 2 | Banco MySQL funcional | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | Tabelas e relacionamentos | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | Entidades e campos | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | Script SQL | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | API Node.js com Express | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | Controllers e rotas organizados | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | Conexão real API e MySQL | ATENDIDO | database/alimenta_plus.sql; backend/app.js; backend/database/conexao.js; backend/controllers/; backend/routes/; testes MySQL | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 2 | Integração React Native e API por fetch | PARCIALMENTE ATENDIDO | services/api.js; services/clienteApi.js; backend/controllers/alimentosController.js; tests/fluxo-web.js | Integração existia; relato de falha Web e teste anterior na mesma origem. | Cliente com diagnósticos específicos; validação real entre origens e smoke no Expo. | ATENDIDO |
| 2 | GET de alimentos | PARCIALMENTE ATENDIDO | services/api.js; services/clienteApi.js; backend/controllers/alimentosController.js; tests/fluxo-web.js | Integração existia; relato de falha Web e teste anterior na mesma origem. | Cliente com diagnósticos específicos; validação real entre origens e smoke no Expo. | ATENDIDO |
| 2 | POST de alimentos | PARCIALMENTE ATENDIDO | services/api.js; services/clienteApi.js; backend/controllers/alimentosController.js; tests/fluxo-web.js | Integração existia; relato de falha Web e teste anterior na mesma origem. | Cliente com diagnósticos específicos; validação real entre origens e smoke no Expo. | ATENDIDO |
| 2 | Persistência | PARCIALMENTE ATENDIDO | services/api.js; services/clienteApi.js; backend/controllers/alimentosController.js; tests/fluxo-web.js | Integração existia; relato de falha Web e teste anterior na mesma origem. | Cliente com diagnósticos específicos; validação real entre origens e smoke no Expo. | ATENDIDO |
| 2 | Alimentos cadastrados aparecem no catálogo | PARCIALMENTE ATENDIDO | services/api.js; services/clienteApi.js; backend/controllers/alimentosController.js; tests/fluxo-web.js | Integração existia; relato de falha Web e teste anterior na mesma origem. | Cliente com diagnósticos específicos; validação real entre origens e smoke no Expo. | ATENDIDO |
| 2 | Requisitos funcionais atualizados | PARCIALMENTE ATENDIDO | README.md; docs/AUDITORIA_ENTREGAS.md; docs/ROTEIRO_APRESENTACAO.md | README mencionava arquivo .env.example ausente e informações antigas de referência/remoto. | Exemplo raiz criado e documentação atualizada. | ATENDIDO |
| 2 | Telas e fluxos atualizados | PARCIALMENTE ATENDIDO | README.md; docs/AUDITORIA_ENTREGAS.md; docs/ROTEIRO_APRESENTACAO.md | README mencionava arquivo .env.example ausente e informações antigas de referência/remoto. | Exemplo raiz criado e documentação atualizada. | ATENDIDO |
| 2 | Rotas documentadas | PARCIALMENTE ATENDIDO | README.md; docs/AUDITORIA_ENTREGAS.md; docs/ROTEIRO_APRESENTACAO.md | README mencionava arquivo .env.example ausente e informações antigas de referência/remoto. | Exemplo raiz criado e documentação atualizada. | ATENDIDO |
| 2 | Níveis e permissões documentados | PARCIALMENTE ATENDIDO | README.md; docs/AUDITORIA_ENTREGAS.md; docs/ROTEIRO_APRESENTACAO.md | README mencionava arquivo .env.example ausente e informações antigas de referência/remoto. | Exemplo raiz criado e documentação atualizada. | ATENDIDO |
| 2 | README atualizado | PARCIALMENTE ATENDIDO | README.md; docs/AUDITORIA_ENTREGAS.md; docs/ROTEIRO_APRESENTACAO.md | README mencionava arquivo .env.example ausente e informações antigas de referência/remoto. | Exemplo raiz criado e documentação atualizada. | ATENDIDO |
| 2 | Evolução e repositório atualizado | NÃO VERIFICADO | git log e remoto origin | Evolução por entrega não comprovada no remoto. | Revisar commits reais e publicar somente após autorização. | NÃO VERIFICADO |
| 3 | Cadastro de usuários | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Login | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Hash das senhas | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Geração JWT | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Bearer Token | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Validação JWT | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Logout | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Dois níveis | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Rotas protegidas | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Permissões no backend | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | CRUD completo | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Integração do CRUD com MySQL | ATENDIDO | backend/controllers/; backend/middlewares/; backend/routes/; contexts/AuthContext.js; backend/tests/mysql.integration.test.js; tests/fluxo-web.js | Nenhuma falha identificada no escopo verificado. | Preservado e revisado. | ATENDIDO |
| 3 | Armazenamento seguro e restauração nativa do token | PARCIALMENTE ATENDIDO | services/tokenStorage.js (SecureStore); services/tokenStorage.web.js (memória); contexts/AuthContext.js | Código revisado; persistência no Android não executada. Web encerra sessão ao recarregar. | Validar SecureStore em aparelho físico; manter token Web em memória. | PARCIALMENTE ATENDIDO |
| 3 | Funcionamento testado e correções | PARCIALMENTE ATENDIDO | npm test; npm run test:mysql; npm run test:web | Faltavam regressões do cliente e cadastro pela interface. | Incluídos cenários de URL, HTTP, timeout, preflight e cadastro Web. | ATENDIDO |
| 3 | Commits e push evidenciando evolução | NÃO VERIFICADO | git log e origin | Sem verificação remota ou cronologia por etapa. | Commit/push destas mudanças pendentes de autorização. | NÃO VERIFICADO |
| 4 | Funcionalidades completas no Web | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Navegação Web | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Cadastro e login Web | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | CRUD de alimentos | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Permissões | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Solicitações e entrega | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Interface organizada | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Código organizado | PARCIALMENTE ATENDIDO | screens/; components/; backend/; backend/tests/; tests/fluxo-web.js | Necessária validação atual, especialmente entre origens. | Fluxo real Web e testes MySQL executados; arquitetura existente preservada. | ATENDIDO |
| 4 | Mensagens de erro | PARCIALMENTE ATENDIDO | services/clienteApi.js; tests/clienteApi.test.js; README.md; docs/ROTEIRO_APRESENTACAO.md | Mensagem única para falhas de fetch e documentação desatualizada. | Diagnósticos distintos, testes de regressão e documentação atual. | ATENDIDO |
| 4 | Testes executados | PARCIALMENTE ATENDIDO | services/clienteApi.js; tests/clienteApi.test.js; README.md; docs/ROTEIRO_APRESENTACAO.md | Mensagem única para falhas de fetch e documentação desatualizada. | Diagnósticos distintos, testes de regressão e documentação atual. | ATENDIDO |
| 4 | README completo | PARCIALMENTE ATENDIDO | services/clienteApi.js; tests/clienteApi.test.js; README.md; docs/ROTEIRO_APRESENTACAO.md | Mensagem única para falhas de fetch e documentação desatualizada. | Diagnósticos distintos, testes de regressão e documentação atual. | ATENDIDO |
| 4 | Material de apresentação | PARCIALMENTE ATENDIDO | services/clienteApi.js; tests/clienteApi.test.js; README.md; docs/ROTEIRO_APRESENTACAO.md | Mensagem única para falhas de fetch e documentação desatualizada. | Diagnósticos distintos, testes de regressão e documentação atual. | ATENDIDO |
| 4 | Configuração do APK Android | ATENDIDO | eas.json perfil preview; app.json | Configuração existente não comprova APK. | Configuração preservada; gerar com API definitiva. | ATENDIDO |
| 4 | APK final gerado | NÃO ATENDIDO | eas.json; export Android; sem APK produzido | Build EAS e instalação em dispositivo não executados. | Configurar conta/projeto EAS e API definitiva, gerar APK, instalar e validar. | NÃO ATENDIDO |
| 4 | APK instalável e correspondente à versão final | NÃO ATENDIDO | eas.json; export Android; sem APK produzido | Build EAS e instalação em dispositivo não executados. | Configurar conta/projeto EAS e API definitiva, gerar APK, instalar e validar. | NÃO ATENDIDO |
| 4 | Teste Android de navegação, autenticação, níveis e CRUD | NÃO ATENDIDO | eas.json; export Android; sem APK produzido | Build EAS e instalação em dispositivo não executados. | Configurar conta/projeto EAS e API definitiva, gerar APK, instalar e validar. | NÃO ATENDIDO |
| 4 | Commit e push final | PARCIALMENTE ATENDIDO | README.md; Git local; origin | Mudanças locais sem commit/push; APK ausente. | Revisar mudanças, autorizar publicação e conferir remoto/build final. | PARCIALMENTE ATENDIDO |
| 4 | Repositório preparado e remoto atualizado | PARCIALMENTE ATENDIDO | README.md; Git local; origin | Mudanças locais sem commit/push; APK ausente. | Revisar mudanças, autorizar publicação e conferir remoto/build final. | PARCIALMENTE ATENDIDO |
| 4 | Link final e correspondência entre APK e repositório | PARCIALMENTE ATENDIDO | README.md; Git local; origin | Mudanças locais sem commit/push; APK ausente. | Revisar mudanças, autorizar publicação e conferir remoto/build final. | PARCIALMENTE ATENDIDO |
| 4 | Apresentação prática e domínio técnico | NÃO VERIFICADO | docs/ROTEIRO_APRESENTACAO.md | Roteiro criado; desempenho do aluno e apresentação não observados. | Ensaiar e apresentar; concluir APK. | NÃO VERIFICADO |
| 4 | Defesa e apresentação do APK | NÃO VERIFICADO | docs/ROTEIRO_APRESENTACAO.md | Roteiro criado; desempenho do aluno e apresentação não observados. | Ensaiar e apresentar; concluir APK. | NÃO VERIFICADO |

### Indicadores oficiais do PDF

| Entrega | Indicador | Estado final e limite |
| --- | --- | --- |
| 1 | Identificação do problema e proposta de solução | ATENDIDO: proposta, público e justificativa no README. |
| 1 | Definição inicial do sistema | ATENDIDO: funcionalidades, papéis, telas e fluxo. |
| 1 | Estrutura inicial do aplicativo | ATENDIDO: Expo, dez telas e componentes. |
| 1 | Navegação, versionamento e primeira versão funcional | PARCIALMENTE ATENDIDO: navegação testada; remoto por entrega não verificado. |
| 2 | Modelagem dos dados | ATENDIDO: três entidades, FKs e restrições. |
| 2 | Estrutura da API | ATENDIDO: app/server, controllers, rotas e conexão separados. |
| 2 | Integração aplicativo, API e banco | ATENDIDO no Web com fetch e MySQL real. |
| 2 | Evolução, documentação e versionamento | PARCIALMENTE ATENDIDO: documentação atualizada; evidência remota não verificada. |
| 3 | Cadastro, login e proteção de senha | ATENDIDO: bcrypt, validação e fluxo real. |
| 3 | JWT e gerenciamento da sessão | PARCIALMENTE ATENDIDO: Web/API testados; restauração SecureStore no Android não verificada. |
| 3 | Controle de acesso | ATENDIDO: verificações diretas na API e propriedade. |
| 3 | CRUD e integração geral | ATENDIDO: testes com MySQL e integração Web. |
| 3 | Funcionamento, evolução e versionamento | PARCIALMENTE ATENDIDO: testes atuais; mudanças sem commit/push. |
| 4 | Solução final e atendimento ao problema | PARCIALMENTE ATENDIDO: fluxo Web funciona; versão nativa final não instalada. |
| 4 | Funcionamento, testes e build final | PARCIALMENTE ATENDIDO: testes e bundle Android; APK NÃO ATENDIDO. |
| 4 | Demonstração prática e domínio técnico | NÃO VERIFICADO: depende da apresentação do aluno. |
| 4 | Versionamento, documentação e defesa | PARCIALMENTE ATENDIDO: documentação/roteiro prontos; remoto e defesa pendentes. |

## B. Comparação técnica com a referência disponível

| Aspecto | Referência extraída | Alimenta+ e decisão desta revisão |
| --- | --- | --- |
| Estrutura | Expo Blank, App/index, screens/components, Express separado | Mesma organização geral; Context, hooks, abas e domínio de doações preservados. |
| Dependências | Expo 58, React 19.3, RN 0.88.0 | Expo 58, React 19.3, RN 0.88.1; expo install --check aprovou versões instaladas. Não houve troca de SDK. |
| API | app/server, rotas, controllers e middleware | Separação preservada; prefixo /api e rate limit no auth. |
| MySQL | mysql2/promise e queries parametrizadas | Pool real, SQL com três entidades, transações de estoque e histórico. |
| Cadastro/login | bcrypt; nível usuario imposto pelo servidor | Dois papéis públicos do domínio; escolha restrita a DOADOR/RECEPTOR. Doador não tem privilégio administrativo global. |
| JWT | JWT com id/nivel; validação e papel atual do banco | subject mínimo, oito horas, HS256, issuer/audience; papel atual do banco e propriedade da oferta. |
| Permissões | somenteAdmin para escrita de produtos | autorizarTipo e verificações de dono para ofertas e pedidos. |
| CRUD | Produtos com preço e estoque | Alimentos com quantidade, validade, retirada e exclusão lógica; sem funcionalidades comerciais. |
| Navigation | Native Stack e sessão por props | Native Stack + abas por papel e AuthContext; não reescrever. |
| fetch e token | URL fixa localhost; AsyncStorage; helper retorna Response | URL pública validada, SecureStore nativo e memória Web; JSON centralizado, timeout e expiração. |
| Erros | HTTP/json, mensagens nas telas | Diagnósticos específicos de rede/timeout/configuração/HTTP e logs sem credenciais. |
| Testes | API, MySQL e Playwright | Regras, cliente, MySQL isolado, concorrência, preflight, fluxo real entre origens e smoke do Expo. |
| Ambiente/docs | dotenv com caminho relativo ao módulo; exemplo, README e validações | Mesmo padrão de carregamento; exemplo raiz restaurado, segredo modelo substituído localmente e documentação atualizada. |

Esses padrões já existiam em grande parte no Alimenta+. Esta auditoria os comparou e preservou; não atribui toda a implementação existente às mudanças atuais. Endereço privado após aprovação, solicitações, reservas e entrega distinguem a solução de uma loja renomeada.

## C. Problemas, causas e correções

| Arquivo | Problema e causa | Correção aplicada |
| --- | --- | --- |
| services/api.js | Catch amplo convertia timeout e outras exceções na mensagem genérica de conexão; resposta inválida podia parecer sucesso. | Cliente extraído para clienteApi.js, mensagens/códigos próprios e falha explícita para JSON inválido. |
| services/clienteApi.js (novo) | URL não tinha validação; configuração futura em Markdown ou sem /api provocaria falha difícil de diagnosticar. Não foi encontrado Markdown na URL atual. | Valida protocolo, caminho e ausência de credenciais/query/hash; padrões Web e Android separados. |
| tests/fluxo-web.js | Interface e API servidas em 3011; não comprovava CORS, nem cadastro pela tela, nem entrega. | Interface 3012 e API 3011, cadastro visual, credenciais incorretas, aprovação, retirada, entrega e logout. |
| .env.example | Ausente, apesar de instrução de cópia no README. | Criado com URL local e orientações por plataforma. |
| backend/.env.example | Continha senha e segredo de exemplo reutilizáveis. | Removidos os valores utilizáveis; segredo passa a exigir geração aleatória. Não se comprovou que a senha de exemplo era credencial real. |
| backend/.env (ignorado) | JWT_SECRET local ainda era o exemplo conhecido. | Substituído por segredo aleatório local sem imprimir valor; dados/credenciais MySQL preservados. Tokens anteriores deixam de funcionar após reinício. |
| backend/config/ambiente.js | Aceitava segredo de exemplo antigo e não validava faixa das portas. | Rejeita exemplos conhecidos/valores vazios; valida DB_PORT e PORT. |
| backend/controllers/authController.js | Helper texto removia espaços da senha antes de hash/comparação. | Valida senha sem normalizar; limite de 72 bytes e teste de espaços. |
| screens/CadastroUsuario.js | Prop autoCapitalize sobrescrevia proteção dos campos de senha. | Senha e confirmação agora usam none. |
| backend/tests/mysql.integration.test.js | Teste do hash selecionava usuário arbitrário com LIMIT 1; falhou após inclusão de conta com outra senha. | Consulta pelo e-mail da conta testada. Novos testes de preflight, espaços, bytes e JSON inválido. |
| README e docs | Afirmações históricas de fonte/remoto e ausência de matriz detalhada atual. | Versões/fontes qualificadas, matriz completa, resultados atuais e roteiro. |

### Diagnóstico honesto do erro original de conexão

Antes das mudanças, .env já apontava para http://localhost:3000/api e api.js usava localhost no Web, não 10.0.2.2. As rotas públicas usavam publica: true e enviavam JSON. backend/.env era carregado por caminho baseado no módulo. cors() já estava antes das rotas e respondia OPTIONS. Não havia evidência de que faltasse CORS no Express.

Nesta sessão a API iniciou e /api/health respondeu 200 em localhost e 127.0.0.1 usando a configuração pessoal, sem modificar registros. O smoke real confirmou Expo Web localhost:8081 → localhost:3000/api e mensagens HTTP de cadastro/login. O fluxo de cadastro válido ocorreu no banco isolado. A falha original de transporte não foi reproduzida; não há prova para atribuí-la exclusivamente a URL, firewall, cache ou backend desligado. A causa comprovada no código era a perda do diagnóstico no catch genérico, agora corrigida. Não se declara resolvido um bloqueio de rede externo que não foi observado.

Fetch não permite distinguir CORS de conexão recusada no JavaScript. A mensagem informa rede/CORS/HTTPS; Network e Console do navegador distinguem a causa. Timeout, erro HTTP, resposta inválida e armazenamento têm códigos próprios. Logs contém somente origem, método, status e código; nenhum corpo, senha ou JWT.

## D. Testes e resultados atuais

| Comando executado | Aprovados | Falhas | Resultado |
| --- | --- | --- | --- |
| npm.cmd test | 8 | 0 | Regras e cliente HTTP. |
| npm.cmd run test:mysql | 14 | 0 | MySQL isolado, JWT, matriz de papéis, CRUD, concorrência e persistência. |
| npm.cmd run test:web | 15 | 0 | Integração anterior mais fluxo Edge de cadastro até entrega entre origens distintas. |
| node scripts/verificar-expo-web.js | Smoke concluído | 0 | Expo em 8081 usa API localhost:3000/api; mensagens 401/400 exibidas. |
| npm.cmd run lint / npm.cmd run typecheck | Concluídos | 0 | Sem avisos de lint; análise JS sem tipagem estrita. |
| npx.cmd expo install --check | Concluído | 0 | Dependências compatíveis segundo o Expo instalado. |
| npm.cmd run export:android | Bundle gerado | 0 | APK não gerado. |
| npm.cmd run api:dev / npx.cmd expo start --web --clear --port 8081 | Iniciados | 0 | API 3000 e Expo Web 8081; comunicação exercitada. |
| npm.cmd audit --omit=dev --json | Não limpo | 5 avisos moderados | Zero high/critical; dependências transitivas do Expo, sem atualização forçada. |

Resultados e comandos atualizados em docs/TESTES.md. MySQL de testes usa datadir novo e porta aleatória; não apaga nem limpa registros pessoais. O teste de persistência reinicia a API e abre nova conexão MySQL; não reinicia o serviço pessoal. Contagens TAP incluem o cenário-pai nos comandos de integração.

Falhas intermediárias: PowerShell bloqueou npm.ps1 (usado npm.cmd); sandbox bloqueou subprocessos (execução autorizada fora dessa restrição); consulta LIMIT 1 de hash e observação de preflight automático via Playwright falharam e foram corrigidas. OPTIONS é verificado diretamente via HTTP; o navegador valida o fluxo entre origens. Essas falhas não estão omitidas dos resultados: a tabela registra a execução final, após correção.

## E. Segurança, organização e entrega

.env e backend/.env são ignorados pelo Git e não apareceram no histórico consultado desses caminhos. A auditoria não garante ausência de qualquer segredo em todo o histórico remoto. O segredo de exemplo identificado foi substituído; não houve cópia de segredos nos relatórios. Não há evidência confirmada de vazamento de credenciais reais. Se algum segredo real já foi publicado fora deste histórico local, deve ser substituído.

Queries externas usam parâmetros; campos de INSERT/UPDATE são derivados da whitelist de validação. O backend protege papéis/propriedade e não retorna hashes. Endereço completo é ocultado até aprovação; descrições e observações são públicas e não devem conter endereço privado. JWT tem expiração, sem revogação global no logout. CORS aberto é configuração local de desenvolvimento e não autoriza operações.

components/Botao.js e CampoInput.js são reexports de compatibilidade, não implementações duplicadas. Telas de cadastro/edição compartilham FormularioAlimento; telas de solicitações compartilham ListaSolicitacoes. Não foram removidos arquivos de referência, banco ou históricos. Dependências e arquitetura foram preservadas. typecheck usa checkJs=false, portanto não equivale a checagem estrita.

O projeto está funcional nos fluxos Web/API testados e preparado para ensaio da demonstração Web. Nenhuma entrega é declarada integralmente concluída sem evidência de envio ao remoto; a entrega 4 permanece incompleta pelo APK ausente e testes físicos pendentes. EAS preview está configurado para APK, mas não foi executado build EAS nesta auditoria. É necessário conta/projeto EAS, API definitiva acessível no Android e validação do APK instalado. Não houve commit/push; as mudanças estão locais para revisão.
