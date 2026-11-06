# Entregas e análise da referência

Referências locais: ZIP `loja-jwt.zip` e PDF `Projeto Avaliativo Aplicacao Mobile JWT.pdf`, encontrados em Downloads. O ZIP original não foi alterado. A cópia extraída `referencias/loja-jwt` é ignorada pelo Git.

## Análise dos arquivos do exemplo

| Grupo analisado | Decisão no Alimenta+ |
| --- | --- |
| App.js, index.js, app.json, package.json, lock | Manter Expo Blank/JavaScript e Native Stack; organizar sessão em Context, acrescentar abas |
| screens/Login e CadastroUsuario | Manter validação e login HTTP, acrescentar telefone e papéis do domínio |
| Home, Produtos, DetalhesProduto | Catálogo real com busca/categorias, validade, estoque e privacidade |
| CadastrarProduto, EditarProduto, FormularioProduto | Substituir preço/estoque comercial por quantidade total, validade, endereço e foto opcional por URL |
| Usuarios | Não há administração global de níveis no novo escopo; substituir por gestão das solicitações da própria oferta |
| components/ui, assets | Recriar identidade verde; manter componentes compartilhados, StyleSheet e mensagens claras |
| services/api | Manter fetch/Bearer/401; URL por ambiente e SecureStore nativo |
| backend/app, server, config, database | Manter responsabilidades separadas e segredo validado; novo banco alimenta_plus |
| authController, autenticarToken, somenteAdmin | Manter bcrypt/JWT e papel do banco; substituir somenteAdmin por autorizarTipo e propriedade |
| produtosController/routes, usuariosController/routes | CRUD de ofertas e máquina de estados de pedidos, com transações e locks |
| utils/validacoes, database/loja_jwt.sql | Validação própria para alimentos, FKs e histórico, sem importar dados demonstrativos |
| tests API/MySQL, Playwright e scripts | Novos testes com MySQL real, concorrência, privacidade, histórico e fluxo visual |
| README, VALIDACAO, ENTREGA_COMPLETA, AGENTS, configs, LICENSE | Ler convenções; documentação e evidências novas, sem copiar resultados ou alegações de entrega |

O PDF confirma que o tema precisa resolver um problema real e não pode ser uma troca de nomes da loja. Solicitações, reservas, entrega e endereço condicionado à aprovação são a adaptação funcional central.

## Etapa 1 — Proposta e navegação

Problema: alimentos próprios para consumo são desperdiçados enquanto pessoas e instituições precisam deles. Objetivo: ligar oferta e demanda com retirada organizada. Justificativa: facilitar publicação, descoberta e acompanhamento em um fluxo simples. Papéis e permissões no README.

Arquivos: `App.js`, `index.js`, `app.json`, `components/`, `screens/`, `navigation/`, `contexts/`, `services/`. Telas: Login, CadastroUsuario, Home, DetalhesAlimento, CadastrarAlimento, EditarAlimento, MinhasDoacoes, SolicitacoesRecebidas, MinhasSolicitacoes e Perfil. Navegação separa a pilha pública da autenticada e monta ferramentas por papel.

## Etapa 2 — Banco e integração

Arquivos: `database/alimenta_plus.sql`, `backend/config`, `backend/database`, `backend/app.js`, `backend/server.js`, controllers e routes, `services/api.js`. Banco com três entidades relacionadas. GET/POST e consultas reais com mysql2/promise; nenhuma lista estática de ofertas. Execução: configurar MySQL e os dois arquivos `.env`, `npm run api`, `npm start`.

## Etapa 3 — JWT, papéis e CRUD

Arquivos: middlewares, authController, alimentosController, solicitacoesController, AuthContext, tokenStorage e formulários. JWT validado no backend, senha com bcrypt, identidade do token e papel lido no banco. Propriedade checada para editar/excluir/aprovar. Solicitações têm estados e reserva transacional, sem decrementar por pedido pendente.

## Etapa 4 — Revisão, testes e build

Arquivos: `backend/tests`, `tests`, `scripts`, `eas.json` e documentação. Comandos: `npm test`, `npm run test:mysql`, `npm run test:web`, `npm run lint`, `npm run typecheck`, `npm run export:android`. Evidências efetivamente executadas e limitações estão em `TESTES.md`.

APK, teste no aparelho físico e repositório remoto são itens de entrega separados. Configurar EAS não comprova geração do APK. Não foram criados commits retroativos nem pushes. A implementação foi feita nesta sessão; esta organização descreve critérios, não inventa um histórico de quatro entregas já realizadas.

Sugestões de commits para desenvolvimento incremental real: `docs: definir proposta e permissões`; `feat: implementar navegação e telas iniciais`; `feat: integrar ofertas com MySQL`; `feat: autenticar e proteger operações`; `feat: controlar solicitações e reservas`; `test: validar concorrência e fluxo completo`; `build: preparar entrega Android`. Se todos os arquivos forem enviados juntos, registre honestamente o estado completo em vez de fingir etapas passadas.
