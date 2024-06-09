"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../modules/user/entities/user.entity");
exports.User = (0, common_1.createParamDecorator)(async (relations, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return await user_entity_1.UserModel.findOne({
        where: { id: request.user.id },
        relations,
    });
});
//# sourceMappingURL=user.decorator.js.map