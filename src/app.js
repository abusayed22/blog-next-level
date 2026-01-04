"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = require("express");
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello World");
});
app.listen(5000, function () {
    console.log("Server is running on http://localhost:5000");
});
