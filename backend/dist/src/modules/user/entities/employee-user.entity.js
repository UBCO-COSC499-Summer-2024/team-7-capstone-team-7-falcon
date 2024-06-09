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
exports.EmployeeUserModel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let EmployeeUserModel = class EmployeeUserModel extends typeorm_1.BaseEntity {
};
exports.EmployeeUserModel = EmployeeUserModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmployeeUserModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserModel, (user) => user.employee_user),
    __metadata("design:type", user_entity_1.UserModel)
], EmployeeUserModel.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], EmployeeUserModel.prototype, "employee_id", void 0);
exports.EmployeeUserModel = EmployeeUserModel = __decorate([
    (0, typeorm_1.Entity)('employee_user_model')
], EmployeeUserModel);
//# sourceMappingURL=employee-user.entity.js.map