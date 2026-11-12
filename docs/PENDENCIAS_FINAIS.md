# Pendências finais — Alimenta+

Atualização: **12/11/2026**. A auditoria local foi executada; **a entrega final ainda não está concluída**. Este documento separa ações técnicas de ações que precisam de conta, autorização, escolha de dados ou aparelho. Nenhuma publicação, migração, rotação de credencial, alteração de histórico, commit/push ou build pago foi executado.

## PRIORIDADE ALTA — bloqueadores da entrega

### P1. Credencial MySQL atual presente no histórico local

1. **Falta:** invalidar a senha MySQL atual que coincide com `DB_PASSWORD` em `backend/.env.example` nos commits b170a77, 0b8d557 e c245a1c. O valor não é reproduzido aqui.
2. **Por quê:** remover do exemplo atual/.gitignore não elimina versões antigas. Um push enviará esse histórico; a senha ainda corresponde à conexão local atual.
3. **Entrega:** regra de segurança do PDF em todas as entregas, especialmente 4/versionamento.
4. **Automático:** o agente pode auxiliar após autorização; não pode trocar a credencial ou reescrever Git por conta própria.
5. **Sua participação:** autorizar a rotação e usar a conta administrativa local; não enviar senha na conversa.
6. **Passos:** identificar no Workbench o usuário/host usado pela API; escolher senha nova exclusiva; alterar com privilégio administrativo; atualizar somente `backend/.env` e a conexão privada necessária do Workbench; reiniciar a API; confirmar SELECT 1/login/CRUD; não reutilizar a senha em hospedagem. Revisar o histórico antes de autorizar push. Não é obrigatório reescrever histórico para invalidar a credencial: a rotação é o primeiro passo.
7. **Comprovação:** conexão com a credencial nova e API funcionando; senha anterior deixa de autenticar. Registrar apenas resultado, nunca valores. O JWT local atual não foi encontrado nos nove commits e não foi alterado nesta auditoria.

### P2. Railway/hospedagem: API pública HTTPS e MySQL privado

1. **Falta:** hospedagem realmente publicada/validada; hoje há apenas plano e não há URL pública configurada no projeto.
2. **Por quê:** celular e computador estão em redes diferentes. IP privado, localhost e 10.0.2.2 não atendem o APK definitivo.
3. **Entrega:** 4 — conexão da API no APK; também integração das entregas 2/3 no ambiente final.
4. **Automático:** preparo local está feito; criação de recursos pagos, publicação e cópia de dados dependem de autorização explícita.
5. **Sua participação:** escolher provedor/plano/orçamento e conta; decidir base nova de demonstração ou cópia autorizada dos registros. Não compartilhar credenciais em chat.
6. **Passos:** seguir [HOSPEDAGEM_API.md](HOSPEDAGEM_API.md): criar MySQL privado com volume, conferir versão, instalar SQL em base nova, configurar usuário exclusivo e variáveis privadas; iniciar Express com `node backend/server.js` na raiz; habilitar HTTPS só na API; revisar proxy/rate limit/TLS conforme o provedor; validar health e CRUD externamente. Não abrir porta 3306 residencial/pública, não migrar os dados locais sem autorização.
7. **Comprovação:** URL HTTPS estável, celular em outra rede executando login/CRUD/pedido/entrega, MySQL sem acesso público, registros persistentes e restauração de backup verificada. Health sozinho não basta.

### P3. Expo/EAS: conta e projeto vinculados

1. **Falta:** autenticação EAS e projectId real. `whoami` hoje retornou Not logged in; não há projectId em app.json.
2. **Por quê:** EAS precisa identificar proprietário, projeto e assinatura do binário.
3. **Entrega:** 4 — build APK.
4. **Automático:** o agente pode configurar arquivos depois da vinculação/autorização; login é feito por você, sem expor senha.
5. **Sua participação:** entrar na conta Expo e confirmar projeto/assinatura.
6. **Passos:** executar `npx.cmd eas-cli@latest login`, `whoami` e `build:configure`; vincular/criar projeto da sua conta; se o CLI pedir, inserir owner/projectId fornecidos pelo EAS em app.json. Depois de P2, configurar EXPO_PUBLIC_API_URL real no ambiente preview, mantendo somente variáveis públicas no aplicativo. Seguir [APK_ANDROID.md](APK_ANDROID.md).
7. **Comprovação:** whoami autenticado, projeto correto, perfil preview/apk e URL pública avaliada pela configuração; apk:check confirma health. Esses comandos não comprovam APK gerado.

### P4. APK gerado, instalado e testado em Android físico

1. **Falta:** artefato .apk final e comprovação no aparelho. Existem somente bundles locais, que não são APK.
2. **Por quê:** o PDF exige arquivo Android instalável e fluxo funcional, não apenas configuração/exportação.
3. **Entrega:** 4 — build final e demonstração.
4. **Automático:** só iniciar build após URL validada, conta pronta e sua autorização de eventual custo. Instalação/uso físico exigem aparelho.
5. **Sua participação:** autorizar build, instalar e executar o checklist.
6. **Passos:** concluir P2/P3; aprovar a versão fonte; executar `npx.cmd eas-cli@latest build --platform android --profile preview`; aguardar sucesso; baixar/instalar; testar cadastro/login dos papéis, calendário, CRUD, busca, pedidos, cancelamento, recusa, aprovação, entrega e logout. Encerrar e reabrir para conferir SecureStore e expiração; repetir com celular em rede diferente. Não gerar com IP privado.
7. **Comprovação:** build ID, APK baixável/instalável, identificação da versão, checklist e evidências do aparelho sem dados privados. Erro/fila ou bundle Hermes não são aprovação deste item.

### P5. GitHub atualizado e correspondência entre fonte e APK

1. **Falta:** publicar a versão final e comprovar que o APK foi produzido dessa fonte. Remoto main b37fd98; HEAD local inicial e2c0b15, oito commits à frente, além das mudanças desta revisão.
2. **Por quê:** o professor avalia o repositório; correções apenas locais não contam como entrega.
3. **Entrega:** todas — regra central de versionamento; 4 — correspondência APK/fonte.
4. **Automático:** verificação está feita; commit/push somente após autorização. Não inventar commits retroativos ou reescrever histórico automaticamente.
5. **Sua participação:** revisar diff e autorizar commit/push; concluir P1 antes de enviar histórico.
6. **Passos:** revisar git status/diff, exemplos de ambiente e arquivos sensíveis; registrar a evolução real em commit autorizado; enviar branch main; conferir remotamente arquivos/README/API/SQL; anotar commit fonte exato usado no build e comparar com o artefato. Se novas correções forem necessárias, repetir testes e gerar novo APK da fonte correspondente.
7. **Comprovação:** git ls-remote aponta à versão enviada, arquivos finais visíveis no GitHub e build identificado com commit fonte. Se tiver outra evidência de envios anteriores por etapa, preservá-la; o estado atual não permite inventar essa cronologia.

### P6. Demonstração e defesa do aluno

1. **Falta:** apresentação real e explicação técnica observadas; ter roteiro não comprova domínio/apresentação.
2. **Por quê:** os indicadores da entrega 4 exigem explicar problema, solução, JWT, middleware, níveis, CRUD, API, banco, Git e APK.
3. **Entrega:** 4 — demonstração prática e defesa.
4. **Automático:** agente prepara materiais e testes; não pode realizar a defesa no seu lugar.
5. **Sua participação:** ensaiar e apresentar.
6. **Passos:** seguir [ROTEIRO_APRESENTACAO.md](ROTEIRO_APRESENTACAO.md); demonstrar fluxo com contas próprias e oferta nova válida; mostrar SQL, endpoints, middleware e histórico; não projetar .env, senha, hash ou token. Concluir os requisitos de APK/Git antes de apresentá-los como prontos.
7. **Comprovação:** demonstração concluída e respostas técnicas do aluno, com APK e repositório corretos.

## PRIORIDADE MÉDIA — funcionamento, apresentação e qualidade

### P7. Três unidades antigas inválidas

1. **Falta:** confirmar significado e corrigir IDs 1/2/3 (unidades 11, 2,5kg e kgaaa). IDs 1/2 excluídos; ID 3 ativo, com solicitação no histórico.
2. **Por quê:** o formulário/API aceitam kg, g, unidades, litros e pacotes. A edição de uma unidade antiga com pedido não pode ser resolvida burlando a proteção do histórico.
3. **Entrega:** 2/modelagem coerente e 3/CRUD integrado; afeta a demonstração com dados existentes.
4. **Automático:** não é possível deduzir os valores corretos. Após confirmação e autorização, pode ser preparado um script transacional específico e testado primeiro em cópia.
5. **Sua participação:** informar unidade/quantidade corretas e autorizar uma correção não destrutiva; não basta supor que kgaaa é kg.
6. **Passos:** conferir as ofertas e pedidos no Workbench; confirmar unidade, quantidade e saldo; fazer backup; testar correção em cópia; aprovar script; executar apenas o ajuste aprovado; rever catálogo, histórico e disponibilidade. Não remover registros para esconder o problema.
7. **Comprovação:** diagnóstico de unidades retorna zero; histórico e estoque continuam coerentes; CRUD desses registros passa.

### P8. Sessão Web após recarregar a página

1. **Falta:** a sessão Web não persiste após reload; hoje o JWT fica em memória por decisão de segurança existente. O PDF exige sessão/armazenamento no app mobile, mas não diz explicitamente que o navegador precisa persistir reload.
2. **Por quê:** o pedido de auditoria menciona sessão persistente; não se pode marcar o reload Web como implementado.
3. **Entrega:** 3/JWT e sessão, requisito adicional do pedido.
4. **Automático:** pode ser implementada outra estratégia se esse comportamento for exigido; não introduzir armazenamento inseguro ou nova arquitetura somente para mascarar a pendência.
5. **Sua participação:** definir se persistência é exigida também no navegador ou se a sessão mobile persistente e a memória Web são aceitas.
6. **Passos:** confirmar o comportamento esperado com o professor; se persistência Web for necessária, planejar sessão protegida por cookie HttpOnly/HTTPS e defesas de origem/CSRF, preservando fluxo nativo; implementar e testar reload/expiração/logout. Não simplesmente guardar JWT em localStorage para dizer que o requisito está atendido.
7. **Comprovação:** comportamento acordado documentado e, se implementado, testes de reload, logout e expiração aprovados. Persistência nativa física continua obrigatória no P4.

### P9. Expo Go no iPhone e retomada nativa

1. **Falta:** execução real em iPhone. Bundle iOS compilou, mas não foi aberto em aparelho nesta sessão.
2. **Por quê:** compilação não testa teclado, rolagem, permissões, rede ou SecureStore. O pedido exige verificar Expo Go no iPhone.
3. **Entrega:** 3/sessão e qualidade de 4; iPhone é pedido adicional, APK exigido pelo PDF é Android.
4. **Automático:** exportação JS foi feita; interação física não pode ser comprovada sem aparelho.
5. **Sua participação:** usar iPhone com Expo Go compatível com SDK 58 e acesso à API/Metro.
6. **Passos:** após P2, iniciar Expo em terminal com EXPO_PUBLIC_API_URL real HTTPS (sem editar o .env Web); usar `npx.cmd expo start --clear --port 8082`; colocar iPhone e computador na mesma rede para acesso ao Metro ou autorizar uma alternativa específica de distribuição/túnel de desenvolvimento. QR do Expo não publica a API. Abrir e repetir fluxo, fechar/reabrir e testar logout/expiração/retomada. Ao encerrar, remover a variável temporária do terminal.
7. **Comprovação:** checklist físico e versão Expo Go/iOS registrados; token restaurado após encerramento completo e recusado após expiração. Bundles não substituem essa prova.

### P10. Nove avisos moderados nas dependências

1. **Falta:** avisos atuais nas cadeias minimatch/Expo e ESLint; nenhum high/critical reportado hoje.
2. **Por quê:** qualidade/segurança precisam de acompanhamento; Doctor 20/20 não significa audit limpo.
3. **Entrega:** 4/revisão técnica e código organizado.
4. **Automático:** somente patches compatíveis e verificados. Não aplicar force/downgrade de SDK para zerar a contagem.
5. **Sua participação:** avaliar impacto/prazo se uma mudança maior for necessária; não há correção principal segura aprovada nesta revisão.
6. **Passos:** consultar audit atual, acompanhar versões corrigidas dentro do SDK; aplicar apenas opções compatíveis e repetir test/lint/typecheck/MySQL/Web/doctor/exportações. Manter avisos documentados enquanto não houver correção segura.
7. **Comprovação:** audit reduzido/limpo com versions e suites aprovadas, ou aceitação documentada da limitação. Não tratar como zero vulnerabilidades.

## PRIORIDADE BAIXA — opcional

### P11. Análise de tipos mais forte

1. **Falta:** checkJs estrito; jsconfig atual usa checkJs=false e verifica principalmente sintaxe/estrutura.
2. **Por quê:** melhoria opcional de manutenção; não é requisito do PDF nem substitui testes reais.
3. **Entrega:** qualidade da 4, opcional.
4. **Automático:** possível em trabalho separado, sem converter o projeto para TypeScript.
5. **Sua participação:** escolher se vale ampliar o escopo após concluir bloqueadores.
6. **Passos:** ativar análise gradualmente/JSDoc, corrigir erros reais e repetir testes, preservando JavaScript.
7. **Comprovação:** compilador com escopo/tipos efetivamente verificados e suite aprovada. Não bloqueia a entrega por si só.

## Próxima ação mais importante

**P1: autorizar e concluir a rotação da credencial MySQL antes de publicar o histórico.** Em paralelo, decidir provedor/orçamento e autorizar P2. Sem API HTTPS validada não se inicia o APK final; sem APK e GitHub atualizados não se declara a entrega 4 concluída.

Os passos acima são instruções, não operações já executadas. Nenhuma senha deve ser enviada ao agente ou aparecer no relatório/GitHub.
