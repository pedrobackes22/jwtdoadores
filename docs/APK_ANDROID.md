# Entrega 4 — APK Android

Revisão: 16/11/2026. APK ainda não gerado. Nenhum commit ou push executado.

## Estrutura e configuração

- Cliente Expo/React Native: App.js, screens/, navigation/, components/, contexts/ e services/. O cliente HTTP usa EXPO_PUBLIC_API_URL e a sessão usa SecureStore no Android.
- Servidor separado: backend/ (Express, autenticação JWT, rotas e conexão MySQL). Estrutura SQL em database/. O APK não inclui nem inicia o servidor ou o banco.
- eas.json já continha preview com distribution=internal, android.buildType=apk e environment=preview. Foi acrescentado developmentClient=false para explicitar um aplicativo independente do Metro/Expo Go. Production permanece AAB.
- app.json define br.com.alimentaplus.app. Falta vincular o projeto EAS (extra.eas.projectId); não foi inventado um identificador.
- app.config.js já bloqueia builds sem URL adequada e exige HTTPS público nos perfis configurados. Nesse caso, também desabilita tráfego HTTP no Android.
- .gitignore e .easignore já excluem arquivos de ambiente e credenciais. O arquivo de upload também exclui backend e SQL. Não colocar segredos em EXPO_PUBLIC_*: esses valores entram no APK.

## Pendências antes de compilar

A configuração local da API não atende ao uso fora da rede local. Não foi fornecida uma URL pública real para substituir essa configuração. Hospede a API Express e o MySQL acessível por ela, com domínio HTTPS estável. Não publique a porta do MySQL para o celular: o aplicativo acessa somente a API. Configure DB_* e JWT_SECRET exclusivamente no servidor.

O comando de início da hospedagem é node backend/server.js (npm start inicia o Expo). O servidor já respeita PORT e escuta 0.0.0.0. Verifique conexão com o banco, TLS e configuração do proxy conforme a hospedagem escolhida. /api/health sozinho não testa consultas ao MySQL.

## Comandos no PowerShell

Use npm.cmd/npx.cmd para evitar o bloqueio de scripts .ps1 deste computador. Execute na raiz do projeto. Troque o marcador pela URL REAL da hospedagem; não execute o build com o marcador.

```powershell
npm.cmd ci
$env:EXPO_PUBLIC_API_URL='https://DOMINIO-REAL/api'
npm.cmd run apk:check
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest whoami
npx.cmd eas-cli@latest build:configure --platform android
```

Crie ou vincule o projeto correto quando solicitado. Se o EAS não conseguir escrever na configuração dinâmica, use os valores que ele fornecer para owner e extra.eas.projectId em app.json. Preserve o perfil preview existente. Não compartilhe senha ou token.

Cadastre a mesma URL no ambiente remoto, pois o .env local não é enviado:

```powershell
npx.cmd eas-cli@latest env:set --environment preview --name EXPO_PUBLIC_API_URL --value "$env:EXPO_PUBLIC_API_URL" --visibility plaintext
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npx.cmd expo install --check
npx.cmd expo-doctor@latest
$env:ALIMENTA_APK='1'
$env:ALIMENTA_API_PUBLICA='1'
npx.cmd expo config --type public
npm.cmd run export:android
npx.cmd eas-cli@latest build --platform android --profile preview
```

Avance apenas quando as verificações passarem. Se solicitado, permita ao EAS gerar/gerenciar a chave de assinatura Android e preserve acesso à conta para futuras atualizações. Não versione a chave ou sua senha. A URL fica embutida no aplicativo: mudar a URL exige outro APK nesta configuração.

Após terminar, remova somente as variáveis temporárias desta sessão:

```powershell
Remove-Item Env:EXPO_PUBLIC_API_URL, Env:ALIMENTA_APK, Env:ALIMENTA_API_PUBLICA
```

## Baixar e instalar

O terminal fornece o link da página do build. Aguarde o estado Finished, abra essa página no celular e use o botão de download/instalação para baixar o .apk. Autorize a instalação pelo navegador quando o Android solicitar. O APK preview funciona sem Expo Go ou Metro, mas suas operações dependem da API e do banco disponíveis.

Para reencontrar o build:

```powershell
npx.cmd eas-cli@latest build:list --platform android --build-profile preview --limit 1
```

## Verificação desta revisão

- 12 testes passaram usando node --test --test-isolation=none backend/tests/regras.test.js tests/clienteApi.test.js tests/configBuild.test.js. A execução normal encontrou spawn EPERM no ambiente restrito.
- Lint e TypeScript concluíram sem erros.
- expo install --check em modo offline indicou dependências atualizadas, com ressalva do próprio Expo sobre confiabilidade offline. A consulta online falhou por restrição de rede; repetir com internet e executar expo-doctor.
- Exportação Android processou 874 módulos, mas falhou ao iniciar Hermes com spawn EPERM. A exportação completa e a compilação nativa continuam pendentes; isso não comprova erro no código nem sucesso do APK.
- apk:check falhou por falta de URL pública configurada. Não foi testada disponibilidade de uma hospedagem externa, nem login/vínculo remoto EAS nesta revisão.

## Testar antes de entregar

- Instalar e abrir o APK em Android físico, com Metro desligado; fechar e reabrir para testar restauração da sessão e logout.
- Em dados móveis ou outro Wi-Fi: cadastro/login dos dois perfis, lista, busca e detalhes; publicação, edição e exclusão de oferta.
- Solicitação pelo receptor, aprovação/recusa pelo doador, cancelamento, endereço após aprovação e confirmação de entrega; conferir permissões entre perfis.
- Quantidades, saldo, unidades e datas; campos inválidos, credenciais incorretas, sessão expirada e tentativa duplicada.
- Sem internet/API indisponível: mensagens de erro, tempo limite e recuperação da conexão.
- Conferir persistência no MySQL hospedado após reiniciar API/app, layout/teclado/calendário no celular e disponibilidade da hospedagem durante a apresentação.
- Guardar APK, versão e link do build; preparar contas e dados de demonstração sem informações pessoais.

Referências oficiais: [APK](https://docs.expo.dev/build-reference/apk/), [variáveis de ambiente](https://docs.expo.dev/eas/environment-variables/) e [configuração EAS](https://docs.expo.dev/build-reference/build-configuration/).
