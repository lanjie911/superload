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


router.get('/qrypaudits', function (req, res, next) {
    if (!req.session.loginAdmin) {
        res.send("You haven't login the system!");
        return;
    }

    req.session.touch();

    let sql = "select real_id,concat('https://tenent.juhedx.com/person/',person_id_url_0) person_id_url_0,";
    sql += "concat('https://tenent.juhedx.com/person/',person_id_url_1) person_id_url_1,";
    sql += "concat('https://tenent.juhedx.com/person/',person_id_url_2) person_id_url_2,";
    sql += "creator_id,date_format(created_time,'%Y-%m-%d %H:%i:%S') created_time from real_name_p_verify where audit_stat=1 limit 10 offset 0";

    let params = [];
    let jsonResp = {};

    dbUtil.apiQuery(sql,params,function(rs,fld){
        if (rs && rs.length > 0) {
            jsonResp.rs = rs;
            res.json(jsonResp);
        }
    });
});

router.get('/qryeaudits', function (req, res, next) {
    if (!req.session.loginAdmin) {
        res.send("You haven't login the system!");
        return;
    }

    req.session.touch();

    let sql = "select real_id,concat('https://tenent.juhedx.com/enterprise/',enterprise_id_url_0) enterprise_id_url_0,";
    sql += "concat('https://tenent.juhedx.com/enterprise/',enterprise_id_url_1) enterprise_id_url_1,";
    sql += "concat('https://tenent.juhedx.com/enterprise/',enterprise_id_url_2) enterprise_id_url_2,";
    sql += "concat('https://tenent.juhedx.com/enterprise/',enterprise_id_url_3) enterprise_id_url_3,";
    sql += "creator_id,date_format(created_time,'%Y-%m-%d %H:%i:%S') created_time from real_name_e_verify where audit_stat=1 limit 10 offset 0";

    let params = [];
    let jsonResp = {};

    dbUtil.apiQuery(sql,params,function(rs,fld){
        if (rs && rs.length > 0) {
            jsonResp.rs = rs;
            res.json(jsonResp);
        }
    });
});

router.post('/doaudit', function (req, res, next) {
    if (!req.session.loginAdmin) {
        res.send("You haven't login the system!");
        return;
    }

    req.session.touch();

    let kind = req.body.kind;
    let table = "real_name_"+kind+"_verify";

    let sql = "update "+table+" set audit_stat=?, audit_desc=?,audit_time=NOW() where real_id=? ";
    let params = [req.body.opt,req.body.desc,req.body.rid];
    let jsonResp = {"rs":"OK"};

    dbUtil.apiQuery(sql,params,function(rs,fld){
        res.json(jsonResp);
        return;
    });
});

module.exports = router;
