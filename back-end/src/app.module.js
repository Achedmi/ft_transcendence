"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var prisma_service_1 = require("./prisma/prisma.service");
var config_1 = require("@nestjs/config");
var user_module_1 = require("./user/user.module");
var auth_module_1 = require("./auth/auth.module");
var userAT_strategy_1 = require("./auth/strategies/userAT.strategy");
var userRT_strategy_1 = require("./auth/strategies/userRT.strategy");
var intra_stategy_1 = require("./auth/strategies/intra.stategy");
var helpers_module_1 = require("./helpers/helpers.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [config_1.ConfigModule.forRoot(), user_module_1.UserModule, auth_module_1.AuthModule, helpers_module_1.HelpersModule],
            controllers: [app_controller_1.AppController],
            providers: [
                app_service_1.AppService,
                prisma_service_1.PrismaService,
                userAT_strategy_1.UserAccessTokenStrategy,
                userRT_strategy_1.UserRefreshTokenStrategy,
                intra_stategy_1.IntraStrategy,
                // ,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
