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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const user_service_1 = require("./user.service");
const common_2 = require("../../common");
const auth_guard_1 = require("../../guards/auth.guard");
const system_role_guard_1 = require("../../guards/system-role.guard");
const user_enum_1 = require("../../enums/user.enum");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const user_edit_dto_1 = require("./dto/user-edit.dto");
const user_entity_1 = require("./entities/user.entity");
const user_decorator_1 = require("../../decorators/user.decorator");
const errors_1 = require("../../common/errors");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async get(req, res) {
        const user = await this.userService.getUserById(req.user.id);
        if (!user) {
            return res.status(common_1.HttpStatus.NOT_FOUND).send({
                message: common_2.ERROR_MESSAGES.userController.userNotFound,
            });
        }
        else {
            return res.status(common_1.HttpStatus.OK).send(user);
        }
    }
    async getById(res, uid) {
        const user = await this.userService.getUserById(uid);
        if (!user) {
            return res.status(common_1.HttpStatus.NOT_FOUND).send({
                message: common_2.ERROR_MESSAGES.userController.userNotFound,
            });
        }
        else {
            return res.status(common_1.HttpStatus.OK).send(user);
        }
    }
    async edit(res, uid, body, user) {
        console.log(body);
        if (user.id !== uid && user.role !== user_enum_1.UserRoleEnum.ADMIN) {
            return res.status(common_1.HttpStatus.FORBIDDEN).send({
                message: common_2.ERROR_MESSAGES.userController.editForbidden,
            });
        }
        try {
            await this.userService.editUser(uid, body);
            return res.status(common_1.HttpStatus.OK).send({ message: 'ok' });
        }
        catch (e) {
            if (e instanceof errors_1.UserNotFoundException) {
                return res.status(common_1.HttpStatus.NOT_FOUND).send({
                    message: common_2.ERROR_MESSAGES.userController.userNotFound,
                });
            }
            else if (e instanceof errors_1.EmployeeIdAlreadyExistsException) {
                return res.status(common_1.HttpStatus.CONFLICT).send({
                    message: common_2.ERROR_MESSAGES.userController.employeeIdAlreadyExists,
                });
            }
            else if (e instanceof errors_1.StudentIdAlreadyExistsException) {
                return res.status(common_1.HttpStatus.CONFLICT).send({
                    message: common_2.ERROR_MESSAGES.userController.studentIdAlreadyExists,
                });
            }
            else {
                return res
                    .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({ error: e.message });
            }
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, decorators_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, decorators_1.Get)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, decorators_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    (0, decorators_1.Get)('/:uid'),
    (0, decorators_1.UseGuards)(auth_guard_1.AuthGuard, system_role_guard_1.SystemRoleGuard),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRoleEnum.ADMIN),
    __param(0, (0, decorators_1.Res)()),
    __param(1, (0, decorators_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
__decorate([
    (0, decorators_1.Patch)('/:uid'),
    (0, decorators_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, decorators_1.Res)()),
    __param(1, (0, decorators_1.Param)('uid', common_1.ParseIntPipe)),
    __param(2, (0, decorators_1.Body)()),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, user_edit_dto_1.UserEditDto,
        user_entity_1.UserModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "edit", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map