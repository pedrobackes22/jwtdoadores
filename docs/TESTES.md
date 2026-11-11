# Validação final — 11/11/2026

| Comando/verificação desta revisão final | Resultado | Limite |
| --- | --- | --- |
| `npm.cmd test` e duas chamadas `npm.cmd run test` | 12 aprovados e zero falhas em cada execução | Mesma suíte, não somar aliases como casos novos. |
| `npm.cmd run test:mysql` | 16 aprovados, zero falhas | MySQL isolado; inclui regressão decimal 0,1 + 0,2 e preservação dos scripts. |
| `npm.cmd run test:web` | 17 aprovados, zero falhas | Edge com API/MySQL reais e origens separadas; dez telas, CRUD e estados completos. |
| `npm.cmd run lint` | Sem erros/avisos | Inclui app.config.js e novos testes. |
| `npm.cmd run typecheck` | Concluído | JS sem checkJs estrito. |
| `npx.cmd expo install --check` | Dependencies are up to date | Após patches Expo 58.0.24, SecureStore 58.0.3 e StatusBar 58.0.5. |
| `npx.cmd --yes expo-doctor` | 20/20 aprovados | Não substitui teste físico/segurança. |
| `npm.cmd run export:android` | Bundle Hermes gerado | Foi verificado com URL LAN durante a investigação; essa URL foi depois retirada conforme nova instrução. Não é APK, não foi instalado. |
| Configuração pública por `@expo/config` com URL de formato HTTPS de teste | Avaliada; `usesCleartextTraffic=false` | Teste estático, sem rede ou publicação. Não foi inventada API pública real. |
| `/api/health` em localhost e 172.20.134.251 | HTTP 200 pelo computador | Não comprova acesso de outro aparelho/rede; usuário informou redes diferentes. |
| `npm.cmd run apk:check` no estado final sem URL pública | Bloqueio esperado (exit 1) | URL HTTPS/hospedagem ainda não configurada; não houve build. |
| `npx.cmd --yes eas-cli@latest whoami` | Not logged in | Build cloud bloqueado também por autenticação/projeto. |
| `npm.cmd audit fix --dry-run`, `npm.cmd audit fix` sem force, audit final | 9 moderados; zero high/critical | Patches compatíveis aplicados; avisos residuais exigiriam mudanças não consideradas seguras para esta entrega. |
| `git ls-remote` | Remoto b37fd98; local final 291988e | Consulta somente leitura; sete commits locais ainda não publicados. Commit 291988e observado durante o trabalho, criado por outra ação, sem comando de commit/push do agente. |
| `git diff --check` | Sem erros | Avisos de conversão LF/CRLF são configuração Git, não falhas de whitespace. |

Fluxo visual final: cadastro DOADOR → login inválido e válido → publicar com validade de hoje → conferir SQL → editar data/descrição → logout → RECEPTOR consulta/busca/detalhes → solicita → DOADOR aprova → RECEPTOR consulta endereço → DOADOR entrega → RECEPTOR cria/cancela outro pedido → cria novamente → DOADOR recusa → consulta filtro de pedidos → exclui logicamente a oferta → logout. Banco confirma preservação do registro com status EXCLUIDO. As dez telas são exercitadas nas rotas dos dois papéis.

API testa cadastro dos dois papéis, bcrypt, JWT/Bearer inválido/expirado, 401/403 e propriedade, validações, CRUD, estados, duas aprovações concorrentes, total decimal com reserva/entrega, persistência após reiniciar API/reconectar MySQL e scripts SQL sem alteração dos registros existentes. Nenhum dado real foi inserido/alterado/apagado pelos testes. A revisão real continua apenas leitura, com os mesmos três valores antigos de unidade pendentes de confirmação.

Intermediários: a atualização Expo solicitou registrar o plugin StatusBar na configuração dinâmica; ele foi incluído e as verificações passaram. Os primeiros comandos de auditoria exigiram ajuste de leitura UTF-16 da saída redirecionada do PowerShell; o relatório final foi consultado diretamente, sem interferir no aplicativo. `npm audit` retorna 1 pelos avisos moderados; isso não foi omitido ou tratado como sucesso limpo.

Hospedagem, acesso público pelo celular, APK/build/instalação e SecureStore físico não foram executados. Nenhum túnel ou recurso externo foi criado. Leia [HOSPEDAGEM_API.md](HOSPEDAGEM_API.md), [APK_ANDROID.md](APK_ANDROID.md) e a [auditoria das entregas](AUDITORIA_ENTREGAS.md).

---

# Histórico — revisão anterior de banco/formulário em 11/11/2026

As contagens abaixo são registros anteriores; a tabela final acima prevalece.

Revisão adicional do banco: [AUDITORIA_BANCO.md](AUDITORIA_BANCO.md). O schema real foi consultado apenas em leitura e não exige alteração estrutural. Foram encontrados três registros de unidade incompatíveis com as opções atuais, preservados para confirmação. A suíte MySQL ganhou uma verificação dos novos scripts de instalação/diagnóstico, comparando estrutura e checksums antes/depois. Resultados atuais: **15 testes MySQL e 16 testes Web aprovados**, sem falhas.

Atualização do formulário: calendário React Native compartilhado Web/Android, exibição brasileira e envio ISO; unidade por opções fixas e quantidade positiva. `npm test` agora possui **9 aprovados**. O fluxo Web publica com validade de hoje, confere o registro diretamente no MySQL isolado, edita a validade pelo calendário para o mês seguinte e verifica os dados SQL e a exibição no receptor. Inclui rejeição de quantidade zero pela interface, unidades inválidas pela API e testes de virada do dia UTC/Brasília. O calendário não exige instalação de dependência nativa. Bundle Android exportado; interação em aparelho físico permanece não verificada. A primeira execução do teste novo encontrou ambiguidade entre texto de cartão e detalhes; o seletor foi corrigido para correspondência exata.

Nesta atualização foram reexecutados `npm test`, `npm run lint`, `npm run typecheck`, `npm run test:web` e `npm run export:android`. Os outros comandos da tabela conservam os resultados da auditoria de 10/11; o teste Web executa também todos os cenários MySQL com banco isolado. Captura do calendário: [calendario.png](calendario.png). Em 11/11/2026, a data 10/11/2026 já está vencida e continua sendo rejeitada por regra de negócio.

| Comando / verificação final | Aprovados | Falhas | Resultado e limite |
| --- | --- | --- | --- |
| `npm.cmd test` | 9 | 0 | Quatro testes de regras/datas + cinco testes do cliente. |
| `npm.cmd run test:mysql` | 15 | 0 | Cenário-pai + 14 subtestes com MySQL real isolado, incluindo preservação dos scripts SQL. |
| `npm.cmd run test:web` | 16 | 0 | Os 15 anteriores + fluxo Edge entre origens: cadastro, login inválido/válido, publicação, pedido, aprovação, endereço, entrega e logout. |
| `node scripts/verificar-expo-web.js` | Smoke concluído | 0 | Expo localhost:8081 → API localhost:3000/api; erros 401/400 na tela, sem gravar registros pessoais e sem erros de página. |
| `npm.cmd run lint` | Concluído | 0 | Sem avisos na execução final. |
| `npm.cmd run typecheck` | Concluído | 0 | Verificação sintática/estrutural, `checkJs=false`. |
| `npx.cmd expo install --check` | Concluído | 0 | Dependências compatíveis segundo Expo instalado. |
| `npm.cmd run api:dev` | Iniciou | 0 | Porta 3000, MySQL pessoal conectado; health 200. |
| `npx.cmd expo start --web --clear --port 8081` | Iniciou | 0 | `.env` raiz carregado; interface exercitada pelo smoke. |
| `npm.cmd run export:android` | Bundle gerado | 0 | Bundle Hermes; não equivale a APK gerado/instalado. |
| `git diff --check` | Concluído | 0 | Sem erros de whitespace. |
| `npm.cmd audit --omit=dev --json` | Não limpo | 5 moderados | Zero high/critical; cadeia glob/minimatch/Expo. Comando retorna código 1 pelos avisos. |

As contagens de integração incluem o teste-pai e não são quantidades de ações de interface. As suítes MySQL e Web repetem cenários; não some as contagens como casos únicos. O banco pessoal não foi usado para criar contas de teste. As instâncias temporárias, dados e logs ficam em `.mysql-validation/`, sem DROP ou limpeza do banco pessoal.

Os avisos de dependências permanecem: a correção sugerida pelo npm implica mudar a versão principal do Expo; não foi aplicado `audit fix --force`. Nenhuma atualização de dependências foi feita nesta auditoria.

Falhas intermediárias corrigidas: execução de `npm.ps1` bloqueada pelo PowerShell (usado `npm.cmd`), criação de processos bloqueada no sandbox (testes executados com autorização apropriada), consulta de hash `LIMIT 1` dependente da ordem das contas (agora filtra pelo e-mail), captura de preflight automático não exposta pelo Playwright (OPTIONS validado diretamente via HTTP; navegador confirma acesso entre origens). A versão inicial dos novos testes Web falhou por essas duas suposições de teste; a execução final passou integralmente.

Não foi reproduzida a falha original de transporte na configuração atual. O código foi corrigido para preservar diagnósticos e o caminho real de cadastro/login foi exercitado com MySQL isolado. O smoke do banco pessoal usou somente login inválido e cadastro inválido. Detalhes: [AUDITORIA_ENTREGAS.md](AUDITORIA_ENTREGAS.md).

Pendentes: testes de SecureStore/retomada e interface em Android físico, build EAS, instalação e teste do APK, correspondência APK/remoto e apresentação do aluno. O teste de persistência reinicia a API e reconecta ao MySQL; não reinicia o serviço MySQL pessoal. A configuração Android usa HTTP para desenvolvimento; build final exige URL acessível ao aparelho. Não foi executado `expo-doctor` nesta auditoria.

As capturas [doacoes.png](doacoes.png), [aprovacao.png](aprovacao.png) e [retirada.png](retirada.png) foram atualizadas pelo fluxo de 10/11. O export Android sobrescreve `dist`; antes de servir Web estático, refaça `npm run export:web` com a URL adequada. O Expo Web usa seu próprio servidor e continua lendo o `.env` raiz.

---

# Histórico — 06/11/2026

Os resultados abaixo são registros anteriores, não evidência da execução atual. Informações sobre configuração local, autenticação EAS e auditoria de dependências podem ter mudado; use a tabela atual acima.

Os resultados abaixo são desta implementação. Não foram copiados do projeto de referência.

| Verificação executada | Resultado |
| --- | --- |
| `npm test` | 3 testes de regras aprovados |
| `npm run test:mysql` | 11 testes aprovados, incluindo o cenário principal com 10 subtestes |
| `npm run test:web` | 12 testes aprovados, incluindo o cenário principal com 11 subtestes; navegador Edge headless com API e MySQL reais |
| `npm run lint` | Sem erros ou avisos |
| `npm run typecheck` | Concluído; validação sintática/estrutural dos arquivos JS, sem checkJs estrito |
| `npx expo-doctor` | 20/20 verificações aprovadas |
| Exportação Expo Web | Bundle gerado e executado no navegador |
| Exportação Expo Android | Bundle Hermes gerado; não equivale a APK instalado |

Ambiente: Windows, Node 24.11.0, MySQL 8.0 instalado localmente, instâncias isoladas criadas pelo runner. O serviço/banco pessoal não foi alterado. Logs e dados descartáveis ficam em `.mysql-validation/`, ignorada pelo Git. Cada execução cria uma pasta própria e encerra o servidor temporário ao final.

## Cobertura real da API e do banco

Cadastro de doador/receptor; conflito de e-mail; hash bcrypt; login válido/inválido; emissão e verificação JWT; ausência de token; token inválido/expirado; perfil; publicação real; bloqueio de receptor; catálogo e detalhes; endereço oculto; listagem do doador; edição do proprietário e bloqueio de outro doador; validade e quantidade inválidas; pedido real; duplicação ativa; limite de quantidade; pendência sem reserva; solicitações recebidas; aprovação restrita ao dono; duas aprovações simultâneas para saldo insuficiente; edição/exclusão com reserva bloqueadas; recusa liberando reserva; entrega consumindo estoque; cancelamento restrito ao receptor proprietário; exclusão lógica e histórico; oferta vencida fora do catálogo; persistência após reiniciar a API e abrir outra conexão com o banco.

Um teste inicial revelou que a leitura do estoque sob o isolamento padrão REPEATABLE READ podia usar um snapshot anterior à obtenção do bloqueio. A implementação foi corrigida para READ COMMITTED, mantendo o bloqueio do alimento. O cenário concorrente foi repetido com sucesso: dois pedidos de 7 para uma oferta de 10 resultam em respostas 200 e 409, reservada 7 e disponível 3.

## Fluxo visual verificado

Sem interceptação/simulação de HTTP: login como doador → publicação pela tela → logout → login receptor → catálogo real → detalhes sem endereço completo → pedido de 2 kg → logout → login doador → aprovação pela tela → logout → receptor consulta endereço liberado. Nenhum erro JavaScript de página foi registrado.

Capturas produzidas automaticamente:

- [Doações](doacoes.png)
- [Aprovação](aprovacao.png)
- [Retirada](retirada.png)

## Checklist nativo manual pendente

| Caso | Procedimento | Resultado esperado |
| --- | --- | --- |
| Expo Go | Abrir QR code em Android com SDK compatível | Login exibido sem erro nativo |
| Rede física | Configurar IPv4 real e abrir `/api/health` no celular | API acessível pela mesma rede |
| Persistência de sessão | Login, encerrar o app completamente e reabrir | SecureStore restaura token e `/auth/me` recupera perfil |
| Falha de rede na restauração | Reabrir offline após login | Aviso e nova tentativa; token preservado |
| Expiração | Usar token expirado no dispositivo | Token removido e retorno ao login |
| Logout | Sair, reiniciar e tentar voltar | Login; tela anterior não reabre sessão |
| Teclado e rolagem | Preencher formulário inteiro em aparelho pequeno | Campos acessíveis e botões alcançáveis |
| Build APK | Gerar, baixar, instalar e executar fluxo na API definitiva | Arquivo instalável corresponde ao código final |

Esses testes nativos não foram executados: não havia aparelho Android conectado nem SDK Android configurado neste ambiente. A persistência do banco foi testada; a persistência do SecureStore no aparelho permanece manual. Na Web, recarregar a página encerra intencionalmente a sessão em memória.

## Dependências e pendências

A auditoria completa reportou 12 avisos de severidade moderada na cadeia de ferramentas Expo/ESLint (glob/minimatch e dependentes), sem avisos high/critical na execução. Não foi aplicado `npm audit fix --force`, que propõe trocar a versão principal do Expo e romper a compatibilidade da referência. Reavalie com `npm audit` antes de distribuir.

O banco de desenvolvimento e o segredo JWT precisam ser configurados em `backend/.env`. O `.env` da raiz precisa do IP da rede/API definitiva. As contas dos testes são descartáveis e não ficam no banco de desenvolvimento. APK e publicação remota não estão concluídos; configuração de build não comprova geração de APK. Consulte o README para os comandos.

`npx eas-cli@latest whoami` foi executado e retornou `Not logged in`. Portanto, o APK está bloqueado pela autenticação/projeto EAS e pela configuração de uma API definitiva para o build. Não foi gerado arquivo APK nem feita alteração em repositório remoto.
