export default function autorizarTipo(tipo) {
  return function verificar(req, res, next) {
    if (req.usuario.tipo_usuario !== tipo)
      return res
        .status(403)
        .json({ mensagem: "Seu tipo de usuário não permite esta operação." });
    next();
  };
}
