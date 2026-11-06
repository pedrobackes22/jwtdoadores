# Validação — 06/11/2026

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
