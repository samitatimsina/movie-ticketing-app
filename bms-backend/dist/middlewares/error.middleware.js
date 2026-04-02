"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    //Default response
    let statusCode = 500;
    let message = "Something went wrong!";
    let errors = [];
    //Zod error hamdler
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message: "Validation Error!";
        error: err.errors.map((e) => ({
            field: e.path.join("."),
            messsage: e.message
        }));
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};
exports.globalErrorHandler = globalErrorHandler;
