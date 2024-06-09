"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTypeEnum = exports.UserRoleEnum = void 0;
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "admin";
    UserRoleEnum["STUDENT"] = "student";
    UserRoleEnum["PROFESSOR"] = "professor";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
var AuthTypeEnum;
(function (AuthTypeEnum) {
    AuthTypeEnum["EMAIL"] = "email";
    AuthTypeEnum["GOOGLE_OAUTH"] = "google_oauth";
})(AuthTypeEnum || (exports.AuthTypeEnum = AuthTypeEnum = {}));
//# sourceMappingURL=user.enum.js.map