var express = require('express');
var router = express.Router();
let dbUtil = require("../../dao/dbdao");

/* GET admin listing. */
router.get('/', function (req, res, next) {
    let login = req.session.login;
    if (!login) {
        res.send("You haven't login the system!");
        return;
    }
    res.render('admin/admin', { title: 'admin' });
});

router.get('/login', function (req, res, next) {
    req.session.login = true;
    res.redirect("/admin");
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        console.info("Session Destroied");
    });
    res.redirect("../");
});

// 查询访问明细
router.get('/qryreqlist', function (req, res, next) {
    let login = req.session.login;
    if (!login) {
        res.send("{rs:'FAILED'}");
        return;
    }
    // console.log(req.query.limit + "::" + req.query.offset);
    req.session.touch();
    // 查明细列表
    let qryString = "select a.req_id,b.merchant_name,date_format(a.req_time,'%Y-%m-%d %H:%i:%s') as req_time,a.raw_msg, a.rs_status from mo_command a left join merchant b on a.merchant_id=b.merchant_id limit " + req.query.limit + " offset " + req.query.offset;
    let qryParams = [req.query.limit, req.query.offset];
    let rsArray = [];
    let jsonRs = {};
    jsonRs.rs = "ERROR";
    let callbackfunc = function (rs, fds) {
        if (rs && rs.length > 0) {
            for (let idx = 0; idx < rs.length; idx++) {
                let record = rs[idx];
                rsArray.push(record);
            }
            jsonRs.rsArray = rsArray;
        }
    };
    dbUtil.query(qryString, qryParams, callbackfunc);

    // 查总数
    qryString = "select count(1) as total from mo_command";
    let callbackfunc2 = function (rs, fds) {
        if (rs && rs.length > 0) {
            jsonRs.total = rs[0].total;
            jsonRs.rs = "OK";
        }
        res.json(jsonRs);
    }
    dbUtil.query(qryString, qryParams, callbackfunc2);
});

module.exports = router;
