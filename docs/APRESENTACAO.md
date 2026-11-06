# Roteiro de apresentação

1. Explique o problema: desperdício de alimentos e dificuldade de conectar doadores a quem precisa receber.
2. Mostre a proposta e os dois papéis. Explique por que o fluxo envolve solicitações e retirada.
3. Abra o SQL: usuários têm ofertas e solicitações; a oferta pertence a um doador, o pedido a um receptor.
4. Cadastre as duas contas. Demonstre login e explique bcrypt, JWT e Bearer Token. SecureStore guarda o token no celular; a senha não é persistida no aplicativo.
5. Como doador, publique uma oferta e edite uma informação. Como receptor, encontre-a no catálogo e solicite parte da quantidade.
6. Mostre que o pedido pendente não reduz disponibilidade. Como doador, aprove; explique a reserva. Como receptor, veja o endereço liberado.
7. Marque a entrega e mostre que o estoque não volta. Demonstre recusa ou cancelamento em outro pedido.
8. Mostre o teste de dois pedidos concorrentes: apenas uma reserva cabe no saldo. Explique o bloqueio por alimento e a leitura READ COMMITTED.
9. Demonstre que outro doador não consegue editar a oferta. Esconder botão não substitui autorização no servidor.
10. Mostre os resultados reais de testes, a documentação e os itens ainda pendentes. Apresente o repositório e APK somente quando tiverem sido efetivamente publicados/gerados e conferidos.

Prepare duas contas suas e uma oferta não vencida antes da apresentação. Não exponha `backend/.env` na projeção. Não use os dados descartáveis dos testes como banco de apresentação.
