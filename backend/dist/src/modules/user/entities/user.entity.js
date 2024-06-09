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
exports.UserModel = void 0;
const user_enum_1 = require("../../../enums/user.enum");
const typeorm_1 = require("typeorm");
const employee_user_entity_1 = require("./employee-user.entity");
const student_user_entity_1 = require("./student-user.entity");
const class_transformer_1 = require("class-transformer");
let UserModel = class UserModel extends typeorm_1.BaseEntity {
};
exports.UserModel = UserModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserModel.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserModel.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: user_enum_1.UserRoleEnum.STUDENT }),
    __metadata("design:type", String)
], UserModel.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], UserModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], UserModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: user_enum_1.AuthTypeEnum.EMAIL }),
    __metadata("design:type", String)
], UserModel.prototype, "auth_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => employee_user_entity_1.EmployeeUserModel, (employee_user) => employee_user.user, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", employee_user_entity_1.EmployeeUserModel)
], UserModel.prototype, "employee_user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => student_user_entity_1.StudentUserModel, (student_user) => student_user.user, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", student_user_entity_1.StudentUserModel)
], UserModel.prototype, "student_user", void 0);
exports.UserModel = UserModel = __decorate([
    (0, typeorm_1.Entity)('user_model')
], UserModel);
//# sourceMappingURL=user.entity.js.map