import * as service from "./modulos.service";
import { getClinicaId } from "../../../shared/middlewares/auth.js";
export async function criarPergunta(req, res) {
    const clinicaId = getClinicaId(req);
    const { moduloId } = req.params;
    const payload = req.body;
    const pergunta = await service.criarPergunta(clinicaId, moduloId, payload);
    return res.status(201).json({ success: true, data: pergunta });
}
export async function editarModulo(req, res) {
    const clinicaId = getClinicaId(req);
    const { moduloId } = req.params;
    const payload = req.body;
    const modulo = await service.editarModulo(clinicaId, moduloId, payload);
    return res.json({ success: true, data: modulo });
}
export async function excluirModulo(req, res) {
    const clinicaId = getClinicaId(req);
    const { moduloId } = req.params;
    await service.excluirModulo(clinicaId, moduloId);
    return res.json({ success: true, message: "Módulo excluído" });
}
export async function editarPergunta(req, res) {
    const clinicaId = getClinicaId(req);
    const { moduloId, perguntaId } = req.params;
    const payload = req.body;
    const pergunta = await service.editarPergunta(clinicaId, moduloId, perguntaId, payload);
    return res.json({ success: true, data: pergunta });
}
export async function excluirPergunta(req, res) {
    const clinicaId = getClinicaId(req);
    const { moduloId, perguntaId } = req.params;
    await service.excluirPergunta(clinicaId, moduloId, perguntaId);
    return res.json({ success: true, message: "Pergunta excluída" });
}
