import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
function iniciar(bin, args) {
  const filho = spawn(bin, args, {
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  filho.stdout.on("data", (d) => {
    log += d;
  });
  filho.stderr.on("data", (d) => {
    log += d;
  });
  const terminou = new Promise((r, j) => {
    filho.once("exit", (codigo) => r({ codigo, log }));
    filho.once("error", j);
  });
  terminou.catch(() => {});
  return { filho, terminou };
}
test(
  "MySQL real: autenticação, permissões, estoque concorrente, histórico e persistência",
  { skip: process.env.MYSQL_INTEGRATION !== "1", timeout: 180000 },
  async function (t) {
    await mkdir(".mysql-validation", { recursive: true });
    const pasta = await mkdtemp(resolve(".mysql-validation/run-")),
      dados = join(pasta, "data"),
      bin = resolve(process.env.MYSQLD_PATH),
      base = dirname(dirname(bin));
    await mkdir(dados);
    let mysqld, db, pool, servidor;
    try {
      const init = await iniciar(bin, [
        "--no-defaults",
        "--initialize-insecure",
        "--basedir=" + base,
        "--datadir=" + dados,
        "--log-error=" + join(pasta, "mysql.log"),
      ]).terminou;
      assert.equal(init.codigo, 0, init.log);
      const net = await import("node:net");
      const probe = net.createServer();
      await new Promise((r) => probe.listen(0, "127.0.0.1", r));
      const port = probe.address().port;
      await new Promise((r) => probe.close(r));
      mysqld = iniciar(bin, [
        "--no-defaults",
        "--basedir=" + base,
        "--datadir=" + dados,
        "--log-error=" + join(pasta, "mysql.log"),
        "--bind-address=127.0.0.1",
        "--port=" + port,
        "--mysqlx=OFF",
        "--skip-log-bin",
        ...(process.platform === "win32" ? ["--no-monitor"] : []),
      ]);
      for (let i = 0; i < 100; i++) {
        try {
          db = await mysql.createConnection({
            host: "127.0.0.1",
            port,
            user: "root",
            password: "",
            multipleStatements: true,
          });
          break;
        } catch {
          await esperar(200);
        }
      }
      assert.ok(db, "MySQL isolado não iniciou. Veja " + pasta);
      await db.query(await readFile("database/alimenta_plus.sql", "utf8"));
      Object.assign(process.env, {
        DB_HOST: "127.0.0.1",
        DB_PORT: String(port),
        DB_USER: "root",
        DB_PASSWORD: "",
        DB_NAME: "alimenta_plus",
        JWT_SECRET: randomBytes(48).toString("hex"),
      });
      const { default: app } = await import("../app.js");
      pool = (await import("../database/conexao.js")).default;
      servidor = app.listen(0, "127.0.0.1");
      await new Promise((r) => servidor.once("listening", r));
      const baseApi = "http://127.0.0.1:" + servidor.address().port + "/api";
      async function req(path, token, method = "GET", body) {
        const r = await fetch(baseApi + path, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: "Bearer " + token } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return { status: r.status, ...(await r.json()) };
      }
      const senha = "Teste-seguro-123";
      let doador, receptor, outro, r2, alimento, pedido, p2;
      const conta = (nome, tipo) => ({
        nome,
        email: nome.toLowerCase() + "@example.com",
        telefone: "11999999999",
        senha,
        tipo_usuario: tipo,
      });
      await t.test(
        "cadastro dos dois papéis, e-mail duplicado, hash e login",
        async () => {
          for (const [nome, tipo] of [
            ["Doador", "DOADOR"],
            ["Receptor", "RECEPTOR"],
            ["Outro", "DOADOR"],
            ["Receptor2", "RECEPTOR"],
          ])
            assert.equal(
              (await req("/auth/cadastro", null, "POST", conta(nome, tipo)))
                .status,
              201,
            );
          assert.equal(
            (
              await req(
                "/auth/cadastro",
                null,
                "POST",
                conta("Doador", "DOADOR"),
              )
            ).status,
            409,
          );
          const [u] = await db.query(
            "SELECT senha_hash FROM alimenta_plus.usuarios LIMIT 1",
          );
          assert.ok(await bcrypt.compare(senha, u[0].senha_hash));
          assert.equal(
            (
              await req("/auth/login", null, "POST", {
                email: "doador@example.com",
                senha: "incorreta",
              })
            ).status,
            401,
          );
          [doador, receptor, outro, r2] = await Promise.all(
            ["doador", "receptor", "outro", "receptor2"].map((nome) =>
              req("/auth/login", null, "POST", {
                email: nome + "@example.com",
                senha,
              }),
            ),
          );
          for (const u of [doador, receptor, outro, r2]) {
            assert.equal(u.status, 200);
            assert.ok(u.token);
            assert.equal(u.usuario.senha_hash, undefined);
          }
          assert.equal(
            jwt.verify(doador.token, process.env.JWT_SECRET).sub,
            String(doador.usuario.id),
          );
        },
      );
      await t.test("sem token, token inválido e token expirado", async () => {
        for (const token of [
          null,
          "invalido",
          jwt.sign({}, process.env.JWT_SECRET, {
            subject: String(doador.usuario.id),
            expiresIn: -1,
            issuer: "alimenta-plus",
            audience: "alimenta-mobile",
          }),
        ])
          assert.equal((await req("/alimentos", token)).status, 401);
        assert.equal(
          (await req("/auth/me", doador.token)).dados.tipo_usuario,
          "DOADOR",
        );
      });
      const oferta = {
        nome: "Arroz integral",
        descricao: "Pacotes fechados",
        categoria: "Grãos e cereais",
        quantidade: 10,
        unidade: "kg",
        data_validade: "2099-12-31",
        cidade: "São Paulo",
        bairro: "Centro",
        endereco_retirada: "Rua teste, 123",
        informacoes_adicionais: "Retirar à tarde",
      };
      await t.test(
        "publicação, catálogo, detalhes, privacidade e bloqueio do receptor",
        async () => {
          assert.equal(
            (await req("/alimentos", receptor.token, "POST", oferta)).status,
            403,
          );
          const r = await req("/alimentos", doador.token, "POST", oferta);
          assert.equal(r.status, 201);
          alimento = r.id;
          const catalogo = await req("/alimentos", receptor.token);
          assert.equal(catalogo.dados[0].id, alimento);
          assert.equal(catalogo.dados[0].endereco_retirada, undefined);
          assert.equal(
            (await req("/alimentos/" + alimento, receptor.token)).dados
              .disponivel,
            10,
          );
          assert.equal(
            (await req("/alimentos/" + alimento, receptor.token)).dados
              .endereco_retirada,
            undefined,
          );
          assert.equal(
            (await req("/alimentos/meus", doador.token)).dados.length,
            1,
          );
        },
      );
      await t.test(
        "edição pelo dono, bloqueio de outro doador e validade inválida",
        async () => {
          assert.equal(
            (await req("/alimentos/" + alimento, outro.token, "PUT", oferta))
              .status,
            403,
          );
          assert.equal(
            (
              await req("/alimentos/" + alimento, doador.token, "PUT", {
                ...oferta,
                descricao: "Atualizada",
              })
            ).status,
            200,
          );
          assert.equal(
            (
              await req("/alimentos", doador.token, "POST", {
                ...oferta,
                data_validade: "2020-01-01",
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await req("/alimentos", doador.token, "POST", {
                ...oferta,
                quantidade: -2,
              })
            ).status,
            400,
          );
        },
      );
      await t.test(
        "pedidos reais não reservam e duplicação é bloqueada",
        async () => {
          const a = await req("/solicitacoes", receptor.token, "POST", {
            alimento_id: alimento,
            quantidade_solicitada: 7,
          });
          assert.equal(a.status, 201);
          pedido = a.id;
          assert.equal(
            (
              await req("/solicitacoes", receptor.token, "POST", {
                alimento_id: alimento,
                quantidade_solicitada: 1,
              })
            ).status,
            409,
          );
          assert.equal(
            (
              await req("/solicitacoes", r2.token, "POST", {
                alimento_id: alimento,
                quantidade_solicitada: 11,
              })
            ).status,
            409,
          );
          const b = await req("/solicitacoes", r2.token, "POST", {
            alimento_id: alimento,
            quantidade_solicitada: 7,
          });
          p2 = b.id;
          assert.equal(
            (await req("/alimentos/" + alimento, receptor.token)).dados
              .disponivel,
            10,
          );
          assert.equal(
            (await req("/solicitacoes/recebidas", doador.token)).dados.length,
            2,
          );
        },
      );
      await t.test(
        "aprovação concorrente reserva apenas um pedido e verifica dono",
        async () => {
          assert.equal(
            (
              await req(
                "/solicitacoes/" + pedido + "/aprovar",
                outro.token,
                "PATCH",
              )
            ).status,
            403,
          );
          assert.equal(
            (
              await req(
                "/solicitacoes/" + pedido + "/aprovar",
                receptor.token,
                "PATCH",
              )
            ).status,
            403,
          );
          const respostas = await Promise.all(
            [pedido, p2].map((id) =>
              req("/solicitacoes/" + id + "/aprovar", doador.token, "PATCH"),
            ),
          );
          assert.deepEqual(respostas.map((r) => r.status).sort(), [200, 409]);
          const a = (await req("/alimentos/" + alimento, doador.token)).dados;
          assert.equal(a.reservada, 7);
          assert.equal(a.disponivel, 3);
          const pedidos = (await req("/solicitacoes/recebidas", doador.token))
            .dados;
          const aprovado = pedidos.find((s) => s.status === "APROVADA");
          pedido = aprovado.id;
          const token =
            aprovado.receptor_nome === "Receptor" ? receptor.token : r2.token;
          assert.equal(
            (await req("/alimentos/" + alimento, token)).dados
              .endereco_retirada,
            "Rua teste, 123",
          );
          assert.equal(
            (
              await req("/alimentos/" + alimento, doador.token, "PUT", {
                ...oferta,
                quantidade: 6,
              })
            ).status,
            409,
          );
          assert.equal(
            (await req("/alimentos/" + alimento, doador.token, "DELETE"))
              .status,
            409,
          );
        },
      );
      await t.test(
        "recusa libera reserva e entrega consome estoque definitivamente",
        async () => {
          assert.equal(
            (
              await req(
                "/solicitacoes/" + pedido + "/recusar",
                doador.token,
                "PATCH",
              )
            ).status,
            200,
          );
          assert.equal(
            (await req("/alimentos/" + alimento, doador.token)).dados
              .disponivel,
            10,
          );
          const pendente = (
            await req("/solicitacoes/recebidas", doador.token)
          ).dados.find((s) => s.status === "PENDENTE");
          assert.equal(
            (
              await req(
                "/solicitacoes/" + pendente.id + "/aprovar",
                doador.token,
                "PATCH",
              )
            ).status,
            200,
          );
          assert.equal(
            (
              await req(
                "/solicitacoes/" + pendente.id + "/entregar",
                doador.token,
                "PATCH",
              )
            ).status,
            200,
          );
          const a = (await req("/alimentos/" + alimento, doador.token)).dados;
          assert.equal(a.entregue, 7);
          assert.equal(a.reservada, 0);
          assert.equal(a.disponivel, 3);
          assert.equal(
            (
              await req(
                "/solicitacoes/" + pendente.id + "/entregar",
                doador.token,
                "PATCH",
              )
            ).status,
            409,
          );
        },
      );
      await t.test("cancelamento, exclusão lógica e histórico", async () => {
        const p = await req("/solicitacoes", receptor.token, "POST", {
          alimento_id: alimento,
          quantidade_solicitada: 1,
        });
        assert.equal(p.status, 201);
        assert.equal(
          (await req("/solicitacoes/" + p.id + "/cancelar", r2.token, "PATCH"))
            .status,
          403,
        );
        assert.equal(
          (
            await req(
              "/solicitacoes/" + p.id + "/cancelar",
              receptor.token,
              "PATCH",
            )
          ).status,
          200,
        );
        assert.equal(
          (await req("/alimentos/" + alimento, outro.token, "DELETE")).status,
          403,
        );
        assert.equal(
          (await req("/alimentos/" + alimento, doador.token, "DELETE")).status,
          200,
        );
        assert.equal((await req("/alimentos", receptor.token)).dados.length, 0);
        assert.ok(
          (await req("/solicitacoes/minhas", receptor.token)).dados.length > 0,
        );
        const [linhas] = await db.query(
          "SELECT status FROM alimenta_plus.alimentos WHERE id=?",
          [alimento],
        );
        assert.equal(linhas[0].status, "EXCLUIDO");
      });
      await t.test("filtro de oferta vencida e indisponível", async () => {
        const a = await req("/alimentos", doador.token, "POST", oferta);
        await db.execute(
          "UPDATE alimenta_plus.alimentos SET data_validade='2020-01-01' WHERE id=?",
          [a.id],
        );
        assert.equal((await req("/alimentos", receptor.token)).dados.length, 0);
        assert.equal(
          (
            await req("/solicitacoes", receptor.token, "POST", {
              alimento_id: a.id,
              quantidade_solicitada: 1,
            })
          ).status,
          409,
        );
      });
      await t.test(
        "dados persistem após reiniciar a API e reconectar ao MySQL",
        async () => {
          await new Promise((r) => servidor.close(r));
          servidor = app.listen(0, "127.0.0.1");
          await new Promise((r) => servidor.once("listening", r));
          const r = await fetch(
            "http://127.0.0.1:" +
              servidor.address().port +
              "/api/solicitacoes/minhas",
            { headers: { Authorization: "Bearer " + receptor.token } },
          );
          assert.equal(r.status, 200);
          assert.ok((await r.json()).dados.length > 0);
          const nova = await mysql.createConnection({
            host: "127.0.0.1",
            port,
            user: "root",
            password: "",
            database: "alimenta_plus",
          });
          const [dados] = await nova.query(
            "SELECT COUNT(*) n FROM solicitacoes",
          );
          assert.ok(dados[0].n > 0);
          await nova.end();
        },
      );
      if (process.env.TEST_WEB === "1")
        await t.test(
          "interface web real: doação até aprovação e logout",
          async () => {
            await (
              await import("../../tests/fluxo-web.js")
            ).validarInterface({ app, servidor, doador, receptor, senha });
          },
        );
      await writeFile(
        join(pasta, "resultado.txt"),
        "Testes executados com MySQL real. Consulte a saída TAP para os resultados individuais.\n",
      );
    } finally {
      if (servidor) await new Promise((r) => servidor.close(r));
      if (pool) await pool.end();
      if (db) {
        try {
          await db.query("SHUTDOWN");
        } catch {}
        try {
          await db.end();
        } catch {}
      }
      if (mysqld && mysqld.filho.exitCode === null) {
        await Promise.race([mysqld.terminou, esperar(5000)]);
        if (mysqld.filho.exitCode === null) mysqld.filho.kill();
      }
    }
  },
);
