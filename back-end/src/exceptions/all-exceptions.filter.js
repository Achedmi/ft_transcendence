"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PrismaClientExceptionFilter = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var client_1 = require("@prisma/client");
/**
 * {@link PrismaClientExceptionFilter}
 * catches {@link Prisma.PrismaClientKnownRequestError}
 * and {@link Prisma.NotFoundError} exceptions.
 */
var PrismaClientExceptionFilter = /** @class */ (function (_super) {
    __extends(PrismaClientExceptionFilter, _super);
    /**
     * @param applicationRef
     * @param errorCodesStatusMapping
     */
    function PrismaClientExceptionFilter(applicationRef, errorCodesStatusMapping) {
        var _this = _super.call(this, applicationRef) || this;
        /**
         * default error codes mapping
         *
         * Error codes definition for Prisma Client (Query Engine)
         * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
         */
        _this.errorCodesStatusMapping = {
            P2000: common_1.HttpStatus.BAD_REQUEST,
            P2002: common_1.HttpStatus.CONFLICT,
            P2025: common_1.HttpStatus.NOT_FOUND
        };
        if (errorCodesStatusMapping) {
            _this.errorCodesStatusMapping = Object.assign(_this.errorCodesStatusMapping, errorCodesStatusMapping);
        }
        return _this;
    }
    /**
     * @param exception
     * @param host
     * @returns
     */
    PrismaClientExceptionFilter.prototype["catch"] = function (exception, host) {
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            return this.catchClientKnownRequestError(exception, host);
        }
        if (exception instanceof client_1.Prisma.NotFoundError) {
            return this.catchNotFoundError(exception, host);
        }
    };
    PrismaClientExceptionFilter.prototype.catchClientKnownRequestError = function (exception, host) {
        var statusCode = this.errorCodesStatusMapping[exception.code];
        var message = "[".concat(exception.code, "]: ").concat(this.exceptionShortMessage(exception.message));
        if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
            return _super.prototype["catch"].call(this, exception, host);
        }
        _super.prototype["catch"].call(this, new common_1.HttpException({ statusCode: statusCode, message: message }, statusCode), host);
    };
    PrismaClientExceptionFilter.prototype.catchNotFoundError = function (_a, host) {
        var message = _a.message;
        var statusCode = common_1.HttpStatus.NOT_FOUND;
        _super.prototype["catch"].call(this, new common_1.HttpException({ statusCode: statusCode, message: message }, statusCode), host);
    };
    PrismaClientExceptionFilter.prototype.exceptionShortMessage = function (message) {
        var shortMessage = message.substring(message.indexOf('→'));
        return shortMessage
            .substring(shortMessage.indexOf('\n'))
            .replace(/\n/g, '')
            .trim();
    };
    PrismaClientExceptionFilter = __decorate([
        (0, common_1.Catch)(client_1.Prisma === null || client_1.Prisma === void 0 ? void 0 : client_1.Prisma.PrismaClientKnownRequestError, client_1.Prisma === null || client_1.Prisma === void 0 ? void 0 : client_1.Prisma.NotFoundError)
    ], PrismaClientExceptionFilter);
    return PrismaClientExceptionFilter;
}(core_1.BaseExceptionFilter));
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter;
