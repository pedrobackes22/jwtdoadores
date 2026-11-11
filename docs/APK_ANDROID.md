# APK Android — configuração e sequência de entrega

## Estado atual

**APK não gerado.** O usuário confirmou que o celular está em outra rede e solicitou API pública HTTPS. O IP privado foi removido de `eas.json`. API pública ainda não existe/autorizada, e `eas whoami` retornou **Not logged in**. Também falta vincular um projeto EAS; não há `extra.eas.projectId` configurado. Nenhum build ou upload foi iniciado.

- `preview`: distribuição interna e `android.buildType = apk`.
- `production`: AAB, não é o perfil de instalação direta para apresentação.
- Ambos exigem URL pública HTTPS por `ALIMENTA_API_PUBLICA=1`.
- `app.config.js` interrompe builds com URL ausente, local, privada/de emulador ou de exemplo. No perfil público, Android usa `usesCleartextTraffic=false`.
- Desenvolvimento local continua permitindo HTTP, e o `.env` do Expo Web continua `http://localhost:3000/api`.
- `.easignore` exclui backend, SQL, `.env`, credenciais, dumps/logs/artefatos de teste. MySQL e JWT não são configurações do cliente.

O bundle Hermes foi validado nesta revisão antes da decisão de exigir hospedagem pública. Exportação de bundle não é APK instalável. Não houve teste de instalação, SecureStore ou retomada em Android físico.

## Antes do build

1. Escolha a hospedagem e autorize a publicação conforme [HOSPEDAGEM_API.md](HOSPEDAGEM_API.md).
2. Valide a API pela internet e pelo celular em outra rede, incluindo o fluxo real com banco. `health` no computador sozinho não comprova isso.
3. Confirme a URL estável terminando em `/api`. Não usar `172.20.134.251`, localhost ou endereço de emulador.
4. Faça login no EAS localmente, sem compartilhar sua senha:

```powershell
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest whoami
npx.cmd eas-cli@latest build:configure
```

Quando solicitado, crie/vincule seu projeto. Se a configuração dinâmica impedir escrita automática, insira `owner`/`extra.eas.projectId` em `app.json` com os valores fornecidos pelo EAS. Não invente IDs. Revise o diff e preserve o perfil preview e a validação de URL.

## Configurar a URL pública e testar

Após a API existir, use a URL **real**, não os marcadores abaixo:

```powershell
npx.cmd eas-cli@latest env:set --environment preview --name EXPO_PUBLIC_API_URL --value https://DOMINIO-REAL/api --visibility plaintext
$env:EXPO_PUBLIC_API_URL='https://DOMINIO-REAL/api'
npm.cmd run apk:check
Remove-Item Env:EXPO_PUBLIC_API_URL
```

`apk:check` valida o formato e consulta `/api/health` a partir do computador; não substitui o teste no celular. Sem URL configurada ele falha intencionalmente. A URL pública entra no aplicativo e não é segredo; `DB_PASSWORD` e `JWT_SECRET` nunca devem usar prefixo `EXPO_PUBLIC_`.

Confirme também a configuração local do perfil sem iniciar build:

```powershell
$env:EXPO_PUBLIC_API_URL='https://DOMINIO-REAL/api'
$env:ALIMENTA_APK='1'
$env:ALIMENTA_API_PUBLICA='1'
npx.cmd expo config --type public
Remove-Item Env:EXPO_PUBLIC_API_URL, Env:ALIMENTA_APK, Env:ALIMENTA_API_PUBLICA
```

## Gerar (somente após confirmação)

```powershell
npx.cmd eas-cli@latest build --platform android --profile preview
```

Se necessário, permita ao EAS gerenciar a assinatura Android. Não versione keystore, senha ou `credentials.json`. Aguarde estado final concluído e salve build ID, URL do `.apk` e identificação da versão do código. Fila, exportação ou build com erro não comprovam APK gerado. Não use `--auto-submit`.

Antes da entrega, o código correspondente deve estar no GitHub; commit/push ainda dependem de autorização. Não há Android SDK/adb configurados neste ambiente para uma alternativa local validada.

## Instalar e validar no celular

1. Abra o link do build concluído, baixe o `.apk` e permita a instalação pelo navegador quando solicitado.
2. Abra Alimenta+, cadastre/entre como DOADOR, publique com calendário/unidade, consulte e edite.
3. Entre como RECEPTOR, pesquise, consulte detalhes e solicite. Verifique a ausência das ferramentas de doador e os bloqueios do servidor.
4. No DOADOR, aprove; no RECEPTOR, confira endereço liberado. No DOADOR, marque como entregue.
5. Teste outro pedido para recusa, um pendente para cancelamento e uma oferta sem reserva para exclusão lógica.
6. Feche e reabra: confira SecureStore/restauração. Faça logout e verifique que Voltar não reabre sessão.
7. Repita em Wi-Fi diferente/dados móveis e confira persistência no MySQL da hospedagem. Não exiba senhas, hashes ou dados pessoais ao professor.

Referências oficiais: [APK e instalação](https://docs.expo.dev/build-reference/apk/) e [ambientes EAS](https://docs.expo.dev/eas/environment-variables/).
