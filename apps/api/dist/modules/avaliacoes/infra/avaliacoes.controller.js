import * as service from "./avaliacoes.service.js";
export async function buscarPorId(req, res) {
    const id = req.params.id;
    const avaliacao = await service.pegarAvaliacaoPorId(id);
    return res.json({ success: true, data: avaliacao });
}
export async function buscarComRespostas(req, res) {
    const id = req.params.id;
    const avaliacao = await service.pegarAvaliacaoComRespostas(id);
    return res.json({ success: true, data: avaliacao });
}
export async function Exluir(req, res) {
    const id = req.params.id;
    await service.DeleteAvaliacao(id);
}
