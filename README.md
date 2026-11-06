# Alimenta+ — Doação de Alimentos

Compartilhe alimentos, transforme vidas.

Aplicativo escolar em JavaScript, React Native e Expo que conecta pessoas e estabelecimentos com alimentos próprios para consumo a pessoas e instituições que precisam recebê-los. Reduz o desperdício ao organizar ofertas, solicitações, reservas e retiradas em uma única aplicação. Público: doadores individuais, supermercados, padarias, restaurantes, ONGs e receptores individuais.

## Referências e adaptação

O ZIP `Downloads/loja-jwt.zip` foi extraído em `referencias/loja-jwt` para análise, sem modificar o original. Foram examinados o aplicativo, telas, componentes, serviços, API, SQL, testes e documentação. Também foi lido o PDF `Projeto Avaliativo Aplicacao Mobile JWT.pdf`. A análise e a correspondência com as quatro entregas estão em [docs/ENTREGAS.md](docs/ENTREGAS.md).

Mantidos: JavaScript, Expo Blank com `App.js`, Native Stack, `fetch`, ES Modules, Express, mysql2/promise sem ORM, bcrypt, JWT e papel atual consultado no banco. Adaptados: produtos viraram ofertas com validade e retirada; administração virou propriedade das ofertas; foram acrescentados Context API, SecureStore, abas e solicitações com estoque transacional. Não foram reutilizados usuários, credenciais, catálogo ou resultados de testes do exemplo.

## Funcionalidades e permissões

| Operação | Doador | Receptor |
| --- | --- | --- |
| Cadastro, login, perfil, logout | Sim | Sim |
| Catálogo, busca por nome/cidade e categoria, detalhes | Sim | Sim |
| Publicar alimentos | Sim | Não |
| Editar/excluir oferta | Apenas própria | Não |
| Solicitar doação e acompanhar pedidos | Não | Sim |
| Cancelar pedido pendente | Não | Apenas próprio |
| Aprovar, recusar ou entregar | Apenas de oferta própria | Não |

Todas as permissões são verificadas pelo backend. O catálogo vem do MySQL, sem lista fictícia. Atualiza ao abrir a aba, ao puxar a lista e a cada 30 segundos enquanto a tela tem foco. Ofertas vencidas, excluídas e sem saldo são filtradas. Imagem opcional por URL HTTPS persistida no banco; não há upload de arquivos. Sem imagem ou se o link falhar no cartão, aparece uma representação da categoria.

## Instalação

Pré-requisitos: Node.js 22+ (validado com Node 24), npm, MySQL 8.0.16+ e Expo Go compatível com o SDK do projeto. As dependências nativas são do SDK 58, como na referência. Confira a versão instalada em `package.json` e a [compatibilidade do Expo Go](https://expo.dev/go). [Documentação versionada do SDK](https://docs.expo.dev/versions/v58.0.0/).

Todos os comandos abaixo são executados na raiz `jwtdoadores`, inclusive os da API. As dependências são centralizadas no `package.json` da raiz; não há instalação separada em `backend`.

```powershell
npm ci
Copy-Item backend/.env.example backend/.env
Copy-Item .env.example .env
```

No MySQL Workbench, conecte-se ao seu MySQL, abra `database/alimenta_plus.sql` com **File → Open SQL Script**, execute todo o script e atualize os schemas. Não há contas ou alimentos pré-cadastrados.

Crie um usuário local para a API, substituindo a senha de exemplo:

```sql
CREATE USER 'alimenta_app'@'127.0.0.1' IDENTIFIED BY 'defina-uma-senha-local';
GRANT SELECT, INSERT, UPDATE, DELETE ON alimenta_plus.* TO 'alimenta_app'@'127.0.0.1';
```

Preencha `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME=alimenta_plus` em `backend/.env`. Gere um segredo e coloque-o em `JWT_SECRET` nesse arquivo:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

O servidor valida configuração e conexão antes de escutar. Não coloque o segredo JWT no `.env` do Expo. Variáveis `EXPO_PUBLIC_*` são públicas e entram no aplicativo.

## API e celular

Descubra o IPv4 da conexão Wi-Fi com `ipconfig`. No `.env` da raiz, configure o IP do computador:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

Para emulador Android padrão: `http://10.0.2.2:3000/api`. Para Expo Web na mesma máquina: `http://localhost:3000/api`. Celular físico deve usar o IPv4 real do computador, na mesma rede Wi-Fi; `localhost` no celular aponta para o próprio celular.

Primeiro terminal, na raiz:

```powershell
npm run api
```

Segundo terminal, na raiz:

```powershell
npm start -- --clear
```

Abra o Expo Go e leia o QR code. Permita Node na rede privada do Firewall do Windows. O backend escuta em `0.0.0.0:3000`. Confirme pelo navegador do celular: `http://IP-DO-PC:3000/api/health`. Esse endpoint informa apenas se a API responde; a conexão é verificada na inicialização e nas operações reais. Após mudar o `.env`, reinicie o Expo.

Cadastre uma conta de doador e outra de receptor pela tela de cadastro. Publique uma oferta no doador, saia, entre como receptor, abra o alimento, informe quantidade e confirme a solicitação. Entre como doador, abra Solicitações, aprove o pedido; o receptor passa a ver o endereço. Marque como entregue após a retirada.

## Sessão e segurança

Senha com bcrypt (12 rounds), JWT HS256 com expiração de 8 horas, emissor e audiência conferidos. O token identifica o usuário; o papel é lido novamente no MySQL em cada requisição. SecureStore armazena somente o token no Android/iOS. Na Web, o token fica apenas na memória e recarregar a página encerra a sessão; não usamos armazenamento inseguro para imitar SecureStore.

Uma resposta 401 protegida remove a sessão. Falha de rede durante a restauração nativa preserva o token e permite tentar novamente. Logout remove o token local e troca a pilha de navegação. JWT já emitido continua válido até expirar: este projeto não implementa revogação global. Endereço completo é retornado ao doador e ao receptor com pedido aprovado/entregue; listagem de catálogo não revela esse endereço aos demais. Não escreva endereço nos campos públicos de descrição.

Consultas parametrizadas, validação no servidor, limite de JSON, limite de tentativas de autenticação, respostas sem hashes ou detalhes internos de SQL. HTTP é permitido na configuração Android para desenvolvimento local. Na distribuição final, use uma API HTTPS acessível pelo aparelho e configure sua URL no ambiente do build.

## Banco e estoque

`usuarios` 1:N `alimentos`; `usuarios` (receptor) 1:N `solicitacoes`; `alimentos` 1:N `solicitacoes`. InnoDB, FKs, índices, CHECK de quantidades positivas, e-mail único e chave gerada que impede pedidos ativos duplicados para o mesmo receptor/alimento.

- `quantidade`: total publicado, incluindo porções já reservadas/entregues.
- `reservada`: soma de solicitações APROVADAS.
- `entregue`: soma de solicitações ENTREGUES.
- `disponivel = quantidade - reservada - entregue`.

PENDENTE não reserva. Aprovação reserva; recusa de pendente ou aprovado encerra o pedido e libera eventual reserva; receptor cancela apenas PENDENTE. Entrega transforma reserva em consumo e não devolve saldo. Pedidos recusados/cancelados/entregues permitem nova solicitação se houver disponibilidade. Quantidades aceitam até três casas decimais.

Toda alteração relevante trava primeiro a linha do alimento com `SELECT ... FOR UPDATE`, em transação `READ COMMITTED`. Assim, depois de obter o bloqueio, a consulta de saldo lê as aprovações confirmadas anteriormente. Edição não reduz o total abaixo do reservado + entregue e não altera unidade depois de existir pedido. Exclusão é lógica; bloqueada enquanto existir reserva aprovada e recusa pedidos pendentes, preservando histórico. Validade é comparada ao dia em `America/Sao_Paulo`. Entrega de reserva existente pode ser registrada após a validade, para manter registro de uma retirada já ocorrida; novos pedidos/aprovações vencidos são bloqueados.

## Rotas

Respostas: `{ dados: ... }` para consultas, `{ mensagem, id? }` para escrita e `{ mensagem }` para erros. Login retorna `{ mensagem, token, usuario }`. Erros: 400 entrada inválida, 401 sessão, 403 permissão/propriedade, 404 inexistente, 409 conflito, 413 payload, 429 tentativas e 500 falha interna.

| Método | Rota (prefixo `/api`) | Acesso |
| --- | --- | --- |
| POST | `/auth/cadastro` | Público; nome, email, telefone, senha, tipo_usuario |
| POST | `/auth/login` | Público; email, senha |
| GET | `/auth/me` | Autenticado |
| GET | `/alimentos?busca=&categoria=` | Autenticado; até 200 ofertas |
| GET | `/alimentos/meus` | Doador |
| GET | `/alimentos/:id` | Autenticado |
| POST | `/alimentos` | Doador |
| PUT, DELETE | `/alimentos/:id` | Dono |
| POST | `/solicitacoes` | Receptor; alimento_id, quantidade_solicitada |
| GET | `/solicitacoes/minhas` | Receptor |
| GET | `/solicitacoes/recebidas` | Doador |
| PATCH | `/solicitacoes/:id/aprovar` | Dono; PENDENTE → APROVADA |
| PATCH | `/solicitacoes/:id/recusar` | Dono; PENDENTE/APROVADA → RECUSADA |
| PATCH | `/solicitacoes/:id/entregar` | Dono; APROVADA → ENTREGUE |
| PATCH | `/solicitacoes/:id/cancelar` | Receptor proprietário; PENDENTE → CANCELADA |

POST e PUT de alimentos recebem nome, descricao, categoria, quantidade, unidade, data_validade (`AAAA-MM-DD`), cidade, bairro, endereco_retirada, informacoes_adicionais e imagem_url opcional. POST associa doador pelo token; doador_id enviado pelo cliente não é utilizado. PUT substitui todos os campos editáveis, não é atualização parcial.

## Estrutura

```text
App.js / index.js / app.json / eas.json
components/     cartões, campos, botões e formulários compartilhados
contexts/       AuthContext e restauração de sessão
hooks/          consultas com atualização ao focar a tela
navigation/     Native Stack e abas conforme papel
screens/        dez telas solicitadas
services/       fetch centralizado e SecureStore (memória no Web)
shared/         categorias usadas no aplicativo e servidor
database/       script MySQL
backend/        server, app, config, database, controllers, routes, middlewares, utils, tests
scripts/        execução de testes isolados
tests/          fluxo visual com navegador e API/MySQL reais
docs/           entregas, testes e apresentação
referencias/    cópia local do exemplo, ignorada pelo Git
```

## Verificações

```powershell
npm test
npm run lint
npm run typecheck
npm run test:mysql
npm run test:web
npm run export:android
npx expo install --check
```

`typecheck` usa o compilador para verificar sintaxe e estrutura dos arquivos JavaScript; não habilita checagem estrita de tipos. Testes de regras não precisam de banco. Testes MySQL inicializam uma instância descartável na raiz ignorada `.mysql-validation`, em porta aleatória, sem usar serviço MySQL80 ou `backend/.env` como destino de teste. O servidor temporário sem senha escuta apenas em loopback e é encerrado ao final. Logs e dados ficam locais para diagnóstico. O teste nunca usa o banco de desenvolvimento.

No Windows o runner procura `C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqld.exe`. Em outro caminho:

```powershell
$env:MYSQLD_PATH='C:/caminho/do/mysql/bin/mysqld.exe'
npm run test:mysql
```

`npm run test:web` exporta a versão Web e executa os testes reais com Edge headless, sem simular API nem banco. Requer Edge instalado e porta 3011 livre. Capturas são salvas em `docs/`. A URL 127.0.0.1:3011 existe somente nesse export de teste, não altera seu `.env`. Confira [docs/TESTES.md](docs/TESTES.md) para resultados e verificações manuais nativas.

## APK

Configuração pronta em `eas.json`, perfil `preview` gera APK. Antes de buildar, defina uma API permanente acessível pelo celular. Não compile usando o endereço dos testes ou `localhost`. Instale e faça login no EAS:

```powershell
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://sua-api.example.com/api --visibility plaintext
npx eas-cli@latest build --platform android --profile preview
```

Após o build, baixe o APK pela URL fornecida pelo EAS, instale no aparelho e repita o fluxo doador → receptor → aprovação. A API deve continuar disponível para o APK funcionar. O bundle Android exportado pelos testes não é um APK instalável. Sem login/projeto EAS e URL definitiva não há build final validado.

## Entregas e Git

Os arquivos e critérios estão organizados em [docs/ENTREGAS.md](docs/ENTREGAS.md), com roteiro em [docs/APRESENTACAO.md](docs/APRESENTACAO.md). Nenhum histórico incremental foi inventado, nenhum push foi executado e não há remoto configurado por esta implementação. O PDF exige repositório atualizado a cada entrega; envie somente com sua autorização e com commits que correspondam ao trabalho real. Nunca versione `.env`, segredos ou `node_modules`.
