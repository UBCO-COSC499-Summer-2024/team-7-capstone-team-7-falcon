"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const dotenv_1 = require("dotenv");
const employee_user_entity_1 = require("../user/entities/employee-user.entity");
const student_user_entity_1 = require("../user/entities/student-user.entity");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const path = require("path");
(0, dotenv_1.config)();
const ormconfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [user_entity_1.UserModel, employee_user_entity_1.EmployeeUserModel, student_user_entity_1.StudentUserModel],
    migrations: [path.join(__dirname, '..', '..', '..', 'migrations', '*')],
};
exports.dataSource = new typeorm_1.DataSource(ormconfig);
//# sourceMappingURL=ormconfig.js.map