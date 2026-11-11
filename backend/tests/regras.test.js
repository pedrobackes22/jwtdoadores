import { test } from "node:test";
import assert from "node:assert/strict";
import { hojeLocal, dataReal, dataBrasileira } from "../../shared/datas.js";
import { UNIDADES } from "../../shared/constants.js";
import {
  validarAlimento,
  quantidade,
  idValido,
  hoje,
  verificarDisponivel,
} from "../utils/regras.js";
test("quantidades e IDs rejeitam entradas ambíguas ou fora da precisão", function () {
  for (const valor of [
    -1,
    0,
    "",
    true,
    null,
    "1e2",
    "0.0001",
    "10000000",
    "1 OR 1=1",
  ])
    assert.throws(() => quantidade(valor));
  assert.equal(quantidade("1.125"), 1.125);
  for (const id of ["1 OR 1=1", 0, "2.1", null])
    assert.throws(() => idValido(id));
});
test("validação de oferta exige data real e URL HTTPS opcional", function () {
  const a = {
    nome: "Arroz",
    categoria: "Grãos e cereais",
    quantidade: 5,
    unidade: "kg",
    data_validade: "2099-12-31",
    cidade: "São Paulo",
    bairro: "Centro",
    endereco_retirada: "Rua de teste, 12",
  };
  assert.equal(validarAlimento(a).quantidade, 5);
  assert.equal(
    validarAlimento({ ...a, data_validade: hoje() }).data_validade,
    hoje(),
  );
  for (const unidade of UNIDADES)
    assert.equal(validarAlimento({ ...a, unidade }).unidade, unidade);
  for (const unidade of ["caixas", "", "KG", null])
    assert.throws(() => validarAlimento({ ...a, unidade }));
  assert.throws(() => validarAlimento({ ...a, data_validade: "10/11/2026" }));
  for (const data of ["2020-01-01", "2099-02-31", "invalida"])
    assert.throws(() => validarAlimento({ ...a, data_validade: data }));
  assert.throws(() =>
    validarAlimento({ ...a, imagem_url: "file:///foto.jpg" }),
  );
  assert.match(hoje(), /^\d{4}-\d{2}-\d{2}$/);
});
test("dia civil brasileiro não avança com UTC; calendário valida e formata sem deslocamento", () => {
  assert.equal(hojeLocal(new Date("2026-11-12T01:30:00Z")), "2026-11-11");
  assert.equal(hojeLocal(new Date("2026-11-12T03:00:00Z")), "2026-11-12");
  assert.equal(dataBrasileira("2026-11-11"), "11/11/2026");
  assert.ok(dataReal("2028-02-29"));
  for (const data of [
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "11/11/2026",
    "",
  ])
    assert.equal(dataReal(data), false);
});
test("oferta vencida, excluída ou saldo insuficiente não pode ser reservada", function () {
  const a = { status: "ATIVO", data_validade: "2099-01-01" };
  assert.throws(() => verificarDisponivel(a, { disponivel: 2 }, 3));
  assert.throws(() =>
    verificarDisponivel({ ...a, status: "EXCLUIDO" }, { disponivel: 5 }, 1),
  );
  assert.throws(() =>
    verificarDisponivel(
      { ...a, data_validade: "2020-01-01" },
      { disponivel: 5 },
      1,
    ),
  );
});
