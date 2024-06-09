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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const google_auth_library_1 = require("google-auth-library");
const errors_1 = require("../../common/errors");
const jwt_1 = require("@nestjs/jwt");
const user_enum_1 = require("../../enums/user.enum");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    }
    async signInWithGoogle(code) {
        const { tokens } = await this.client.getToken(code);
        const ticket = await this.client.verifyIdToken({
            idToken: tokens.id_token,
            audience: `${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com`,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new errors_1.OAuthGoogleErrorException();
        }
        if (!payload.email_verified) {
            throw new errors_1.OAuthGoogleErrorException('Email not verified');
        }
        const { email, given_name, family_name, picture } = payload;
        const userPayload = {
            email,
            given_name,
            family_name,
            picture,
        };
        const user = await this.userService.findOrCreateUser(userPayload, user_enum_1.AuthTypeEnum.GOOGLE_OAUTH);
        return {
            access_token: this.jwtService.sign({ id: user.id }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map