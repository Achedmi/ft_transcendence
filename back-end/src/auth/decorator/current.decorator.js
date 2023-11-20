"use strict";
exports.__esModule = true;
exports.GetCurrent = void 0;
var common_1 = require("@nestjs/common");
exports.GetCurrent = (0, common_1.createParamDecorator)(function (data, context) {
    var _a;
    var user = (_a = context.switchToHttp().getRequest()) === null || _a === void 0 ? void 0 : _a.user;
    if (!data)
        return user;
    return user[data];
});
