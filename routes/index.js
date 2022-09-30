const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
router.get("/", (req, res) => {
  try {
    res.render("./index.ejs", { results: [], isAdmin: req.cookies.accessToken ? true : false })
  } catch (err) {
    console.log(err);
  }
})
router.post("/", async (req, res) => {
  try {
    const userInfo = req.body.nameOrSerialNumber;
    const filePath = `${path.resolve()}/public/uploads/data.json`;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
    for (let i = 0; i < data.length; i++) {
      const col = data[i];
      const serialNumber = col[col.length - 1][1];
      const name = col[col.length - 2][1];
      if (!Number.isNaN(Number(userInfo)) && Number(serialNumber) === Number(userInfo)) {
        return res.render("./index.ejs", { results:col, isAdmin: req.cookies.accessToken ? true : false });
      }
      if (new RegExp(userInfo, "i").test(name)) {
        return res.render("./index.ejs", { results:col, isAdmin: req.cookies.accessToken ? true : false })
      }
    }
    req.flash('danger', Number.isNaN(Number(userInfo)) ? "لا يوجد طالب بهذا الاسم" : "لا يوجد طالب بهذا التسلسل");
    res.render("./index.ejs", { results: [], isAdmin: req.cookies.accessToken ? true : false })
  } catch (err) {
    console.log(err);
    res.render("./index.ejs", { results: [], isAdmin: req.cookies.accessToken ? true : false })
  }
});
module.exports = router;
