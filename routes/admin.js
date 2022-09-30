const jwt = require("jsonwebtoken")
const dayjs = require("dayjs")();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const adminMiddleware = require("../middleware/admin")
const router = express.Router();
const csv = require("csv-parser");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve() + "/public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, `data${path.extname(file.originalname)}`)
    },
});

const upload = multer({
    storage,
});
router.get("/login", adminMiddleware.isLogin, (req, res) => {
    try {
        res.render("./admin/login.ejs", { isAdmin: req.cookies.accessToken ? true : false })
    } catch (err) {
        console.log(err);
    }
})
router.get("/panel", adminMiddleware.isAdmin, (req, res) => {
    try {
        res.render("./admin/panel.ejs", { isAdmin: req.cookies.accessToken ? true : false })
    } catch (err) {
        console.log(err);
    }
})
router.get("/upload", adminMiddleware.isAdmin, (req, res) => {
    try {
        res.render("./admin/upload.ejs", { isAdmin: req.cookies.accessToken ? true : false })
    } catch (err) {
        console.log(err);
    }
})
router.post("/upload", adminMiddleware.isAdmin, upload.single("file"), async (req, res) => {
    try {
        let ext = path.extname(req.file.filename);
        if (ext !== ".csv") {
            req.flash("danger", "صيغة الفايل يجب ان تكون (csv)");
            return res.render("./admin/upload.ejs", { isAdmin: req.cookies.accessToken ? true : false })
        };
        const data = [];
        const filePath = `${path.resolve()}/public/uploads/data.csv`
        const stream = fs.createReadStream(filePath);
        stream.pipe(csv({}))
            .on("data", d => data.push(Object.entries(d)))
            .on("end", () => {
                fs.writeFile(`${path.resolve()}/public/uploads/data.json`, JSON.stringify(data), (err, data) => {
                    if (err) throw err;
                    fs.unlink(filePath, err => {
                        if (err) throw err;
                    });
                })
            })
        req.flash("success", "تم تحميل الفايل ينجاح")
        res.redirect("/admin/upload")
    } catch (err) {
        console.log(err);
        req.flash("danger", err.message)
        res.render("./admin/upload.ejs", { isAdmin: req.cookies.accessToken ? true : false })
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
        res.send({ success: true })
    } catch (err) {
        console.log(err);
        res.send({ success: false })

    }
})
module.exports = router;
