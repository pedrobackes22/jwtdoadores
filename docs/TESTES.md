# Testes e evidências — 12/11/2026

Esta tabela contém **execuções desta auditoria**, não resultados reaproveitados. As contagens de MySQL/Web incluem o teste-pai e compartilham cenários; não devem ser somadas como testes funcionais exclusivos. Relatório de conformidade: [AUDITORIA_ENTREGAS.md](AUDITORIA_ENTREGAS.md).

| Comando executado | Resultado real | Escopo e limite |
| --- | --- | --- |
| `npm.cmd test` | 12 aprovados, 0 falhas | Regras/datas, cliente HTTP e configuração de build. |
| `npm.cmd run test:mysql` | 16 aprovados, 0 falhas | Instância MySQL real isolada: auth, permissões, CRUD, estados, concorrência, precisão decimal, persistência e scripts SQL. |
| `npm.cmd run test:web` | 17 aprovados, 0 falhas na execução final | Edge real + API/MySQL isolados; dez telas e regressões de busca/edição. |
| `npm.cmd run lint` | Sem erros/avisos na execução final | Reexecutado após corrigir a atualização de estado no efeito de carregamento. |
| `npm.cmd run typecheck` | Concluído | JavaScript com checkJs=false; não é checagem estrita de tipos. |
| `npx.cmd --yes expo-doctor` | 20/20 verificações aprovadas | Compatibilidade/configuração, não prova de aparelho ou audit limpo. |
| `npx.cmd expo export --platform ios --output-dir .expo/auditoria-ios` | Bundle Hermes gerado | Compilação local gratuita; não é app instalado nem teste no Expo Go físico. |
| `npx.cmd expo export --platform android --output-dir .expo/auditoria-android` | Bundle Hermes gerado | Não gera APK. Saída separada do Web para não disputar dist. |
| `npm.cmd audit --json --registry=https://registry.npmjs.org --fetch-timeout=15000 --fetch-retries=0` | 9 moderados, 0 high/critical | Cadeias minimatch, Expo/fingerprint e ESLint. Npm retorna falha de audit pelos avisos; não foi aplicado force. |
| `npm.cmd run apk:check` | Bloqueio esperado, exit 1 | Não há URL pública HTTPS configurada; não houve build ou publicação. |
| `npx.cmd --yes eas-cli@latest whoami` | Not logged in, exit 1 | Conta EAS não autenticada; projectId ausente nos arquivos. |
| `git ls-remote origin HEAD refs/heads/main` | Remoto b37fd98 | Local inicial e2c0b15, oito commits à frente; nenhum commit/push desta auditoria. |
| Diagnóstico SQL em START TRANSACTION READ ONLY | 5 usuários, 4 alimentos, 2 solicitações | 16 verificações zeradas e 1 com três unidades inválidas; nada modificado. |
| Busca privada de credenciais em nove commits | Correspondência de DB_PASSWORD em três versões antigas do exemplo | Valor não exibido; precisa rotação autorizada antes de push. JWT local atual não encontrado no histórico consultado. |
| `git diff --check` | Sem erros de whitespace | Avisos LF/CRLF são configuração do Git. |

## Fluxo real e regressões

Cadastro DOADOR → login inválido/válido → publicar validade de hoje, unidade e quantidade → conferir SQL → simular falha HTTP 500 na leitura da edição e verificar que não há formulário/salvamento habilitado → recuperar a leitura real → editar e conferir SQL → logout → RECEPTOR → atrasar uma resposta real de busca antiga e executar busca nova → confirmar que a resposta velha não apaga a atual → detalhes, pedido, aprovação, retirada, entrega, cancelamento de outro pedido, novo pedido recusado, filtro de solicitações, exclusão lógica e logout.

O fluxo principal não usa catálogo fictício ou banco simulado. Somente o erro negativo de GET de edição é simulado; o atraso da busca usa resposta obtida da API real por route.fetch. As dez telas e as abas de ambos os papéis são percorridas. A inspeção SQL confirma registro preservado com status EXCLUIDO, data ISO, unidade e quantidade corretas.

Testes API diretos conferem cadastro DOADOR/RECEPTOR, bcrypt sem retorno de hash, duplicação de e-mail, senhas com espaços preservados e senha composta só de espaços rejeitada, cabeçalho bearer com separadores válidos, JWT inválido/expirado, 401/403, propriedade, CRUD, datas/unidades/quantidades inválidas, pedido duplicado, vencimento, transições, duas aprovações concorrentes e total decimal comprometido. O teste de persistência reinicia a API e abre nova conexão MySQL; não reinicia o serviço pessoal. Os scripts de instalação/diagnóstico são conferidos por estrutura e checksum antes/depois em base isolada.

## Falhas intermediárias e correções

A primeira verificação de lint das mudanças apontou react-hooks/set-state-in-effect no início do carregamento. A atualização foi movida para o evento de nova tentativa e o formulário reinicia pelo ID; a regra não foi desabilitada. Lint/typecheck e teste Web afetado foram reexecutados com sucesso.

O Metro detectou um cache incompatível na exportação iOS e refez a leitura completa automaticamente; exportações concluíram. Os avisos NO_COLOR/FORCE_COLOR não são falha de aplicativo. Nenhum comando foi usado para apagar diretórios ou banco pessoal.

## Segurança comprovada e limites

O teste de busca/cancelamento de consultas impede atualizações antigas no estado da lista. O formulário de edição não permite sobrescrever dados após falhar ao carregar. A API mantém permissões e validações no servidor.

A senha MySQL atual coincide com DB_PASSWORD em backend/.env.example nos commits b170a77, 0b8d557 e c245a1c. O valor não foi impresso no relatório nem alterado no banco. `.env` e credenciais não estão rastreados no HEAD e são ignorados, mas isso não saneia o histórico. O resultado exige ação humana antes da publicação; não equivale a vulnerabilidade já explorada ou prova de exposição do banco à internet.

## Não executado / pendente

- Hospedagem Railway/API HTTPS e banco privado: só plano; sem URL/conta/publicação confirmadas.
- Build EAS/APK: não iniciado, sem login/projeto/URL e sem autorização de custos.
- Instalação Android, SecureStore após fechamento/reabertura e teclado/rolagem físicos.
- Expo Go no iPhone: apenas bundle iOS compilado; aparelho não executado.
- Persistência Web depois de reload: não implementada, token em memória da aba.
- Rotação de senha MySQL, correção das três unidades antigas, migração de dados, commit e push: não autorizados/executados.
- Defesa/apresentação do aluno e correspondência do APK com o remoto.

Passos exatos e comprovações: [PENDENCIAS_FINAIS.md](PENDENCIAS_FINAIS.md). Capturas Web atualizadas: [calendário](calendario.png), [doações](doacoes.png), [aprovação](aprovacao.png), [retirada](retirada.png). Elas não são capturas de um aparelho nativo.
