"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../lib/prisma");
var app_1 = require("./app");
var main = function () {
    try {
        prisma_1.prisma.$connect();
        console.log("Connented to Database Successfully!");
        app_1.app.listen(process.env.PORT || 5000, function () {
            console.log("Server is Successfully running on ".concat(process.env.PORT || 5000));
        });
    }
    catch (error) {
        console.log({ error: error });
        prisma_1.prisma.$disconnect();
        process.exit(1);
    }
};
main();
