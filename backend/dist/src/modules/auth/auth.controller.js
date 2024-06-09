"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_pipe_1 = require("./pipes/auth.pipe");
const auth_service_1 = require("./auth.service");
const errors_1 = require("../../common/errors");
const code_auth_pipe_1 = require("./pipes/code-auth.pipe");
const auth_guard_1 = require("../../guards/auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    }
    oAuthProviderNegotiation(res, _provider) {
        return res
            .status(common_1.HttpStatus.PERMANENT_REDIRECT)
            .redirect(`${this.GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com&response_type=` +
            `code&scope=openid%20profile%20email&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&state=google`);
    }
    async oAuthProviderCallback(res, _provider, code) {
        try {
            const result = await this.authService.signInWithGoogle(code);
            return res
                .status(common_1.HttpStatus.PERMANENT_REDIRECT)
                .cookie('auth_token', result.access_token, {
                httpOnly: true,
                secure: this.isSecure(),
            })
                .redirect(process.env.FRONTEND_URL);
        }
        catch (e) {
            if (e instanceof errors_1.OAuthGoogleErrorException) {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).send({ error: e.message });
            }
            else if (e instanceof errors_1.UserAlreadyExistsException) {
                return res.status(common_1.HttpStatus.CONFLICT).send({ error: e.message });
            }
            else if (e instanceof Error) {
                return res
                    .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({ error: e.message });
            }
        }
    }
    logout(res) {
        return res
            .status(common_1.HttpStatus.NO_CONTENT)
            .clearCookie('auth_token', { httpOnly: true, secure: this.isSecure() })
            .send();
    }
    isSecure() {
        return process.env.NODE_ENV === 'production';
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('oauth/:provider'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('provider', auth_pipe_1.ProviderAuthPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "oAuthProviderNegotiation", null);
__decorate([
    (0, common_1.Get)('oauth/:provider/callback'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('provider', auth_pipe_1.ProviderAuthPipe)),
    __param(2, (0, common_1.Query)('code', code_auth_pipe_1.CodeAuthPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oAuthProviderCallback", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map