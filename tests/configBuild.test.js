import { test } from "node:test";
import assert from "node:assert/strict";
import { validarApiDispositivo } from "../shared/configBuild.js";

test("build para celular rejeita URL ausente, local, de emulador ou de exemplo", () => {
  for (const valor of [
    undefined,
    "",
    "[http://localhost:3000/api](http://localhost:3000/api)",
    "http://localhost:3000/api",
    "http://127.0.0.1/api",
    "http://127.1.2.3/api",
    "http://[::1]/api",
    "http://0.0.0.0/api",
    "http://10.0.2.2:3000/api",
    "http://10.0.3.2:3000/api",
    "https://sua-api.example.com/api",
    "http://usuario:senha@192.168.1.5/api",
    "https://api.minhaong.org/",
    "https://api.minhaong.org/api?token=segredo",
  ])
    assert.throws(() => validarApiDispositivo(valor));
});
test("build aceita URL de rede física ou HTTPS, mantendo /api", () => {
  assert.equal(
    validarApiDispositivo("http://192.168.1.5:3000/api/"),
    "http://192.168.1.5:3000/api",
  );
  assert.equal(
    validarApiDispositivo("https://api.minhaong.org/api"),
    "https://api.minhaong.org/api",
  );
});
test("APK público exige HTTPS e rejeita IP privado mesmo com TLS", () => {
  for (const valor of [
    "http://api.minhaong.org/api",
    "https://172.20.134.251/api",
    "https://192.168.1.5/api",
    "https://10.1.2.3/api",
    "https://[fd00::1]/api",
  ])
    assert.throws(() => validarApiDispositivo(valor, { publica: true }));
  assert.equal(
    validarApiDispositivo("https://api.minhaong.org/api", { publica: true }),
    "https://api.minhaong.org/api",
  );
});
