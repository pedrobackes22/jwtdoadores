# Auditoria final de conformidade — Alimenta+

Data: **12/11/2026**. **O Alimenta+ ainda não está pronto para a entrega final.** Os fluxos Web/API foram testados e corrigidos; a entrega formal depende de segurança das credenciais, publicação autorizada do código, API HTTPS, APK e validação física.

## Fontes e método

- PDF principal lido integralmente: `referencias/Projeto Avaliativo Aplicacao Mobile JWT.pdf`, **8 páginas**, SHA-256 `8C279488BF09F45F5E2480C24BD2A1B610EDCF75D616E674024FD6A5781B0DD6`. A avaliação corresponde a esse arquivo disponível, sem presumir versões posteriores.
- Projeto atual: App/index, dez telas, componentes, navegação, Context, hooks, serviços, backend, SQL, scripts, testes, configurações e README.
- Referência técnica: `referencias/loja-jwt`, somente leitura; 53 arquivos tiveram hashes registrados para conferir preservação.
- Relatórios anteriores foram consultados como histórico; resultados antigos não substituem as execuções de hoje. Resultados atuais: [TESTES.md](TESTES.md).
- Banco pessoal consultado apenas em transação de leitura. Testes usam MySQL isolado com porta/datadir próprios. Não houve migração de dados, publicação, build pago, commit ou push.

## Resumo e critério de contagem

A matriz contém **62 itens**: **17 indicadores oficiais** do PDF (I) e **45 verificações complementares** (R). Elas detalham o mesmo sistema e não representam 62 funcionalidades independentes.

- **38 ATENDIDOS**, **10 PARCIALMENTE ATENDIDOS**, **8 NÃO ATENDIDOS**, **6 NÃO VERIFICADOS**.
- Considerando somente os 17 indicadores oficiais: **8 atendidos, 8 parciais, 0 não atendidos e 1 não verificado**. Os indicadores amplos podem ser parciais mesmo quando um componente obrigatório, como o APK, está ausente; os itens R explicitam essas ausências.
- ATENDIDO em Web/API não comprova execução em aparelho. Configuração pronta não equivale a hospedagem, APK instalado ou push realizado.

## Indicadores oficiais do professor — todos os 17

| Entrega | Requisito | Situação | Evidência | O que falta | Prioridade |
| --- | --- | --- | --- | --- | --- |
| 1 | I1. Identificação do problema e proposta de solução | ATENDIDO | README: problema social, contexto, público, justificativa e solução | Nada documental no escopo | BAIXA |
| 1 | I2. Definição inicial do sistema | ATENDIDO | README, navigation/AppNavigator.js e telas: tipos, permissões, funcionalidades e fluxo | Nada documental no escopo | BAIXA |
| 1 | I3. Estrutura inicial do aplicativo | ATENDIDO | App.js, index.js, components, screens, package.json; bundles e teste Web | Nada estrutural no escopo | BAIXA |
| 1 | I4. Navegação, versionamento e primeira versão funcional | PARCIALMENTE ATENDIDO | Dez telas percorridas no Web; Git local real; remoto b37fd98 | Publicar versão atual com autorização; cronologia de entregas não comprovada | ALTA |
| 2 | I1. Modelagem dos dados | ATENDIDO | Três entidades, FKs, índices e CHECKs; SQL e teste MySQL de instalação | Nada estrutural; qualidade de registros está no R5 | BAIXA |
| 2 | I2. Estrutura da API | ATENDIDO | backend/app.js, server.js, routes, controllers e database/conexao.js | Nada no escopo local testado | BAIXA |
| 2 | I3. Integração aplicativo, API e banco | ATENDIDO | fetch em services/clienteApi.js; test:mysql e test:web reais | Nada no escopo Web local testado | BAIXA |
| 2 | I4. Evolução, documentação e versionamento | PARCIALMENTE ATENDIDO | README/SQL/relatórios atualizados; nove commits locais | Push autorizado e conferência do remoto atualizado | ALTA |
| 3 | I1. Cadastro, login e proteção de senha | ATENDIDO | authController, bcrypt e testes dos dois papéis, duplicação e credenciais inválidas | Nada funcional no fluxo testado; credencial MySQL histórica é item separado | BAIXA |
| 3 | I2. JWT e gerenciamento da sessão | PARCIALMENTE ATENDIDO | JWT HS256, 8h, issuer/audience, Bearer e expiração; tokenStorage nativo/Web | Confirmar persistência SecureStore em aparelho; Web encerra sessão ao recarregar | ALTA |
| 3 | I3. Controle de acesso | ATENDIDO | Middlewares e matriz HTTP 401/403; propriedade e transições testadas | Nada no backend testado | BAIXA |
| 3 | I4. CRUD e integração geral | PARCIALMENTE ATENDIDO | CRUD válido passa no Web/MySQL; três unidades antigas inválidas no banco real | Confirmar e corrigir dados legados com autorização; ID 3 tem histórico | MÉDIA |
| 3 | I5. Funcionamento, evolução e versionamento | PARCIALMENTE ATENDIDO | Testes atuais aprovados e regressões corrigidas; Git local | Publicar versão final e concluir comprovação nativa | ALTA |
| 4 | I1. Solução final e atendimento ao problema | PARCIALMENTE ATENDIDO | Fluxo doação até entrega funciona no Web | Validar a solução final no aparelho com API acessível | ALTA |
| 4 | I2. Funcionamento, testes e build final | PARCIALMENTE ATENDIDO | 12 unitários, 16 MySQL, 17 Web; Doctor 20/20; bundles iOS/Android | API pública e APK gerado/instalado/testado | ALTA |
| 4 | I3. Demonstração prática e domínio técnico | NÃO VERIFICADO | Roteiro disponível; apresentação do aluno não observada | Ensaiar e realizar defesa/demonstração; mostrar APK final | ALTA |
| 4 | I4. Versionamento, documentação e defesa | PARCIALMENTE ATENDIDO | Documentação e material completos localmente; remoto ainda antigo | Push autorizado, versão do APK correspondente e apresentação | ALTA |

## Verificações complementares dos requisitos

| Entrega | Requisito | Situação | Evidência | O que falta | Prioridade |
| --- | --- | --- | --- | --- | --- |
| 1 | R1. Problema, público, justificativa, proposta e nome | ATENDIDO | README e roteiro | Nada documental | BAIXA |
| 1 | R2. Tipos, permissões, funcionalidades, telas e fluxo | ATENDIDO | README e AppNavigator | Nada documental | BAIXA |
| 1 | R3. Expo, pastas, React Navigation, três ou mais telas e identidade | ATENDIDO | Dez telas, ui.js e exportações | Nada estrutural | BAIXA |
| 1 | R4. Repositório criado e commits reais | ATENDIDO | Branch main; nove commits; origin configurado | Nada quanto à existência | BAIXA |
| 1 | R5. Repositório atualizado no momento de cada entrega | NÃO VERIFICADO | Histórico local disponível; sem comprovação dos envios por etapa | Conferir datas de entrega e evidências reais, sem inventar commits | ALTA |
| 2 | R1. Requisitos funcionais e documentação técnica atualizados | ATENDIDO | README, roteiro, SQL e esta matriz | Nada documental | BAIXA |
| 2 | R2. Tabelas, campos, relacionamentos e scripts SQL | ATENDIDO | usuarios/alimentos/solicitacoes e estrutura_final_alimenta_plus.sql | Nada estrutural | BAIXA |
| 2 | R3. Conexão real, fetch e GET/POST da entidade principal | ATENDIDO | API/mysql2 e testes MySQL/Web | Nada no escopo testado | BAIXA |
| 2 | R4. Persistência após fechar/reabrir a API | ATENDIDO | Teste reinicia API e abre nova conexão MySQL | Reinício do serviço MySQL pessoal não foi necessário nem executado | BAIXA |
| 2 | R5. Registros existentes coerentes com as opções atuais | PARCIALMENTE ATENDIDO | Diagnóstico read-only: unidades 11, 2,5kg, kgaaa em IDs 1/2/3 | Confirmar unidade/quantidade e autorizar correção preservando histórico | MÉDIA |
| 3 | R1. Cadastro dos dois papéis | ATENDIDO | test:mysql; tela de cadastro no fluxo Web | Nada no escopo testado | BAIXA |
| 3 | R2. Hash bcrypt e respostas sem hash | ATENDIDO | authController e testes SQL/HTTP | Nada no escopo testado | BAIXA |
| 3 | R3. Login válido/inválido e validação de dados | ATENDIDO | Testes HTTP/Web; senha só de espaços rejeitada | Nada no escopo testado | BAIXA |
| 3 | R4. JWT assinado, prazo, emissor e audiência | ATENDIDO | authController e autenticarToken; testes JWT | Nada no escopo testado | BAIXA |
| 3 | R5. Envio por Bearer e leitura do cabeçalho | ATENDIDO | Cliente HTTP; teste de esquema bearer com espaços | Nada no escopo testado | BAIXA |
| 3 | R6. Token inválido e expirado rejeitados | ATENDIDO | Casos 401 em mysql.integration.test.js e clienteApi.test.js | Nada no escopo testado | BAIXA |
| 3 | R7. Persistência SecureStore após encerrar o app nativo | NÃO VERIFICADO | Implementação em tokenStorage.js; sem dispositivo nesta sessão | Login, encerrar/reabrir Android/iPhone e registrar restauração | ALTA |
| 3 | R8. Sessão Web preservada após recarregar, solicitada pelo usuário | NÃO ATENDIDO | tokenStorage.web.js mantém apenas memória da aba, por decisão existente | Definir se persistência Web é exigida; se for, implementar sessão segura; PDF não exige explicitamente reload Web | MÉDIA |
| 3 | R9. Logout e limpeza após 401 protegido | ATENDIDO | AuthContext e testes Web/cliente | Nada no escopo testado; revogação global não é implementada | BAIXA |
| 3 | R10. Papéis e propriedade no backend | ATENDIDO | Receptor não publica/aprova; doador não edita/exclui/aprova oferta alheia | Nada no escopo testado | BAIXA |
| 3 | R11. CRUD completo para entradas válidas | ATENDIDO | Publicação, leitura, edição e exclusão lógica na API/interface | Dados legados estão no item 2-R5 | BAIXA |
| 3 | R12. Duplicação, saldo e aprovações simultâneas | ATENDIDO | Transações, FOR UPDATE, índice gerado e testes de concorrência/frações | Nada no escopo testado | BAIXA |
| 3 | R13. Calendário, validade, quantidade e unidade | ATENDIDO | Datas brasileiras/ISO, testes de virada UTC, hoje, valores inválidos e unidades | Interação física no aparelho está pendente em item próprio | BAIXA |
| 3 | R14. Doador publica/administra pedidos e consulta histórico | ATENDIDO | MinhasDoacoes e SolicitacoesRecebidas; estados pendente/aprovado/recusado/entregue | Nada no fluxo Web válido; exclusão preserva histórico de pedidos | BAIXA |
| 3 | R15. Receptor busca/detalhes/solicita/cancela/consulta retirada | ATENDIDO | Home, Detalhes, MinhasSolicitacoes e fluxo Web real | Nada no fluxo Web testado | BAIXA |
| 3 | R16. Regressões de busca concorrente e edição com falha | ATENDIDO | Teste Web atrasa resposta real e simula erro HTTP 500 somente na leitura da edição | Nada no escopo desses testes | BAIXA |
| 4 | R1. Navegação pelas dez telas no Web | ATENDIDO | test:web dos dois papéis | Nada no Web; não equivale a execução nativa | BAIXA |
| 4 | R2. Interface e mensagens revisadas | ATENDIDO | Formulário impede editar sem dados; catálogo ignora resposta antiga; avisos HTTP | Limitações físicas estão em itens próprios | BAIXA |
| 4 | R3. Testes obrigatórios executados hoje | ATENDIDO | TESTES.md: test, mysql, web, lint, typecheck e expo-doctor | Nada dos comandos obrigatórios | BAIXA |
| 4 | R4. README, código, SQL e material de apresentação | ATENDIDO | Arquivos locais e roteiro atualizado | Publicação remota é item próprio | BAIXA |
| 4 | R5. API pública HTTPS confirmada | NÃO ATENDIDO | Sem URL pública configurada/validada; apk:check bloqueia | Escolher/autorizar hospedagem, publicar e testar pelo celular | ALTA |
| 4 | R6. MySQL privado acessível à API hospedada | NÃO ATENDIDO | Banco atual é local; Railway consta apenas como plano | Provisionar cópia privada com autorização e testar; não expor 3306 | ALTA |
| 4 | R7. Conta e projeto Expo/EAS configurados para o build | NÃO ATENDIDO | whoami: Not logged in; app.json sem projectId | Login e vinculação na conta do usuário | ALTA |
| 4 | R8. Configuração para APK e bloqueio de URL imprópria | ATENDIDO | eas.json preview/apk; app.config.js; configBuild.test.js | Execução do build é item próprio | BAIXA |
| 4 | R9. APK Android final gerado | NÃO ATENDIDO | Nenhum build/artefato APK produzido | API HTTPS validada, conta EAS e autorização de build | ALTA |
| 4 | R10. APK instalado com navegação/auth/permissões/CRUD | NÃO VERIFICADO | Nenhum APK/dispositivo executado | Instalar artefato final e cumprir checklist físico | ALTA |
| 4 | R11. APK corresponde ao código final do repositório | NÃO ATENDIDO | Sem APK; remoto antigo | Gerar da versão identificada e publicar a mesma versão com autorização | ALTA |
| 4 | R12. GitHub contém a versão atual | NÃO ATENDIDO | Local e2c0b15; remoto b37fd98; oito commits à frente | Autorizar commit das mudanças finais e push após revisar segurança | ALTA |
| 4 | R13. .env e arquivos de credenciais protegidos no estado atual | ATENDIDO | git check-ignore; nenhum arquivo sensível rastreado no HEAD, exemplos sem segredo | Não implica limpeza de histórico | BAIXA |
| 4 | R14. Ausência de credencial real utilizável no histórico | NÃO ATENDIDO | Senha MySQL atual coincide com DB_PASSWORD em exemplos de três commits antigos | Rotacionar com autorização; não enviar essa credencial ainda válida no histórico | ALTA |
| 4 | R15. Expo Go no iPhone executado fisicamente | NÃO VERIFICADO | Bundle iOS exportado; nenhum iPhone conectado/testado | Abrir em Expo Go compatível e API alcançável; testar fluxo/SecureStore | MÉDIA |
| 4 | R16. Bundles JavaScript Android/iOS compatíveis | ATENDIDO | Exportações locais em .expo/auditoria-android e .expo/auditoria-ios | Bundle não é APK nem prova de instalação | BAIXA |
| 4 | R17. Compatibilidade das dependências Expo | ATENDIDO | Expo Doctor 20/20 | Nada no diagnóstico executado | BAIXA |
| 4 | R18. Avisos de segurança das dependências resolvidos | PARCIALMENTE ATENDIDO | npm audit: 9 moderados; zero high/critical | Reavaliar patches seguros; não aplicar downgrade/force incompatível | MÉDIA |
| 4 | R19. Defesa e demonstração prática realizadas | NÃO VERIFICADO | Roteiro existe; apresentação do aluno não observada | Ensaiar, explicar decisões e apresentar APK/banco/repositório | ALTA |

## Erros corrigidos nesta auditoria

- `hooks/useLista.js`: requisições têm sequência e estado de foco. Respostas, erros e finalizações antigas não sobrescrevem busca atual nem atualizam lista fora do foco.
- `components/FormularioAlimento.js`: erro de GET da oferta bloqueia formulário e salvamento; botão de nova tentativa carrega os dados reais; callbacks de uma instância encerrada são ignorados.
- `screens/EditarAlimento.js`: chave pelo ID reinicia o formulário ao trocar a oferta, evitando herdar estado de outro registro.
- `backend/controllers/authController.js`: cadastro direto pela API rejeita senha composta apenas de espaços, sem remover espaços de senhas válidas.
- `backend/middlewares/autenticarToken.js`: aceita esquema Bearer sem depender de maiúsculas e com separadores de espaço válidos; cabeçalhos malformados continuam rejeitados.
- `backend/tests/mysql.integration.test.js`: cobre senha vazia por espaços e cabeçalho bearer com espaços.
- `tests/fluxo-web.js`: regressão com resposta antiga real deliberadamente atrasada e erro 500 simulado somente no GET da edição; o fluxo principal continua usando MySQL/API reais.
- README e relatórios atualizados; `PENDENCIAS_FINAIS.md` criado com passos e comprovações. Não foi alterado schema, dado real ou arquivo da referência.

Arquivos alterados na revisão: `.env.example`, `README.md`, `hooks/useLista.js`, `components/FormularioAlimento.js`, `screens/EditarAlimento.js`, `backend/controllers/authController.js`, `backend/middlewares/autenticarToken.js`, `backend/tests/mysql.integration.test.js`, `tests/fluxo-web.js`, `docs/AUDITORIA_ENTREGAS.md`, `docs/PENDENCIAS_FINAIS.md` (novo), `docs/TESTES.md`, `docs/AUDITORIA_BANCO.md`, `docs/ENTREGAS.md` e `docs/ROTEIRO_APRESENTACAO.md`. As capturas Web `docs/aprovacao.png`, `docs/calendario.png` e `docs/retirada.png` foram atualizadas pelo teste. O exemplo de ambiente recebeu apenas comentário de orientação, sem mudar configuração real.

A conferência final dos hashes dos 53 arquivos de `referencias/loja-jwt` encontrou **zero arquivos modificados**.

## Banco, segurança e Git

Consulta real de hoje: 5 usuários, 4 alimentos, 2 solicitações; zero órfãos, estoque negativo ou pedidos ativos duplicados. Há 3 unidades fora do domínio: IDs 1/2/3, valores 11, 2,5kg e kgaaa; ID 3 ativo tem pedido associado. Não foram corrigidas sem confirmação de significado e autorização.

A comparação privada detectou que a senha MySQL local atual coincide com um valor de `backend/.env.example` nos commits `b170a77`, `0b8d557` e `c245a1c`. **O valor não é reproduzido neste relatório.** O remoto conferido ainda está no primeiro commit, mas um push normal enviará o histórico; trocar a credencial é prioridade antes de publicar. O exemplo atual está vazio. O segredo JWT local atual não foi encontrado nos arquivos de nenhum dos nove commits consultados. Essa verificação não garante ausência de qualquer segredo desconhecido fora dos padrões examinados.

Branch main, origin `https://github.com/pedrobackes22/jwtdoadores.git`; HEAD inicial e2c0b15, remoto b37fd98. Não houve commit/push do agente. Mudanças locais desta auditoria ainda não publicadas. Atualizar .gitignore não remove um segredo do histórico.

## Comparação com loja-jwt

O exemplo separa Express em app/server, usa mysql2 parametrizado, bcrypt/JWT, papel atual consultado no banco, Native Stack, fetch e armazenamento de token. O Alimenta+ preserva esses padrões e os adapta: DOADOR/RECEPTOR em vez de admin/usuário comercial, propriedade de ofertas, validade, endereço condicionado à aprovação, reservas e entrega transacionais, Context/abas e SecureStore nativo. Produto/preço/carrinho não foram importados. O exemplo usa AsyncStorage e URL fixa; Alimenta+ mantém memória no Web e ambiente configurável. Nenhum teste da referência foi usado como prova do aplicativo atual.

## Conclusão por entrega

- Entrega 1: proposta/estrutura/navegação Web demonstradas; publicação e evidências temporais por entrega incompletas.
- Entrega 2: schema/API/fetch/persistência comprovados no ambiente de teste; documentação atual, remoto desatualizado e dados legados pendentes.
- Entrega 3: auth, permissões e CRUD para dados válidos testados; falta comprovação de persistência nativa, resolver unidades antigas e publicar a evolução autorizada.
- Entrega 4: testes, código e documentos locais revisados; **API pública, APK final, instalação/validação física, correspondência com Git e defesa ainda pendentes**.

Próximos passos detalhados, responsáveis, autorização e comprovação: [PENDENCIAS_FINAIS.md](PENDENCIAS_FINAIS.md). Hospedagem é apenas plano; não existe publicação confirmada nesta auditoria. Não há garantia de acesso a serviços criados fora deste ambiente e não informados.
