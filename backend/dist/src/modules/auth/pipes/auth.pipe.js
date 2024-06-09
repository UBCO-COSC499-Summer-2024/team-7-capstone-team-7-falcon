"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderAuthPipe = void 0;
const common_1 = require("@nestjs/common");
const auth_enum_1 = require("../../../enums/auth.enum");
let ProviderAuthPipe = class ProviderAuthPipe {
    transform(value) {
        if (!auth_enum_1.AuthProviderEnum[value]) {
            throw new common_1.BadRequestException(`auth provided '${value}' is not supported, must be: ${Object.keys(auth_enum_1.AuthProviderEnum)}`);
        }
        return value;
    }
};
exports.ProviderAuthPipe = ProviderAuthPipe;
exports.ProviderAuthPipe = ProviderAuthPipe = __decorate([
    (0, common_1.Injectable)()
], ProviderAuthPipe);
//# sourceMappingURL=auth.pipe.js.map