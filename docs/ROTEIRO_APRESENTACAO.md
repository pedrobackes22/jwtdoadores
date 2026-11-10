# Roteiro de apresentação — Alimenta+

## Preparação

1. Configure MySQL e os dois `.env` conforme README. Inicie `npm run api:dev` e `npx expo start --web --clear` em terminais separados. No PowerShell restrito, use `npm.cmd` e `npx.cmd`.
2. Abra `http://localhost:8081`. Para celular use o IPv4 do computador; para APK use API acessível no aparelho. Nunca mostre o conteúdo de `.env`, senhas ou tokens na projeção.
3. Tenha uma conta DOADOR e outra RECEPTOR. Use contas próprias de demonstração e alimento com validade futura. Os usuários de teste automatizado não existem no banco pessoal.
4. Abra Workbench no schema `alimenta_plus`, README, controllers, rotas e middlewares. Mostre somente colunas públicas, evitando `senha_hash` em telas compartilhadas.

## Demonstração (8–10 minutos)

**Problema e solução (1 min).** “Alimentos próprios para consumo podem ser desperdiçados enquanto pessoas e instituições precisam deles. O Alimenta+ aproxima doadores e receptores e organiza os pedidos e a retirada.” Explique público, justificativa e identidade verde.

**Cadastro e login (1 min).** Mostre escolha de DOADOR/RECEPTOR, cadastro e login. Explique que o aplicativo envia JSON por `fetch` para Express, que valida os dados e grava no MySQL. Senhas recebem hash bcrypt; o valor original não é salvo.

**JWT e sessão (1 min).** Abra `authController.js` e `autenticarToken.js`: login emite JWT assinado, com expiração de oito horas, emissor e audiência. SecureStore guarda o token no Android; Web mantém a sessão apenas na memória da aba. Requisições protegidas enviam `Authorization: Bearer ...`. O middleware verifica assinatura e validade e consulta o papel atual no banco. Logout remove a sessão local; tokens emitidos não têm revogação global.

**Doador e CRUD (2 min).** Entre como DOADOR. Cadastre alimento com nome, descrição, categoria, quantidade, unidade, validade, cidade, bairro e endereço. Abra Minhas doações, consulte detalhes e edite a descrição. Mostre o registro no MySQL. Explique Create (POST), Read (GET), Update (PUT) e Delete (DELETE lógico). Demonstre exclusão em uma segunda oferta sem reservas e confirme que seu histórico permanece.

**Receptor e solicitação (1 min).** Saia e entre como RECEPTOR. Pesquise o alimento, abra detalhes e consulte quantidade/validade. Mostre que não há ferramenta de cadastro para esse papel. O endereço completo permanece oculto. Solicite uma quantidade menor que o saldo. Se quiser mostrar cancelamento, cancele um pedido pendente e crie outro.

**Aprovação e entrega (1 min).** No DOADOR, abra Solicitações e aprove. No RECEPTOR, mostre endereço liberado. No DOADOR, marque como entregue após retirada. Explique que pendência não reserva, aprovação reserva e entrega consome. Transações e bloqueio da oferta impedem duas aprovações de exceder o saldo.

**Permissões e testes (1 min).** Mostre a suíte MySQL e seus testes de acesso direto: receptor não cadastra nem aprova; outro doador não edita, exclui ou aprova oferta alheia. Não basta esconder botões: o backend retorna 403. Mostre resultados atuais da auditoria e as capturas de interface.

**Encerramento e entrega (1 min).** Mostre SQL, documentação e histórico real do Git. Explique as diferenças para a loja de referência: validade, estoque por reserva, propriedade das ofertas e retirada após aprovação. Declare honestamente: configuração de APK existe, mas APK e instalação no Android ainda precisam ser concluídos; commit/push desta auditoria ainda não foram feitos.

## Perguntas prováveis

- **JWT é criptografia da senha?** Não. JWT comprova autenticação pela assinatura; bcrypt protege a senha armazenada.
- **Por que MySQL?** Persiste usuários, ofertas e solicitações com relacionamentos, restrições e transações.
- **Por que receptor não aprova?** O backend verifica tipo e propriedade antes da alteração.
- **O que impede estoque negativo?** Bloqueio da linha do alimento, leitura do saldo sob READ COMMITTED e validação na mesma transação.
- **Por que localhost falha no celular?** No celular aponta para o próprio aparelho; é necessário IPv4 do computador ou API pública.
- **Por que a sessão Web encerra ao atualizar?** O token fica apenas em memória, por decisão de segurança; no nativo usa SecureStore.
- **Export Android é APK?** Não; o APK instalável exige build EAS concluído e teste no aparelho.
