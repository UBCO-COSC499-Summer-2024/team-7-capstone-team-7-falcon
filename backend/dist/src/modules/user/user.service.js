"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const errors_1 = require("../../common/errors");
const user_enum_1 = require("../../enums/user.enum");
const employee_user_entity_1 = require("./entities/employee-user.entity");
const student_user_entity_1 = require("./entities/student-user.entity");
let UserService = class UserService {
    async getUserById(id) {
        const user = await user_entity_1.UserModel.findOne({
            where: { id },
            relations: ['employee_user', 'student_user'],
        });
        if (!user) {
            return null;
        }
        delete user.password;
        return user;
    }
    async findOrCreateUser(userPayload, method) {
        if (method === user_enum_1.AuthTypeEnum.GOOGLE_OAUTH) {
            let user = await user_entity_1.UserModel.findOne({
                where: { email: userPayload.email },
            });
            if (!user) {
                const currentTime = parseInt(new Date().getTime().toString());
                user = new user_entity_1.UserModel();
                user.email = userPayload.email;
                user.first_name = userPayload.given_name;
                user.last_name = userPayload.family_name;
                user.auth_type = user_enum_1.AuthTypeEnum.GOOGLE_OAUTH;
                user.created_at = currentTime;
                user.updated_at = currentTime;
                await user.save();
            }
            if (user && user.auth_type !== user_enum_1.AuthTypeEnum.GOOGLE_OAUTH) {
                throw new errors_1.UserAlreadyExistsException();
            }
            return user;
        }
        throw new Error('Invalid auth method');
    }
    async editUser(uid, userEditBody) {
        const user = await user_entity_1.UserModel.findOne({
            where: { id: uid },
            relations: ['employee_user', 'student_user'],
        });
        if (!user) {
            throw new errors_1.UserNotFoundException();
        }
        if (userEditBody.first_name) {
            user.first_name = userEditBody.first_name;
        }
        if (userEditBody.last_name) {
            user.last_name = userEditBody.last_name;
        }
        if (userEditBody.employee_id) {
            const employeeUser = await this.findEmployeeNumber(userEditBody.employee_id);
            if (employeeUser && employeeUser.user.id !== uid) {
                throw new errors_1.EmployeeIdAlreadyExistsException();
            }
            let employeeUserRecord;
            if (!user.employee_user) {
                employeeUserRecord = await employee_user_entity_1.EmployeeUserModel.create({
                    employee_id: userEditBody.employee_id,
                    user,
                }).save();
                user.employee_user = employeeUserRecord;
            }
            else {
                user.employee_user.employee_id = userEditBody.employee_id;
                await user.employee_user.save();
            }
        }
        if (userEditBody.student_id) {
            const studentUser = await this.findStudentNumber(userEditBody.student_id);
            if (studentUser && studentUser.user.id !== uid) {
                throw new errors_1.StudentIdAlreadyExistsException();
            }
            let studentUserRecord;
            if (!user.student_user) {
                studentUserRecord = await student_user_entity_1.StudentUserModel.create({
                    student_id: userEditBody.student_id,
                    user,
                }).save();
                user.student_user = studentUserRecord;
            }
            else {
                user.student_user.student_id = userEditBody.student_id;
                await user.student_user.save();
            }
        }
        await user.save();
        return user;
    }
    async findEmployeeNumber(employeeId) {
        return await employee_user_entity_1.EmployeeUserModel.findOne({
            where: { employee_id: employeeId },
            relations: ['user'],
        });
    }
    async findStudentNumber(studentId) {
        return await student_user_entity_1.StudentUserModel.findOne({
            where: { student_id: studentId },
            relations: ['user'],
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map