"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireUser = (req, res, next) => {
    const user = req.session.user;
    if (!user) {
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    return next();
};
exports.default = requireUser;
