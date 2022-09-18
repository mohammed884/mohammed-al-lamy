const exportToken = require("../utils/exportToken.js")
exports.isAdmin = (req, res, next) => {
    const { ADMIN_PASSWORD } = process.env;
    const decoded = exportToken(req.cookies.accessToken)
    if (!decoded) return res.redirect("/")
    if (ADMIN_PASSWORD !== decoded.password) return res.redirect("/")
    next();
}
exports.isLogin = (req, res, next) => {
    const decoded = exportToken(req.cookies.accessToken)
    if (decoded) return res.redirect("/admin/panel")
    next();
}
exports.isLogout = (req, res, next) => {
    const decoded = exportToken(req.cookies.accessToken)
    if (decoded) return res.redirect("/")
    next();
}