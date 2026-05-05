import { loginUseCase } from '../application/login.usecase.js';
import { refreshUseCase } from '../application/refresh.usecase.js';
import { logoutUseCase } from '../application/logout.usecase.js';
export async function login(req, res) {
    const tokens = await loginUseCase(req.body);
    return res.json({
        success: true,
        data: tokens,
    });
}
export async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: 'Refresh token é obrigatório',
        });
    }
    const tokens = await refreshUseCase(refreshToken);
    return res.json({
        success: true,
        data: tokens,
    });
}
export async function logout(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    await logoutUseCase(req.user.userId, token);
    return res.json({
        success: true,
        message: 'Logout realizado com sucesso',
    });
}
export async function me(req, res) {
    return res.json({
        success: true,
        data: req.user,
    });
}
