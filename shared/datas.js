// Datas de validade são dias civis, sem conversão de meia-noite para UTC.
export function hojeLocal(agora = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(agora);
  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}
export function dataReal(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [ano, mes, dia] = iso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia, 12);
  return (
    ano >= 1000 &&
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}
export function dataBrasileira(iso) {
  return dataReal(iso) ? iso.split("-").reverse().join("/") : "";
}
