var express = require('express');
var router = express.Router();
let dbUtil = require("../../dao/dbdao");
let md5Util = require("../../util/md5");

/* GET admin listing. */
router.get('/qrymerchants', function (req, res, next) {
    if (!req.session.loginAdmin) {
        res.send("You haven't login the system!");
        return;
    }

    req.session.touch();

    let sql = "SELECT * FROM merchant";
    let params = [];
    let jsonResp = {};

    dbUtil.query(sql,params,function(rs,fld){
        if (rs && rs.length > 0) {
            jsonResp.rs = rs;
            res.json(jsonResp);
        }
    });
});


module.exports = router;
