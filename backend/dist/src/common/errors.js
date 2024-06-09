"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentIdAlreadyExistsException = exports.EmployeeIdAlreadyExistsException = exports.UserNotFoundException = exports.OAuthGoogleErrorException = exports.InvalidAuthMethodException = exports.UserAlreadyExistsException = void 0;
const _1 = require(".");
class UserAlreadyExistsException extends Error {
    constructor() {
        super(_1.ERROR_MESSAGES.authController.userAlreadyExists);
    }
}
exports.UserAlreadyExistsException = UserAlreadyExistsException;
class InvalidAuthMethodException extends Error {
    constructor() {
        super(_1.ERROR_MESSAGES.authController.invalidAuthMethod);
    }
}
exports.InvalidAuthMethodException = InvalidAuthMethodException;
class OAuthGoogleErrorException extends Error {
    constructor(message) {
        super(message ?? _1.ERROR_MESSAGES.authController.googleAuthError);
    }
}
exports.OAuthGoogleErrorException = OAuthGoogleErrorException;
class UserNotFoundException extends Error {
    constructor() {
        super(_1.ERROR_MESSAGES.userController.userNotFound);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class EmployeeIdAlreadyExistsException extends Error {
    constructor() {
        super(_1.ERROR_MESSAGES.userController.employeeIdAlreadyExists);
    }
}
exports.EmployeeIdAlreadyExistsException = EmployeeIdAlreadyExistsException;
class StudentIdAlreadyExistsException extends Error {
    constructor() {
        super(_1.ERROR_MESSAGES.userController.studentIdAlreadyExists);
    }
}
exports.StudentIdAlreadyExistsException = StudentIdAlreadyExistsException;
//# sourceMappingURL=errors.js.map