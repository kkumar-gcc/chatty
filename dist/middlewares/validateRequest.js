"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, { abortEarly: false });
        return next();
    }
    catch (e) {
        if (e.name === "ValidationError") {
            const errors = {};
            e.inner.forEach((x) => {
                if (x.path !== undefined) {
                    const z = (x.path).slice(5);
                    errors[z] = x.errors;
                }
            });
            req.flash("errors", errors);
            return res.redirect("back");
            ;
        }
        return res.status(500).send("Something went wrong");
    }
});
exports.default = validate;
