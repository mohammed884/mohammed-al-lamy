const express = require('express');
const xlsx = require('node-xlsx');
const path = require('path');
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.render("./index.ejs", {data:[]})
  } catch (err) {
    console.log(err);
  }
})
router.post("/", async (req, res) => {
  try {
    let nameOrSerialNumber = req.body.nameOrSerialNumber;
    const workSheetsFromFile = xlsx.parse(`${path.resolve()}/public/uploads/data.xlsx`);
    for (let i = 0; i < workSheetsFromFile.length; i++) {
      const col = workSheetsFromFile[i];
      for (let x = 0; x < col.data.length; x++) {
        const data = col.data[x];
        if (data.length > 8 && Number.isNaN(Number(nameOrSerialNumber)) && data[8] === nameOrSerialNumber) {
          nameOrSerialNumber= ""
          return res.render("./index.ejs", {data});
        }
        if (data.length > 8 && data[9] === Number(nameOrSerialNumber)) {
          nameOrSerialNumber= ""
          return res.render("./index.ejs", {data})
        }
      }
    }
    req.flash('danger', Number.isNaN(Number(nameOrSerialNumber)) ? "لا يوجد طالب بهذا الاسم" : "لا يوجد طالب بهذا التسلسل");
    res.render("./index.ejs", {data:[]})
  } catch (e) {
    console.log(err);
    res.render("./index.ejs", {data:[]})
  }
});
module.exports = router;
