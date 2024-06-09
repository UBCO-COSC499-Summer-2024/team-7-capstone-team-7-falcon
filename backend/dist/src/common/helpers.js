"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = void 0;
function getCookie(req, cookieName) {
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) {
        return null;
    }
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === cookieName) {
            return value;
        }
    }
}
exports.getCookie = getCookie;
//# sourceMappingURL=helpers.js.map