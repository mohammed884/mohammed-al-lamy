const jwt = require("jsonwebtoken")
const dayjs = require("dayjs")()
const express = require("express");
const multer = require("multer");
const path = require("path")
const adminMiddleware = require("../middleware/admin")
const router = express.Router();

const storage = multer.diskStorage({
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== ".xlsx") return cb(new Error("File type is not supported"), false);
    },
    destination: function (req, file, cb) {
        cb(null, path.resolve() + "/public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, "data.xlsx")
    },
    limits: {
        files: 1,
    },
});

const upload = multer({ storage });
router.get("/login", adminMiddleware.isLogin, (req, res) => {
    try {
        res.render("./admin/login.ejs", {isAdmin:req.cookies.accessToken ? true :false})
    } catch (err) {
        console.log(err);
    }
})
router.get("/panel", adminMiddleware.isAdmin, (req, res) => {
    try {
        res.render("./admin/panel.ejs", {isAdmin:req.cookies.accessToken ? true :false})
    } catch (err) {
        console.log(err);
    }

})
router.get("/upload", adminMiddleware.isAdmin, (req, res) => {
    try {
        res.render("./admin/upload.ejs", {isAdmin:req.cookies.accessToken ? true :false})
    } catch (err) {
        console.log(err);
    }
})
router.post("/upload", adminMiddleware.isAdmin, upload.single("file"), (req, res) => {
    try {
        req.flash("success", "تم تحميل الفايل ينجاح")
        res.render("./admin/upload.ejs")
    } catch (err) {
        console.log(err);
        req.flash("danger", err.message)
        res.render("./admin/upload.ejs")
    }
});
router.post("/login", adminMiddleware.isLogout, (req, res) => {
    try {
        const password = req.body.password;
        const { JWT_SECRET, ADMIN_PASSWORD } = process.env;
        if (!password || password !== ADMIN_PASSWORD) {
            req.flash("danger", "خطا في رمز الحماية")
            return res.render("./admin/login.ejs")
        }
        const token = jwt.sign({
            password: ADMIN_PASSWORD,
            expiresIn: "5m"
        }, JWT_SECRET);
        res.cookie("accessToken", token, { maxAge: dayjs.add(5, "months"), httpOnly: true });
        res.redirect("/admin/panel")
    } catch (err) {
        console.log(err);
        res.render("./admin/login")
    }
});
router.post("/logout", adminMiddleware.isAdmin, (req, res) => {
    try {
        res.cookie("accessToken", "logout", { maxAge: 1, httpOnly: true });
        res.send({success:true})
    } catch (err) {
        console.log(err);
        res.send({success:false})

    }
})
module.exports = router;
